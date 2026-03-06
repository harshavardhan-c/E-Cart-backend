/**
 * Send email using SendGrid API (HTTP-based)
 * This is the ONLY method used - no SMTP fallback
 */
export const sendEmailViaSendGrid = async (to, subject, htmlContent) => {
  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'chamalaharshavardhan55@gmail.com';

    if (!SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not configured in environment variables');
    }

    console.log(`📧 Sending email via SendGrid API to ${to}...`);

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
      console.error(`❌ SendGrid API error: ${response.status}`);
      console.error(`   Response: ${errorText}`);
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
 * Send OTP email using SendGrid API ONLY
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

  return await sendEmailViaSendGrid(email, subject, htmlContent);
};

export default sendOtpEmail;
