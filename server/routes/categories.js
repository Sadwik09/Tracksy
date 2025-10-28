const express = require("express")
const router = express.Router()
const Category = require("../models/Category")
const { protect } = require("../middleware/auth")

// @route   GET /api/categories
// @desc    Get all categories for user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { type } = req.query

    const query = { user: req.user.id }
    if (type) query.type = type

    const categories = await Category.find(query).sort({ name: 1 })

    res.json({ success: true, data: categories })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// @route   POST /api/categories
// @desc    Create a category
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { name, type, color, icon } = req.body

    const category = await Category.create({
      user: req.user.id,
      name,
      type,
      color: color || "#4CAF50",
      icon: icon || "tag",
    })

    res.status(201).json({ success: true, data: category })
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Category already exists" })
    }
    res.status(400).json({ success: false, message: "Invalid data", error: error.message })
  }
})

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" })
    }

    // Check ownership
    if (category.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    res.json({ success: true, data: category })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: "Invalid data", error: error.message })
  }
})

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" })
    }

    // Check ownership
    if (category.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await category.deleteOne()

    res.json({ success: true, message: "Category deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

module.exports = router
