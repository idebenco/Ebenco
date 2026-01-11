const Application = require('../models/Application.model');
const Property = require('../models/Property.model');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/applications';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs only
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

exports.getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};

    // Filter by role
    if (req.user.role === 'tenant') {
      query.tenantId = req.userId;
    } else if (['landlord', 'agent'].includes(req.user.role)) {
      // Get properties owned by landlord
      const properties = await Property.find({ landlordId: req.userId }).select('_id');
      query.propertyId = { $in: properties.map(p => p._id) };
    }
    // Admin can see all applications

    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('propertyId', 'title address price images')
      .populate('tenantId', 'email profile')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch applications' } });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('propertyId', 'title address price images landlordId')
      .populate('tenantId', 'email profile');

    if (!application) {
      return res.status(404).json({ error: { message: 'Application not found' } });
    }

    // Check access
    const canAccess = 
      req.user.role === 'admin' ||
      application.tenantId._id.toString() === req.userId.toString() ||
      (application.propertyId.landlordId && 
       application.propertyId.landlordId.toString() === req.userId.toString());

    if (!canAccess) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch application' } });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Only tenants can create applications
    if (req.user.role !== 'tenant') {
      return res.status(403).json({ error: { message: 'Only tenants can submit applications' } });
    }

    // Check if property exists and is available
    const property = await Property.findById(req.body.propertyId);
    if (!property) {
      return res.status(404).json({ error: { message: 'Property not found' } });
    }

    if (property.status !== 'available') {
      return res.status(400).json({ error: { message: 'Property is not available' } });
    }

    // Check if tenant already has a pending application for this property
    const existingApplication = await Application.findOne({
      propertyId: req.body.propertyId,
      tenantId: req.userId,
      status: 'pending'
    });

    if (existingApplication) {
      return res.status(400).json({ error: { message: 'You already have a pending application for this property' } });
    }

    const application = new Application({
      ...req.body,
      tenantId: req.userId
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: { message: 'Failed to submit application' } });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('propertyId', 'landlordId');

    if (!application) {
      return res.status(404).json({ error: { message: 'Application not found' } });
    }

    // Check authorization - landlord or admin
    const canUpdate = 
      req.user.role === 'admin' ||
      (application.propertyId.landlordId && 
       application.propertyId.landlordId.toString() === req.userId.toString());

    if (!canUpdate) {
      return res.status(403).json({ error: { message: 'Not authorized to update this application' } });
    }

    application.status = status;
    if (status === 'rejected' && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    await application.save();

    // If approved, update property status
    if (status === 'approved') {
      await Property.findByIdAndUpdate(application.propertyId._id, { status: 'rented' });
    }

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: { message: 'Failed to update application' } });
  }
};

exports.createPublicApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Parse application data from form
    const applicationData = JSON.parse(req.body.applicationData);

    // Check if property exists and is available
    const property = await Property.findById(applicationData.propertyId);
    if (!property) {
      return res.status(404).json({ error: { message: 'Property not found' } });
    }

    if (property.status !== 'available') {
      return res.status(400).json({ error: { message: 'Property is not available' } });
    }

    // Process uploaded documents
    const documents = [];
    if (req.files) {
      if (req.files.driverLicenseFront) {
        documents.push({
          type: 'driver_license_front',
          url: req.files.driverLicenseFront[0].path,
          fileName: req.files.driverLicenseFront[0].originalname
        });
      }
      if (req.files.driverLicenseBack) {
        documents.push({
          type: 'driver_license_back',
          url: req.files.driverLicenseBack[0].path,
          fileName: req.files.driverLicenseBack[0].originalname
        });
      }
    }

    // Create application without authentication
    const application = new Application({
      propertyId: applicationData.propertyId,
      applicantInfo: applicationData.applicantInfo,
      employmentInfo: applicationData.employmentInfo,
      references: applicationData.references || [],
      moveInDate: applicationData.moveInDate,
      additionalNotes: applicationData.additionalNotes,
      documents: documents,
      status: 'pending',
      isPublic: true
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        _id: application._id,
        status: application.status,
        createdAt: application.createdAt
      }
    });
  } catch (error) {
    console.error('Create public application error:', error);
    res.status(500).json({ error: { message: 'Failed to submit application' } });
  }
};

// Export multer upload middleware
exports.uploadDocuments = upload.fields([
  { name: 'driverLicenseFront', maxCount: 1 },
  { name: 'driverLicenseBack', maxCount: 1 }
]);
