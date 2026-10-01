import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService, reviewService } from '../services/api';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Star, 
  ArrowRight, 
  AlertCircle,
  Briefcase 
} from 'lucide-react';

export const ProviderDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const bData = await bookingService.getProviderBookings();
      setBookings(bData);

      if (user?.providerId) {
        const rData = await reviewService.getByProvider(user.providerId);
        setReviews(rData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const acceptedBookings = bookings.filter((b) => b.status === 'ACCEPTED');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Provider Portal
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-gray-500 mt-1">
            Accept upcoming requests and mark finished jobs to keep customers updated.
          </p>
        </div>
        <div>
          <Link
            to="/provider/bookings"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition inline-flex items-center space-x-1.5"
          >
            <span>Manage All Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Requests</p>
            <p className="text-2xl font-bold text-amber-600">{pendingBookings.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{acceptedBookings.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Completed Jobs</p>
            <p className="text-2xl font-bold text-green-600">{completedBookings.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Rating ({reviews.length})</p>
            <p className="text-2xl font-bold text-gray-900">{averageRating} ★</p>
          </div>
        </div>
      </div>

      {/* Pending Action Required */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
            Pending Action ({pendingBookings.length})
          </h2>
          <Link to="/provider/bookings" className="text-xs text-blue-600 hover:underline font-semibold">
            View All
          </Link>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            No pending booking requests. Good job!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingBookings.map((b) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {b.service?.name} (₹{b.service?.price})
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Customer: <span className="font-semibold text-gray-900">{b.customer?.name}</span> ({b.customer?.phone})
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Scheduled on: <span className="font-medium text-gray-800">{b.bookingDate}</span> at{' '}
                    <span className="font-medium text-gray-800">{b.bookingTime}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/provider/bookings"
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Respond Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
