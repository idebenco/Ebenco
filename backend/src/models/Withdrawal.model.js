const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 50 // Minimum withdrawal $50
  },
  method: {
    type: String,
    required: true,
    enum: ['crypto_btc', 'crypto_usdt_trc20', 'crypto_usdt_erc20', 'crypto_eth', 'bank_transfer']
  },
  
  // Crypto Details
  walletAddress: {
    type: String,
    // Required if method is crypto
  },
  network: {
    type: String,
    enum: ['trc20', 'erc20', 'btc', 'eth']
  },
  
  // Bank Details
  bankAccount: {
    accountNumber: String,
    routingNumber: String,
    bankName: String,
    accountHolderName: String,
    accountType: {
      type: String,
      enum: ['checking', 'savings']
    }
  },
  
  // Fees & Amounts
  fee: {
    type: Number,
    required: true
  },
  feePercentage: {
    type: Number,
    default: 2 // 2% for crypto, 1% for bank
  },
  netAmount: {
    type: Number,
    required: true
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  rejectionReason: String,
  
  // Transaction Details
  transactionHash: String, // For crypto transactions
  confirmationNumber: String, // For bank transfers
  processedAt: Date,
  completedAt: Date,
  
  // Admin Actions
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  
  // Notes
  notes: String,
  adminNotes: String
  
}, { timestamps: true });

// Indexes for performance
withdrawalSchema.index({ userId: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1 });
withdrawalSchema.index({ method: 1 });

// Virtual for calculating fee on save
withdrawalSchema.pre('save', function(next) {
  if (this.isNew) {
    // Calculate fee based on method
    if (this.method.startsWith('crypto_')) {
      this.feePercentage = 2;
      this.fee = this.amount * 0.02;
    } else {
      this.feePercentage = 1;
      this.fee = Math.max(this.amount * 0.01, 2); // Minimum $2 fee
    }
    this.netAmount = this.amount - this.fee;
  }
  next();
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
