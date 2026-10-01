import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService, reviewService, paymentService } from '../services/api';
import { 
  Calendar, 
  Clock, 
  User, 
  Star, 
  CreditCard, 
  XCircle, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  X
} from 'lucide-react';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [paymentsMap, setPaymentsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Review modal state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedBookings, setReviewedBookings] = useState(new Set());

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getCustomerBookings();
      setBookings(data);

      // Check payment status for each booking
      const pMap = {};
      await Promise.all(
        data.map(async (b) => {
          try {
            const pay = await paymentService.getByBooking(b.id);
            if (pay && pay.status === 'SUCCESS') {
              pMap[b.id] = pay;
            }
          } catch (e) {
            // ignore
          }
        })
      );
      setPaymentsMap(pMap);
    } catch (e) {
      setError(e.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancel(bookingId);
      setSuccessMessage('Booking cancelled successfully.');
      loadBookings();
    } catch (e) {
      setError(e.message || 'Failed to cancel booking.');
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setRating(5);
    setComment('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    setSubmittingReview(true);
    setError('');

    try {
      await reviewService.createReview(selectedBookingForReview.id, rating, comment);
      setReviewedBookings((prev) => new Set(prev).add(selectedBookingForReview.id));
      setSelectedBookingForReview(null);
      setSuccessMessage('Review submitted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Accepted</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">Completed</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">Rejected</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your service appointments</p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
        >
          Book New Service
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No bookings yet</h3>
          <p className="text-sm text-gray-500 mt-1">When you book home services, they will appear here.</p>
          <Link
            to="/services"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {bookings.map((booking) => {
                  const isPaid = !!paymentsMap[booking.id];
                  const hasReviewed = reviewedBookings.has(booking.id);

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">#{booking.id}</td>
                      <td className="py-3.5 px-4 font-medium text-gray-900">{booking.service?.name}</td>
                      <td className="py-3.5 px-4 text-gray-600">{booking.provider?.user?.name}</td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="text-xs">
                          <span className="block font-medium text-gray-900">{booking.bookingDate}</span>
                          <span className="text-gray-500">{booking.bookingTime}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">₹{booking.service?.price}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(booking.status)}</td>
                      <td className="py-3.5 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" /> Paid
                          </span>
                        ) : booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' ? (
                          <Link
                            to={`/payment?bookingId=${booking.id}`}
                            className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            <CreditCard className="w-3.5 h-3.5 mr-1" /> Pay Now
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {/* Cancel Action */}
                        {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded border border-red-200 transition"
                          >
                            Cancel
                          </button>
                        )}

                        {/* Review Action */}
                        {booking.status === 'COMPLETED' && (
                          hasReviewed ? (
                            <span className="text-xs text-gray-400 italic">Reviewed</span>
                          ) : (
                            <button
                              onClick={() => openReviewModal(booking)}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition inline-flex items-center space-x-1"
                            >
                              <Star className="w-3 h-3 fill-blue-600 text-blue-600" />
                              <span>Review</span>
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {selectedBookingForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Leave a Review</h3>
                <p className="text-xs text-gray-500">
                  For {selectedBookingForReview.provider?.user?.name} ({selectedBookingForReview.service?.name})
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForReview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-gray-700 ml-2">{rating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Your Feedback / Comment
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience with this service provider..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForReview(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
