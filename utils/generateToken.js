import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mock-jwt-secret-for-development';

/**
 * Generate JWT token for user
 * @param {Object} payload - User data to encode
 * @param {string} expiresIn - Token expiration time (default: 7d)
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = '7d') => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    return token;
  } catch (error) {
    console.error('❌ Error generating token:', error.message);
    throw new Error('Failed to generate token');
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('❌ Error verifying token:', error.message);
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate access token for user
 * @param {Object} user - User object
 * @returns {string} Access token
 */
export const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'customer',
    name: user.name
  };
  
  return generateToken(payload, '7d');
};

/**
 * Generate refresh token for user
 * @param {Object} user - User object
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    type: 'refresh'
  };
  
  return generateToken(payload, '30d');
};

export default generateToken;