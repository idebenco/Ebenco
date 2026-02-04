const Tour = require('../models/Tour.model');
const Property = require('../models/Property.model');
const { validationResult } = require('express-validator');

// Create tour request (public - no auth required)
exports.createTourRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { propertyId, tenantInfo, preferredDate, preferredTime, message } = req.body;

    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Create tour request
    const tour = new Tour({
      propertyId,
      landlordId: property.landlordId,
      tenantInfo,
      preferredDate,
      preferredTime,
      message,
      status: 'pending'
    });

    await tour.save();
    await tour.populate(['propertyId', 'landlordId']);

    // TODO: Send email notification to landlord
    // sendEmail({
    //   to: tour.landlordId.email,
    //   subject: 'New Tour Request',
    //   template: 'tour-request',
    //   data: { tour, property }
    // });

    // TODO: Send confirmation email to tenant
    // sendEmail({
    //   to: tenantInfo.email,
    //   subject: 'Tour Request Confirmation',
    //   template: 'tour-confirmation',
    //   data: { tour, property }
    // });

    res.status(201).json({
      message: 'Tour request submitted successfully',
      tour: {
        _id: tour._id,
        status: tour.status,
        preferredDate: tour.preferredDate,
        preferredTime: tour.preferredTime,
        property: {
          title: property.title,
          address: property.address
        }
      }
    });
  } catch (error) {
    console.error('Error creating tour request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all tours (filtered by role)
exports.getTours = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, propertyId } = req.query;
    const query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by property if provided
    if (propertyId) {
      query.propertyId = propertyId;
    }

    // Filter by role
    if (req.user.role === 'landlord' || req.user.role === 'agent') {
      query.landlordId = req.user._id;
    }
    // Admins can see all tours

    const tours = await Tour.find(query)
      .populate('propertyId', 'title address price images')
      .populate('landlordId', 'profile.firstName profile.lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Tour.countDocuments(query);

    res.json({
      tours,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error getting tours:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate('propertyId')
      .populate('landlordId', 'profile.firstName profile.lastName email')
      .populate('updatedBy', 'profile.firstName profile.lastName');

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        tour.landlordId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(tour);
  } catch (error) {
    console.error('Error getting tour:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update tour status (landlord/admin only)
exports.updateTourStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, statusNote } = req.body;
    const tour = await Tour.findById(req.params.id)
      .populate('propertyId', 'title address')
      .populate('landlordId', 'profile.firstName profile.lastName email');

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        tour.landlordId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    tour.status = status;
    tour.statusNote = statusNote;
    tour.updatedBy = req.user._id;

    await tour.save();

    // TODO: Send email notification to tenant
    // if (status === 'approved') {
    //   sendEmail({
    //     to: tour.tenantInfo.email,
    //     subject: 'Tour Request Approved',
    //     template: 'tour-approved',
    //     data: { tour }
    //   });
    // } else if (status === 'rejected') {
    //   sendEmail({
    //     to: tour.tenantInfo.email,
    //     subject: 'Tour Request Update',
    //     template: 'tour-rejected',
    //     data: { tour, statusNote }
    //   });
    // }

    res.json({
      message: `Tour ${status} successfully`,
      tour
    });
  } catch (error) {
    console.error('Error updating tour status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete/Cancel tour
exports.cancelTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        tour.landlordId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    tour.status = 'cancelled';
    tour.updatedBy = req.user._id;
    await tour.save();

    res.json({ message: 'Tour cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling tour:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
