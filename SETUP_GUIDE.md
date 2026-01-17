# 🚀 Apna Plan - Setup & Implementation Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

Required packages:
- express, express-rate-limit, helmet, cors
- mongoose
- jsonwebtoken, bcrypt
- dotenv
- nodemailer
- razorpay
- socket.io
- axios (for GROQ API calls)

#### Frontend
```bash
cd frontend
npm install
```

Required packages:
- react, react-router-dom
- axios
- tailwindcss
- lucide-react
- @zxing/browser (QR code scanning)
- socket.io-client

### 2. Configure Environment Variables

#### Backend `.backend/.env`
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/apnaplan

# Auth
JWT_SECRET=your_strong_secret_key_here

# Payments
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@apnaplan.com

# AI
GROQ_API_KEY=your_groq_api_key

# Frontend
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend `.frontend/.env`
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Servers

#### Terminal 1 - Backend
```bash
cd backend
npm start
# or npm run dev (with nodemon for auto-reload)
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

## 📋 Feature Checklist

### ✅ Implemented Features

#### 1. User Authentication & JWT
- [x] User registration with validation
- [x] User login with JWT tokens
- [x] Password hashing with bcrypt
- [x] Protected routes requiring authentication
- [x] Role-based access (admin/user)
- [x] Token persistence in localStorage
- [x] User profile management

**Files**: 
- Backend: `models/User.js`, `controllers/authController.js`, `middleware/auth.js`
- Frontend: `pages/Login.js`, `pages/Register.js`

#### 2. Payment Gateway Integration
- [x] Razorpay order creation
- [x] Payment signature verification
- [x] Transaction tracking
- [x] Refund processing
- [x] Multiple payment methods
- [x] Payment history

**Files**:
- Backend: `services/paymentService.js`, `controllers/bookingController.js`, `routes/paymentRoutes.js`
- Frontend: `components/BookingPanel.jsx`, `pages/Scanner.js`

#### 3. Email Notifications
- [x] Booking confirmation emails
- [x] Payment success notifications
- [x] Booking reminders (before travel)
- [x] Review request emails
- [x] HTML email templates
- [x] Configurable email providers

**Files**: `backend/services/emailService.js`

#### 4. Advanced Search & Filters
- [x] Multi-criteria filtering
- [x] Price range filtering
- [x] Duration filtering
- [x] Rating filtering
- [x] Amenities filtering
- [x] Multiple sorting options
- [x] Dynamic filter options

**Files**: 
- Backend: `services/searchFilterService.js`
- Frontend: `components/AdvancedFilterPanel.jsx`

#### 5. Booking History
- [x] View all bookings
- [x] Filter by status
- [x] Booking details
- [x] Cancel booking with refunds
- [x] Download tickets
- [x] Booking statistics
- [x] Pagination

**Files**:
- Backend: `controllers/historyController.js`, `routes/historyRoutes.js`
- Frontend: `pages/BookingHistory.js`

#### 6. User Reviews & Ratings
- [x] 5-star rating system
- [x] Detailed review submissions
- [x] Review moderation
- [x] Helpful/unhelpful voting
- [x] Rating distribution charts
- [x] Verified purchase badges
- [x] Review images support
- [x] Admin moderation panel

**Files**:
- Backend: `models/Review.js`, `controllers/reviewController.js`, `routes/reviewRoutes.js`
- Frontend: `pages/ReviewsPage.js`

#### 7. Multi-Language Support
- [x] i18n context system
- [x] English translations
- [x] Hindi translations
- [x] Spanish translations (partial)
- [x] Language preference persistence
- [x] Easy to add more languages

**Files**:
- Backend: `utils/i18n.js`
- Frontend: `context/I18nContext.jsx`

#### 8. Real-Time Seat Availability
- [x] Socket.IO integration
- [x] Live seat updates
- [x] Seat mapping by position
- [x] Dynamic pricing
- [x] Seat hold functionality (15 min)
- [x] Automatic hold expiration
- [x] Seat status tracking

**Files**: 
- Backend: `services/realtimeSeatService.js`, `server.js`
- Frontend: Socket.IO client in components

#### 9. Mobile Responsive Design
- [x] Mobile-first CSS
- [x] Responsive components
- [x] Touch-friendly UI
- [x] Mobile navigation
- [x] Optimized forms
- [x] Mobile payment (UPI QR)
- [x] PWA ready

**Files**: All React components use Tailwind CSS responsive classes

## 🔧 Configuration Details

### Database Setup (MongoDB Atlas)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Update `MONGO_URI` in `.env`

### Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Copy Key ID and Key Secret
4. Use **Test Mode** for development
5. Update environment variables

### Email Configuration

#### Using Gmail
1. Enable 2-factor authentication on Google account
2. Create App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the 16-character password in `EMAIL_PASSWORD`

#### Using Other Providers
Update `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` accordingly

### GROQ API Setup

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create API key
3. Update `GROQ_API_KEY` in `.env`

## 📱 Frontend Components

### New/Updated Components

1. **AdvancedFilterPanel.jsx** - Filter UI component
   - Price range slider
   - Duration selector
   - Amenities checkboxes
   - Sort options

2. **BookingHistory.js** - Booking history page
   - Booking list with filtering
   - Status badges
   - Cancel and download options
   - Pagination

3. **ReviewsPage.js** - Reviews & ratings page
   - Item review display
   - User review management
   - Rating statistics
   - Review form

4. **I18nContext.jsx** - Multi-language support
   - Language switching
   - Translation management
   - Preference persistence

## 🔌 API Integration

### New API Methods in `travelApi.js`

```javascript
// Payments
createPaymentOrder(bookingId, amount)
verifyPayment(orderId, paymentId, signature, bookingId)
requestRefund(bookingId, reason)
getPaymentHistory(page, limit)

