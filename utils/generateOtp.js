/**
 * Generate a 6-digit random OTP
 * @returns {string} 6-digit OTP
 */
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a random OTP with custom length
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} Random OTP
 */
export const generateCustomOtp = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

export default generateOtp;

