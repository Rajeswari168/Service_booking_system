import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { 
  Check, 
  X, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Phone, 
  User, 
  AlertCircle 
} from 'lucide-react';

export const ProviderBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getProviderBookings();
      setBookings(data);
    } catch (e) {
      setError(e.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    setError('');
    setSuccessMessage('');
    try {
      await bookingService.accept(id);
      setSuccessMessage(`Booking #${id} successfully accepted!`);
      loadBookings();
    } catch (err) {
      setError(err.message || 'Failed to accept booking');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm(`Are you sure you want to reject booking #${id}?`)) return;
    setError('');
    setSuccessMessage('');
    try {
      await bookingService.reject(id);
      setSuccessMessage(`Booking #${id} rejected.`);
      loadBookings();
    } catch (err) {
      setError(err.message || 'Failed to reject booking');
    }
  };

  const handleComplete = async (id) => {
    setError('');
    setSuccessMessage('');
    try {
      await bookingService.complete(id);
      setSuccessMessage(`Booking #${id} marked as COMPLETED!`);
      loadBookings();
    } catch (err) {
      setError(err.message || 'Failed to complete booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'ALL') return true;
    return b.status === activeFilter;
  });

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">Review customer requests, accept jobs, and update progress</p>
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
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-3">
        {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeFilter === filter
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No {activeFilter !== 'ALL' ? activeFilter.toLowerCase() : ''} bookings found</h3>
          <p className="text-sm text-gray-500 mt-1">Bookings from customers will be listed here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Earnings</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">#{b.id}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-900">{b.customer?.name}</td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{b.customer?.phone}</td>
                    <td className="py-3.5 px-4 text-gray-900">{b.service?.name}</td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="block font-medium text-gray-900">{b.bookingDate}</span>
                      <span className="text-gray-500">{b.bookingTime}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">₹{b.service?.price}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      {b.status === 'PENDING' && (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleAccept(b.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleReject(b.id)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-medium rounded-lg transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {b.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleComplete(b.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center space-x-1 ml-auto"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      )}

                      {b.status === 'COMPLETED' && (
                        <span className="text-xs text-green-700 font-medium">Done</span>
                      )}

                      {(b.status === 'REJECTED' || b.status === 'CANCELLED') && (
                        <span className="text-xs text-gray-400 italic">No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
