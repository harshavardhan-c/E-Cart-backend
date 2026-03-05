import { UsersModel } from '../models/usersModel.js';
import { OtpModel } from '../models/otpModel.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtp } from '../utils/sendOtp.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { supabase } from '../config/supabaseClient.js';

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
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user exists to determine if it's login or signup
    const existingUser = await UsersModel.getUserByEmail(email);
    const purpose = existingUser ? 'login' : 'signup';

    // Store OTP in Supabase database with purpose
    try {
      // Try different purpose values to match database constraint
      await OtpModel.createOtp(email, otp, expiryTime, 'login');
    } catch (firstError) {
      try {
        await OtpModel.createOtp(email, otp, expiryTime, 'registration');
      } catch (secondError) {
        // Try without purpose parameter using direct supabase call
        await supabase.from('otps').delete().eq('email', email); // Delete existing OTPs first
        
        const { data: insertData, error: insertError } = await supabase
          .from('otps')
          .insert([{
            email,
            otp,
            expires_at: expiryTime.toISOString(),
            attempts: 0
          }])
          .select()
          .single();
        
        if (insertError) throw insertError;
      }
    }

    // Send OTP via Email
    await sendOtp(email, otp);

    console.log(`✅ OTP sent successfully to ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully to your email',
      data: {
        email,
        expiresIn: '10 minutes'
      }
    });
  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      status: 'error',
      message: 'Failed to send OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

/**
 * Test OTP functionality step by step
 */
export const testOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is required for testing'
    });
  }

  const results = {
    step1_validation: 'PENDING',
    step2_env_check: 'PENDING',
    step3_otp_generation: 'PENDING',
    step4_user_lookup: 'PENDING',
    step5_database_store: 'PENDING',
    step6_email_send: 'PENDING',
    errors: []
  };

  try {
    // Step 1: Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      results.step1_validation = 'SUCCESS';
    } else {
      results.step1_validation = 'FAILED';
      results.errors.push('Invalid email format');
    }

    // Step 2: Environment check
    const requiredEnvs = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    
    if (missingEnvs.length === 0) {
      results.step2_env_check = 'SUCCESS';
    } else {
      results.step2_env_check = 'FAILED';
      results.errors.push(`Missing env vars: ${missingEnvs.join(', ')}`);
    }

    // Step 3: OTP generation
    try {
      const otp = generateOtp();
      results.step3_otp_generation = 'SUCCESS';
      results.generated_otp = otp;
    } catch (error) {
      results.step3_otp_generation = 'FAILED';
      results.errors.push(`OTP generation error: ${error.message}`);
    }

    // Step 4: User lookup
    try {
      const existingUser = await UsersModel.getUserByEmail(email);
      results.step4_user_lookup = 'SUCCESS';
      results.user_exists = !!existingUser;
    } catch (error) {
      results.step4_user_lookup = 'FAILED';
      results.errors.push(`User lookup error: ${error.message}`);
    }

    // Step 5: Database store (if previous steps succeeded)
    if (results.step3_otp_generation === 'SUCCESS') {
      try {
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000);
        // Try without purpose first, then with different values
        try {
          await OtpModel.createOtp(email, results.generated_otp, expiryTime, 'login');
          results.step5_database_store = 'SUCCESS';
        } catch (firstError) {
          try {
            await OtpModel.createOtp(email, results.generated_otp, expiryTime, 'registration');
            results.step5_database_store = 'SUCCESS';
          } catch (secondError) {
            try {
              // Try without purpose parameter
              const { data, error } = await supabase
                .from('otps')
                .insert([{
                  email,
                  otp: results.generated_otp,
                  expires_at: expiryTime.toISOString(),
                  attempts: 0
                }])
                .select()
                .single();
              
              if (error) throw error;
              results.step5_database_store = 'SUCCESS';
            } catch (thirdError) {
              results.step5_database_store = 'FAILED';
              results.errors.push(`Database store error: ${thirdError.message}`);
            }
          }
        }
      } catch (error) {
        results.step5_database_store = 'FAILED';
        results.errors.push(`Database store error: ${error.message}`);
      }
    }

    // Step 6: Email send (if all previous steps succeeded)
    if (results.step5_database_store === 'SUCCESS') {
      try {
        await sendOtp(email, results.generated_otp);
        results.step6_email_send = 'SUCCESS';
      } catch (error) {
        results.step6_email_send = 'FAILED';
        results.errors.push(`Email send error: ${error.message}`);
      }
    }

    const overallStatus = results.errors.length === 0 ? 'SUCCESS' : 'PARTIAL_FAILURE';

    res.status(200).json({
      status: overallStatus,
      message: 'OTP test completed',
      data: results
    });

  } catch (error) {
    results.errors.push(`Unexpected error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'OTP test failed',
      data: results
    });
  }
});


/**
 * Test SMTP connection
 */
export const testSmtp = asyncHandler(async (req, res) => {
  try {
    const { transporter } = await import('../config/nodemailerClient.js');
    
    // Test SMTP connection
    const isConnected = await transporter.verify();
    
    if (isConnected) {
      res.status(200).json({
        status: 'success',
        message: 'SMTP connection successful',
        data: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER ? 'SET' : 'NOT SET'
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'SMTP connection failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'SMTP test failed',
      error: error.message,
      code: error.code
    });
  }
});
export default {
  sendOtpToEmail,
  verifyOtpAndLogin,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  testOtp,
  testSmtp
};