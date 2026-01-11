const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['rent', 'deposit', 'fee', 'late_fee', 'maintenance'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  stripePaymentId: String,
  dueDate: {
    type: Date,
    required: true
  },
  paidAt: Date,
  description: String,
  notes: String
}, {
  timestamps: true
});

// Index for queries
paymentSchema.index({ tenantId: 1, status: 1, dueDate: 1 });
paymentSchema.index({ landlordId: 1, status: 1, paidAt: 1 });
paymentSchema.index({ propertyId: 1, dueDate: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
