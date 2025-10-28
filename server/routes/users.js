const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { protect } = require("../middleware/auth")

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, currency } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    user.name = name || user.name
    user.email = email || user.email
    user.currency = currency || user.currency

    await user.save()

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
    res.status(400).json({ success: false, message: "Invalid data", error: error.message })
  }
})

// @route   PUT /api/users/password
// @desc    Update user password
// @access  Private
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select("+password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: "Invalid data", error: error.message })
  }
})

module.exports = router
