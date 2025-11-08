const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Create a transaction
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, sellerId, amount } = req.body;

    console.log('=== Transaction Creation ===');
    console.log('Request body:', req.body);
    console.log('Authenticated user (buyer):', req.userId);
    console.log('Seller ID from request:', sellerId);
    console.log('Item ID:', itemId);

    if (!itemId || !sellerId) {
      return res.status(400).json({ error: 'Item ID and seller ID are required' });
    }

    // Check if item exists and is available
    const item = await Item.findById(itemId).populate('seller');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    console.log('Item found - Actual seller from DB:', item.seller);
    console.log('Seller ID from request matches item seller?', item.seller._id.toString() === sellerId);

    if (!item.isAvailable) {
      return res.status(400).json({ error: 'Item is no longer available' });
    }

    // Verify that buyer is not the seller
    if (req.userId.toString() === sellerId.toString()) {
      console.log('ERROR: User trying to buy their own item!');
      return res.status(400).json({ error: 'You cannot buy your own item' });
    }

    const transaction = new Transaction({
      item: itemId,
      seller: sellerId,
      buyer: req.userId,
      amount: amount || item.price || 0,
      status: 'pending'
    });

    console.log('Transaction object:', { item: itemId, seller: sellerId, buyer: req.userId });
    console.log('==========================');

    await transaction.save();
    await transaction.populate('item');
    await transaction.populate('seller', 'name rating reviewCount');
    await transaction.populate('buyer', 'name email rating reviewCount');

    res.status(201).json({ 
      message: 'Transaction created successfully',
      transaction 
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Error creating transaction', message: error.message });
  }
});

// Complete a transaction
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Verify user is buyer or seller
    if (transaction.buyer.toString() !== req.userId.toString() && 
        transaction.seller.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to complete this transaction' });
    }

    transaction.status = 'completed';
    transaction.completedDate = new Date();
    await transaction.save();

    // Mark item as unavailable
    await Item.findByIdAndUpdate(transaction.item, { isAvailable: false });

    await transaction.populate('item');
    await transaction.populate('seller', 'name rating reviewCount');
    await transaction.populate('buyer', 'name email rating reviewCount');

    res.json({ 
      message: 'Transaction completed successfully',
      transaction 
    });
  } catch (error) {
    console.error('Error completing transaction:', error);
    res.status(500).json({ error: 'Error completing transaction', message: error.message });
  }
});

// Get user's transactions (as buyer or seller)
router.get('/my-transactions', auth, async (req, res) => {
  try {
    const { role } = req.query; // 'buyer' or 'seller' or undefined for all

    let query;
    if (role === 'buyer') {
      query = { buyer: req.userId };
    } else if (role === 'seller') {
      query = { seller: req.userId };
    } else {
      query = { $or: [{ buyer: req.userId }, { seller: req.userId }] };
    }

    const transactions = await Transaction.find(query)
      .populate('item')
      .populate('seller', 'name email rating reviewCount')
      .populate('buyer', 'name email rating reviewCount')
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions', message: error.message });
  }
});

// Get transaction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('item')
      .populate('seller', 'name email rating reviewCount')
      .populate('buyer', 'name email rating reviewCount');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Verify user is part of transaction
    if (transaction.buyer._id.toString() !== req.userId.toString() && 
        transaction.seller._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this transaction' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Error fetching transaction', message: error.message });
  }
});

// List transactions (filter by query params)
// Supports: ?seller=...&buyer=...&status=...&page=1&limit=20
router.get('/', async (req, res) => {
  try {
    // Try to optionally authenticate user if Authorization header present
    let requestUserId = null;
    const authHeader = req.header('Authorization') || req.header('authorization');
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        if (user) requestUserId = user._id;
      } catch (e) {
        // ignore auth errors for optional auth
      }
    }

    const { seller, buyer, status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (seller) query.seller = seller;
    if (buyer) query.buyer = buyer;
    if (status) query.status = status;

    // If no explicit seller/buyer provided but we have an authenticated user,
    // default to returning transactions where the user is buyer or seller.
    if (!seller && !buyer && requestUserId) {
      query.$or = [{ buyer: requestUserId }, { seller: requestUserId }];
    }

    const skip = (Math.max(Number(page), 1) - 1) * Number(limit);
    const transactions = await Transaction.find(query)
      .populate('item')
      .populate('seller', 'name email rating reviewCount')
      .populate('buyer', 'name email rating reviewCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Return shape compatible with various client expectations
    res.json({ transactions });
  } catch (error) {
    console.error('Error listing transactions:', error);
    res.status(500).json({ error: 'Error listing transactions', message: error.message });
  }
});

// Cancel a transaction
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Verify user is buyer or seller
    if (transaction.buyer.toString() !== req.userId.toString() && 
        transaction.seller.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to cancel this transaction' });
    }

    transaction.status = 'cancelled';
    await transaction.save();

    await transaction.populate('item');
    await transaction.populate('seller', 'name rating reviewCount');
    await transaction.populate('buyer', 'name email rating reviewCount');

    res.json({ 
      message: 'Transaction cancelled successfully',
      transaction 
    });
  } catch (error) {
    console.error('Error cancelling transaction:', error);
    res.status(500).json({ error: 'Error cancelling transaction', message: error.message });
  }
});

module.exports = router;
