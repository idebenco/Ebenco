const Withdrawal = require('../models/Withdrawal.model');
const Payment = require('../models/Payment.model');

// Get user's available balance
exports.getBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get total earnings (completed payments where user is landlord)
    const earnings = await Payment.aggregate([
      { 
        $match: { 
          landlordId: userId,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const totalEarnings = earnings.length > 0 ? earnings[0].total : 0;
    
    // Get total withdrawn + pending withdrawals
    const withdrawals = await Withdrawal.aggregate([
      {
        $match: {
          userId: userId,
          status: { $in: ['pending', 'approved', 'processing', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const totalWithdrawn = withdrawals.length > 0 ? withdrawals[0].total : 0;
    
    const availableBalance = totalEarnings - totalWithdrawn;
    
    res.json({
      totalEarnings,
      totalWithdrawn,
      availableBalance,
      currency: 'USD'
    });
    
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Error fetching balance', error: error.message });
  }
};

// Create withdrawal request
exports.createWithdrawal = async (req, res) => {
  try {
    const { amount, method, walletAddress, network, bankAccount, notes } = req.body;
    const userId = req.user._id;
    
    // Validate minimum amount
    if (amount < 50) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is $50' });
    }
    
    // Check available balance
    const balanceData = await exports.getBalanceData(userId);
    if (balanceData.availableBalance < amount) {
      return res.status(400).json({ 
        message: 'Insufficient balance', 
        availableBalance: balanceData.availableBalance 
      });
    }
    
    // Validate crypto address or bank account
    if (method.startsWith('crypto_')) {
      if (!walletAddress) {
        return res.status(400).json({ message: 'Wallet address is required for crypto withdrawals' });
      }
      // Basic validation - in production use proper validation libraries
      if (walletAddress.length < 26) {
        return res.status(400).json({ message: 'Invalid wallet address format' });
      }
    } else if (method === 'bank_transfer') {
      if (!bankAccount || !bankAccount.accountNumber || !bankAccount.routingNumber) {
        return res.status(400).json({ message: 'Bank account details are required' });
      }
    }
    
    // Create withdrawal request
    const withdrawal = new Withdrawal({
      userId,
      amount,
      method,
      walletAddress: method.startsWith('crypto_') ? walletAddress : undefined,
      network: network,
      bankAccount: method === 'bank_transfer' ? bankAccount : undefined,
      notes,
      status: 'pending'
    });
    
    await withdrawal.save();
    
    // TODO: Send email notification to user and admin
    
    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      withdrawal,
      estimatedFee: withdrawal.fee,
      netAmount: withdrawal.netAmount
    });
    
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ message: 'Error creating withdrawal request', error: error.message });
  }
};

// Get withdrawal history
exports.getWithdrawals = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, method, page = 1, limit = 20 } = req.query;
    
    const query = { userId };
    
    if (status) query.status = status;
    if (method) query.method = method;
    
    const withdrawals = await Withdrawal.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('approvedBy', 'profile.firstName profile.lastName email');
    
    const count = await Withdrawal.countDocuments(query);
    
    res.json({
      withdrawals,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
    
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({ message: 'Error fetching withdrawals', error: error.message });
  }
};

// Get single withdrawal
exports.getWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const withdrawal = await Withdrawal.findOne({ _id: id, userId })
      .populate('approvedBy', 'profile.firstName profile.lastName email');
    
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    
    res.json(withdrawal);
    
  } catch (error) {
    console.error('Get withdrawal error:', error);
    res.status(500).json({ message: 'Error fetching withdrawal', error: error.message });
  }
};

// Helper function to get balance data
exports.getBalanceData = async (userId) => {
  const earnings = await Payment.aggregate([
    { 
      $match: { 
        landlordId: userId,
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  
  const totalEarnings = earnings.length > 0 ? earnings[0].total : 0;
  
  const withdrawals = await Withdrawal.aggregate([
    {
      $match: {
        userId: userId,
        status: { $in: ['pending', 'approved', 'processing', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  
  const totalWithdrawn = withdrawals.length > 0 ? withdrawals[0].total : 0;
  
  return {
    totalEarnings,
    totalWithdrawn,
    availableBalance: totalEarnings - totalWithdrawn
  };
};

// Admin: Get all withdrawal requests
exports.getAllWithdrawals = async (req, res) => {
  try {
    const { status, method, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (method) query.method = method;
    
    const withdrawals = await Withdrawal.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'profile.firstName profile.lastName email profile.phone')
      .populate('approvedBy', 'profile.firstName profile.lastName email');
    
    const count = await Withdrawal.countDocuments(query);
    
    res.json({
      withdrawals,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
    
  } catch (error) {
    console.error('Get all withdrawals error:', error);
    res.status(500).json({ message: 'Error fetching withdrawals', error: error.message });
  }
};

// Admin: Approve withdrawal
exports.approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user._id;
    
    const withdrawal = await Withdrawal.findById(id);
    
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal is not pending' });
    }
    
    withdrawal.status = 'approved';
    withdrawal.approvedBy = adminId;
    withdrawal.approvedAt = new Date();
    if (adminNotes) withdrawal.adminNotes = adminNotes;
    
    await withdrawal.save();
    
    // TODO: Send email notification to user
    
    res.json({ message: 'Withdrawal approved successfully', withdrawal });
    
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ message: 'Error approving withdrawal', error: error.message });
  }
};

// Admin: Reject withdrawal
exports.rejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    
    const withdrawal = await Withdrawal.findById(id);
    
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal is not pending' });
    }
    
    withdrawal.status = 'rejected';
    withdrawal.rejectionReason = rejectionReason;
    
    await withdrawal.save();
    
    // TODO: Send email notification to user
    
    res.json({ message: 'Withdrawal rejected', withdrawal });
    
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ message: 'Error rejecting withdrawal', error: error.message });
  }
};

// Admin: Complete withdrawal
exports.completeWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionHash, confirmationNumber } = req.body;
    
    const withdrawal = await Withdrawal.findById(id);
    
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    
    if (withdrawal.status !== 'approved' && withdrawal.status !== 'processing') {
      return res.status(400).json({ message: 'Withdrawal must be approved or processing' });
    }
    
    withdrawal.status = 'completed';
    withdrawal.completedAt = new Date();
    if (transactionHash) withdrawal.transactionHash = transactionHash;
    if (confirmationNumber) withdrawal.confirmationNumber = confirmationNumber;
    
    await withdrawal.save();
    
    // TODO: Send email notification to user
    
    res.json({ message: 'Withdrawal marked as completed', withdrawal });
    
  } catch (error) {
    console.error('Complete withdrawal error:', error);
    res.status(500).json({ message: 'Error completing withdrawal', error: error.message });
  }
};

// Admin: Get withdrawal statistics
exports.getWithdrawalStatistics = async (req, res) => {
  try {
    const totalWithdrawn = await Withdrawal.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$netAmount' } } }
    ]);
    
    const pendingAmount = await Withdrawal.aggregate([
      { $match: { status: { $in: ['pending', 'approved', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const byMethod = await Withdrawal.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$method', total: { $sum: '$netAmount' }, count: { $sum: 1 } } }
    ]);
    
    const pendingCount = await Withdrawal.countDocuments({ status: 'pending' });
    
    res.json({
      totalWithdrawn: totalWithdrawn.length > 0 ? totalWithdrawn[0].total : 0,
      pendingAmount: pendingAmount.length > 0 ? pendingAmount[0].total : 0,
      pendingCount,
      byMethod
    });
    
  } catch (error) {
    console.error('Get withdrawal statistics error:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};
