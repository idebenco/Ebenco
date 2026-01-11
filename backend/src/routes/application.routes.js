const express = require('express');
const { body } = require('express-validator');
const applicationController = require('../controllers/application.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

// Public application submission (no auth required)
router.post('/public',
  [
    body('propertyId').notEmpty(),
    body('applicantInfo.firstName').notEmpty().trim(),
    body('applicantInfo.lastName').notEmpty().trim(),
    body('applicantInfo.email').isEmail().trim(),
    body('applicantInfo.phone').notEmpty().trim(),
    body('employmentInfo.employer').notEmpty().trim(),
    body('employmentInfo.position').notEmpty().trim(),
    body('employmentInfo.income').isNumeric().isFloat({ min: 0 }),
    body('moveInDate').isISO8601()
  ],
  applicationController.createPublicApplication
);

// Get all applications (filtered by role)
router.get('/', auth, applicationController.getApplications);

// Get single application
router.get('/:id', auth, applicationController.getApplication);

// Create application (tenant only)
router.post('/',
  auth,
  [
    body('propertyId').notEmpty(),
    body('employmentInfo.employer').notEmpty().trim(),
    body('employmentInfo.position').notEmpty().trim(),
    body('employmentInfo.income').isNumeric().isFloat({ min: 0 }),
    body('moveInDate').isISO8601()
  ],
  applicationController.createApplication
);

// Update application status (landlord/admin only)
router.put('/:id/status',
  auth,
  [
    body('status').isIn(['pending', 'approved', 'rejected'])
  ],
  applicationController.updateApplicationStatus
);

module.exports = router;
