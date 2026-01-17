// Train Schema
const trainSchema = {
  trainNumber: String,
  trainName: String,
  departure: {
    city: String,
    station: String,
    time: Date
  },
  arrival: {
    city: String,
    station: String,
    time: Date
  },
  duration: String,
  price: Number,
  classes: {
    sleeper: { seats: Number, price: Number },
    firstAC: { seats: Number, price: Number },
    secondAC: { seats: Number, price: Number },
    thirdAC: { seats: Number, price: Number }
  },
  createdAt: { type: Date, default: Date.now }
};

module.exports = trainSchema;
