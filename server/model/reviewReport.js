const mongoose = require("mongoose");

const reviewReportSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  reviewId: {
    type: String,
    required: true,
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'reporterModel',
    required: true,
  },
  reporterModel: {
    type: String,
    required: true,
    enum: ['Shop', 'User']
  },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "resolved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ReviewReport", reviewReportSchema);