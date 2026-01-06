import { UsersModel } from '../models/usersModel.js';
import { OtpModel } from '../models/otpModel.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtp } from '../utils/sendOtp.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Send OTP to email
 */
export const sendOtpToEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Valid email address is required'
    });
  }

  try {
    // Generate OTP
    const otp = generateOtp();
    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Check if user exists to determine if it's login or signup
    const existingUser = await UsersModel.getUserByEmail(email);
    const purpose = existingUser ? 'login' : 'signup';

    // Store OTP in Supabase database with purpose
    await OtpModel.createOtp(email, otp, expiryTime, purpose);

    // Send OTP via Email
    await sendOtp(email, otp);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully to your email',
      data: {
        email,
        expiresIn: '24 hours'
      }
    });
  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

/**
 * Verify OTP and login/register user
 */
export const verifyOtpAndLogin = asyncHandler(async (req, res) => {
  const { email, otp, name } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({
      status: 'error',
      message: 'Email address and OTP are required'
    });
  }

  try {
    // Get OTP from database
    const storedOtp = await OtpModel.getOtpByEmail(email);
    if (!storedOtp) {
      return res.status(400).json({
        status: 'error',
        message: 'OTP not found or expired. Please request a new OTP.'
      });
    }

    // Check if OTP has expired
    const now = new Date();
    const expiresAt = new Date(storedOtp.expires_at);
    if (now > expiresAt) {
      await OtpModel.deleteOtp(email);
      return res.status(400).json({
        status: 'error',
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Check attempts
    if (storedOtp.attempts >= 3) {
      await OtpModel.deleteOtp(email);
      return res.status(400).json({
        status: 'error',
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (storedOtp.otp !== otp) {
      await OtpModel.updateAttempts(email, storedOtp.attempts + 1);
      
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP'
      });
    }

    // OTP is valid, delete from database
    await OtpModel.deleteOtp(email);

    // Check if user exists
    let user = await UsersModel.getUserByEmail(email);

    if (!user) {
      // Create new user
      const userData = {
        email,
        name: name || email.split('@')[0], // Use email prefix as name if not provided
        role: 'customer',
        created_at: new Date().toISOString()
      };

      user = await UsersModel.createUser(userData);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.created_at
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('❌ Error verifying OTP:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify OTP. Please try again.'
    });
  }
});

/**
 * Refresh access token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      status: 'error',
      message: 'Refresh token is required'
    });
  }

  try {
    const { verifyToken } = await import('../utils/generateToken.js');
    const decoded = verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }

    // Get user
    const user = await UsersModel.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    console.error('❌ Error refreshing token:', error.message);
    res.status(401).json({
      status: 'error',
      message: 'Invalid refresh token'
    });
  }
});

/**
 * Logout user (client-side token removal)
 */
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logout successful'
  });
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    status: 'success',
    message: 'Profile retrieved successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at
      }
    }
  });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const updatedUser = await UsersModel.updateUser(userId, { name });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          created_at: updatedUser.created_at
        }
      }
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});
/**
 * Admin Login (email + password)
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin (you can later replace with DB check)
  const adminEmail = "admin@lalithamegamall.com";
  const adminPassword = "admin123";

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({
      status: "error",
      message: "Invalid admin credentials",
    });
  }

  // Create token manually
  const adminData = { id: "admin001", email, role: "admin", name: "Admin" };

  const accessToken = generateAccessToken(adminData);
  const refreshToken = generateRefreshToken(adminData);

  res.status(200).json({
    status: "success",
    message: "Admin login successful",
    data: {
      user: adminData,
      accessToken,
      refreshToken,
    },
  });
});

export default {
  sendOtpToEmail,
  verifyOtpAndLogin,
  refreshToken,
  logout,
  getProfile,
  updateProfile
};

