const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const PaymentTransaction = require('../models/PaymentTransaction');
const Booking = require('../models/Booking');
const { sendPaymentSuccess } = require('../services/emailService');

/**
 * Create Razorpay order
 */
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const userId = req.user.id;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'bookingId and amount are required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to this booking' });
    }

    const result = await paymentService.createOrder(
      amount,
      booking.bookingId,
      userId,
      booking.traveler.email,
      booking.traveler.phone
    );

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

/**
 * Verify payment and complete booking
 */
router.post('/verify', requireAuth, async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingId } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: 'Payment verification details are required' });
    }

    // Verify signature
    const verification = paymentService.verifyPaymentSignature(orderId, paymentId, signature);
    if (!verification.success) {
      return res.status(400).json({ error: verification.message });
    }

    // Get payment details
    const paymentDetails = await paymentService.getPaymentDetails(paymentId);
    if (!paymentDetails.success) {
      return res.status(400).json({ error: 'Failed to fetch payment details' });
    }

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to this booking' });
    }

    // Create payment transaction record
    const transaction = new PaymentTransaction({
      transactionId: paymentId,
      bookingId: booking._id,
      userId,
      amount: paymentDetails.payment.amount,
      paymentMethod: 'razorpay',
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      status: paymentDetails.payment.status === 'captured' ? 'completed' : 'processing',
      metadata: paymentDetails.payment
    });

    await transaction.save();

    // Update booking payment status
    booking.paymentStatus = 'completed';
    booking.paymentMethod = 'razorpay';
    booking.razorpayOrderId = orderId;
    booking.razorpayPaymentId = paymentId;
    booking.paymentReference = paymentId;
    booking.status = 'confirmed';
    await booking.save();

    // Send payment success email
    await sendPaymentSuccess(booking.traveler.email, booking, transaction);

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed',
      booking,
      transaction
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

/**
 * Get transaction details
 */
router.get('/transaction/:transactionId', requireAuth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    const transaction = await PaymentTransaction.findOne({
      transactionId,
      userId
    }).populate('bookingId');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

/**
 * Request refund
 */
router.post('/refund/:bookingId', requireAuth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to this booking' });
    }

    if (booking.paymentStatus !== 'completed') {
      return res.status(400).json({ error: 'Only completed payments can be refunded' });
    }

    if (!booking.razorpayPaymentId) {
      return res.status(400).json({ error: 'Payment information not found' });
    }

    // Request refund from Razorpay
    const refundResult = await paymentService.refundPayment(
      booking.razorpayPaymentId,
      booking.netAmount,
      reason || 'User requested refund'
    );

    if (!refundResult.success) {
      return res.status(400).json({ error: refundResult.error });
    }

    // Update transaction
    const transaction = await PaymentTransaction.findOne({
      razorpayPaymentId: booking.razorpayPaymentId
    });

    if (transaction) {
      transaction.refundId = refundResult.refundId;
      transaction.refundAmount = refundResult.amount;
      transaction.refundStatus = 'initiated';
      transaction.status = 'refunded';
      await transaction.save();
    }

    // Update booking
    booking.refundAmount = refundResult.amount;
    booking.refundStatus = 'processed';
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || 'User requested cancellation';
    await booking.save();

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      refund: refundResult,
      booking
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

/**
 * Get user payment history
 */
router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await PaymentTransaction.find({ userId })
      .populate('bookingId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PaymentTransaction.countDocuments({ userId });

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

module.exports = router;
