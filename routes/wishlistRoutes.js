import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getWishlistCount
} from '../controllers/wishlistController.js';

const router = express.Router();

// GET routes support optional auth (for guest users)
router.get('/count', optionalAuth, getWishlistCount);
router.get('/', optionalAuth, getWishlist);

// Modification routes require authentication
router.post('/', authenticateToken, addToWishlist);
router.delete('/:productId', authenticateToken, removeFromWishlist);
router.delete('/', authenticateToken, clearWishlist);

export default router;