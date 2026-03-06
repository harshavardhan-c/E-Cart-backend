import { sendOtpEmail } from './sendEmailApi.js';

// Rate limiting: Track last send time per email
const emailSendTimes = new Map();
const MIN_DELAY_BETWEEN_SENDS = 60000; // 1 minute in milliseconds

/**
 * Add delay between sends
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if we can send to this email (rate limiting)
 */
const canSendToEmail = (email) => {
  const lastSendTime = emailSendTimes.get(email);
  if (!lastSendTime) return true;
  
  const timeSinceLastSend = Date.now() - lastSendTime;
  return timeSinceLastSend >= MIN_DELAY_BETWEEN_SENDS;
};

/**
 * Send OTP via Email with rate limiting
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP to send
 * @returns {Promise<Object>} Email response
 */
export const sendOtp = async (email, otp) => {
  try {
    // Validate inputs
    if (!email || !otp) {
      throw new Error('Email and OTP are required');
    }

    // Check rate limiting
    if (!canSendToEmail(email)) {
      const lastSendTime = emailSendTimes.get(email);
      const waitTime = Math.ceil((MIN_DELAY_BETWEEN_SENDS - (Date.now() - lastSendTime)) / 1000);
      console.log(`⏱️ Rate limit: ${email} must wait ${waitTime} seconds`);
      throw new Error(`Please wait ${waitTime} seconds before requesting another OTP`);
    }

    console.log(`📧 Sending OTP to ${email}...`);
    
    // Add small delay to avoid rapid-fire sends
    await delay(1000); // 1 second delay
    
    const result = await sendOtpEmail(email, otp);
    
    // Track send time for rate limiting
    emailSendTimes.set(email, Date.now());
    
    console.log(`✅ OTP sent successfully to ${email}`);
    return result;
  } catch (error) {
    console.error('❌ Error sending OTP email:');
    console.error('   Error type:', error.name);
    console.error('   Error message:', error.message);
    
    // Provide specific error messages
    let errorMessage = 'Failed to send OTP';
    
    if (error.message.includes('wait')) {
      errorMessage = error.message; // Rate limit message
    } else if (error.message.includes('API')) {
      errorMessage = 'Email service error. Please try again.';
    } else if (error.message.includes('Network')) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Send custom email message
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @returns {Promise<Object>} Email response
 */
export const sendEmail = async (email, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${email}: Message ID - ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
      email: email
    };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendOtp;
