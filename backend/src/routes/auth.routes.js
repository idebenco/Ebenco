const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

// Register
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('profile.firstName').notEmpty().trim(),
    body('profile.lastName').notEmpty().trim(),
    body('profile.phone').notEmpty().trim()
  ],
  authController.register
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.login
);

// Get current user
router.get('/me', auth, authController.getMe);

// Update profile
router.put('/profile', auth, authController.updateProfile);

// Google OAuth
router.post('/google', authController.googleAuth);

// Phone authentication (placeholders for Twilio/Firebase integration)
router.post('/phone/send-otp', authController.sendPhoneOTP);
router.post('/phone/verify-otp', authController.verifyPhoneOTP);

module.exports = router;
