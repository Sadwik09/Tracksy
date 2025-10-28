# Tracksy MERN Stack - Setup Instructions

## Complete Setup Guide

### Step 1: Project Structure
Your project should have this structure:
\`\`\`
tracksy/
├── server/              # Backend (Node.js + Express)
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env
├── client/              # Frontend (React)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
\`\`\`

### Step 2: Backend Setup

1. **Navigate to server directory:**
\`\`\`bash
cd server
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

This will install:
- express
- mongoose
- cors
- dotenv
- bcryptjs
- jsonwebtoken

3. **Configure MongoDB Connection:**

The `.env` file already contains your MongoDB Atlas connection string:
\`\`\`
MONGODB_URI=mongodb://atlas-sql-6900f19ac558922b8432b469-aabfet.a.query.mongodb.net/myVirtualDatabase?ssl=true&authSource=admin
\`\`\`

4. **Start the backend server:**
\`\`\`bash
npm run dev
\`\`\`

You should see:
\`\`\`
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
\`\`\`

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to client directory:**
\`\`\`bash
cd client
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Start the React development server:**
\`\`\`bash
npm start
\`\`\`

The app will open at http://localhost:3000

### Step 4: Testing the Application

1. **Register a new account:**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Fill in your details
   - Submit the form

2. **Login:**
   - Use your registered credentials
   - You'll be redirected to the dashboard

3. **Test features:**
   - Add transactions (income/expense)
   - Create categories
   - Set budgets
   - View reports

### Step 5: MongoDB Atlas Configuration

Your MongoDB connection is already configured, but ensure:

1. **Network Access:**
   - Go to MongoDB Atlas dashboard
   - Navigate to "Network Access"
   - Add your IP address or use `0.0.0.0/0` for development (allow all)

2. **Database User:**
   - Ensure you have a database user created
   - The credentials should match your connection string

### Troubleshooting

**Backend won't start:**
- Check if MongoDB connection string is correct
- Ensure port 5000 is not in use
- Check Node.js version (should be v14+)

**Frontend won't connect to backend:**
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in client/.env
- Check browser console for CORS errors

**MongoDB connection fails:**
- Verify connection string in server/.env
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### Production Deployment

**Backend (Railway/Render/Heroku):**
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

**Frontend (Vercel/Netlify):**
1. Build: `npm run build`
2. Deploy the build folder
3. Set REACT_APP_API_URL to production backend URL

### Environment Variables Summary

**Server (.env):**
\`\`\`
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=5000
NODE_ENV=development
\`\`\`

**Client (.env):**
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

### Next Steps

1. Customize the UI to match your brand
2. Add more features (recurring transactions, export data, etc.)
3. Implement email notifications
4. Add data visualization
5. Deploy to production

## Support

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas is accessible
4. Check that all dependencies are installed

Happy coding! 🚀
