const express = require("express")
const router = express.Router()
const Transaction = require("../models/Transaction")
const { protect } = require("../middleware/auth")

// @route   GET /api/transactions
// @desc    Get all transactions for user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { type, startDate, endDate, category } = req.query

    const query = { user: req.user.id }

    if (type) query.type = type
    if (category) query.category = category
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(query).populate("category", "name color type").sort({ date: -1 })

    res.json({ success: true, data: transactions })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// @route   POST /api/transactions
// @desc    Create a transaction
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date: date || Date.now(),
    })

    const populatedTransaction = await Transaction.findById(transaction._id).populate("category", "name color type")

    res.status(201).json({ success: true, data: populatedTransaction })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: "Invalid data", error: error.message })
  }
})

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" })
    }

    // Check ownership
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name color type")

    res.json({ success: true, data: transaction })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: "Invalid data", error: error.message })
  }
})

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" })
    }

    // Check ownership
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await transaction.deleteOne()

    res.json({ success: true, message: "Transaction deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// @route   GET /api/transactions/stats
// @desc    Get transaction statistics
// @access  Private
router.get("/stats", protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const matchQuery = { user: req.user._id }

    if (startDate || endDate) {
      matchQuery.date = {}
      if (startDate) matchQuery.date.$gte = new Date(startDate)
      if (endDate) matchQuery.date.$lte = new Date(endDate)
    }

    const stats = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ])

    const result = {
      income: 0,
      expense: 0,
      balance: 0,
    }

    stats.forEach((stat) => {
      result[stat._id] = stat.total
    })

    result.balance = result.income - result.expense

    res.json({ success: true, data: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

module.exports = router
