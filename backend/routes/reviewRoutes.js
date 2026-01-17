const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

/**
 * User routes
 */
// Create review
router.post('/', requireAuth, reviewController.createReview);

// Get user's reviews
router.get('/user/my-reviews', requireAuth, reviewController.getUserReviews);

// Update review
router.put('/:reviewId', requireAuth, reviewController.updateReview);

// Delete review
router.delete('/:reviewId', requireAuth, reviewController.deleteReview);

/**
 * Public routes
 */
// Get reviews for an item (no auth required)
router.get('/item', reviewController.getItemReviews);

// Mark review as helpful (this could be by anyone)
router.post('/:reviewId/helpful', reviewController.markReviewHelpful);

/**
 * Admin routes
 */
// Get pending reviews
router.get('/admin/pending', requireAuth, requireAdmin, reviewController.getPendingReviews);

// Moderate review (approve/reject)
router.put('/:reviewId/moderate', requireAuth, requireAdmin, reviewController.moderateReview);

module.exports = router;
