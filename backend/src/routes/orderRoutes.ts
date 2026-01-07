import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.get('/', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, createOrder);
router.put('/:id', authenticate, authorize('admin'), updateOrderStatus);
router.delete('/:id', authenticate, deleteOrder);

export default router;
