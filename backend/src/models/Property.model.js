const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'USA'
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  squareFeet: {
    type: Number,
    min: 0
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance'],
    default: 'available'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ 'address.city': 1, 'address.state': 1 });
propertySchema.index({ price: 1, status: 1 });

module.exports = mongoose.model('Property', propertySchema);
