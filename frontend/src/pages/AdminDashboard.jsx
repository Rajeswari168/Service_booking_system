import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService, serviceService, categoryService, userService } from '../services/api';
import { 
  Users, 
  Calendar, 
  Layers, 
  Tag, 
  ArrowRight, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, b, s, c] = await Promise.all([
        userService.getAll(),
        bookingService.getAllBookings(),
        serviceService.getAll(),
        categoryService.getAll(),
      ]);
      setUsers(u);
      setBookings(b);
      setServices(s);
      setCategories(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Administration Panel
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Platform Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage service categories, service catalogs, user accounts, and bookings.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/services"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center space-x-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manage Services</span>
          </Link>
          <Link
            to="/admin/categories"
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
          >
            Categories
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 transition flex items-center space-x-4"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
        </Link>

        <Link
          to="/admin/bookings"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 transition flex items-center space-x-4"
        >
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
        </Link>

        <Link
          to="/admin/services"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 transition flex items-center space-x-4"
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Services</p>
            <p className="text-2xl font-bold text-gray-900">{services.length}</p>
          </div>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 transition flex items-center space-x-4"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Categories</p>
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          </div>
        </Link>
      </div>

      {/* Recent Bookings in the system */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base">Recent Platform Bookings</h2>
          <Link to="/admin/bookings" className="text-xs text-blue-600 hover:underline font-semibold flex items-center">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No bookings on platform yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                  <th className="pb-3 px-3">ID</th>
                  <th className="pb-3 px-3">Service</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Provider</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 font-mono font-semibold">#{b.id}</td>
                    <td className="py-3 px-3 font-medium text-gray-900">{b.service?.name}</td>
                    <td className="py-3 px-3 text-gray-600">{b.customer?.name}</td>
                    <td className="py-3 px-3 text-gray-600">{b.provider?.user?.name}</td>
                    <td className="py-3 px-3 text-gray-500 text-xs">{b.bookingDate}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
