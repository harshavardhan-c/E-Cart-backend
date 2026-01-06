import express from 'express';
import {
  sendOtpToEmail,
  verifyOtpAndLogin,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  adminLogin
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public routes
router.post('/admin-login', adminLogin); // <-- move this ABOVE auth middleware
router.post('/send-otp', sendOtpToEmail);
router.post('/verify-otp', verifyOtpAndLogin);
router.post('/refresh-token', refreshToken);

// ✅ Protected routes
router.use(authenticateToken); // Everything below needs token
router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
