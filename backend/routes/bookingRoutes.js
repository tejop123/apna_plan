const express = require('express');
const {
  listTravelingContacts,
  createTravelBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
  recordBookingPayment,
  getInventorySnapshot,
  checkoutTravelBooking
} = require('../controllers/bookingController');

const router = express.Router();

router.get('/travelers', listTravelingContacts);
router.get('/inventory', getInventorySnapshot);

// Create booking
router.post('/', createTravelBooking);

// Create booking with immediate payment
router.post('/checkout', checkoutTravelBooking);

// Get all bookings
router.get('/', getAllBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Cancel booking
router.put('/:id/cancel', cancelBooking);

// Payment
router.post('/:id/payment', recordBookingPayment);

module.exports = router;
