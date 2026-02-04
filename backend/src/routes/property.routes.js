const express = require('express');
const { body } = require('express-validator');
const propertyController = require('../controllers/property.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all properties (with filters)
router.get('/', propertyController.getProperties);

// Get single property
router.get('/:id', propertyController.getProperty);

// Create property (landlord/agent only)
router.post('/',
  auth,
  [
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('address.street').notEmpty().trim(),
    body('address.city').notEmpty().trim(),
    body('address.state').notEmpty().trim(),
    body('address.zipCode').notEmpty().trim(),
    body('price').isNumeric().isFloat({ min: 0 }),
    body('bedrooms').isInt({ min: 0 }),
    body('bathrooms').isNumeric().isFloat({ min: 0 })
  ],
  propertyController.createProperty
);

// Update property (landlord/agent/admin only)
router.put('/:id', auth, propertyController.updateProperty);

// Delete property (landlord/agent/admin only)
router.delete('/:id', auth, propertyController.deleteProperty);

module.exports = router;
