import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { bookingService, paymentService } from '../services/api';
import { CreditCard, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';

export const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState(null);
  const [existingPayment, setExistingPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) {
      loadDetails();
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const b = await bookingService.getById(bookingId);
      setBooking(b);

      const pay = await paymentService.getByBooking(bookingId);
      if (pay && pay.status === 'SUCCESS') {
        setExistingPayment(pay);
      }
    } catch (e) {
      setError(e.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!booking) return;
    setPaying(true);
    setError('');

    try {
      const res = await paymentService.createPayment(booking.id, booking.service.price);
      setPaymentSuccess(true);
    } catch (err) {
      setError(err.message || 'Payment processing failed.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!bookingId || !booking) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-xl border border-gray-200 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900">No Booking Selected</h2>
        <p className="text-sm text-gray-500 mt-1">Please select a valid booking to complete payment.</p>
        <Link
          to="/my-bookings"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
        >
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link to="/my-bookings" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Bookings
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        {/* Header */}
        <div className="text-center pb-6 border-b border-gray-100">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
            <CreditCard className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mock Payment Portal</h1>
          <p className="text-xs text-gray-500 mt-1">
            Simulated college-level mock payment gateway
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="my-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Banner */}
        {(paymentSuccess || existingPayment) && (
          <div className="my-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
            <div className="flex justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-green-900">Payment Successful</h3>
            <p className="text-xs text-green-700">
              Payment of ₹{booking.service.price} has been recorded with status SUCCESS.
            </p>
            <div className="pt-2">
              <Link
                to="/my-bookings"
                className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg transition"
              >
                <span>View My Bookings</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {/* Booking Details Invoice */}
        <div className="py-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Booking Reference:</span>
            <span className="font-semibold text-gray-900">#{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Service:</span>
            <span className="font-semibold text-gray-900">{booking.service?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Service Provider:</span>
            <span className="text-gray-900">{booking.provider?.user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Scheduled Date & Time:</span>
            <span className="text-gray-900">{booking.bookingDate} at {booking.bookingTime}</span>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-base">
            <span className="font-bold text-gray-900">Total Payable:</span>
            <span className="text-2xl font-black text-gray-900">₹{booking.service?.price}</span>
          </div>
        </div>

        {/* Action Button */}
        {!paymentSuccess && !existingPayment && (
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Simulated Instant Payment (No real card required)</span>
            </div>

            <button
              onClick={handlePayNow}
              disabled={paying}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {paying ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <span>Pay Now (₹{booking.service?.price})</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
