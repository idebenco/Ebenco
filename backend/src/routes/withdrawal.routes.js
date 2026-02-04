const express = require('express');
const withdrawalController = require('../controllers/withdrawal.controller');
const { auth, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// User routes - require authentication
router.use(auth);

// Get available balance
router.get('/balance', withdrawalController.getBalance);

// Create withdrawal request
router.post('/request', authorize('landlord', 'agent'), withdrawalController.createWithdrawal);

// Get user's withdrawal history
router.get('/', withdrawalController.getWithdrawals);

// Get single withdrawal
router.get('/:id', withdrawalController.getWithdrawal);

// Admin routes - require admin role
router.get('/admin/all', authorize('admin'), withdrawalController.getAllWithdrawals);
router.put('/admin/:id/approve', authorize('admin'), withdrawalController.approveWithdrawal);
router.put('/admin/:id/reject', authorize('admin'), withdrawalController.rejectWithdrawal);
router.put('/admin/:id/complete', authorize('admin'), withdrawalController.completeWithdrawal);
router.get('/admin/statistics', authorize('admin'), withdrawalController.getWithdrawalStatistics);

module.exports = router;
