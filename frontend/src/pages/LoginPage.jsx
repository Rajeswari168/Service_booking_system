import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.role === 'CUSTOMER') {
        navigate('/customer/dashboard');
      } else if (data.role === 'PROVIDER') {
        navigate('/provider/dashboard');
      } else if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 bg-blue-100 rounded-full text-blue-600 mb-3">
          <Wrench className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to your HomeServe account</p>
      </div>

      {/* Demo Credentials Quick-Fill (Viva & Demonstration helper) */}
      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
        <div className="font-semibold text-blue-900 mb-1.5 flex items-center justify-between">
          <span>Quick Demo Login:</span>
          <span className="text-blue-600 font-normal">Click to fill</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickLogin('customer@test.com', 'password123')}
            className="px-2 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100 text-blue-800 text-center font-medium transition"
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('provider@test.com', 'password123')}
            className="px-2 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100 text-blue-800 text-center font-medium transition"
          >
            Provider
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@test.com', 'password123')}
            className="px-2 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100 text-blue-800 text-center font-medium transition"
          >
            Admin
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-medium">
          Create an account
        </Link>
      </div>
    </div>
  );
};
