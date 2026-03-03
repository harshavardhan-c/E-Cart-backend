import { transporter } from '../config/nodemailerClient.js';

/**
 * Send OTP via Email using Nodemailer
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

    // Validate SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP configuration is incomplete. Check .env file');
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Your Lalitha Mega Mall OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              color: #4CAF50;
              font-size: 28px;
              margin-bottom: 30px;
            }
            .content {
              color: #333333;
              line-height: 1.6;
            }
            .otp-code {
              background-color: #4CAF50;
              color: white;
              font-size: 32px;
              font-weight: bold;
              padding: 15px 30px;
              text-align: center;
              border-radius: 5px;
              margin: 20px 0;
              letter-spacing: 5px;
            }
            .warning {
              color: #ff9800;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              color: #666666;
              font-size: 14px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="header">🚀 Lalitha Mega Mall</h1>
            <div class="content">
              <p>Hello,</p>
              <p>Your One-Time Password (OTP) for account verification is:</p>
              <div class="otp-code">${otp}</div>
              <p>This OTP is valid for <strong>10 minutes</strong> only.</p>
              <p class="warning">⚠️ DO NOT share this code with anyone. Our team will never ask for your OTP.</p>
              <p>If you didn't request this OTP, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Thank you for choosing Lalitha Mega Mall!</p>
              <p>© ${new Date().getFullYear()} Lalitha Mega Mall. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log(`📧 Attempting to send OTP to ${email}...`);
    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ OTP sent successfully to ${email}`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    
    return {
      success: true,
      messageId: info.messageId,
      email: email
    };
  } catch (error) {
    console.error('❌ Error sending OTP email:');
    console.error('   Error type:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    
    // Provide specific error messages
    let errorMessage = 'Failed to send OTP';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'SMTP authentication failed. Please check your email credentials.';
      console.error('   💡 Fix: Generate new Gmail App Password at https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Network error. Unable to connect to email server.';
      console.error('   💡 Fix: Check your internet connection and firewall settings');
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid email address format.';
    } else if (error.message.includes('Missing credentials')) {
      errorMessage = 'SMTP credentials not configured. Check .env file.';
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
