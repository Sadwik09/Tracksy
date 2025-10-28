const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  optionsSuccessStatus: 200,
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://atlas-sql-6900f19ac558922b8432b469-aabfet.a.query.mongodb.net/myVirtualDatabase?ssl=true&authSource=admin"

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err))

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/transactions", require("./routes/transactions"))
app.use("/api/categories", require("./routes/categories"))
app.use("/api/budgets", require("./routes/budgets"))
app.use("/api/users", require("./routes/users"))

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Tracksy API is running" })
})

app.get("/", (req, res) => {
  res.json({
    message: "Tracksy API Server",
    version: "1.0.0",
    status: "running",
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`)
})
