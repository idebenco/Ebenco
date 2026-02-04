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
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'townhouse', 'studio', 'duplex', 'other'],
    default: 'apartment'
  },
  listingType: {
    type: String,
    enum: ['rent', 'sale'],
    default: 'rent'
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
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
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
  yearBuilt: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear() + 1
  },
  images: [{
    type: String
  }],
  videos: [{
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
  availableDate: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  },
  showContactInfo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ 'address.city': 1, 'address.state': 1 });
propertySchema.index({ price: 1, status: 1 });

module.exports = mongoose.model('Property', propertySchema);
