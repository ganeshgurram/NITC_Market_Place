const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  categories: {
    communication: { type: Number, min: 1, max: 5 },
    itemCondition: { type: Number, min: 1, max: 5 },
    punctuality: { type: Number, min: 1, max: 5 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one review per transaction
reviewSchema.index({ transaction: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
