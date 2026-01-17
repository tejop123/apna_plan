const axios = require('axios');
const { flights, trains, buses, hotels } = require('../data/travelInventory');

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

const NON_INDIA_PATTERNS = ['Dubai', 'Singapore', 'Paris', 'Colombo'];

function isIndiaOnlySegment(departure = {}, arrival = {}) {
  const haystack = `${departure.city || ''} ${arrival.city || ''}`;
  return !NON_INDIA_PATTERNS.some((term) => haystack.includes(term));
}

function summarizeInventory() {
  const flightLines = flights
      .filter((flight) => isIndiaOnlySegment(flight.departure, flight.arrival))
      .map(
        (flight) =>
          `${flight.flightNumber}: ${flight.departure.city} (${flight.departure.airport}) -> ${flight.arrival.city} (${flight.arrival.airport}), nonstop, approx Rs ${flight.price}`
      );

  const trainLines = trains.map(
    (train) =>
      `${train.trainName} ${train.trainNumber}: ${train.departure.city} (${train.departure.station}) -> ${train.arrival.city} (${train.arrival.station}), ${train.duration}, from Rs ${train.price}`
  );

  const busLines = buses.map(
    (bus) =>
      `${bus.operatorName}: ${bus.departure.city} -> ${bus.arrival.city}, ${bus.busType}, from Rs ${bus.price}`
  );

  const hotelLines = hotels.map(
    (hotel) => `${hotel.hotelName}: ${hotel.city}, ${hotel.location}, from Rs ${hotel.pricePerNight || hotel.price}`
  );

  const sections = [
    flightLines.length ? `Flights (India only):\n- ${flightLines.join('\n- ')}` : null,
    trainLines.length ? `Trains:\n- ${trainLines.join('\n- ')}` : null,
    busLines.length ? `Buses:\n- ${busLines.join('\n- ')}` : null,
    hotelLines.length ? `Hotels:\n- ${hotelLines.join('\n- ')}` : null
  ].filter(Boolean);

  return sections.join('\n\n');
}

async function askChatbot(req, res) {
  const question = req.body?.question?.trim();
  if (!question) {
    return res.status(400).json({ message: 'Question is required' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: 'Chatbot is not configured' });
  }

  try {
    const { data } = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a concise, friendly assistant for travel routes within India only. Answer questions about Indian flights, trains, buses, and hotels between Indian cities/airports/stations. If asked about routes outside India or non-travel topics, reply with: "I can help only with travel routes within India." Keep every reply under 80 words.'
          },
          {
            role: 'system',
            content: `Here is the latest India-only inventory. Prefer using these options. If nothing matches, say what is unavailable and ask for a valid India route.\n\n${summarizeInventory()}`
          },
          { role: 'user', content: question }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const answer = data?.choices?.[0]?.message?.content?.trim();
    return res.json({ answer: answer || 'Sorry, I could not generate a reply right now.' });
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data?.error?.message;
    return res
      .status(status && status >= 400 && status < 600 ? status : 500)
      .json({ message: 'Chatbot service error', detail });
  }
}

module.exports = { askChatbot };