import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Get all users (admin only)
export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.query;
    const query: any = {};

    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching users' });
  }
};

// Get single user by ID
export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check authorization - customer can only view their own profile
    if (req.user?.role === 'customer' && user._id.toString() !== req.user.id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching user' });
  }
};

// Update user profile
export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { password, role, ...updateData } = req.body;

    // Check authorization - customer can only update their own profile
    if (req.user?.role === 'customer' && req.params.id !== req.user.id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    // Only admin can change role
    if (role && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Only admin can change user role' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating user' });
  }
};

// Delete user (admin only)
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting user' });
  }
};
