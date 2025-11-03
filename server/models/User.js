const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  hostel: {
    type: String
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Ensure candidatePassword is a string and stored password exists
    if (typeof candidatePassword !== 'string' || !this.password) {
      return false;
    }
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    // On any error, return false rather than throwing to the caller
    return false;
  }
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
