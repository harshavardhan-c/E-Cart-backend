import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} from '../controllers/cartController.js';

const router = express.Router();

// GET routes support optional auth (for guest users)
router.get('/count', optionalAuth, getCartCount);
router.get('/', optionalAuth, getCart);

// Modification routes require authentication
router.post('/', authenticateToken, addToCart);
router.put('/:cartId', authenticateToken, updateCartItem);
router.delete('/:cartId', authenticateToken, removeFromCart);
router.delete('/', authenticateToken, clearCart);

export default router;










