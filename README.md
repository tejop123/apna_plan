# Apna Plan - Travel Booking Platform

## Project Title (50 words)
Comprehensive Apna Plan Travel Booking Experience Delivering Flights, Trains, Buses, Hotels, Insightful Admin Analytics, Unified Search, Personalized Recommendations, Secure Auth, Responsive React UI, Modular Express APIs, Mock Inventory Simulation, Scalable Architecture, Performance Optimization, Educational Full-Stack Showcase, Data-Driven Insights, Cloud-Ready Deployment, Extensible Integrations, Seamless Booking Journeys, Engaging UI Flourishes Across Multiple Touchpoints.

## Objective
Deliver a learning-focused full-stack reference with comprehensive multimodal booking capabilities while emphasizing clean React UI patterns, modular Express APIs, mock travel inventory pipelines, and extensibility hooks for future upgrades such as MongoDB persistence, payment workflows, analytics, and cloud-native deployment.

## Description
This project combines a responsive React frontend with an Express backend to simulate end-to-end booking flows for flights, trains, buses, and hotels. Users can search itineraries, review curated results, and manage reservations, while the admin panel surfaces rosters, booking stats, and user insights. Mock stores emulate real-time travel inventory so contributors can iterate quickly without external dependencies.

## Skills Demonstrated
- Full-stack JavaScript architecture with React 18, Express.js, and modular routing
- Secure auth patterns using JWT, bcrypt, and middleware-based validation
- UI systems thinking through reusable components, Tailwind/CSS theming, and responsive layouts
- API design, request validation, and mock data orchestration for travel inventories
- Dev tooling proficiency including npm workspaces, environment management, and structured README documentation

## Machine Learning Model
The roadmap includes a recommendation engine that leverages gradient-boosted ranking (GBDT) to surface the most relevant itineraries by blending historical booking signals, real-time availability, and user context (route, preferred transport mode, budget). The model is containerized behind a lightweight inference service so both the frontend and admin analytics can consume personalized suggestions without coupling to the training pipeline.

## Data-Centric Strategy
Training pipelines emphasize curated, high-signal datasets collected from mock booking logs, synthetic search events, and admin-verified inventory updates. Features are engineered via a declarative registry focusing on data quality (freshness checks, schema contracts, drift alerts) before model iterations. This data-first loop ensures improvements to labeling, segmentation, and coverage consistently outperform ad-hoc model tweaks, keeping the recommendation stack robust even as new modalities or partners are introduced.

## Project Structure

```
apna-plan/
├── frontend/                 # React Frontend Application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── admin/           # Admin panel
│   │   ├── styles/          # CSS styling
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── backend/                  # Express.js Backend API
    ├── models/              # Database schemas
    ├── routes/              # API routes
    ├── controllers/         # Business logic
    ├── server.js            # Main server file
    ├── package.json
    ├── .env                 # Environment variables
    └── README.md
```

## Features

### Frontend
- **Home Page**: Attractive landing page with carousel and features
- **Flight Booking**: Search and book flights
- **Train Booking**: Find and book trains with multiple classes
- **Bus Booking**: Book buses with amenities
- **Hotel Booking**: Search hotels with room types and amenities
- **Admin Panel**: Dashboard with user and booking management
- **Responsive Design**: Mobile-friendly UI using Ant Design and CSS
- **Modern UI**: Professional and modern design for travel bookings

### Backend
- **RESTful API**: Express.js server with multiple endpoints
- **Models**: Database schemas for flights, trains, buses, hotels, users, and bookings
- **Routes**: Organized routing for all modules
- **Admin Endpoints**: Analytics and management endpoints
- **CORS**: Enabled for frontend communication

## Output Features

### User Outputs
- **Booking Confirmations**: Detailed confirmation with booking reference number and itinerary details
- **QR Codes**: Scannable QR codes for quick check-in and validation
- **Travel Receipts**: PDF-formatted receipts with pricing breakdown and payment details
- **Booking History**: Complete list of past bookings with status tracking
- **Email Notifications**: Confirmation emails, booking updates, and cancellation notices

