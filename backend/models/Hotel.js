// Hotel Schema
const hotelSchema = {
  hotelName: String,
  city: String,
  location: String,
  rating: { type: Number, min: 0, max: 5 },
  price: Number,
  pricePerNight: Number,
  images: [String],
  amenities: [String],
  rooms: {
    single: { available: Number, price: Number },
    double: { available: Number, price: Number },
    suite: { available: Number, price: Number }
  },
  description: String,
  checkIn: Date,
  checkOut: Date,
  createdAt: { type: Date, default: Date.now }
};

module.exports = hotelSchema;
