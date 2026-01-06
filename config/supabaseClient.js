import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// For development, use mock values if environment variables are not set
const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'mock-anon-key';

// Create Supabase client with service role key for admin operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: fetch
  }
});

// Create Supabase client for user operations (with anon key)
export const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: fetch
  }
});

export default supabase;
