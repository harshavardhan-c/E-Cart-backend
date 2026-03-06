import { sendOtpEmail } from './sendEmailApi.js';

/**
 * Send OTP via Email using API-first approach with SMTP fallback
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

    console.log(`📧 Sending OTP to ${email}...`);
    const result = await sendOtpEmail(email, otp);
    
    console.log(`✅ OTP sent successfully to ${email}`);
    return result;
  } catch (error) {
    console.error('❌ Error sending OTP email:');
    console.error('   Error type:', error.name);
    console.error('   Error message:', error.message);
    
    // Provide specific error messages
    let errorMessage = 'Failed to send OTP';
    
    if (error.message.includes('API')) {
      errorMessage = 'Email service API error. Please try again.';
    } else if (error.message.includes('SMTP')) {
      errorMessage = 'Email server connection error. Please try again.';
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
