const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const historyController = require('../controllers/historyController');

/**
 * Get booking history
 */
router.get('/', requireAuth, historyController.getBookingHistory);

/**
 * Get booking statistics
 */
router.get('/stats', requireAuth, historyController.getBookingStats);

/**
 * Get booking details
 */
router.get('/:bookingId', requireAuth, historyController.getBookingDetails);

/**
 * Cancel booking
 */
router.post('/:bookingId/cancel', requireAuth, historyController.cancelBooking);

/**
 * Download ticket
 */
router.get('/:bookingId/download', requireAuth, historyController.downloadTicket);

module.exports = router;
