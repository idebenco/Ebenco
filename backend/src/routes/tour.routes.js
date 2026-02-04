const express = require('express');
const { body } = require('express-validator');
const tourController = require('../controllers/tour.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

// Public tour request (no auth required)
router.post('/',
  [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('tenantInfo.name').notEmpty().trim().withMessage('Name is required'),
    body('tenantInfo.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('tenantInfo.phone').notEmpty().trim().withMessage('Phone is required'),
    body('preferredDate').isISO8601().withMessage('Valid date is required'),
    body('preferredTime').isIn(['morning', 'afternoon', 'evening']).withMessage('Valid time slot is required')
  ],
  tourController.createTourRequest
);

// Get all tours (filtered by role)
router.get('/', auth, tourController.getTours);

// Get single tour
router.get('/:id', auth, tourController.getTour);

// Update tour status (landlord/admin only)
router.put('/:id/status',
  auth,
  [
    body('status').isIn(['pending', 'approved', 'rejected', 'completed', 'cancelled']).withMessage('Invalid status')
  ],
  tourController.updateTourStatus
);

// Cancel tour
router.delete('/:id', auth, tourController.cancelTour);

module.exports = router;
