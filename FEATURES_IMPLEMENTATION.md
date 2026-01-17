# Apna Plan - Complete Travel Booking Platform

A full-stack travel booking application built with Node.js, Express, MongoDB, and React. Features user authentication, booking management, payments, reviews, real-time seat availability, and multi-language support.

## ✨ Features

### 1. **User Authentication & JWT**
- Secure registration and login with bcrypt password hashing
- JWT token-based authentication (12-hour expiry)
- Role-based access control (user/admin)
- Protected routes and API endpoints
- Profile management with additional user details

### 2. **Payment Gateway Integration**
- **Razorpay Integration**: Full payment flow support
- Multiple payment methods: UPI, Credit Card, Debit Card, Net Banking, Wallet
- Secure payment verification using Razorpay signatures
- Transaction tracking and history
- Refund processing
- Order creation and management

### 3. **Email Notifications**
- Automated email system using Nodemailer
- Email templates for:
  - Booking confirmations
  - Payment success notifications
  - Booking reminders (before travel date)
  - Review requests
  - Promotional content
- Configurable email providers (Gmail, custom SMTP)

### 4. **Advanced Search & Filters**
- Multi-criteria search filtering for flights, trains, buses, and hotels
- Filter by:
  - Price range (min/max)
  - Duration
  - Departure time windows
  - Star/Review ratings
  - Amenities
  - Seat types (trains/buses)
  - Room types (hotels)
- Sorting options:
  - Price (ascending/descending)
  - Rating
  - Duration
  - Departure time
- Dynamic filter options based on available data

### 5. **Booking History**
- Complete booking history for authenticated users
- Filter by status: pending, confirmed, completed, cancelled
- Pagination support
- Booking details view
- Booking cancellation with refund calculation
- Download ticket/receipt functionality
- Statistics dashboard (total bookings, spending, etc.)

### 6. **User Reviews & Ratings**
- 5-star rating system
- Detailed review submissions with titles and comments
- Tag-based review categorization
- Image uploads support (placeholder)
- Review moderation (pending/approved/rejected)
- Helpful/unhelpful voting on reviews
- Average rating calculation with distribution charts
- Verified purchase badges
- Admin review moderation panel

### 7. **Multi-Language Support**
- i18n (Internationalization) support
- Currently supported: English (en), Hindi (hi), Spanish (es)
- Language-specific translations for all UI text
- User language preference persistence
- Easy to add more languages
- Context-based translation system

### 8. **Real-Time Seat Availability**
- Socket.IO integration for real-time updates
- Dynamic seat mapping for different transport types
- Seat status tracking (available, booked, blocked)
- Price variations by seat position
- 15-minute seat hold functionality
- Automatic cleanup of expired seat holds
- Real-time broadcast of seat changes to all connected clients
- Seat selection interface

### 9. **Mobile Responsive Design**
- Fully responsive UI for mobile, tablet, and desktop
- Mobile-first design approach
- Touch-friendly components
- Optimized navigation for smaller screens
- Mobile payment integration (UPI QR scanner)
- Progressive Web App (PWA) ready

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Payment**: Razorpay SDK
- **Email**: Nodemailer
- **Real-time**: Socket.IO
- **AI**: GROQ API (Chatbot)
- **Validation**: Custom middleware
- **Rate Limiting**: express-rate-limit
- **Security**: helmet, CORS

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **QR Code**: @zxing/browser
- **Icons**: Lucide React
- **State Management**: React Context + Hooks
- **Internationalization**: Custom i18n context
- **Real-time**: Socket.IO Client

### DevOps/Deployment
- **Version Control**: Git & GitHub
- **Environment Management**: dotenv
- **CORS Handling**: Express CORS middleware

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your credentials:
# - MONGO_URI: Your MongoDB connection string
# - JWT_SECRET: A strong secret key
# - RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET: From Razorpay dashboard
# - GROQ_API_KEY: From GROQ API
# - Email credentials

