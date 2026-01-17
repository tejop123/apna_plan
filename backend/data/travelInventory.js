const flights = [
  {
    _id: 'FL-101',
    flightNumber: 'AI 101',
    airline: 'Air India',
    departure: { city: 'New Delhi', airport: 'DEL', time: '2026-01-05T09:15:00+05:30' },
    arrival: { city: 'Mumbai', airport: 'BOM', time: '2026-01-05T11:45:00+05:30' },
    duration: '2h 30m',
    stops: 0,
    price: 5400,
    seats: 28,
    aircraft: 'A321',
    fareType: 'Saver'
  },
  {
    _id: 'FL-118',
    flightNumber: '6E 302',
    airline: 'IndiGo',
    departure: { city: 'Bengaluru', airport: 'BLR', time: '2026-01-06T06:10:00+05:30' },
    arrival: { city: 'Goa', airport: 'GOI', time: '2026-01-06T07:40:00+05:30' },
    duration: '1h 30m',
    stops: 0,
    price: 3899,
    seats: 42,
    aircraft: 'A320 Neo',
    fareType: 'Flex'
  },
  {
    _id: 'FL-208',
    flightNumber: 'UK 981',
    airline: 'Vistara',
    departure: { city: 'Mumbai', airport: 'BOM', time: '2026-01-08T02:15:00+05:30' },
    arrival: { city: 'Dubai', airport: 'DXB', time: '2026-01-08T04:05:00+04:00' },
    duration: '3h 20m',
    stops: 0,
    price: 14800,
    seats: 18,
    aircraft: 'B737 MAX',
    fareType: 'Premium'
  },
  {
    _id: 'FL-256',
    flightNumber: 'SQ 523',
    airline: 'Singapore Airlines',
    departure: { city: 'Hyderabad', airport: 'HYD', time: '2026-01-10T23:30:00+05:30' },
    arrival: { city: 'Singapore', airport: 'SIN', time: '2026-01-11T07:00:00+08:00' },
    duration: '4h 00m',
    stops: 0,
    price: 22350,
    seats: 12,
    aircraft: 'A350',
    fareType: 'Business'
  }
];

const trains = [
  {
    _id: 'TR-901',
    trainNumber: '12001',
    trainName: 'Bhopal Shatabdi',
    departure: { city: 'New Delhi', station: 'NDLS', time: '2026-01-05T06:00:00+05:30' },
    arrival: { city: 'Bhopal', station: 'BPL', time: '2026-01-05T14:00:00+05:30' },
    duration: '8h 00m',
    price: 1650,
    classes: {
      executive: { seats: 12, price: 2850 },
      chairCar: { seats: 65, price: 1650 }
    }
  },
  {
    _id: 'TR-932',
    trainNumber: '20173',
    trainName: 'Vande Bharat Lucknow',
    departure: { city: 'Ayodhya', station: 'AY', time: '2026-01-06T06:05:00+05:30' },
    arrival: { city: 'Lucknow', station: 'LKO', time: '2026-01-06T08:35:00+05:30' },
    duration: '2h 30m',
    price: 890,
    classes: {
      executive: { seats: 16, price: 1490 },
      chairCar: { seats: 72, price: 890 }
    }
  },
  {
    _id: 'TR-958',
    trainNumber: '12951',
    trainName: 'Rajdhani Delhi-Mumbai',
    departure: { city: 'New Delhi', station: 'NDLS', time: '2026-01-07T16:25:00+05:30' },
    arrival: { city: 'Mumbai', station: 'BCT', time: '2026-01-08T08:15:00+05:30' },
    duration: '15h 50m',
    price: 2400,
    classes: {
      firstAC: { seats: 8, price: 5150 },
      secondAC: { seats: 36, price: 3180 },
      thirdAC: { seats: 64, price: 2400 }
    }
  },
  {
    _id: 'TR-971',
    trainNumber: '12213',
    trainName: 'Duronto Express',
    departure: { city: 'Mumbai', station: 'LTT', time: '2026-01-09T20:50:00+05:30' },
    arrival: { city: 'Kolkata', station: 'SDAH', time: '2026-01-10T19:00:00+05:30' },
    duration: '22h 10m',
    price: 2750,
    classes: {
      firstAC: { seats: 6, price: 5200 },
      secondAC: { seats: 28, price: 3350 },
      thirdAC: { seats: 58, price: 2750 }
    }
  }
];

