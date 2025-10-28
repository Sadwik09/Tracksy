# Quick Deploy Guide - Tracksy MERN

## Fastest Way to Deploy (5 minutes)

### Backend → Render

1. **Push to GitHub:**
\`\`\`bash
git init
git add .
git commit -m "Deploy Tracksy"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
\`\`\`

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - New Web Service → Connect GitHub repo
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
   - Add env vars:
     \`\`\`
     MONGODB_URI=mongodb://atlas-sql-6900f19ac558922b8432b469-aabfet.a.query.mongodb.net/myVirtualDatabase?ssl=true&authSource=admin
     JWT_SECRET=your-secret-key
     NODE_ENV=production
     \`\`\`
   - Deploy!

3. **Copy your Render URL:** `https://tracksy-api.onrender.com`

### Frontend → Vercel

1. **Update API URL in `client/.env`:**
\`\`\`
REACT_APP_API_URL=https://tracksy-api.onrender.com/api
\`\`\`

2. **Deploy with Vercel CLI:**
\`\`\`bash
npm install -g vercel
cd client
vercel login
vercel
\`\`\`

3. **Set environment variable:**
\`\`\`bash
vercel env add REACT_APP_API_URL
# Enter: https://tracksy-api.onrender.com/api
vercel --prod
\`\`\`

Done! Your app is live! 🚀

### Alternative: Deploy Frontend via Vercel Dashboard

1. Push client code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project
4. Add env var: `REACT_APP_API_URL`
5. Deploy!

---

## MongoDB Atlas Setup

1. Go to MongoDB Atlas
2. Network Access → Add IP → Allow All (0.0.0.0/0)
3. Done!

---

## Test Your Deployment

- Backend: `https://YOUR-API.onrender.com/api/health`
- Frontend: `https://YOUR-APP.vercel.app`

---

Need help? Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
