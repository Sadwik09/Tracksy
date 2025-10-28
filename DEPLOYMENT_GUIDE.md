# Tracksy MERN Stack - Deployment Guide

## Overview
This guide will help you deploy your Tracksy MERN application to production. The backend will be deployed to **Render** (free tier available) and the frontend can be deployed to **Vercel** (free).

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend for Deployment

1. **Ensure your code is ready:**
   - All files in the `server/` directory
   - `package.json` with correct dependencies
   - `.env` file configured (don't commit this!)

2. **Create a `.gitignore` in server directory:**
\`\`\`
node_modules/
.env
.DS_Store
\`\`\`

### Step 2: Push to GitHub

1. **Initialize Git (if not already done):**
\`\`\`bash
git init
git add .
git commit -m "Initial commit - Tracksy MERN backend"
\`\`\`

2. **Create a new repository on GitHub**
   - Go to github.com
   - Click "New Repository"
   - Name it "tracksy-backend"
   - Don't initialize with README

3. **Push your code:**
\`\`\`bash
git remote add origin https://github.com/YOUR_USERNAME/tracksy-backend.git
git branch -M main
git push -u origin main
\`\`\`

### Step 3: Deploy on Render

1. **Go to [Render.com](https://render.com)** and sign up/login

2. **Create a New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select "tracksy-backend"

3. **Configure the service:**
   - **Name:** tracksy-api
   - **Environment:** Node
   - **Region:** Choose closest to you
   - **Branch:** main
   - **Root Directory:** server
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   \`\`\`
   MONGODB_URI=mongodb://atlas-sql-6900f19ac558922b8432b469-aabfet.a.query.mongodb.net/myVirtualDatabase?ssl=true&authSource=admin
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=production
   PORT=5000
   \`\`\`

5. **Click "Create Web Service"**
   - Render will build and deploy your backend
   - Wait for deployment to complete (5-10 minutes)
   - You'll get a URL like: `https://tracksy-api.onrender.com`

6. **Test your backend:**
   - Visit: `https://tracksy-api.onrender.com/api/health`
   - You should see: `{"status":"OK","message":"Tracksy API is running"}`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend API URL

1. **Update `client/.env`:**
\`\`\`
REACT_APP_API_URL=https://tracksy-api.onrender.com/api
\`\`\`

2. **Update `client/src/utils/api.js`:**
\`\`\`javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://tracksy-api.onrender.com/api'
\`\`\`

### Step 2: Build and Test Locally

\`\`\`bash
cd client
npm run build
\`\`\`

Make sure the build completes without errors.

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI:**
\`\`\`bash
npm install -g vercel
\`\`\`

2. **Login to Vercel:**
\`\`\`bash
vercel login
\`\`\`

3. **Deploy:**
\`\`\`bash
cd client
vercel
\`\`\`

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **tracksy-finance**
- Directory? **./build**
- Override settings? **N**

4. **Set Environment Variable:**
\`\`\`bash
vercel env add REACT_APP_API_URL
\`\`\`
Enter: `https://tracksy-api.onrender.com/api`

5. **Deploy to production:**
\`\`\`bash
vercel --prod
\`\`\`

**Option B: Using Vercel Dashboard**

1. **Push frontend to GitHub:**
\`\`\`bash
cd client
git init
git add .
git commit -m "Initial commit - Tracksy frontend"
git remote add origin https://github.com/YOUR_USERNAME/tracksy-frontend.git
git push -u origin main
\`\`\`

2. **Go to [Vercel.com](https://vercel.com)** and login

3. **Import Project:**
   - Click "Add New" → "Project"
   - Import your "tracksy-frontend" repository
   - Framework Preset: Create React App
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add: `REACT_APP_API_URL` = `https://tracksy-api.onrender.com/api`

5. **Click "Deploy"**

---

## Part 3: Configure MongoDB Atlas for Production

1. **Go to MongoDB Atlas Dashboard**

2. **Network Access:**
   - Click "Network Access" in sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Database Access:**
   - Verify your database user has read/write permissions

---

## Part 4: Post-Deployment Testing

### Test Backend
1. Visit: `https://tracksy-api.onrender.com/api/health`
2. Should return: `{"status":"OK"}`

### Test Frontend
1. Visit your Vercel URL (e.g., `https://tracksy-finance.vercel.app`)
2. Try to sign up with a new account
3. Login with your credentials
4. Add a transaction
5. Check if data persists

---

## Troubleshooting

### Backend Issues

**Problem:** "Application failed to respond"
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

**Problem:** CORS errors
- Check that CORS is enabled in server.js
- Verify frontend URL is correct

### Frontend Issues

**Problem:** "Network Error" or "Failed to fetch"
- Check that REACT_APP_API_URL is correct
- Verify backend is running
- Check browser console for errors

**Problem:** Blank page after deployment
- Check Vercel deployment logs
- Verify build completed successfully
- Check browser console for errors

---

## Important Notes

1. **Free Tier Limitations:**
   - Render free tier: Server sleeps after 15 min of inactivity (first request may be slow)
   - MongoDB Atlas free tier: 512MB storage
   - Vercel free tier: Unlimited bandwidth for personal projects

2. **Security:**
   - Change JWT_SECRET to a strong random string
   - Never commit .env files
   - Use HTTPS only in production

3. **Monitoring:**
   - Check Render logs regularly
   - Monitor MongoDB Atlas usage
   - Set up error tracking (optional: Sentry)

---

## Your Deployed URLs

After deployment, save these URLs:

- **Backend API:** `https://tracksy-api.onrender.com`
- **Frontend App:** `https://tracksy-finance.vercel.app` (or your custom domain)
- **MongoDB:** Already configured

---

## Next Steps

1. Set up a custom domain (optional)
2. Enable SSL/HTTPS (automatic on Vercel/Render)
3. Set up monitoring and analytics
4. Configure email notifications
5. Add backup strategy for database

Congratulations! Your Tracksy app is now live! 🎉
