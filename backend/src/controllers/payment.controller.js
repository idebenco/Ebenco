const Payment = require('../models/Payment.model');
const Property = require('../models/Property.model');
const { validationResult } = require('express-validator');

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

exports.processPayment = async (req, res) => {
  try {
    const { stripePaymentId } = req.body;

    const payment = await Payment.findById(req.params.id);

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

    // In a real application, verify payment with Stripe here
    // const stripePayment = await stripe.paymentIntents.retrieve(stripePaymentId);
    
    payment.status = 'completed';
    payment.stripePaymentId = stripePaymentId;
    payment.paidAt = new Date();
    await payment.save();

    res.json({
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: { message: 'Failed to process payment' } });
  }
};
