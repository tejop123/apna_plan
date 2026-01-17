import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ChatbotSidebar from './components/ChatbotSidebar';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import BusBooking from './pages/BusBooking';
import FlightBooking from './pages/FlightBooking';
import GetApp from './pages/GetApp';
import HotelBooking from './pages/HotelBooking';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingScanner from './pages/Scanner';
import TrainBooking from './pages/TrainBooking';
import TravelContacts from './pages/TravelContacts';

const authHiddenRoutes = ['/login', '/register'];

function hasToken() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.localStorage.getItem('authToken'));
}

function RequireAuth({ children }) {
  if (!hasToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RedirectIfAuth({ children }) {
  return children;
}

function AppContent() {
  const { pathname } = useLocation();
  const hideFooter = authHiddenRoutes.includes(pathname);

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-white text-slate-900">
      <Navbar />
      <main className="flex w-full flex-col items-stretch justify-center">
        <div className="flex w-full flex-col justify-center">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/flights"
              element={(
                <RequireAuth>
                  <FlightBooking />
                </RequireAuth>
              )}
            />
            <Route
              path="/trains"
              element={(
                <RequireAuth>
                  <TrainBooking />
                </RequireAuth>
              )}
            />
            <Route
              path="/buses"
              element={(
                <RequireAuth>
                  <BusBooking />
                </RequireAuth>
              )}
            />
            <Route
              path="/hotels"
              element={(
                <RequireAuth>
                  <HotelBooking />
                </RequireAuth>
              )}
            />
            <Route
              path="/get-app"
              element={(
                <RequireAuth>
                  <GetApp />
                </RequireAuth>
              )}
            />
            <Route
              path="/travelers"
              element={(
                <RequireAuth>
                  <TravelContacts />
                </RequireAuth>
              )}
            />
            <Route
              path="/scanner"
              element={(
                <RequireAuth>
                  <BookingScanner />
                </RequireAuth>
              )}
            />
            <Route
              path="/login"
              element={(
                <RedirectIfAuth>
                  <Login />
                </RedirectIfAuth>
              )}
            />
            <Route
              path="/register"
              element={(
                <RedirectIfAuth>
                  <Register />
                </RedirectIfAuth>
              )}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </main>
      {!hideFooter && <Footer />}
      {!hideFooter && <ChatbotSidebar />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
