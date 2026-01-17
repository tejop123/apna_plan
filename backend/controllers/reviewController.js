const Review = require('../models/Review');
const Booking = require('../models/Booking');

/**
 * Create a new review for a booking
 */
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, title, comment, tags = [], images = [] } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to review this booking' });
    }

    // Check if user already reviewed this booking
    const existingReview = await Review.findOne({ bookingId, userId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this booking' });
    }

    // Create review
    const review = new Review({
      bookingId,
      userId,
      itemType: booking.bookingType,
      itemId: booking.itemId,
      rating,
      title,
      comment,
      tags,
      images,
      verified: booking.status === 'completed'
    });

    await review.save();

    // Update average rating for the item (optional: implement in a separate service)
    res.status(201).json({
      success: true,
      review,
      message: 'Review created successfully. It will be displayed after approval.'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

/**
 * Get reviews for an item
 */
exports.getItemReviews = async (req, res) => {
  try {
    const { itemId, itemType } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!itemId || !itemType) {
      return res.status(400).json({ error: 'itemId and itemType are required' });
    }

    // Get approved reviews
    const reviews = await Review.find({
      itemId,
      itemType,
      status: 'approved'
    })
      .populate('userId', 'name profilePicture')
      .sort({ helpful: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({
      itemId,
      itemType,
      status: 'approved'
    });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      {
        $match: {
          itemId,
          itemType,
          status: 'approved'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const stats = ratingStats[0] || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: []
    };

    // Calculate rating distribution
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };
    stats.ratingDistribution.forEach(rating => {
      distribution[rating]++;
    });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        averageRating: parseFloat(stats.averageRating.toFixed(1)),
        totalReviews: stats.totalReviews,
        distribution
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/**
 * Get user's reviews
 */
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ userId })
      .populate('bookingId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ userId });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/**
 * Update a review
 */
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, tags, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this review' });
    }

    // Only allow updates if review is still pending or approved (not rejected)
    if (review.status === 'rejected') {
      return res.status(400).json({ error: 'Cannot update rejected reviews' });
    }

    // Update fields
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    if (tags !== undefined) review.tags = tags;
    if (images !== undefined) review.images = images;

    // Reset status to pending if updated
    review.status = 'pending';

    await review.save();

    res.json({
      success: true,
      review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

/**
 * Delete a review
 */
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this review' });
    }

    await Review.deleteOne({ _id: reviewId });

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

/**
 * Mark review as helpful (admin only)
 */
exports.markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body; // true or false

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (helpful) {
      review.helpful = (review.helpful || 0) + 1;
    } else {
      review.unhelpful = (review.unhelpful || 0) + 1;
    }

    await review.save();

    res.json({
      success: true,
      review,
      message: `Review marked as ${helpful ? 'helpful' : 'unhelpful'}`
    });
  } catch (error) {
    console.error('Error marking review:', error);
    res.status(500).json({ error: 'Failed to mark review' });
  }
};

/**
 * Approve/Reject reviews (admin only)
 */
exports.moderateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      success: true,
      review,
      message: `Review ${status} successfully`
    });
  } catch (error) {
    console.error('Error moderating review:', error);
    res.status(500).json({ error: 'Failed to moderate review' });
  }
};

/**
 * Get pending reviews (admin only)
 */
exports.getPendingReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ status: 'pending' })
      .populate('userId', 'name email')
      .populate('bookingId', 'bookingId itemType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ status: 'pending' });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    res.status(500).json({ error: 'Failed to fetch pending reviews' });
  }
};
