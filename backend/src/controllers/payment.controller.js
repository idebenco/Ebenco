const Payment = require('../models/Payment.model');
const Property = require('../models/Property.model');
const { validationResult } = require('express-validator');

// Stripe integration (configure with your key)
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};

    // Filter by role
    if (req.user.role === 'tenant') {
      query.tenantId = req.userId;
    } else if (['landlord', 'agent'].includes(req.user.role)) {
      query.landlordId = req.userId;
    }
    // Admin can see all payments

    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('propertyId', 'title address')
      .populate('tenantId', 'email profile')
      .populate('landlordId', 'email profile')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ dueDate: -1 });

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch payments' } });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('propertyId', 'title address')
      .populate('tenantId', 'email profile')
      .populate('landlordId', 'email profile');

    if (!payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    // Check access
    const canAccess = 
      req.user.role === 'admin' ||
      payment.tenantId._id.toString() === req.userId.toString() ||
      payment.landlordId._id.toString() === req.userId.toString();

    if (!canAccess) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    res.json({ payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch payment' } });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get property to verify landlord
    const property = await Property.findById(req.body.propertyId);
    if (!property) {
      return res.status(404).json({ error: { message: 'Property not found' } });
    }

    // Only landlords/agents can create payment requests
    if (!['landlord', 'agent', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Only landlords and agents can create payment requests' } });
    }

    const payment = new Payment({
      ...req.body,
      landlordId: property.landlordId
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: { message: 'Failed to create payment' } });
  }
};

// Create Stripe Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    // Verify tenant is making the payment
    if (payment.tenantId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: { message: 'Not authorized to process this payment' } });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({ error: { message: 'Payment already completed' } });
    }

    // Create Stripe Payment Intent
    // In production, uncomment and configure:
    /*
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payment.amount * 100), // Amount in cents
      currency: 'usd',
      metadata: {
        paymentId: payment._id.toString(),
        paymentType: payment.paymentType,
        propertyId: payment.propertyId.toString()
      }
    });

    payment.stripePaymentIntentId = paymentIntent.id;
    payment.status = 'processing';
    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    */

    // Mock response for development
    payment.status = 'processing';
    await payment.save();

    res.json({
      clientSecret: 'mock_client_secret_' + payment._id,
      paymentIntentId: 'mock_pi_' + payment._id,
      message: 'Payment intent created (mock mode - configure Stripe for production)'
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: { message: 'Failed to create payment intent' } });
  }
};

// Confirm Payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodDetails } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    // Verify tenant is making the payment
    if (payment.tenantId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: { message: 'Not authorized to process this payment' } });
    }

    // Verify payment with Stripe
    // In production, uncomment:
    /*
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'completed';
      payment.stripePaymentIntentId = paymentIntent.id;
      payment.cardLast4 = paymentIntent.charges.data[0].payment_method_details.card.last4;
      payment.cardBrand = paymentIntent.charges.data[0].payment_method_details.card.brand;
      payment.paidAt = new Date();
      
      // Generate receipt URL (implement PDF generation)
      payment.receiptUrl = `/receipts/${payment.receiptNumber}.pdf`;
      
      await payment.save();

      // Send email notification with receipt
      // await sendPaymentConfirmationEmail(payment);

      res.json({
        message: 'Payment completed successfully',
        payment,
        receiptUrl: payment.receiptUrl
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ error: { message: 'Payment failed' } });
    }
    */

    // Mock success for development
    payment.status = 'completed';
    payment.stripePaymentIntentId = paymentIntentId;
    payment.cardLast4 = paymentMethodDetails?.last4 || '4242';
    payment.cardBrand = paymentMethodDetails?.brand || 'visa';
    payment.paidAt = new Date();
    payment.receiptUrl = `/api/payments/${payment._id}/receipt`;
    await payment.save();

    res.json({
      message: 'Payment completed successfully (mock mode)',
      payment,
      receiptUrl: payment.receiptUrl
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: { message: 'Failed to confirm payment' } });
  }
};

// Refund Payment
exports.refundPayment = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    // Only landlords/agents/admins can refund
    if (!['landlord', 'agent', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Not authorized to refund payment' } });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ error: { message: 'Can only refund completed payments' } });
    }

    // Process refund with Stripe
    // In production, uncomment:
    /*
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round((amount || payment.amount) * 100)
    });

    payment.status = 'refunded';
    payment.refundAmount = amount || payment.amount;
    payment.refundReason = reason;
    payment.refundedAt = new Date();
    await payment.save();

    // Send refund notification
    // await sendRefundNotificationEmail(payment);
    */

    // Mock refund for development
    payment.status = 'refunded';
    payment.refundAmount = amount || payment.amount;
    payment.refundReason = reason;
    payment.refundedAt = new Date();
    await payment.save();

    res.json({
      message: 'Refund processed successfully (mock mode)',
      payment
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ error: { message: 'Failed to process refund' } });
  }
};

// Get Payment Receipt
exports.getReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('propertyId', 'title address')
      .populate('tenantId', 'email profile')
      .populate('landlordId', 'email profile');

    if (!payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    // Check access
    const canAccess = 
      req.user.role === 'admin' ||
      payment.tenantId._id.toString() === req.userId.toString() ||
      payment.landlordId._id.toString() === req.userId.toString();

    if (!canAccess) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // Generate PDF receipt (implement with PDFKit or similar)
    // For now, return payment details as JSON
    res.json({
      receipt: {
        receiptNumber: payment.receiptNumber,
        date: payment.paidAt || payment.createdAt,
        property: payment.propertyId,
        tenant: {
          name: `${payment.tenantId.profile.firstName} ${payment.tenantId.profile.lastName}`,
          email: payment.tenantId.email
        },
        landlord: {
          name: `${payment.landlordId.profile.firstName} ${payment.landlordId.profile.lastName}`,
          email: payment.landlordId.email
        },
        amount: payment.amount,
        paymentType: payment.paymentType,
        cardLast4: payment.cardLast4,
        cardBrand: payment.cardBrand,
        transactionId: payment.stripePaymentIntentId,
        status: payment.status
      }
    });
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({ error: { message: 'Failed to generate receipt' } });
  }
};

// Get Payment Statistics
exports.getStatistics = async (req, res) => {
  try {
    let query = {};

    // Filter by role
    if (req.user.role === 'tenant') {
      query.tenantId = req.userId;
    } else if (['landlord', 'agent'].includes(req.user.role)) {
      query.landlordId = req.userId;
    }

    const totalRevenue = await Payment.aggregate([
      { $match: { ...query, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paymentsByType = await Payment.aggregate([
      { $match: query },
      { $group: { _id: '$paymentType', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    const paymentsByStatus = await Payment.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      statistics: {
        totalRevenue: totalRevenue[0]?.total || 0,
        paymentsByType,
        paymentsByStatus,
        totalPayments: await Payment.countDocuments(query)
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch statistics' } });
  }
};
