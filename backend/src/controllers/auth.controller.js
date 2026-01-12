const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: { message: 'User already exists with this email' } });
    }

    // Create new user
    const user = new User({
      email,
      password,
      role: role || 'tenant',
      profile
    });

    await user.save();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: { message: 'Registration failed', details: error.message } });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: { message: 'Account is inactive' } });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: { message: 'Login failed', details: error.message } });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: { message: 'Failed to get user info' } });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    
    req.user.profile = { ...req.user.profile, ...profile };
    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: req.user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: { message: 'Failed to update profile' } });
  }
};

// Google OAuth authentication
exports.googleAuth = async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, avatar } = req.body;

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });
    
    if (!user) {
      // Check if user exists with this email
      user = await User.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.emailVerified = true;
        if (avatar && !user.profile.avatar) {
          user.profile.avatar = avatar;
        }
        await user.save();
      } else {
        // Create new user
        user = new User({
          email,
          googleId,
          emailVerified: true,
          profile: {
            firstName,
            lastName,
            phone: '',
            avatar
          }
        });
        await user.save();
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Google authentication successful',
      token,
      user
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: { message: 'Google authentication failed', details: error.message } });
  }
};

// Send OTP for phone authentication (placeholder)
exports.sendPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // TODO: Integrate with Twilio or Firebase to send actual OTP
    // For now, return success response
    
    res.json({
      message: 'OTP sent successfully',
      phoneNumber
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: { message: 'Failed to send OTP' } });
  }
};

// Verify phone OTP (placeholder)
exports.verifyPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // TODO: Verify OTP with Twilio or Firebase
    // For now, return success response
    
    // Check if user exists
    let user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    user.phoneVerified = true;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Phone verified successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: { message: 'Failed to verify OTP' } });
  }
};