const buses = [
  {
    _id: 'BS-329',
    busNumber: 'VRL 2102',
    operatorName: 'VRL Travels',
    departure: { city: 'Pune', location: 'Wakad', time: '2026-01-06T21:00:00+05:30' },
    arrival: { city: 'Goa', location: 'Madgaon', time: '2026-01-07T06:30:00+05:30' },
    duration: '9h 30m',
    seats: 32,
    price: 1590,
    busType: 'Scania Multi-axle',
    amenities: ['Water', 'Movie', 'Snacks']
  },
  {
    _id: 'BS-344',
    busNumber: 'KT 5532',
    operatorName: 'KPN Travels',
    departure: { city: 'Coimbatore', location: 'Gandhipuram', time: '2026-01-07T23:00:00+05:30' },
    arrival: { city: 'Bengaluru', location: 'Madiwala', time: '2026-01-08T05:30:00+05:30' },
    duration: '6h 30m',
    seats: 14,
    price: 980,
    busType: 'Non AC Sleeper',
    amenities: ['Pillow', 'Reading light']
  },
  {
    _id: 'BS-358',
    busNumber: 'GSRTC 7821',
    operatorName: 'GSRTC Volvo',
    departure: { city: 'Ahmedabad', location: 'Paldi', time: '2026-01-08T20:15:00+05:30' },
    arrival: { city: 'Udaipur', location: 'Sector 7', time: '2026-01-09T04:45:00+05:30' },
    duration: '8h 30m',
    seats: 26,
    price: 1350,
    busType: 'AC Seater',
    amenities: ['WiFi', 'Charging']
  }
];

const hotels = [
  {
    _id: 'HT-501',
    hotelName: 'Lakeview Palace',
    city: 'Udaipur',
    location: 'Pichola Lake',
    rating: 4.6,
    pricePerNight: 7200,
    amenities: ['WiFi', 'Pool', 'Spa', 'Rooftop'],
    rooms: {
      deluxe: { available: 8, price: 7200 },
      suite: { available: 3, price: 12800 }
    },
    description: 'Boutique palace hotel overlooking Lake Pichola'
  },
  {
    _id: 'HT-524',
    hotelName: 'Bayfront Residency',
    city: 'Goa',
    location: 'Candolim Beach',
    rating: 4.3,
    pricePerNight: 5400,
    amenities: ['Breakfast', 'Pool', 'Gym', 'Airport pickup'],
    rooms: {
      superior: { available: 11, price: 5400 },
      premium: { available: 6, price: 6900 }
    },
    description: 'Tropical getaway steps away from Candolim beach'
  },
  {
    _id: 'HT-548',
    hotelName: 'Metro Heights',
    city: 'New Delhi',
    location: 'Aerocity',
    rating: 4.1,
    pricePerNight: 4600,
    amenities: ['WiFi', 'Conference hall', '24x7 dining'],
    rooms: {
      standard: { available: 14, price: 4600 },
      executive: { available: 7, price: 6100 }
    },
    description: 'Business friendly stay near IGI airport'
  },
  {
    _id: 'HT-559',
    hotelName: 'Hillside Retreat',
    city: 'Manali',
    location: 'Old Manali Road',
    rating: 4.7,
    pricePerNight: 5800,
    amenities: ['Heated rooms', 'Cafe', 'Bonfire', 'Trekking desk'],
    rooms: {
      valleyView: { available: 9, price: 5800 },
      familySuite: { available: 4, price: 8200 }
    },
    description: 'Panoramic mountain stay with curated treks'
  }
];

module.exports = {
  flights,
  trains,
  buses,
  hotels
};
