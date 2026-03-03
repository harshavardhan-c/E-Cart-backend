import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create reusable transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates (for development)
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug output in development
  logger: process.env.NODE_ENV === 'development' // Enable logger in development
});

// Verify transporter configuration (non-blocking)
// Don't block server startup if SMTP fails
if (process.env.NODE_ENV !== 'production') {
  // Only verify in development to avoid blocking production startup
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ SMTP configuration error:', error.message);
      console.error('   Error code:', error.code);
      console.error('   Please check your SMTP credentials in .env file');
      
      if (error.code === 'EAUTH') {
        console.error('   💡 Generate new Gmail App Password: https://myaccount.google.com/apppasswords');
      } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
        console.error('   💡 Check your internet connection and firewall settings');
      }
    } else {
      console.log('✅ SMTP server is ready to send emails');
      console.log(`   Host: ${process.env.SMTP_HOST}`);
      console.log(`   Port: ${process.env.SMTP_PORT}`);
      console.log(`   User: ${process.env.SMTP_USER}`);
    }
  });
} else {
  // In production, just log that we're using SMTP
  console.log('📧 SMTP configured for production');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
}

export default transporter;