// Reviews
createReview(reviewData)
getItemReviews(itemId, itemType, page)
getUserReviews(page)
updateReview(reviewId, reviewData)
deleteReview(reviewId)
markReviewHelpful(reviewId, helpful)

// Booking History
getBookingHistory(page, limit, status)
getBookingStats()
cancelBooking(bookingId, reason)
downloadTicket(bookingId)
```

## 🧪 Testing Guide

### Test Registration/Login
1. Go to `/register`
2. Enter email, password, phone
3. Click "Sign Up"
4. Redirect to login
5. Enter credentials
6. Verify token in localStorage

### Test Booking Flow
1. Login
2. Select travel type (Flight/Train/Bus/Hotel)
3. Enter search criteria
4. Click "Continue to booking"
5. Fill traveler details
6. Select payment method
7. Complete payment (use test cards)

### Test Payments (Razorpay Test Mode)
Use test credit card: **4111 1111 1111 1111**

### Test Cancellation & Refund
1. Open booking from history
2. Click "Cancel"
3. Check refund amount (varies by time)
4. Verify refund processed

### Test Reviews
1. After booking completes
2. Go to BookingHistory
3. Click "Rate Your Trip"
4. Submit review
5. Check in ReviewsPage

## 📦 Package Dependencies

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.0.0",
    "dotenv": "^16.0.0",
    "nodemailer": "^6.9.0",
    "razorpay": "^2.8.0",
    "socket.io": "^4.5.0",
    "express-rate-limit": "^6.7.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "morgan": "^1.10.0"
  }
}
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "axios": "^1.0.0",
    "tailwindcss": "^3.0.0",
    "lucide-react": "^0.263.0",
    "@zxing/browser": "^0.1.5",
    "socket.io-client": "^4.5.0"
  }
}
```

## 🐛 Troubleshooting

### CORS Error
- Verify `ALLOWED_ORIGINS` in backend `.env`
- Check frontend API base URL
- Restart backend after changing `.env`

### MongoDB Connection Error
- Verify `MONGO_URI` format
- Check network access in MongoDB Atlas
- Ensure IP is whitelisted

### Email Not Sending
- Verify email credentials
- Check Gmail app password (if using Gmail)
- Enable "Less secure apps" if needed
- Check email logs in console

### Razorpay Payment Error
- Ensure test mode is enabled
- Use correct test credentials
- Check webhook URL configuration
- Verify account is activated

### Real-Time Seat Updates Not Working
- Check Socket.IO connection in browser console
- Verify server is running
- Check browser WebSocket support
- Clear browser cache

## 📝 Common Tasks

### Add New Language
1. Update `backend/utils/i18n.js` with translations
2. Update `frontend/context/I18nContext.jsx`
3. Add language option in language selector

### Add New Payment Method
1. Integrate payment provider SDK
2. Add method to `paymentService.js`
3. Update booking controller
4. Add UI option in BookingPanel

### Add New Email Template
1. Create function in `emailService.js`
2. Define HTML template
3. Call from appropriate controller
4. Add to routes if needed

### Add New Filter
1. Update `searchFilterService.js`
2. Add UI option in `AdvancedFilterPanel.jsx`
3. Update API routes to use filter service
4. Test with sample data

## 🚀 Deployment

### Deployment Checklist
- [ ] Update `NODE_ENV=production`
- [ ] Set strong `JWT_SECRET`
- [ ] Configure production MongoDB URI
- [ ] Update email credentials
- [ ] Set production `RAZORPAY_KEY` and `SECRET`
- [ ] Update `FRONTEND_URL` to production
- [ ] Update `ALLOWED_ORIGINS`
- [ ] Build frontend: `npm run build`
- [ ] Set up HTTPS/SSL
- [ ] Configure domain DNS
- [ ] Set up CI/CD pipeline

### Hosting Options
- **Backend**: Heroku, Railway, Render, AWS EC2
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas
- **Storage**: AWS S3, Cloudinary (for images)

## 📞 Support & Documentation

For detailed documentation:
- See `FEATURES_IMPLEMENTATION.md` for feature overview
- Check individual controller files for API logic
- Review `.env.example` for configuration options
- Check frontend component files for UI implementation

## ✅ Completion Status

All 9 requested features have been successfully implemented! 

🎉 **Ready for deployment and further customization**

---

**Last Updated**: January 17, 2026
**Version**: 1.0.0
