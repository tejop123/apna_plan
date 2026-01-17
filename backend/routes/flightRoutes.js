const express = require('express');
const { flights } = require('../data/travelInventory');

const router = express.Router();

function matchesCity(city = '', query) {
  if (!query) {
    return true;
  }
  return city.toLowerCase().includes(String(query).toLowerCase());
}

router.get('/', (req, res) => {
  res.json(flights);
});

router.post('/search', (req, res) => {
  const { from, to } = req.body || {};
  const results = flights.filter(
    (flight) => matchesCity(flight.departure.city, from) && matchesCity(flight.arrival.city, to)
  );

  res.json({ total: results.length, results });
});

router.get('/:id', (req, res) => {
  const flight = flights.find((item) => item._id === req.params.id);
  if (!flight) {
    return res.status(404).json({ message: 'Flight not found' });
  }
  return res.json(flight);
});

module.exports = router;
