import express from 'express';
import {
  getActiveCoupons,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon
} from '../controllers/couponController.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/active', optionalAuth, getActiveCoupons);
router.post('/validate', optionalAuth, validateCoupon);

// Admin routes
router.use(authenticateToken); // All routes below require authentication
router.use(requireAdmin); // All routes below require admin role

router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.put('/:id/toggle', toggleCouponStatus);
router.delete('/:id', deleteCoupon);

export default router;












