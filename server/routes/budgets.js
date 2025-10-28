const express = require("express")
const router = express.Router()
const Budget = require("../models/Budget")
const Transaction = require("../models/Transaction")
const { protect } = require("../middleware/auth")

// @route   GET /api/budgets
// @desc    Get all budgets for user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { month, year } = req.query

    const query = { user: req.user.id }
    if (month) query.month = Number.parseInt(month)
    if (year) query.year = Number.parseInt(year)

    const budgets = await Budget.find(query).populate("category", "name color type").sort({ createdAt: -1 })

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(budget.year, budget.month - 1, 1)
        const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59)

        const spent = await Transaction.aggregate([
          {
            $match: {
              user: req.user._id,
              category: budget.category._id,
              type: "expense",
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ])

        return {
          ...budget.toObject(),
          spent: spent.length > 0 ? spent[0].total : 0,
        }
      }),
    )

    res.json({ success: true, data: budgetsWithSpent })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// @route   POST /api/budgets
// @desc    Create a budget
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { category, amount, period, month, year } = req.body

    const budget = await Budget.create({
      user: req.user.id,
      category,
      amount,
      period: period || "monthly",
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
    })

    const populatedBudget = await Budget.findById(budget._id).populate("category", "name color type")

    res.status(201).json({ success: true, data: populatedBudget })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: "Invalid data", error: error.message })
  }
})

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id)

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" })
    }

    // Check ownership
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(
      "category",
      "name color type",
    )

    res.json({ success: true, data: budget })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: "Invalid data", error: error.message })
  }
})

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" })
    }

    // Check ownership
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await budget.deleteOne()

    res.json({ success: true, message: "Budget deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

module.exports = router
