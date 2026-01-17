const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMethod: { type: String, enum: ['upi', 'credit_card', 'debit_card', 'netbanking', 'razorpay', 'wallet'], required: true },
    status: { type: String, enum: ['initiated', 'processing', 'completed', 'failed', 'refunded'], default: 'initiated' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    failureReason: String,
    failureCode: String,
    refundId: String,
    refundAmount: { type: Number, default: 0 },
    refundStatus: { type: String, enum: ['initiated', 'processed', 'failed'], default: null },
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
