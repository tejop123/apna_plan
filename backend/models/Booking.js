const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingType: { type: String, enum: ['flight', 'train', 'bus', 'hotel'], required: true },
    itemId: { type: String, required: true },
    itemDetails: mongoose.Schema.Types.Mixed,
    traveler: {
      name: String,
      email: String,
      phone: String
    },
    passengers: { type: Number, default: 1 },
    passengerDetails: [
      {
        name: String,
        age: Number,
        email: String,
        gender: String,
        idType: String,
        idNumber: String
      }
    ],
    notes: String,
    amount: Number,
    discountAmount: { type: Number, default: 0 },
    netAmount: Number,
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    paymentMethod: { type: String, enum: ['upi', 'credit_card', 'debit_card', 'netbanking', 'razorpay', 'wallet'], default: null },
    paymentReference: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    voucherCode: String,
    offerCode: String,
    seatNumbers: [String],
    status: { type: String, enum: ['confirmed', 'pending', 'cancelled', 'completed'], default: 'confirmed' },
    cancelledAt: Date,
    cancellationReason: String,
    refundAmount: { type: Number, default: 0 },
    refundStatus: { type: String, enum: ['pending', 'processed', 'failed'], default: null },
    metadata: mongoose.Schema.Types.Mixed,
    inventorySnapshot: mongoose.Schema.Types.Mixed,
    travelDate: Date,
    returnDate: Date,
    specialRequests: String,
    insuranceAdded: { type: Boolean, default: false },
    insuranceAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
