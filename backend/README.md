# Apna Plan Backend API

Backend server for the Apna Plan travel booking platform built with Express.js and Node.js.

## Features

- RESTful API with multiple endpoints
- MongoDB database integration (ready)
- JWT authentication support
- CORS enabled
- Error handling middleware
- Environment variable configuration
- Mock data for testing
- In-memory inventory manager with reservation/rollback helpers
- Integration hook bus for future MongoDB persistence, payment, and analytics adapters

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional for development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/apna_plan
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Documentation

See the main README.md for complete API documentation.

## Project Structure

```
backend/
├── models/        # Database schemas
├── routes/        # API endpoints
├── controllers/   # Business logic (ready for implementation)
├── server.js      # Main entry point
├── .env           # Environment variables
└── package.json   # Dependencies
```

## Development

- All routes are organized by feature (flights, trains, buses, hotels, etc.)
- Models define the database schema structure
- Controllers can be implemented to handle business logic
- Currently returns mock data for demonstration

## Future Development

1. Implement controllers with database queries
2. Add authentication middleware
3. Implement payment processing
4. Add input validation
5. Add rate limiting
6. Add logging
7. Add unit tests
8. Deploy to production server
9. Swap mock inventory + hook adapters with MongoDB-backed providers

---

For more information, see the main README.md file.
