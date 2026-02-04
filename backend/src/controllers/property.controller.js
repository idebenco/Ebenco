const Property = require('../models/Property.model');
const { validationResult } = require('express-validator');

exports.getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      state,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      status = 'available',
      search
    } = req.query;

    const query = {};
    
    // Filters
    if (status) query.status = status;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (search) {
      query.$text = { $search: search };
    }

    const properties = await Property.find(query)
      .populate('landlordId', 'email profile')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch properties' } });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlordId', 'email profile');

    if (!property) {
      return res.status(404).json({ error: { message: 'Property not found' } });
    }

    res.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch property' } });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Only landlords and agents can create properties
    if (!['landlord', 'agent', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Only landlords and agents can create properties' } });
    }

    const property = new Property({
      ...req.body,
      landlordId: req.userId
    });

    await property.save();

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: { message: 'Failed to create property' } });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: { message: 'Property not found' } });
    }

    // Check ownership or admin
    if (property.landlordId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Not authorized to update this property' } });
    }

    Object.assign(property, req.body);
    await property.save();

    res.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: { message: 'Failed to update property' } });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: { message: 'Property not found' } });
    }

    // Check ownership or admin
    if (property.landlordId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Not authorized to delete this property' } });
    }

    await property.deleteOne();

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: { message: 'Failed to delete property' } });
  }
};
