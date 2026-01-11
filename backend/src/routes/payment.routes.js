const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all payments (filtered by role)
router.get('/', auth, paymentController.getPayments);

// Get single payment
router.get('/:id', auth, paymentController.getPayment);

// Create payment (landlord/agent only)
router.post('/',
  auth,
  [
    body('propertyId').notEmpty(),
    body('tenantId').notEmpty(),
    body('amount').isNumeric().isFloat({ min: 0 }),
    body('type').isIn(['rent', 'deposit', 'fee', 'late_fee', 'maintenance']),
    body('dueDate').isISO8601()
  ],
  paymentController.createPayment
);

// Process payment (tenant only)
router.post('/:id/process',
  auth,
  [
    body('stripePaymentId').notEmpty()
  ],
  paymentController.processPayment
);

module.exports = router;
