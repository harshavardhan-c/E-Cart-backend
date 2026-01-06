-- Migration script to change users table from phone to email
-- Run this in your Supabase SQL Editor

-- Step 1: Check if email column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email'
    ) THEN
        -- Add email column
        ALTER TABLE users ADD COLUMN email TEXT UNIQUE;
        
        -- Migrate data from phone to email (if needed)
        -- Update existing records if they exist
        UPDATE users SET email = phone || '@example.com' WHERE phone IS NOT NULL AND email IS NULL;
    END IF;
END $$;

-- Step 2: Add NOT NULL constraint if no existing data
-- ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Step 3: Update primary authentication to email
-- The email will be the new primary identifier

-- Optional: Drop phone column after migration (uncomment if you want to remove phone completely)
-- ALTER TABLE users DROP COLUMN IF EXISTS phone;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('email', 'phone');











