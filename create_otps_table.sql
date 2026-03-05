-- =====================================================
-- CREATE OTP TABLE FOR LALITHA MEGA MALL
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create OTPs table
CREATE TABLE IF NOT EXISTS otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  purpose TEXT DEFAULT 'signup' CHECK (purpose IN ('login', 'signup')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at);

-- Enable RLS
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (allow all operations for now)
CREATE POLICY "OTP full access" ON otps FOR ALL USING (true);

-- Verify table creation
SELECT '✅ OTP table created successfully!' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'otps' 
ORDER BY ordinal_position;