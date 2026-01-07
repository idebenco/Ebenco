import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
