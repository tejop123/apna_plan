// Flight Schema
const flightSchema = {
  flightNumber: String,
  airline: String,
  departure: {
    city: String,
    airport: String,
    time: Date
  },
  arrival: {
    city: String,
    airport: String,
    time: Date
  },
  duration: String,
  stops: Number,
  price: Number,
  seats: Number,
  aircraft: String,
  createdAt: { type: Date, default: Date.now }
};

module.exports = flightSchema;
