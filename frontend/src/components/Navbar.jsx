import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import { 
  Wrench, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Calendar, 
  Grid, 
  Layers, 
  Users, 
  Home, 
  Menu, 
  X 
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, location.pathname]);

  const loadUnreadCount = async () => {
    try {
      const notifs = await notificationService.getAll();
      const unread = notifs.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">HomeServe</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {/* Public & Customer Links */}
              {(!isAuthenticated || user?.role === 'CUSTOMER') && (
                <>
                  <Link
                    to="/services"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/services')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Services
                  </Link>
                </>
              )}

              {/* Customer specific */}
              {isAuthenticated && user?.role === 'CUSTOMER' && (
                <>
                  <Link
                    to="/customer/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/customer/dashboard')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/my-bookings')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    My Bookings
                  </Link>
                </>
              )}

              {/* Provider specific */}
              {isAuthenticated && user?.role === 'PROVIDER' && (
                <>
                  <Link
                    to="/provider/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/provider/dashboard')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/provider/bookings"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/provider/bookings')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Manage Bookings
                  </Link>
                </>
              )}

              {/* Admin specific */}
              {isAuthenticated && user?.role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/dashboard')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/categories"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/categories')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Categories
                  </Link>
                  <Link
                    to="/admin/services"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/services')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Services
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/bookings')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Bookings
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/admin/users')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Users
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Header: Notifications & Auth State */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications Link */}
                <Link
                  to={user?.role === 'PROVIDER' ? '/provider/notifications' : '/notifications'}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Info Badge */}
                <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{user?.name}</p>
                    <span className="inline-block text-[10px] font-medium uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm px-3 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {(!isAuthenticated || user?.role === 'CUSTOMER') && (
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Services
            </Link>
          )}

          {isAuthenticated && user?.role === 'CUSTOMER' && (
            <>
              <Link
                to="/customer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                My Bookings
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Notifications ({unreadCount})
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'PROVIDER' && (
            <>
              <Link
                to="/provider/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to="/provider/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Bookings
              </Link>
              <Link
                to="/provider/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Notifications ({unreadCount})
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'ADMIN' && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Categories
              </Link>
              <Link
                to="/admin/services"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Services
              </Link>
              <Link
                to="/admin/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Bookings
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Users
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.role}</div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-blue-600 font-medium border border-blue-600 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-blue-600 text-white font-medium rounded-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
