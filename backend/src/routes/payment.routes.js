const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all payments (filtered by role)
router.get('/', auth, paymentController.getPayments);

// Get payment statistics
router.get('/statistics', auth, paymentController.getStatistics);

// Get single payment
router.get('/:id', auth, paymentController.getPayment);

// Get payment receipt
router.get('/:id/receipt', auth, paymentController.getReceipt);

// Create payment (landlord/agent only)
router.post('/',
  auth,
  [
    body('propertyId').notEmpty(),
    body('tenantId').notEmpty(),
    body('amount').isNumeric().isFloat({ min: 0 }),
    body('paymentType').isIn(['application_fee', 'rent', 'deposit', 'late_fee', 'maintenance']),
    body('dueDate').isISO8601()
  ],
  paymentController.createPayment
);

// Create Stripe payment intent
router.post('/create-intent',
  auth,
  [
    body('paymentId').notEmpty()
  ],
  paymentController.createPaymentIntent
);

// Confirm payment
router.post('/:id/confirm',
  auth,
  [
    body('paymentIntentId').notEmpty()
  ],
  paymentController.confirmPayment
);

// Refund payment (landlord/agent/admin only)
router.post('/:id/refund',
  auth,
  paymentController.refundPayment
);

module.exports = router;
