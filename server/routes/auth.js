const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Sign Up
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('semester').trim().notEmpty().withMessage('Semester is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, rollNumber, department, semester, phone, hostel } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or roll number already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      rollNumber,
      department,
      semester,
      phone,
      hostel,
      role: 'student'
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
        hostel: user.hostel,
        role: user.role,
        rating: user.rating,
        reviewCount: user.reviewCount
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error creating user', message: error.message });
  }
});

// Sign In
router.post('/signin', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check for admin login
    if (email === 'admin@nitc.ac.in' && password === 'admin123') {
      // Find or create admin user
      let admin = await User.findOne({ email: 'admin@nitc.ac.in' });
      
      if (!admin) {
        admin = new User({
          name: 'Admin',
          email: 'admin@nitc.ac.in',
          password: 'admin123',
          rollNumber: 'ADMIN001',
          department: 'Administration',
          semester: 'N/A',
          phone: '0000000000',
          role: 'admin'
        });
        await admin.save();
      }

      const token = generateToken(admin._id);

      return res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    }

    // Regular user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
        hostel: user.hostel,
        role: user.role,
        rating: user.rating,
        reviewCount: user.reviewCount
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Error signing in', message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

module.exports = router;
