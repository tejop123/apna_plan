const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['booking_confirmation', 'payment_success', 'payment_failed', 'booking_reminder', 'review_request', 'promotion', 'system'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    relatedTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction' },
    isRead: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    channels: { type: [String], enum: ['email', 'in-app', 'sms', 'push'], default: ['in-app', 'email'] },
    sentAt: Date,
    readAt: Date,
    actionUrl: String, // Link to take action on notification
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
