import express from 'express';
import {
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  searchProducts,
  updateStock
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/search', optionalAuth, searchProducts);
router.get('/', optionalAuth, getAllProducts); // ✅ Public access to all products
router.get('/:category', optionalAuth, getProductsByCategory);
router.get('/:category/:id', optionalAuth, getProductById);

// Admin routes (require authentication)
router.post('/:category', authenticateToken, requireAdmin, createProduct);
router.put('/:category/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:category/:id', authenticateToken, requireAdmin, deleteProduct);
router.put('/:id/stock', authenticateToken, requireAdmin, updateStock);

export default router;












