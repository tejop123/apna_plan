const express = require('express');
const { buses } = require('../data/travelInventory');

const router = express.Router();

function matchesCity(city = '', query) {
  if (!query) {
    return true;
  }
  return city.toLowerCase().includes(String(query).toLowerCase());
}

router.get('/', (req, res) => {
  res.json(buses);
});

router.post('/search', (req, res) => {
  const { from, to } = req.body || {};
  const results = buses.filter(
    (bus) => matchesCity(bus.departure.city, from) && matchesCity(bus.arrival.city, to)
  );

  res.json({ total: results.length, results });
});

router.get('/:id', (req, res) => {
  const bus = buses.find((item) => item._id === req.params.id);
  if (!bus) {
    return res.status(404).json({ message: 'Bus not found' });
  }
  return res.json(bus);
});

module.exports = router;
