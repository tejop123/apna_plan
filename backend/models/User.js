const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profilePicture: { type: String, default: '' },
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    address: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    preferences: {
      language: { type: String, default: 'en' },
      currency: { type: String, default: 'INR' },
      notifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false }
    },
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
