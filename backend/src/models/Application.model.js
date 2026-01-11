const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Not required for public applications
  },
  // For public applications (no user account)
  isPublic: {
    type: Boolean,
    default: false
  },
  applicantInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  documents: [{
    type: {
      type: String,
      enum: ['id', 'income_proof', 'credit_report', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    fileName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  employmentInfo: {
    employer: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    income: {
      type: Number,
      required: true,
      min: 0
    },
    startDate: Date
  },
  references: [{
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true
    },
    email: String
  }],
  moveInDate: {
    type: Date,
    required: true
  },
  notes: String,
  additionalNotes: String,
  rejectionReason: String
}, {
  timestamps: true
});

// Index for queries
applicationSchema.index({ tenantId: 1, status: 1 });
applicationSchema.index({ propertyId: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
