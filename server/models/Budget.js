const mongoose = require("mongoose")

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please provide a category"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide a budget amount"],
    min: 0,
  },
  period: {
    type: String,
    enum: ["monthly", "yearly"],
    default: "monthly",
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster queries
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 })

module.exports = mongoose.model("Budget", budgetSchema)
