import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { serviceService, providerService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, AlertCircle, ArrowRight, CheckCircle, Shield } from 'lucide-react';

const FIXED_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
];

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialServiceId = searchParams.get('serviceId') || '';
  const initialProviderId = searchParams.get('providerId') || '';

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedProviderId, setSelectedProviderId] = useState(initialProviderId);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Minimum date = today
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      loadProvidersForService(selectedServiceId);
    } else {
      loadAllProviders();
    }
  }, [selectedServiceId]);

  const loadInitialData = async () => {
    try {
      const allServices = await serviceService.getAll();
      setServices(allServices);

      if (initialServiceId) {
        await loadProvidersForService(initialServiceId);
      } else {
        await loadAllProviders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadAllProviders = async () => {
    try {
      const allProv = await providerService.getAll();
      setProviders(allProv);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProvidersForService = async (serviceId) => {
    try {
      const provs = await providerService.getByService(serviceId);
      setProviders(provs);
      // If currently selected provider doesn't offer this service, reset provider
      if (selectedProviderId && !provs.some((p) => p.id.toString() === selectedProviderId.toString())) {
        setSelectedProviderId('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedService = services.find((s) => s.id.toString() === selectedServiceId.toString());
  const selectedProvider = providers.find((p) => p.id.toString() === selectedProviderId.toString());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedServiceId || !selectedProviderId || !bookingDate || !bookingTime) {
      setError('Please fill all booking details.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingService.create({
        serviceId: Number(selectedServiceId),
        providerId: Number(selectedProviderId),
        bookingDate,
        bookingTime,
      });

      const newBooking = res.data;
      // Navigate to payment page with booking data
      navigate(`/payment?bookingId=${newBooking.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book a Service</h1>
        <p className="text-sm text-gray-500 mt-1">Select your service, preferred provider, date and time slot</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Inputs (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          {/* Step 1: Select Service */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
              1. Choose Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Service --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category?.name}) - ₹{s.price}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Provider */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
              2. Choose Service Provider
            </label>
            <select
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              required
              disabled={!selectedServiceId}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- Select a Provider --</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.user?.name} ({p.experience} experience)
                </option>
              ))}
            </select>
            {selectedServiceId && providers.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                No dedicated provider found for this service.
              </p>
            )}
          </div>

          {/* Step 3: Select Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
              3. Select Booking Date
            </label>
            <input
              type="date"
              min={today}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Step 4: Fixed Time Slots */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
              4. Select Time Slot
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FIXED_TIME_SLOTS.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setBookingTime(slot)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${
                    bookingTime === slot
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Summary Card (Right 1 col) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between h-fit space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-4 border-b border-gray-100 pb-3">
              Booking Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service:</span>
                <span className="font-semibold text-gray-900">{selectedService?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="text-gray-700">{selectedService?.category?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider:</span>
                <span className="font-semibold text-gray-900">{selectedProvider?.user?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-900">{bookingDate || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time Slot:</span>
                <span className="text-gray-900">{bookingTime || 'Not selected'}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Price:</span>
                <span className="text-xl font-extrabold text-blue-600">
                  ₹{selectedService ? selectedService.price : '0'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500 space-x-1.5">
              <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Free cancellation before provider confirmation</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <span>Create Booking & Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
