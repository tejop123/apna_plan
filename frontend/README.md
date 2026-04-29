# Apna Plan Frontend

A modern React frontend for the Apna Plan travel booking platform with beautiful UI and responsive design.

## Features

- **Home Page**: Eye-catching landing page with carousel and feature highlights
- **Booking Pages**: Separate pages for flights, trains, buses, and hotels
- **Search Functionality**: Easy-to-use search bars with date pickers
- **Admin Dashboard**: Comprehensive admin panel for managing bookings and users
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Modern UI**: Built with Ant Design components and custom CSS

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── pages/           # Page components
│   ├── Home.js
│   ├── FlightBooking.js
│   ├── TrainBooking.js
│   ├── BusBooking.js
│   └── HotelBooking.js
├── components/      # Reusable components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── SearchBar.js
│   ├── FlightCard.js
│   ├── TrainCard.js
│   ├── BusCard.js
│   └── HotelCard.js
├── admin/          # Admin panel components
│   ├── AdminPanel.js
│   ├── AdminDashboard.js
│   ├── AdminUsers.js
│   └── AdminBookings.js
├── styles/         # CSS files
│   ├── navbar.css
│   ├── footer.css
│   ├── cards.css
│   ├── home.css
│   ├── booking.css
│   ├── admin.css
│   └── searchbar.css
├── App.js
└── index.js
```

## Components

### Pages
- **Home**: Main landing page with features and statistics
- **FlightBooking**: Search and book flights
- **TrainBooking**: Search and book trains
- **BusBooking**: Search and book buses
- **HotelBooking**: Search and book hotels

### Components
- **Navbar**: Navigation bar with menu and auth buttons
- **Footer**: Footer with links and information
- **SearchBar**: Reusable search component
- **Cards**: FlightCard, TrainCard, BusCard, HotelCard for displaying results

### Admin
- **AdminPanel**: Main admin layout with sidebar
- **AdminDashboard**: Dashboard with statistics
- **AdminUsers**: User management table
- **AdminBookings**: Booking management

## Styling

- **CSS**: Custom CSS files for each section
- **Ant Design**: UI component library
- **Responsive**: Mobile-first approach
- **Colors**: Purple and blue gradient theme

## Available Scripts

### `npm start`
Runs the app in development mode.

### `npm run build`
Builds the app for production.

### `npm test`
Launches the test runner.

## API Integration

The frontend communicates with the backend API running on `localhost:5000`. 
Update the API URLs in the components if the backend runs on a different server.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication
- User account management
- Booking history
- Payment gateway integration
- Email notifications
- Reviews and ratings
- Search filters
- Multi-language support

---

For more information, see the main README.md file.
