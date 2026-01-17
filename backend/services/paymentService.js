const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create a Razorpay order
 */
async function createOrder(amount, bookingId, customerId, customerEmail, customerPhone) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: bookingId,
      customer_notify: 1,
      notes: {
        bookingId,
        customerId
      },
      customer_id: customerId,
      email: customerEmail,
      contact: customerPhone.replace(/[^\d]/g, '') // Remove non-digits
    });

    console.log('Razorpay order created:', order.id);
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    };
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verify payment signature
 */
function verifyPaymentSignature(orderId, paymentId, signature) {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === signature;
    return {
      success: isValid,
      message: isValid ? 'Payment verified successfully' : 'Invalid payment signature'
    };
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get payment details
 */
async function getPaymentDetails(paymentId) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount / 100, // Convert from paise
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        description: payment.description,
        notes: payment.notes,
        fee: payment.fee ? payment.fee / 100 : 0,
        tax: payment.tax ? payment.tax / 100 : 0,
        createdAt: new Date(payment.created_at * 1000)
      }
    };
  } catch (error) {
    console.error('Failed to fetch payment details:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Refund a payment
 */
async function refundPayment(paymentId, amount = null, notes = '') {
  try {
    const refundData = {
      receipt: `refund_${Date.now()}`,
      notes: {
        reason: notes
      }
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, refundData);

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100, // Convert from paise
      status: refund.status,
      createdAt: new Date(refund.created_at * 1000)
    };
  } catch (error) {
    console.error('Failed to refund payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get refund details
 */
async function getRefundDetails(refundId) {
  try {
    const refund = await razorpay.refunds.fetch(refundId);
    return {
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100, // Convert from paise
        status: refund.status,
        notes: refund.notes,
        createdAt: new Date(refund.created_at * 1000)
      }
    };
  } catch (error) {
    console.error('Failed to fetch refund details:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get order details
 */
async function getOrderDetails(orderId) {
  try {
    const order = await razorpay.orders.fetch(orderId);
    return {
      success: true,
      order: {
        id: order.id,
        amount: order.amount / 100, // Convert from paise
        currency: order.currency,
        status: order.status,
        receipt: order.receipt,
        attempts: order.attempts,
        notes: order.notes,
        createdAt: new Date(order.created_at * 1000)
      }
    };
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  createOrder,
  verifyPaymentSignature,
  getPaymentDetails,
  refundPayment,
  getRefundDetails,
  getOrderDetails
};
