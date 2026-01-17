/**
 * Real-time Seat Availability Service
 * Manages real-time updates of seat availability across connected clients
 */

class RealtimeSeatService {
  constructor(io) {
    this.io = io;
    this.seatAvailability = new Map(); // { itemId: { totalSeats, availableSeats, bookedSeats: [] } }
    this.connectedUsers = new Map(); // { userId: socketId }
  }

  /**
   * Initialize seat availability for an item
   */
  initializeSeats(itemId, totalSeats) {
    if (!this.seatAvailability.has(itemId)) {
      this.seatAvailability.set(itemId, {
        totalSeats,
        availableSeats: totalSeats,
        bookedSeats: [],
        seatMap: this.generateSeatMap(totalSeats),
        lastUpdated: new Date()
      });
      return true;
    }
    return false;
  }

  /**
   * Generate seat map (e.g., 6x12 for bus, 20x6 for flight)
   */
  generateSeatMap(totalSeats) {
    const seatMap = {};
    let seatNumber = 1;
    
    // Assume 6 seats per row for buses, 6 seats per row for flights
    const seatsPerRow = totalSeats <= 50 ? 6 : 6;
    let row = 1;
    let col = 1;

    for (let i = 1; i <= totalSeats; i++) {
      const seatCode = `${String.fromCharCode(64 + col)}${row}`;
      seatMap[seatCode] = {
        seatNumber: i,
        status: 'available', // available, booked, blocked
        price: 100 + (col * 10) // Price varies by seat position
      };

      col++;
      if (col > seatsPerRow) {
        col = 1;
        row++;
      }
    }

    return seatMap;
  }

  /**
   * Register user socket
   */
  registerUser(userId, socketId) {
    this.connectedUsers.set(userId, socketId);
  }

  /**
   * Unregister user socket
   */
  unregisterUser(userId) {
    this.connectedUsers.delete(userId);
  }

  /**
   * Book seats
   */
  bookSeats(itemId, seatCodes, userId) {
    if (!this.seatAvailability.has(itemId)) {
      return { success: false, error: 'Item not found' };
    }

    const item = this.seatAvailability.get(itemId);
    const unavailableSeats = [];

    // Check if all seats are available
    for (const seatCode of seatCodes) {
      const seat = item.seatMap[seatCode];
      if (!seat) {
        unavailableSeats.push(seatCode);
      } else if (seat.status !== 'available') {
        unavailableSeats.push(seatCode);
      }
    }

    if (unavailableSeats.length > 0) {
      return {
        success: false,
        error: 'Some seats are not available',
        unavailableSeats
      };
    }

    // Book seats
    for (const seatCode of seatCodes) {
      const seat = item.seatMap[seatCode];
      seat.status = 'booked';
      seat.bookedBy = userId;
      seat.bookedAt = new Date();
      item.bookedSeats.push({
        seatCode,
        userId,
        bookedAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 min hold
      });
    }

    item.availableSeats -= seatCodes.length;
    item.lastUpdated = new Date();

    // Broadcast update to all connected clients
    this.broadcastSeatUpdate(itemId);

    return {
      success: true,
      bookedSeats: seatCodes,
      totalPrice: seatCodes.reduce((sum, code) => sum + item.seatMap[code].price, 0)
    };
  }

  /**
   * Release seats (cancel/timeout)
   */
  releaseSeats(itemId, seatCodes) {
    if (!this.seatAvailability.has(itemId)) {
      return { success: false, error: 'Item not found' };
    }

    const item = this.seatAvailability.get(itemId);

    for (const seatCode of seatCodes) {
      const seat = item.seatMap[seatCode];
      if (seat && seat.status === 'booked') {
        seat.status = 'available';
        seat.bookedBy = null;
        seat.bookedAt = null;

        // Remove from bookedSeats
        item.bookedSeats = item.bookedSeats.filter(b => b.seatCode !== seatCode);
      }
    }

    item.availableSeats += seatCodes.length;
    item.lastUpdated = new Date();

    // Broadcast update
    this.broadcastSeatUpdate(itemId);

    return { success: true, releasedSeats: seatCodes };
  }

  /**
   * Get seat availability for item
   */
  getSeatAvailability(itemId) {
    return this.seatAvailability.get(itemId);
  }

  /**
   * Check seat availability
   */
  checkSeatAvailability(itemId, seatCodes) {
    if (!this.seatAvailability.has(itemId)) {
      return { available: false, reason: 'Item not found' };
    }

    const item = this.seatAvailability.get(itemId);
    const unavailable = [];

    for (const seatCode of seatCodes) {
      const seat = item.seatMap[seatCode];
      if (!seat || seat.status !== 'available') {
        unavailable.push(seatCode);
      }
    }

    return {
      available: unavailable.length === 0,
      unavailableSeats: unavailable,
      availableSeats: item.availableSeats
    };
  }

  /**
   * Broadcast seat update via Socket.IO
   */
  broadcastSeatUpdate(itemId) {
    const availability = this.seatAvailability.get(itemId);
    if (!availability) return;

    this.io.emit('seatUpdate', {
      itemId,
      availableSeats: availability.availableSeats,
      totalSeats: availability.totalSeats,
      seatMap: availability.seatMap,
      lastUpdated: availability.lastUpdated
    });
  }

  /**
   * Get available seats count
   */
  getAvailableSeatsCount(itemId) {
    const item = this.seatAvailability.get(itemId);
    return item ? item.availableSeats : 0;
  }

  /**
   * Subscribe user to seat updates
   */
  subscribeToSeats(socketId, itemId) {
    if (this.io) {
      this.io.to(socketId).emit('seatUpdate', {
        itemId,
        availability: this.getSeatAvailability(itemId)
      });
    }
  }

  /**
   * Clean up expired seat holds
   */
  cleanupExpiredHolds() {
    const now = new Date();

    for (const [itemId, item] of this.seatAvailability.entries()) {
      const expiredSeats = item.bookedSeats.filter(b => b.expiresAt < now);

      for (const expired of expiredSeats) {
        this.releaseSeats(itemId, [expired.seatCode]);
      }
    }
  }

  /**
   * Get seat details with prices
   */
  getSeatDetails(itemId, seatCodes = []) {
    const item = this.seatAvailability.get(itemId);
    if (!item) return null;

    if (seatCodes.length === 0) {
      return item.seatMap;
    }

    const details = {};
    for (const code of seatCodes) {
      if (item.seatMap[code]) {
        details[code] = item.seatMap[code];
      }
    }
    return details;
  }
}

module.exports = RealtimeSeatService;
