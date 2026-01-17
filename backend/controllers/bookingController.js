const { listTravelers, getRosterMetrics } = require('../services/travelRoster');
const { createBookingRecord, listBookings, findBooking, updateBooking } = require('../services/bookingStore');
const inventoryManager = require('../services/inventoryManager');
const { emitHook } = require('../services/integrationHooks');
const { generateBookingQr } = require('../services/qrService');

const allowedStatus = new Set(['confirmed', 'docs_pending', 'awaiting_payment']);
const allowedModes = new Set(['flight', 'train', 'bus', 'hotel']);
const allowedBookingTypes = new Set(['flight', 'train', 'bus', 'hotel']);
const allowedPaymentMethods = new Set(['upi', 'credit_card', 'debit_card']);
const payeeVpa = process.env.UPI_VPA || 'merchant@upi';
const payeeName = process.env.UPI_NAME || 'ApnaPlan';

function sanitizeFilter(value, allowedValues) {
  if (!value) {
    return null;
  }
  const normalized = String(value).toLowerCase();
  return allowedValues.has(normalized) ? normalized : null;
}

function parseWithinHours(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

function listTravelingContacts(req, res) {
  const filters = {
    status: sanitizeFilter(req.query.status, allowedStatus),
    mode: sanitizeFilter(req.query.mode, allowedModes),
    search: req.query.q?.trim() || null,
    withinHours: parseWithinHours(req.query.withinHours)
  };

  if (req.query.withinHours && filters.withinHours === null) {
    return res.status(400).json({ message: 'withinHours must be a non-negative number' });
  }

  const contacts = listTravelers(filters);
  const summary = getRosterMetrics();

  return res.json({
    contacts,
    summary,
    appliedFilters: {
      status: filters.status || 'all',
      mode: filters.mode || 'all',
      withinHours: filters.withinHours,
      search: filters.search || ''
    }
  });
}

function deriveInventoryUnits(bookingType, body = {}) {
  const normalizedType = bookingType?.toLowerCase();
  if (body.inventoryUnits) {
    const units = Number(body.inventoryUnits);
    if (Number.isFinite(units) && units > 0) {
      return units;
    }
  }
  if (normalizedType === 'hotel') {
    const roomCount = Number(body.rooms ?? body.metadata?.rooms);
    if (Number.isFinite(roomCount) && roomCount > 0) {
      return roomCount;
    }
  }
  const passengers = Number(body.passengers) || 1;
  return Math.max(1, passengers);
}

function translateReservationError(result) {
  switch (result.reason) {
    case 'not_found':
      return { status: 404, message: 'Inventory item not found for the requested booking type' };
    case 'insufficient_capacity':
      return { status: 409, message: `Only ${result.available} units left for the requested item` };
    case 'invalid_units':
    default:
      return { status: 400, message: 'Invalid inventory request' };
  }
}

function validateBookingPayload(body = {}) {
  const errors = [];
  const bookingType = typeof body.bookingType === 'string' ? body.bookingType.toLowerCase() : '';
  if (!allowedBookingTypes.has(bookingType)) {
    errors.push('bookingType must be one of flight, train, bus or hotel');
  }

  if (!body.itemId) {
    errors.push('itemId is required');
  }

  const traveler = body.traveler || {};
  if (!traveler.name) {
    errors.push('traveler.name is required');
  }
  if (!traveler.email) {
    errors.push('traveler.email is required');
  }

  return {
    errors,
    bookingType,
    traveler
  };
}

function applyDiscounts(amount = 0, voucherCode = '', offerCode = '') {
  const base = Math.max(0, Number(amount) || 0);
  let discount = 0;

  const normalizedVoucher = voucherCode ? voucherCode.trim().toUpperCase() : '';
  const normalizedOffer = offerCode ? offerCode.trim().toUpperCase() : '';

  if (normalizedVoucher === 'FLAT100') {
    discount += 100;
  } else if (normalizedVoucher === 'OFF10') {
    discount += base * 0.1;
  }

  if (normalizedOffer === 'NEWUSER50') {
    discount += 50;
  }

  const cappedDiscount = Math.min(discount, base);
  const net = base - cappedDiscount;

  return { baseAmount: base, discountAmount: Math.round(cappedDiscount), payableAmount: Math.round(net) };
}

function validatePayment(body = {}) {
  const method = typeof body.paymentMethod === 'string' ? body.paymentMethod.toLowerCase() : '';
  if (!allowedPaymentMethods.has(method)) {
    return { ok: false, message: 'paymentMethod must be one of upi, credit_card, debit_card' };
  }
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < 0) {
    return { ok: false, message: 'amount must be a non-negative number' };
  }
  return { ok: true, method, amount };
}

function buildUpiIntent(booking) {
  if (!booking) return null;
  const amount = booking.netAmount ?? booking.amount ?? 0;
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }
  const reference = booking.bookingId;
  const tn = `Booking-${reference}`;
  const params = new URLSearchParams({
    pa: payeeVpa,
    pn: payeeName,
    am: String(amount),
    cu: 'INR',
    tn,
    tr: reference
  });
  return `upi://pay?${params.toString()}`;
}

