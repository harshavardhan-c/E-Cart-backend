import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Create email transporter based on environment
 * In production, use SendGrid API via nodemailer-sendgrid
 * In development, use SMTP
 */
export const createTransporter = () => {
  // For production, use SendGrid API transport (more reliable than SMTP)
  if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
    console.log('📧 Using SendGrid API transport for production');
    
    // Use nodemailer with SendGrid API
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 465,
      secure: true,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Fallback to standard SMTP configuration
  console.log('📧 Using SMTP transport');
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const transporter = createTransporter();

// Verify connection in development only
if (process.env.NODE_ENV !== 'production') {
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email configuration error:', error.message);
    } else {
      console.log('✅ Email server is ready');
    }
  });
}

export default transporter;
