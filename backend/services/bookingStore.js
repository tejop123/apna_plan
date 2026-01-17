const { randomUUID } = require('crypto');
const { emitHook } = require('./integrationHooks');

const bookings = new Map();

function dispatchHook(channel, payload) {
  emitHook(channel, payload).catch((error) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[bookingStore] hook ${channel} failed`, error);
    }
  });
}

function createBookingRecord({
  bookingType,
  itemId,
  traveler,
  passengers = 1,
  notes = '',
  amount = 0,
  metadata = {},
  inventoryUnits = passengers,
  inventorySnapshot = null,
  paymentStatus = 'pending',
  paymentMethod = null,
  paymentReference = '',
  discountAmount = 0,
  netAmount = amount,
  voucherCode = '',
  offerCode = ''
}) {
  const bookingId = randomUUID();
  const record = {
    bookingId,
    bookingType,
    itemId,
    traveler,
    passengers,
    notes,
    amount,
    netAmount,
    discountAmount,
    voucherCode,
    offerCode,
    metadata,
    inventoryUnits,
    inventorySnapshot,
    status: 'pending',
    paymentStatus,
    paymentMethod,
    paymentReference,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  bookings.set(bookingId, record);
  dispatchHook('persistence:booking_created', record);
  return record;
}

function listBookings() {
  return Array.from(bookings.values());
}

function findBooking(bookingId) {
  return bookings.get(bookingId) || null;
}

function updateBooking(bookingId, updates = {}) {
  const existing = bookings.get(bookingId);
  if (!existing) {
    return null;
  }
  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  bookings.set(bookingId, updated);
  dispatchHook('persistence:booking_updated', updated);
  return updated;
}

module.exports = {
  createBookingRecord,
  listBookings,
  findBooking,
  updateBooking
};
