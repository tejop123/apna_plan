const express = require('express');
const router = express.Router();

// Get dashboard stats
router.get('/dashboard/stats', (req, res) => {
  res.json({ 
    totalUsers: 1000,
    totalBookings: 5000,
    revenue: 250000
  });
});

// Get all users (admin)
router.get('/users', (req, res) => {
  res.json({ message: 'Get all users endpoint' });
});

// Get all bookings (admin)
router.get('/bookings', (req, res) => {
  res.json({ message: 'Get all bookings endpoint' });
});

// Get flight analytics
router.get('/analytics/flights', (req, res) => {
  res.json({ message: 'Flight analytics endpoint' });
});

// Get train analytics
router.get('/analytics/trains', (req, res) => {
  res.json({ message: 'Train analytics endpoint' });
});

// Get bus analytics
router.get('/analytics/buses', (req, res) => {
  res.json({ message: 'Bus analytics endpoint' });
});

// Get hotel analytics
router.get('/analytics/hotels', (req, res) => {
  res.json({ message: 'Hotel analytics endpoint' });
});

module.exports = router;
