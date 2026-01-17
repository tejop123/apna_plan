const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['flight', 'train', 'bus', 'hotel'], required: true },
    itemId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    verified: { type: Boolean, default: false }, // Only users with completed bookings can review
    helpful: { type: Number, default: 0 },
    unhelpful: { type: Number, default: 0 },
    tags: [String], // e.g., ['comfortable', 'punctual', 'expensive']
    images: [String], // URLs to images uploaded by user
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  },
  { timestamps: true }
);

// Index for quick lookups
reviewSchema.index({ itemId: 1, itemType: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ bookingId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
