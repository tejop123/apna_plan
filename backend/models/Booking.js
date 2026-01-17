// Booking Schema
const bookingSchema = {
  bookingId: String,
  userId: String,
  bookingType: { type: String, enum: ['flight', 'train', 'bus', 'hotel'] },
  itemId: String,
  passengers: [
    {
      name: String,
      age: Number,
      email: String,
      phone: String
    }
  ],
  totalPrice: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
};

module.exports = bookingSchema;
