const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');

// Create a transaction
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, sellerId, amount } = req.body;

    if (!itemId || !sellerId) {
      return res.status(400).json({ error: 'Item ID and seller ID are required' });
    }

    // Check if item exists and is available
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!item.isAvailable) {
      return res.status(400).json({ error: 'Item is no longer available' });
    }

    const transaction = new Transaction({
      item: itemId,
      seller: sellerId,
      buyer: req.userId,
      amount: amount || item.price || 0,
      status: 'pending'
    });

    await transaction.save();
    await transaction.populate('item');
    await transaction.populate('seller', 'name rating reviewCount');
    await transaction.populate('buyer', 'name rating reviewCount');

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
    await transaction.populate('buyer', 'name rating reviewCount');

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
      .populate('seller', 'name rating reviewCount')
      .populate('buyer', 'name rating reviewCount')
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
      .populate('seller', 'name rating reviewCount')
      .populate('buyer', 'name rating reviewCount');

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
    await transaction.populate('buyer', 'name rating reviewCount');

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
