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
    // Only allow a restricted set of fields to be updated by users
    const { phone, hostel, semester, avatarUrl, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (phone) user.phone = phone;
    if (hostel) user.hostel = hostel;
    if (semester) user.semester = semester;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl; // allow clearing by sending null

    // If user intends to change password, require currentPassword and verify it
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      user.password = newPassword; // pre-save hook will hash
    }

    await user.save();

    // Return sanitized user object (toJSON removes password)
    res.json({ 
      message: 'Profile updated successfully',
      user: user.toJSON()
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
