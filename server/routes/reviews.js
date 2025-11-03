const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Create a review
router.post('/', auth, [
  body('reviewedUserId').notEmpty().withMessage('Reviewed user ID is required'),
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reviewedUserId, transactionId, rating, comment, categories } = req.body;

    // Check if review already exists for this transaction
    const existingReview = await Review.findOne({
      transaction: transactionId,
      reviewer: req.userId
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this transaction' });
    }

    const review = new Review({
      reviewedUser: reviewedUserId,
      reviewer: req.userId,
      transaction: transactionId,
      rating,
      comment,
      categories: categories || {}
    });

    await review.save();

    // Update user's rating
    const reviews = await Review.find({ reviewedUser: reviewedUserId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(reviewedUserId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    });

    await review.populate('reviewer', 'name');
    await review.populate('reviewedUser', 'name');

    res.status(201).json({ 
      message: 'Review submitted successfully',
      review 
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Error creating review', message: error.message });
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate('reviewer', 'name rating')
      .populate('transaction')
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews', message: error.message });
  }
});

// Get review statistics for a user
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId });

    if (reviews.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        categoryAverages: {
          communication: 0,
          itemCondition: 0,
          punctuality: 0
        }
      });
    }

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let commSum = 0, condSum = 0, punctSum = 0;
    let commCount = 0, condCount = 0, punctCount = 0;

    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
      
      if (review.categories?.communication) {
        commSum += review.categories.communication;
        commCount++;
      }
      if (review.categories?.itemCondition) {
        condSum += review.categories.itemCondition;
        condCount++;
      }
      if (review.categories?.punctuality) {
        punctSum += review.categories.punctuality;
        punctCount++;
      }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    res.json({
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution,
      categoryAverages: {
        communication: commCount > 0 ? Math.round((commSum / commCount) * 10) / 10 : 0,
        itemCondition: condCount > 0 ? Math.round((condSum / condCount) * 10) / 10 : 0,
        punctuality: punctCount > 0 ? Math.round((punctSum / punctCount) * 10) / 10 : 0
      }
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ error: 'Error fetching review stats', message: error.message });
  }
});

module.exports = router;
