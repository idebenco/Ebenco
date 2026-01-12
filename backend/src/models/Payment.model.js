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
    required: false // Not required for public applications
  },
  // For public applications without tenant account
  tenantInfo: {
    name: String,
    email: String,
    phone: String
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
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
  paymentType: {
    type: String,
    enum: ['application_fee', 'rent', 'deposit', 'late_fee', 'maintenance'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Stripe Integration
  stripePaymentIntentId: String,
  stripeCustomerId: String,
  cardLast4: String,
  cardBrand: String, // visa, mastercard, amex, discover
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer'],
    default: 'card'
  },
  
  // Receipt & Documentation
  receiptUrl: String,
  receiptNumber: String, // Auto-generated: RCP-YYYYMM-XXXX
  
  // Payment Details
  dueDate: {
    type: Date,
    required: true
  },
  paidAt: Date,
  description: String,
  notes: String,
  
  // Refund Information
  refundAmount: Number,
  refundReason: String,
  refundedAt: Date
}, {
  timestamps: true
});

// Index for queries
paymentSchema.index({ tenantId: 1, status: 1, dueDate: 1 });
paymentSchema.index({ landlordId: 1, status: 1, paidAt: 1 });
paymentSchema.index({ propertyId: 1, dueDate: 1 });
paymentSchema.index({ receiptNumber: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });

// Generate receipt number before saving
paymentSchema.pre('save', async function(next) {
  if (this.isNew && !this.receiptNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last receipt number for this month
    const lastPayment = await this.constructor.findOne({
      receiptNumber: new RegExp(`^RCP-${year}${month}-`)
    }).sort({ receiptNumber: -1 });
    
    let sequence = 1;
    if (lastPayment && lastPayment.receiptNumber) {
      const lastSequence = parseInt(lastPayment.receiptNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.receiptNumber = `RCP-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
