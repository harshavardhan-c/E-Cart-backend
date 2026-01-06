import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrder
} from '../controllers/orderController.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', getMyOrders);
router.get('/:orderId', getOrderById);
router.post('/', createOrder);
router.put('/:orderId', updateOrder);

export default router;