# Start the server
npm start
# or for development with auto-reload
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_BASE_URL=http://localhost:5000/api" > .env

# Start the development server
npm start
```

## 🚀 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile

### Bookings
- `POST /api/bookings/checkout` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/payment` - Record payment

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/refund/:bookingId` - Request refund
- `GET /api/payments/history` - Payment transaction history

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/item` - Get item reviews (public)
- `GET /api/reviews/user/my-reviews` - Get user's reviews
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `POST /api/reviews/:reviewId/helpful` - Mark as helpful

### Booking History
- `GET /api/history` - Get booking history
- `GET /api/history/stats` - Get booking statistics
- `GET /api/history/:bookingId` - Get booking details
- `POST /api/history/:bookingId/cancel` - Cancel booking
- `GET /api/history/:bookingId/download` - Download ticket

### Other
- `POST /api/chatbot/ask` - Ask chatbot question
- `GET /api/flights` - List flights
- `GET /api/trains` - List trains
- `GET /api/buses` - List buses
- `GET /api/hotels` - List hotels

## 🔐 Environment Variables

See `.env.example` files in both `backend/` and `frontend/` directories for complete configuration options.

### Key Backend Variables
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
GROQ_API_KEY=...
EMAIL_USER=...
EMAIL_PASSWORD=...
```

## 📱 Features Detail

### Real-Time Seat Availability
- Socket.IO connection for live updates
- Automatic seat hold expiration after 15 minutes
- Dynamic pricing based on seat position
- Seat map visualization

### Payment Flow
1. User selects booking and enters details
2. System creates Razorpay order
3. User completes payment
4. System verifies signature
5. Booking confirmed with ticket generation
6. Confirmation email sent
7. Optional: User can request refund later

### Email Notifications
- Triggered automatically on booking events
- HTML templates with styling
- Configurable via environment variables
- Support for multiple email providers

### Multi-Language Support
- Translations stored in context
- Easy to add new languages
- User preference saved in localStorage
- Fallback to English if translation not found

## 🧪 Testing

Run the application and test key flows:
1. User registration and login
2. Search and filter travel options
3. Booking creation
4. Payment processing (Razorpay test mode)
5. Review submission
6. Booking cancellation and refunds

## 📊 Database Schema

### Key Collections
- **Users**: User accounts and profiles
- **Bookings**: Travel bookings
- **Reviews**: User reviews and ratings
- **PaymentTransactions**: Payment records
- **Notifications**: User notifications
- **Flights, Trains, Buses, Hotels**: Travel inventory

## 🔄 Real-Time Features

### Socket.IO Events
- `connection` - User connects
- `register` - Register user ID
- `subscribeSeats` - Subscribe to seat updates
- `unsubscribeSeats` - Unsubscribe from updates
- `seatUpdate` - Broadcast seat changes

## 🚨 Error Handling

- Comprehensive error middleware
- Validation for all inputs
- Proper HTTP status codes
- Meaningful error messages
- Request logging (Morgan)

## 🔒 Security Features

- Helmet for HTTP headers security
- CORS configuration
- Rate limiting (200 requests per 15 minutes)
- JWT token expiration
- Bcrypt password hashing
- Razorpay signature verification
- Input validation and sanitization

## 📈 Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Social sharing features
- [ ] Loyalty program integration
- [ ] AI-powered recommendations
- [ ] Mobile app (React Native)
- [ ] Holiday packages
- [ ] Group bookings
- [ ] Travel insurance integration
- [ ] Multi-currency support
- [ ] Advanced reporting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

Created with ❤️ for travel enthusiasts

## 📞 Support

For support, email support@apnaplan.com or create an issue on GitHub.

## 🙏 Acknowledgments

- GROQ API for chatbot capabilities
- Razorpay for payment processing
- MongoDB for database
- React community for excellent tools
- All contributors and testers
