const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: { message: 'Authentication required' } });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: { message: 'User not found or inactive' } });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: { message: 'Authentication required' } });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    next();
  };
};

module.exports = { auth, authorize };
