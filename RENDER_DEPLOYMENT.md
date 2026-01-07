# Render Deployment Configuration

## ✅ Fix Applied

Added `build` script to `package.json`:
```json
"build": "echo 'No build step required'"
```

This satisfies Render's requirement for a build script, even though Node.js APIs don't need compilation.

## 🔧 Render Configuration

### Option 1: Using Render Dashboard (Recommended)

1. Go to your Render dashboard
2. Select your service
3. Go to **Settings**
4. Configure:

   **Build Command:** `npm install`
   - OR: Leave empty (will use default)
   
   **Start Command:** `npm start`
   - This will run: `node server.js`

   **Root Directory:** `backend`
   - ⚠️ IMPORTANT: Set this if deploying from monorepo

### Option 2: Using render.yaml (If supported)

The `render.yaml` file is provided as reference, but Render's free tier might require dashboard configuration.

## 🔐 Required Environment Variables

Set these in Render Dashboard → Environment Variables:

```
NODE_ENV=production
PORT=10000 (Render auto-assigns, but set this)
FRONTEND_URL=https://your-frontend.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url (if using)
```

### Email Configuration (if using):
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## ✅ Verification Steps

After deployment:
1. Check logs for: "Server is running on port..."
2. Test health endpoint: `https://your-backend.onrender.com/api/health`
3. Verify CORS allows your frontend URL

## 🚨 Common Issues

### Issue: "Missing script: build"
✅ **Fixed** - Added build script to package.json

### Issue: Can't find server.js
**Solution:** Set Root Directory to `backend` in Render settings

### Issue: Module not found errors
**Solution:** Ensure all dependencies are in `dependencies` (not `devDependencies`)

### Issue: Port binding error
**Solution:** Use `process.env.PORT` (Render auto-assigns)