function createTravelBooking(req, res) {
  const { errors, bookingType, traveler } = validateBookingPayload(req.body);
  if (errors.length) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  const passengers = Number(req.body.passengers) || 1;
  const amountValue = Number(req.body.amount) || 0;
  const inventoryUnits = deriveInventoryUnits(bookingType, req.body);

  const reservation = inventoryManager.reserveUnits(bookingType, req.body.itemId, inventoryUnits, {
    reason: 'booking_create',
    traveler: traveler.email,
    reference: req.body.metadata?.reference
  });

  if (!reservation.ok) {
    const { status, message } = translateReservationError(reservation);
    return res.status(status).json({ message });
  }

  const booking = createBookingRecord({
    bookingType,
    itemId: req.body.itemId,
    traveler: {
      name: traveler.name,
      email: traveler.email,
      phone: traveler.phone || '',
      notes: traveler.notes || ''
    },
    passengers: Math.max(1, passengers),
    notes: req.body.notes || '',
    amount: amountValue >= 0 ? amountValue : 0,
    metadata: req.body.metadata || {},
    inventoryUnits,
    inventorySnapshot: reservation.snapshot
  });

  return res.status(201).json({ booking, inventory: reservation.snapshot });
}

async function checkoutTravelBooking(req, res) {
  const { errors, bookingType, traveler } = validateBookingPayload(req.body);
  if (errors.length) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  const paymentValidation = validatePayment(req.body);
  if (!paymentValidation.ok) {
    return res.status(400).json({ message: paymentValidation.message });
  }

  const passengers = Number(req.body.passengers) || 1;
  const inventoryUnits = deriveInventoryUnits(bookingType, req.body);

  const reservation = inventoryManager.reserveUnits(bookingType, req.body.itemId, inventoryUnits, {
    reason: 'booking_checkout',
    traveler: traveler.email,
    reference: req.body.metadata?.reference
  });

  if (!reservation.ok) {
    const { status, message } = translateReservationError(reservation);
    return res.status(status).json({ message });
  }

  const voucherCode = req.body.voucherCode || '';
  const offerCode = req.body.offerCode || '';
  const { baseAmount, discountAmount, payableAmount } = applyDiscounts(paymentValidation.amount, voucherCode, offerCode);

  const booking = createBookingRecord({
    bookingType,
    itemId: req.body.itemId,
    traveler: {
      name: traveler.name,
      email: traveler.email,
      phone: traveler.phone || '',
      notes: traveler.notes || ''
    },
    passengers: Math.max(1, passengers),
    notes: req.body.notes || '',
    amount: baseAmount,
    netAmount: payableAmount,
    discountAmount,
    voucherCode,
    offerCode,
    metadata: req.body.metadata || {},
    inventoryUnits,
    inventorySnapshot: reservation.snapshot,
    paymentStatus: 'completed',
    paymentMethod: paymentValidation.method,
    paymentReference: req.body.paymentReference || ''
  });

  emitHook('payments:payment_recorded', {
    bookingId: booking.bookingId,
    amount: payableAmount,
    reference: booking.paymentReference,
    method: booking.paymentMethod
  }).catch(() => {});

  const upiIntent = buildUpiIntent(booking);
  const qr = await generateBookingQr({ bookingId: booking.bookingId, upiIntent });

  return res.status(201).json({
    booking,
    upiIntent,
    qr,
    pricing: {
      baseAmount,
      discountAmount,
      payableAmount,
      voucherCode,
      offerCode
    },
    inventory: reservation.snapshot
  });
}

function getAllBookings(req, res) {
  return res.json({ bookings: listBookings() });
}

async function getBookingById(req, res) {
  const booking = findBooking(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  const upiIntent = buildUpiIntent(booking);
  const qr = await generateBookingQr({ bookingId: booking.bookingId, upiIntent });
  return res.json({ booking, upiIntent, qr });
}

function cancelBooking(req, res) {
  const booking = findBooking(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (booking.status === 'cancelled') {
    return res.status(409).json({ message: 'Booking already cancelled' });
  }

  const updated = updateBooking(booking.bookingId, {
    status: 'cancelled',
    cancelledAt: new Date().toISOString()
  });

  if (booking.inventoryUnits) {
    inventoryManager.releaseUnits(booking.bookingType, booking.itemId, booking.inventoryUnits, {
      reason: 'booking_cancelled',
      bookingId: booking.bookingId
    });
  }

  return res.json({ booking: updated });
}

function recordBookingPayment(req, res) {
  const booking = findBooking(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const amount = req.body?.amount !== undefined ? Number(req.body.amount) : booking.amount;

  const updated = updateBooking(booking.bookingId, {
    amount: Number.isFinite(amount) && amount >= 0 ? amount : booking.amount,
    paymentStatus: 'completed',
    paymentReference: req.body?.paymentReference || '',
    paidAt: new Date().toISOString()
  });

  emitHook('payments:payment_recorded', {
    bookingId: updated.bookingId,
    amount: updated.amount,
    reference: updated.paymentReference
  }).catch(() => {});

  return res.json({ booking: updated });
}

function getInventorySnapshot(req, res) {
  const typeFilter = sanitizeFilter(req.query.type, allowedBookingTypes);
  const snapshot = inventoryManager.getSnapshot(typeFilter ? { type: typeFilter } : {});
  const audit = inventoryManager.getAuditTrail(20);

  return res.json({
    ...snapshot,
    audit,
    appliedFilters: {
      type: typeFilter || 'all'
    }
  });
}

module.exports = {
  listTravelingContacts,
  createTravelBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
  recordBookingPayment,
  getInventorySnapshot,
  checkoutTravelBooking
};
