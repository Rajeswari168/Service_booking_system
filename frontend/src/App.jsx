import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './layouts/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProviderDetailPage } from './pages/ProviderDetailPage';

// Customer Pages
import { CustomerDashboard } from './pages/CustomerDashboard';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { NotificationsPage } from './pages/NotificationsPage';

// Provider Pages
import { ProviderDashboard } from './pages/ProviderDashboard';
import { ProviderBookingsPage } from './pages/ProviderBookingsPage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminServicesPage } from './pages/AdminServicesPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';

// Root redirect component based on authentication state
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/services" replace />;
  }

  if (user?.role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />;
  if (user?.role === 'PROVIDER') return <Navigate to="/provider/dashboard" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/services" replace />;
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Customer Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<RootRedirect />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:id" element={<ServiceDetailPage />} />
            <Route path="providers/:id" element={<ProviderDetailPage />} />

            {/* Customer Protected Routes */}
            <Route
              path="customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="book"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="payment"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-bookings"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Provider Protected Routes */}
            <Route
              path="provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="provider/bookings"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <ProviderBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="provider/notifications"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/categories"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/services"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminServicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/bookings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminBookingsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
