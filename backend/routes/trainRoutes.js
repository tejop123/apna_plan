const express = require('express');
const { trains } = require('../data/travelInventory');

const router = express.Router();

function matchesCity(city = '', query) {
  if (!query) {
    return true;
  }
  return city.toLowerCase().includes(String(query).toLowerCase());
}

router.get('/', (req, res) => {
  res.json(trains);
});

router.post('/search', (req, res) => {
  const { from, to } = req.body || {};
  const results = trains.filter(
    (train) => matchesCity(train.departure.city, from) && matchesCity(train.arrival.city, to)
  );

  res.json({ total: results.length, results });
});

router.get('/:id', (req, res) => {
  const train = trains.find((item) => item._id === req.params.id);
  if (!train) {
    return res.status(404).json({ message: 'Train not found' });
  }
  return res.json(train);
});

module.exports = router;
