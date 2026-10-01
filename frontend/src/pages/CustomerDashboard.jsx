import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService, notificationService } from '../services/api';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Bell, 
  PlusCircle, 
  Search, 
  Wrench,
  CreditCard 
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bData, nData] = await Promise.all([
        bookingService.getCustomerBookings(),
        notificationService.getAll(),
      ]);
      setBookings(bData);
      setNotifications(nData.slice(0, 4));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.status === 'PENDING' || b.status === 'ACCEPTED').length;
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Hello, {user?.name}!</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your service requests, appointments, and payments in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/services"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book New Service</span>
          </Link>
          <Link
            to="/my-bookings"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition"
          >
            View All Bookings
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active / Pending</p>
            <p className="text-2xl font-bold text-gray-900">{activeBookings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{completedBookings}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Bookings & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-base">Recent Bookings</h2>
            <Link to="/my-bookings" className="text-xs text-blue-600 hover:underline font-semibold flex items-center">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No recent bookings found. Ready to book your first service?
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{b.service?.name}</h4>
                    <p className="text-xs text-gray-500">
                      With {b.provider?.user?.name} on {b.bookingDate} at {b.bookingTime}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-900">₹{b.service?.price}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notifications (1 Col) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-base flex items-center">
              <Bell className="w-4 h-4 mr-1.5 text-blue-600" />
              Notifications
            </h2>
            <Link to="/notifications" className="text-xs text-blue-600 hover:underline font-semibold">
              All
            </Link>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No new notifications.
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    n.isRead
                      ? 'bg-gray-50 border-gray-100 text-gray-600'
                      : 'bg-blue-50/50 border-blue-100 text-blue-900 font-medium'
                  }`}
                >
                  <p>{n.message}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
