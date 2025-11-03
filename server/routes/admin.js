const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const Review = require('../models/Review');
const { adminAuth } = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalItems = await Item.countDocuments();
    const activeListings = await Item.countDocuments({ isAvailable: true });
    const completedTransactions = await Transaction.countDocuments({ status: 'completed' });
    const totalReviews = await Review.countDocuments();

    // Get items by category
    const itemsByCategory = await Item.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Get recent activity
    const recentItems = await Item.find()
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentTransactions = await Transaction.find()
      .populate('item', 'title')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        totalItems,
        activeListings,
        completedTransactions,
        totalReviews
      },
      itemsByCategory,
      recentItems,
      recentTransactions
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Error fetching admin stats', message: error.message });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users', message: error.message });
  }
});

// Get all items (admin view)
router.get('/items', adminAuth, async (req, res) => {
  try {
    const items = await Item.find()
      .populate('seller', 'name email rollNumber')
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Error fetching items', message: error.message });
  }
});

// Delete item (admin)
router.delete('/items/:id', adminAuth, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Error deleting item', message: error.message });
  }
});

// Get all transactions
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('item', 'title')
      .populate('buyer', 'name email rollNumber')
      .populate('seller', 'name email rollNumber')
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions', message: error.message });
  }
});

// Verify/Unverify user
router.put('/users/:id/verify', adminAuth, async (req, res) => {
  try {
    const { isVerified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user 
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Error verifying user', message: error.message });
  }
});

module.exports = router;
