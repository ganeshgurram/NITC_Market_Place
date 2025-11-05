const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const Review = require('../models/Review');
const Report = require('../models/Report');
const { adminAuth } = require('../middleware/auth');

// Get dashboard statistics with growth calculations
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    // Current counts
    const totalUsers = await User.countDocuments({ role: 'student' });
    const activeListings = await Item.countDocuments({ isAvailable: true });
    const totalTransactions = await Transaction.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    // Last month counts for growth calculation
    const lastMonthUsers = await User.countDocuments({
      role: 'student',
      createdAt: { $lte: lastMonth }
    });
    const lastMonthListings = await Item.countDocuments({
      isAvailable: true,
      createdAt: { $lte: lastMonth }
    });
    const lastMonthTransactions = await Transaction.countDocuments({
      createdAt: { $lte: lastMonth }
    });

    // Calculate growth percentages
    const userGrowth = lastMonthUsers > 0 
      ? ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100 
      : 0;
    const listingGrowth = lastMonthListings > 0
      ? ((activeListings - lastMonthListings) / lastMonthListings) * 100
      : 0;
    const transactionGrowth = lastMonthTransactions > 0
      ? ((totalTransactions - lastMonthTransactions) / lastMonthTransactions) * 100
      : 0;

    // Get recent activity for overview
    const recentUsers = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentItems = await Item.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTransactions = await Transaction.find()
      .populate('item', 'title')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        activeListings,
        totalTransactions,
        pendingReports,
        monthlyGrowth: {
          users: parseFloat(userGrowth.toFixed(1)),
          listings: parseFloat(listingGrowth.toFixed(1)),
          transactions: parseFloat(transactionGrowth.toFixed(1))
        }
      },
      recentUsers,
      recentItems,
      recentTransactions
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Error fetching admin stats', message: error.message });
  }
});

// Get all users with search and filter
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = { role: 'student' };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter (based on isVerified)
    if (status === 'verified') {
      query.isVerified = true;
    } else if (status === 'pending') {
      query.isVerified = false;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users', message: error.message });
  }
});

// Get all items (admin view) with search and filter
router.get('/items', adminAuth, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status === 'active') {
      query.isAvailable = true;
    } else if (status === 'sold') {
      query.isAvailable = false;
    }

    const items = await Item.find(query)
      .populate('seller', 'name email rollNumber')
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Error fetching items', message: error.message });
  }
});

// Update item availability (hide/show)
router.put('/items/:id/availability', adminAuth, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    ).populate('seller', 'name email rollNumber');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: `Item ${isAvailable ? 'shown' : 'hidden'} successfully`, item });
  } catch (error) {
    console.error('Error updating item availability:', error);
    res.status(500).json({ error: 'Error updating item availability', message: error.message });
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

// Suspend/Unsuspend user (we'll use isVerified as a proxy for active/suspended)
router.put('/users/:id/suspend', adminAuth, async (req, res) => {
  try {
    const { suspended } = req.body;
    // If suspended, set isVerified to false (or we could add a suspended field)
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: !suspended },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: `User ${suspended ? 'suspended' : 'unsuspended'} successfully`,
      user 
    });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ error: 'Error suspending user', message: error.message });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user', message: error.message });
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

// Reports Management
// Get all reports
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('item', 'title description images')
      .populate('reporter', 'name email rollNumber')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Error fetching reports', message: error.message });
  }
});

// Resolve report
router.put('/reports/:id/resolve', adminAuth, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: action === 'approve' ? 'resolved' : 'rejected',
        resolvedBy: req.userId,
        resolvedAt: new Date()
      },
      { new: true }
    )
      .populate('item', 'title description')
      .populate('reporter', 'name email')
      .populate('resolvedBy', 'name email');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // If approved, hide the item
    if (action === 'approve') {
      await Item.findByIdAndUpdate(report.item._id, { isAvailable: false });
    }

    res.json({ 
      message: `Report ${action === 'approve' ? 'resolved' : 'rejected'} successfully`,
      report 
    });
  } catch (error) {
    console.error('Error resolving report:', error);
    res.status(500).json({ error: 'Error resolving report', message: error.message });
  }
});

// Analytics endpoint
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User growth over last 30 days
    const userGrowth = await User.aggregate([
      {
        $match: {
          role: 'student',
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Transaction volume over last 30 days
    const transactionVolume = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Items by category
    const itemsByCategory = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Items by department
    const itemsByDepartment = await Item.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      userGrowth,
      transactionVolume,
      itemsByCategory,
      itemsByDepartment
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics', message: error.message });
  }
});

module.exports = router;
