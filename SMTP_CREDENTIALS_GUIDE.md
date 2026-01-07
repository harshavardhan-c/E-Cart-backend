# SMTP Credentials Guide

## Migration Complete: Twilio → Nodemailer

I've successfully migrated your authentication system from Twilio SMS to Nodemailer (SMTP email). Here are the credentials you need to provide.

## Required SMTP Credentials

Add these variables to your `backend/.env` file:

```env
# SMTP Email Configuration for OTP
SMTP_HOST=                  # Your SMTP server (e.g., smtp.gmail.com)
SMTP_PORT=                  # SMTP port (usually 587 for TLS, 465 for SSL)
SMTP_SECURE=                # true or false (use 'true' for port 465, 'false' for port 587)
SMTP_USER=                  # Your SMTP email address
SMTP_PASS=                  # Your SMTP password or app-specific password
```

## Common SMTP Providers

### 1. Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not regular password
```

**To get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to "App passwords" under "Security"
4. Generate a new app password for "Mail"
5. Use that 16-character password as SMTP_PASS

### 2. Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### 3. Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password  # Generate app password in Yahoo Account Security
```

### 4. SendGrid (Recommended for Production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey  # Literally write "apikey"
SMTP_PASS=your-sendgrid-api-key
```

## Changes Made

### ✅ Code Changes
- Replaced Twilio with Nodemailer
- Changed authentication from phone-based to email-based
- Updated all user models to use email
- Updated auth controllers to send OTP via email
- Created beautiful HTML email templates for OTP

### ✅ Files Modified
- `backend/config/nodemailerClient.js` (NEW)
- `backend/utils/sendOtp.js` (UPDATED - now sends emails)
- `backend/controllers/authController.js` (UPDATED - uses email)
- `backend/models/usersModel.js` (UPDATED - getUserByEmail instead of getUserByPhone)
- `backend/routes/authRoutes.js` (UPDATED - uses sendOtpToEmail)
- `backend/utils/generateToken.js` (UPDATED - uses email in tokens)

### ✅ Files Removed
- `backend/config/twilioClient.js` (DELETED)
- Twilio package removed from dependencies

### ✅ Package Updates
- Installed: `nodemailer`
- Removed: `twilio`

## Database Changes Needed

Your Supabase `users` table needs to have an `email` field instead of (or in addition to) `phone`. 

**Required columns for users table:**
```sql
- id (UUID)
- email (TEXT) - PRIMARY identifier
- name (TEXT)
- role (TEXT)
- created_at (TIMESTAMP)
```

## Testing Your SMTP Configuration

After adding the credentials to `.env`, you can test it by:

1. Start the server: `npm run dev`
2. Try sending an OTP to your email via the API endpoint
3. Check your inbox and spam folder

## API Endpoints (Updated)

### Send OTP to Email
```bash
POST http://localhost:5000/api/auth/send-otp
Body: { "email": "user@example.com" }
```

### Verify OTP and Login/Register
```bash
POST http://localhost:5000/api/auth/verify-otp
Body: { "email": "user@example.com", "otp": "123456", "name": "User Name" }
```

## Email Template

The OTP emails are sent with a beautiful HTML template featuring:
- Professional design with Lalitha Mega Mall branding
- Large, easy-to-read 6-digit OTP
- Security warnings
- Automatic expiration notice

---

**Next Steps:**
1. Add your SMTP credentials to `backend/.env`
2. Update your Supabase users table to use email instead of phone
3. Test the OTP functionality
4. Update your frontend to use email instead of phone number











