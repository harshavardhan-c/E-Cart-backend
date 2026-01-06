import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// For development, only validate critical environment variables
const criticalEnvVars = ['PORT'];

const missingCriticalEnvVars = criticalEnvVars.filter(envVar => !process.env[envVar]);

if (missingCriticalEnvVars.length > 0) {
  console.error('❌ Missing critical environment variables:');
  missingCriticalEnvVars.forEach(envVar => console.error(`   - ${envVar}`));
  process.exit(1);
}

// Warn about missing optional environment variables in development
if (process.env.NODE_ENV === 'development') {
  const optionalEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM'
  ];

  const missingOptionalEnvVars = optionalEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingOptionalEnvVars.length > 0) {
    console.warn('⚠️  Missing optional environment variables (using mock values):');
    missingOptionalEnvVars.forEach(envVar => console.warn(`   - ${envVar}`));
  }
}

console.log('✅ Environment configuration loaded');

export default {
  PORT: process.env.PORT || 5000,
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://mock.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'mock-anon-key',
  JWT_SECRET: process.env.JWT_SECRET || 'mock-jwt-secret',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_SECURE: process.env.SMTP_SECURE || 'false',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
