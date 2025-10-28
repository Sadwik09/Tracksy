# Tracksy - MERN Stack Finance Tracker

A full-stack personal finance tracking application built with MongoDB, Express.js, React, and Node.js.

## Features

- User authentication (register/login)
- Track income and expenses
- Categorize transactions
- Set and monitor budgets
- Financial reports and analytics
- Secure and private data storage

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd tracksy
\`\`\`

2. **Install Backend Dependencies**
\`\`\`bash
cd server
npm install
\`\`\`

3. **Install Frontend Dependencies**
\`\`\`bash
cd ../client
npm install
\`\`\`

4. **Configure Environment Variables**

Create a `.env` file in the `server` directory:
\`\`\`env
MONGODB_URI=mongodb://atlas-sql-6900f19ac558922b8432b469-aabfet.a.query.mongodb.net/myVirtualDatabase?ssl=true&authSource=admin
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
\`\`\`

Create a `.env` file in the `client` directory:
\`\`\`env
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

### Running the Application

1. **Start the Backend Server**
\`\`\`bash
cd server
npm run dev
\`\`\`
The server will run on http://localhost:5000

2. **Start the Frontend (in a new terminal)**
\`\`\`bash
cd client
npm start
\`\`\`
The app will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Users
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update password

## Database Schema

### User
- name, email, password (hashed)
- currency preference
- timestamps

### Transaction
- user reference
- type (income/expense)
- amount, category, description
- date, timestamps

### Category
- user reference
- name, type (income/expense)
- color, icon
- timestamps

### Budget
- user reference
- category reference
- amount, period (monthly/yearly)
- month, year
- timestamps

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- User data isolation
- Input validation

## Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy from GitHub or CLI
3. Ensure MongoDB Atlas IP whitelist includes deployment server

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Set `REACT_APP_API_URL` to your backend URL

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
