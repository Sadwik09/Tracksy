const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: [true, "Please specify transaction type"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount"],
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please provide a category"],
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster queries
transactionSchema.index({ user: 1, date: -1 })
transactionSchema.index({ user: 1, type: 1 })

module.exports = mongoose.model("Transaction", transactionSchema)
