/**
 * Send email using SendGrid API (HTTP-based, more reliable than SMTP)
 * This works better in production environments like Render
 */
export const sendEmailViaSendGrid = async (to, subject, htmlContent) => {
  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER;

    if (!SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY not configured');
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: { email: FROM_EMAIL },
        content: [{
          type: 'text/html',
          value: htmlContent
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }

    console.log(`✅ Email sent successfully via SendGrid API to ${to}`);
    return {
      success: true,
      messageId: response.headers.get('x-message-id'),
      email: to
    };
  } catch (error) {
    console.error('❌ SendGrid API error:', error.message);
    throw error;
  }
};

/**
 * Send OTP email with fallback mechanism
 * Tries SendGrid API first, falls back to SMTP if needed
 */
export const sendOtpEmail = async (email, otp) => {
  const subject = 'Your Lalitha Mega Mall OTP';
  const htmlContent = `
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
  `;

  // Try SendGrid API first (more reliable in production)
  if (process.env.SENDGRID_API_KEY) {
    try {
      console.log('📧 Attempting to send via SendGrid API...');
      return await sendEmailViaSendGrid(email, subject, htmlContent);
    } catch (apiError) {
      console.warn('⚠️ SendGrid API failed, falling back to SMTP:', apiError.message);
    }
  }

  // Fallback to SMTP
  try {
    console.log('📧 Attempting to send via SMTP...');
    const { transporter } = await import('../config/nodemailerClient.js');
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ OTP sent via SMTP to ${email}`);
    return {
      success: true,
      messageId: info.messageId,
      email: email
    };
  } catch (smtpError) {
    console.error('❌ SMTP also failed:', smtpError.message);
    throw new Error('Failed to send email via both API and SMTP');
  }
};

export default sendOtpEmail;
