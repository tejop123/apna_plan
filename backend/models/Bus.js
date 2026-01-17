// Bus Schema
const busSchema = {
  busNumber: String,
  operatorName: String,
  departure: {
    city: String,
    location: String,
    time: Date
  },
  arrival: {
    city: String,
    location: String,
    time: Date
  },
  duration: String,
  seats: Number,
  price: Number,
  busType: { type: String, enum: ['AC', 'Non-AC', 'Sleeper'] },
  amenities: [String],
  createdAt: { type: Date, default: Date.now }
};

module.exports = busSchema;
