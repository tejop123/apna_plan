const express = require('express');
const { hotels } = require('../data/travelInventory');

const router = express.Router();

function matchesCity(city = '', query) {
  if (!query) {
    return true;
  }
  return city.toLowerCase().includes(String(query).toLowerCase());
}

router.get('/', (req, res) => {
  res.json(hotels);
});

router.post('/search', (req, res) => {
  const { city, maxPrice } = req.body || {};
  const priceLimit = maxPrice ? Number(maxPrice) : null;

  const results = hotels.filter((hotel) => {
    const cityMatch = matchesCity(hotel.city, city);
    const priceMatch = priceLimit ? hotel.pricePerNight <= priceLimit : true;
    return cityMatch && priceMatch;
  });

  res.json({ total: results.length, results });
});

router.get('/:id', (req, res) => {
  const hotel = hotels.find((item) => item._id === req.params.id);
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }
  return res.json(hotel);
});

module.exports = router;
