const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Category = require("../models/Category")
const { protect } = require("../middleware/auth")

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "tracksy-secret-key-change-in-production", {
    expiresIn: "30d",
  })
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" })
    }

    // Create user
    const user = await User.create({ name, email, password })

    // Create default categories for the user
    const defaultCategories = [
      { user: user._id, name: "Groceries", type: "expense", color: "#4CAF50" },
      { user: user._id, name: "Rent", type: "expense", color: "#F44336" },
      { user: user._id, name: "Utilities", type: "expense", color: "#2196F3" },
      { user: user._id, name: "Entertainment", type: "expense", color: "#9C27B0" },
      { user: user._id, name: "Transportation", type: "expense", color: "#FF9800" },
      { user: user._id, name: "Salary", type: "income", color: "#4CAF50" },
      { user: user._id, name: "Freelance", type: "income", color: "#2196F3" },
      { user: user._id, name: "Investments", type: "income", color: "#FF9800" },
    ]

    await Category.insertMany(defaultCategories)

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check for user
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

module.exports = router