### Admin Outputs
- **Dashboard Analytics**: Real-time statistics on bookings, revenue, and user activity
- **Reports**: Detailed reports on flight, train, bus, and hotel bookings
- **User Roster**: Comprehensive list of registered users with booking history
- **Revenue Reports**: Payment transaction summaries and revenue analytics
- **Inventory Management**: Real-time seat and room availability status
- **Export Capabilities**: Download analytics and reports in structured formats

### System Outputs
- **Search Results**: Filtered and ranked travel options based on user criteria
- **Availability Data**: Real-time inventory status for all travel modes
- **Personalized Recommendations**: ML-powered suggestions based on user preferences
- **Error Messages**: Clear, actionable error feedback for validation and system issues
- **Chat Responses**: Intelligent chatbot assistance for travel inquiries and bookings

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios (HTTP client)
- Ant Design (UI Library)
- CSS3 (Responsive styling)
- React DatePicker
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- JWT (Authentication)
- Bcryptjs (Password hashing)
- Dotenv (Environment management)

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/apna_plan
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update profile

### Flights
- `GET /api/flights` - Get all flights
- `POST /api/flights/search` - Search flights
- `GET /api/flights/:id` - Get flight details

### Trains
- `GET /api/trains` - Get all trains
- `POST /api/trains/search` - Search trains
- `GET /api/trains/:id` - Get train details

### Buses
- `GET /api/buses` - Get all buses
- `POST /api/buses/search` - Search buses
- `GET /api/buses/:id` - Get bus details

### Hotels
- `GET /api/hotels` - Get all hotels
- `POST /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/payment` - Process payment

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/analytics/flights` - Flight analytics
- `GET /api/admin/analytics/trains` - Train analytics
- `GET /api/admin/analytics/buses` - Bus analytics
- `GET /api/admin/analytics/hotels` - Hotel analytics

## Pages

### Frontend Pages
- **Home** (`/`) - Landing page with features and statistics
- **Flights** (`/flights`) - Flight booking page
- **Trains** (`/trains`) - Train booking page
- **Buses** (`/buses`) - Bus booking page
- **Hotels** (`/hotels`) - Hotel booking page
- **Admin** (`/admin`) - Admin panel with dashboard, users, bookings, and analytics

## UI Components

### Navigation & Layout
- Navbar with menu and authentication buttons
- Footer with links and contact information
- Responsive layout for all screen sizes

### Search Components
- SearchBar for entering departure, destination, and dates
- Date picker for flexible date selection
- City selection dropdown

### Booking Cards
- FlightCard - Display flight details with times and price
- TrainCard - Show train routes with class options
- BusCard - Present bus information with amenities
- HotelCard - Display hotel details with room types

### Admin Components
- AdminPanel - Main layout with sidebar navigation
- AdminDashboard - Statistics and recent bookings
- AdminUsers - User management table
- AdminBookings - Booking management with status tracking

## Styling Features

- **Modern Design**: Gradient backgrounds and smooth transitions
- **Color Scheme**: Purple and blue gradients matching travel theme
- **Responsive**: Mobile, tablet, and desktop optimized
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Hover Effects**: Interactive elements with visual feedback

## Future Enhancements

- Database integration with MongoDB
- User authentication and JWT tokens
- Payment gateway integration
- Email notifications
- Advanced search filters
- Booking history
- User reviews and ratings
- Multi-language support
- Real-time seat availability
- Mobile app version

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Screenshots

### Desktop Views
![Desktop View 1](https://github.com/user-attachments/assets/69bf2b7f-a1a0-4a73-bfa5-680a744c237f)
![Desktop View 2](https://github.com/user-attachments/assets/b37a3935-6fcb-498b-aa9b-16f31954f328)
![Desktop View 3](https://github.com/user-attachments/assets/8abf51af-fcec-464a-90e2-ad95447cbdd2)

### Mobile Views
![Mobile View](https://github.com/user-attachments/assets/bdf7e538-53b4-4c6b-b329-ac9cf2b63626)

## Contact

For support, email tm344556@gmail.com or visit the website.

---

**Note**: This is a clone project for educational purposes. All APIs are mock endpoints. To use with a real database, implement MongoDB integration and update the API endpoints accordingly.
"# apna-plan" 
