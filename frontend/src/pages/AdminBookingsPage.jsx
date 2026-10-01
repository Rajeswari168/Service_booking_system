import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { Calendar, User, Clock, AlertCircle } from 'lucide-react';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (e) {
      setError(e.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Master Bookings Registry</h1>
        <p className="text-sm text-gray-500 mt-1">Audit and observe all platform appointments and current statuses</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
              <th className="py-3 px-4">Booking ID</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Provider</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/70 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-gray-900">#{b.id}</td>
                <td className="py-3.5 px-4 font-semibold text-gray-900">{b.service?.name}</td>
                <td className="py-3.5 px-4 text-gray-700 text-xs">{b.customer?.name} ({b.customer?.phone})</td>
                <td className="py-3.5 px-4 text-gray-700 text-xs">{b.provider?.user?.name}</td>
                <td className="py-3.5 px-4 text-xs">
                  <span className="block font-medium text-gray-900">{b.bookingDate}</span>
                  <span className="text-gray-500">{b.bookingTime}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-gray-900">₹{b.service?.price}</td>
                <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
