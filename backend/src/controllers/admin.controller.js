const User = require('../models/User.model');
const Property = require('../models/Property.model');
const Application = require('../models/Application.model');
const Payment = require('../models/Payment.model');

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const query = {};

    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch users' } });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    const { role, isActive, profile } = req.body;

    if (role) user.role = role;
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (profile) user.profile = { ...user.profile, ...profile };

    await user.save();

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: { message: 'Failed to update user' } });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: { message: 'Failed to delete user' } });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalPayments = await Payment.countDocuments();

    // Get breakdown by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Get property status breakdown
    const propertiesByStatus = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get application status breakdown
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get payment status breakdown
    const paymentsByStatus = await Payment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get total revenue
    const revenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      analytics: {
        overview: {
          totalUsers,
          totalProperties,
          totalApplications,
          totalPayments,
          totalRevenue: revenue[0]?.total || 0
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        propertiesByStatus: propertiesByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        paymentsByStatus: paymentsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch analytics' } });
  }
};
