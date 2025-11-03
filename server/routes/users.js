const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's items count
    const itemsCount = await Item.countDocuments({ seller: user._id });

    res.json({ 
      user: {
        ...user.toJSON(),
        itemsCount
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user', message: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, hostel, department, semester } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (hostel) user.hostel = hostel;
    if (department) user.department = department;
    if (semester) user.semester = semester;

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile', message: error.message });
  }
});

// Get user's items
router.get('/:id/items', async (req, res) => {
  try {
    const items = await Item.find({ seller: req.params.id, isAvailable: true })
      .populate('seller', 'name rating reviewCount')
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ error: 'Error fetching user items', message: error.message });
  }
});

module.exports = router;
