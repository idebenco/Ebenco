const express = require('express');
const adminController = require('../controllers/admin.controller');
const { auth, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use(authorize('admin'));

// Get all users
router.get('/users', adminController.getUsers);

// Update user
router.put('/users/:id', adminController.updateUser);

// Delete user
router.delete('/users/:id', adminController.deleteUser);

// Get analytics
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
