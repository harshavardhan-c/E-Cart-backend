import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getRecentOrders,
  getLowStockProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Order management
router.get('/orders/recent', getRecentOrders);

// Product management
router.get('/products/low-stock', getLowStockProducts);

// ✅ New product management routes
router.post('/products', addProduct);         // Add new product
router.put('/products/:id', updateProduct);   // Update product details
router.delete('/products/:id', deleteProduct); // Delete product

export default router;
