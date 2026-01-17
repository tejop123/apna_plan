const Booking = require('../models/Booking');
const Review = require('../models/Review');

/**
 * Get booking history for user
 */
exports.getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 'pending', 'confirmed', 'completed', 'cancelled'
    const bookingType = req.query.bookingType; // 'flight', 'train', 'bus', 'hotel'
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { userId };
    if (status) filter.status = status;
    if (bookingType) filter.bookingType = bookingType;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Booking.countDocuments(filter);

    // Fetch reviews for each booking
    const bookingIds = bookings.map(b => b._id);
    const reviews = await Review.find({ bookingId: { $in: bookingIds } }).lean();
    const reviewMap = {};
    reviews.forEach(r => {
      reviewMap[r.bookingId.toString()] = r;
    });

    // Add review info to bookings
    const enhancedBookings = bookings.map(b => ({
      ...b,
      hasReview: !!reviewMap[b._id.toString()],
      review: reviewMap[b._id.toString()] || null
    }));

    res.json({
      bookings: enhancedBookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ error: 'Failed to fetch booking history' });
  }
};

/**
 * Get booking details
 */
exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access to this booking' });
    }

    // Get review if exists
    const review = await Review.findOne({ bookingId: booking._id });

    res.json({
      booking,
      review: review || null
    });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
};

/**
 * Get booking statistics for user
 */
exports.getBookingStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Booking.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $facet: {
          totalBookings: [
            { $count: 'count' }
          ],
          totalSpent: [
            { $group: { _id: null, total: { $sum: '$netAmount' } } }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byType: [
            { $group: { _id: '$bookingType', count: { $sum: 1 } } }
          ],
          recentBookings: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ]);

    const result = {
      totalBookings: stats[0].totalBookings[0]?.count || 0,
      totalSpent: stats[0].totalSpent[0]?.total || 0,
      byStatus: Object.fromEntries(
        stats[0].byStatus.map(s => [s._id, s.count])
      ),
      byType: Object.fromEntries(
        stats[0].byType.map(t => [t._id, t.count])
      ),
      recentBookings: stats[0].recentBookings
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ error: 'Failed to fetch booking statistics' });
  }
};

/**
 * Cancel booking
 */
exports.cancelBooking = async (req, res) => {
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

    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ error: `Cannot cancel ${booking.status} booking` });
    }

    // Calculate refund (usually 80-90% depending on time)
    const hoursUntilTravel = Math.ceil(
      (new Date(booking.travelDate) - new Date()) / (1000 * 60 * 60)
    );
    
    let refundPercentage = 100;
    if (hoursUntilTravel < 24) refundPercentage = 50;
    else if (hoursUntilTravel < 48) refundPercentage = 75;
    else if (hoursUntilTravel < 72) refundPercentage = 90;

    const refundAmount = Math.floor(booking.netAmount * (refundPercentage / 100));

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || 'User cancelled';
    booking.refundAmount = refundAmount;
    booking.refundStatus = 'pending';
    
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
      refund: {
        amount: refundAmount,
        percentage: refundPercentage,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

/**
 * Download booking ticket/receipt
 */
exports.downloadTicket = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access to this booking' });
    }

    if (booking.paymentStatus !== 'completed') {
      return res.status(400).json({ error: 'Only confirmed bookings can download tickets' });
    }

    // Generate ticket data (could be PDF, base64, etc.)
    const ticketData = {
      bookingId: booking.bookingId,
      bookingType: booking.bookingType,
      traveler: booking.traveler,
      passengers: booking.passengerDetails,
      travelDate: booking.travelDate,
      amount: booking.netAmount,
      bookingDate: booking.createdAt,
      seats: booking.seatNumbers,
      qrCode: booking.qrCode || ''
    };

    res.json({
      success: true,
      ticket: ticketData,
      message: 'Ticket generated successfully'
    });
  } catch (error) {
    console.error('Error downloading ticket:', error);
    res.status(500).json({ error: 'Failed to download ticket' });
  }
};
