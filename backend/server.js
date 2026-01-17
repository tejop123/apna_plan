const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./config/db');

const errorHandler = require('./middleware/errorHandler');
require('./services/mockIntegrations');

// Import services
const RealtimeSeatService = require('./services/realtimeSeatService');
const { verifyTransporter } = require('./services/emailService');

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean);

app.set('trust proxy', 1);

app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX || 200),
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const flightRoutes = require('./routes/flightRoutes');
const trainRoutes = require('./routes/trainRoutes');
const busRoutes = require('./routes/busRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const historyRoutes = require('./routes/historyRoutes');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/history', historyRoutes);

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : true,
    methods: ['GET', 'POST']
  }
});

// Initialize real-time seat service
const seatService = new RealtimeSeatService(io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Register user
  socket.on('register', (userId) => {
    seatService.registerUser(userId, socket.id);
    socket.join(`user_${userId}`);
  });

  // Subscribe to seat updates for specific item
  socket.on('subscribeSeats', (itemId) => {
    socket.join(`seats_${itemId}`);
    seatService.subscribeToSeats(socket.id, itemId);
  });

  // Unsubscribe from seat updates
  socket.on('unsubscribeSeats', (itemId) => {
    socket.leave(`seats_${itemId}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Attach seat service to app for use in routes
app.locals.seatService = seatService;

// Cleanup expired seat holds every 5 minutes
setInterval(() => {
  seatService.cleanupExpiredHolds();
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect MongoDB', error.message);
    process.exit(1);
  }

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : '*',
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch (error) {
      return next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(socket.user.id);

    socket.on('chatbot:question', (payload) => {
      if (!payload?.question) {
        return;
      }
      io.to(socket.id).emit('chatbot:queued', { question: payload.question, receivedAt: new Date().toISOString() });
    });

    socket.on('travel:subscribe', (route) => {
      if (route) {
        socket.join(`route:${route}`);
      }
    });

    socket.on('disconnect', () => {
      socket.leave(socket.user.id);
    });
  });

  app.set('io', io);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Secure server running on port ${PORT}`);
  });
}

void start();
