const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    min: 0
  },
  type: {
    type: String,
    enum: ['sale', 'rent', 'free'],
    required: true
  },
  category: {
    type: String,
    enum: ['textbook', 'lab-equipment', 'stationery', 'other'],
    required: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: String
  },
  courseCode: {
    type: String
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair'],
    required: true
  },
  images: [{
    type: String
  }],
  location: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Item', itemSchema);
