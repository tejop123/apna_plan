import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, DollarSign, Download, Star, Trash2 } from 'lucide-react';
import travelApi from '../services/travelApi';
import { useI18n } from '../context/I18nContext';

const BookingHistory = () => {
  const { t } = useI18n();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [filter, page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? '' : filter;
      const response = await travelApi.getBookingHistory(page, 10, status);
      setBookings(response.bookings || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await travelApi.cancelBooking(bookingId, 'User cancelled');
        fetchBookings();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  const handleDownloadTicket = async (bookingId) => {
    try {
      const ticket = await travelApi.downloadTicket(bookingId);
      // Generate and download PDF or show ticket details
      console.log('Ticket:', ticket);
    } catch (error) {
      console.error('Failed to download ticket:', error);
    }
  };

  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('history.title')}</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 font-medium text-sm capitalize ${
                filter === status
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Booking ID */}
                  <div>
                    <p className="text-sm text-gray-600">{t('history.bookingId')}</p>
                    <p className="font-semibold text-gray-900">{booking.bookingId}</p>
                  </div>

                  {/* Route */}
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-semibold text-gray-900">
                        {booking.itemDetails?.from || 'N/A'} → {booking.itemDetails?.to || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-start gap-2">
                    <Calendar size={18} className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">{t('history.date')}</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.travelDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-start gap-2">
                    <DollarSign size={18} className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">{t('history.amount')}</p>
                      <p className="font-semibold text-gray-900">₹{booking.netAmount}</p>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>

                  <div className="flex gap-2">
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={16} />
                        Cancel
                      </button>
                    )}

                    {booking.status === 'confirmed' || booking.status === 'completed' ? (
                      <>
                        <button
                          onClick={() => handleDownloadTicket(booking._id)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition"
                        >
                          <Download size={16} />
                          Ticket
                        </button>

                        {!booking.hasReview && (
                          <button className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white hover:bg-yellow-600 rounded transition">
                            <Star size={16} />
                            Review
                          </button>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded ${
                  page === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
