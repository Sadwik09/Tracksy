const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a category name"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: [true, "Please specify category type"],
  },
  color: {
    type: String,
    default: "#4CAF50",
  },
  icon: {
    type: String,
    default: "tag",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Ensure unique category names per user
categorySchema.index({ user: 1, name: 1 }, { unique: true })

module.exports = mongoose.model("Category", categorySchema)
