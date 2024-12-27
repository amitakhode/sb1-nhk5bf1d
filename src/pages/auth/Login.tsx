import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { signInWithPhone, verifyOTP, signInAsGuest } from '../../services/auth';
import { usePendingCart } from '../../hooks/usePendingCart';

export const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loading: cartLoading, error: cartError } = usePendingCart();

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await signInAsGuest();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithPhone(phone);
      setShowOTP(true);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(phone, otp);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {showOTP ? 'Enter OTP' : 'Login with Phone'}
          </h2>
        </div>
        
        {(error || cartError) && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error || cartError?.message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={showOTP ? handleVerifyOTP : handleSendOTP}>
          {!showOTP ? (
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 left-10 flex items-center">
                  <span className="text-gray-500">+91</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-24 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter mobile number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  disabled={loading || cartLoading}
                />
              </div>
            </div>
          ) : (
            <div>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter 6-digit OTP"
                pattern="[0-9]{6}"
                maxLength={6}
                disabled={loading || cartLoading}
              />
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || cartLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                (loading || cartLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading || cartLoading ? 'Please wait...' : (showOTP ? 'Verify OTP' : 'Send OTP')}
            </button>

            {!showOTP && (
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading || cartLoading}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Continue as Guest
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};