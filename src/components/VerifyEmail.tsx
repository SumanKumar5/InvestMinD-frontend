import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Brain, X, CheckCircle2, AlertCircle, Mail, RefreshCw, Clock } from 'lucide-react';
import { verifyEmail, resendOtp } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthLoading } from '../contexts/AuthLoadingContext';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startAuthLoading, stopAuthLoading } = useAuthLoading();
  const emailFromState = location.state?.email || localStorage.getItem('unverifiedEmail') || '';

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('investmind_token');
    if (token) {
      navigate('/portfolio');
    }
  }, [navigate]);

  // Redirect if no email provided
  useEffect(() => {
    if (!emailFromState) {
      navigate('/signup');
    }
  }, [emailFromState, navigate]);

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Auto-focus OTP input
  useEffect(() => {
    const otpInput = document.getElementById('otp');
    if (otpInput) {
      otpInput.focus();
    }
  }, []);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      setError(''); // Clear error when user types
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !otp) {
      setError('Please fill in all fields');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    startAuthLoading('Verifying your email...');
    setError('');

    try {
      const { token, name, email: userEmail } = await verifyEmail(email, otp);
      localStorage.setItem('investmind_token', token);
      localStorage.setItem('user', JSON.stringify({ name, email: userEmail }));

      localStorage.removeItem('unverifiedEmail');

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
        >
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              Email verified successfully!
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 2000 });

      // Redirect to portfolio
      setTimeout(() => {
        stopAuthLoading();
        navigate('/portfolio');
      }, 1000);
    } catch (err: any) {
      stopAuthLoading();
      const message = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(message);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } toast-error max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
        >
          <div className="flex-shrink-0 text-red-400">
            <X className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              {message}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 4000 });
    }
  };

  const handleResendOtp = async () => {
    if (!email || resendCooldown > 0) return;

    setIsResending(true);
    setError('');

    try {
      await resendOtp(email);
      setResendCooldown(60); // 60 second cooldown
      
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
        >
          <div className="flex-shrink-0 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              New OTP sent to your email!
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 2000 });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(message);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } toast-error max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
        >
          <div className="flex-shrink-0 text-red-400">
            <X className="h-6 w-6" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-100">
              {message}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ), { duration: 4000 });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 2000,
          className: 'bg-transparent border-0 shadow-none p-0 m-0'
        }}
      />
      
      {/* Close Button - Fixed Position */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 right-6 z-50 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-500/20 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between h-full text-white">
          <div>
            <div className="flex items-center space-x-3 mb-12">
              <Brain className="h-10 w-10" />
              <span className="text-3xl font-bold">InvestMinD</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Almost There!</h1>
            <p className="text-xl text-blue-100">
              We've sent a verification code to your email. Enter it below to complete your registration.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-8 w-8 text-blue-200" />
              <div>
                <p className="font-medium">Check Your Email</p>
                <p className="text-sm text-blue-200">Verification code sent</p>
              </div>
            </div>
            <p className="text-sm text-blue-100">
              Didn't receive the code? Check your spam folder or request a new one.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:hidden">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Brain className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">InvestMinD</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Verify Your Email</h2>
              <p className="text-gray-400 text-sm">
                Enter the 6-digit code sent to your email address
              </p>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field (readonly) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* OTP Field */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Verify Email
            </button>

            {/* Resend OTP Section */}
            <div className="text-center space-y-3">
              <p className="text-gray-400 text-sm">
                Didn't receive the code?
              </p>
              
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending || resendCooldown > 0}
                className={`inline-flex items-center space-x-2 text-blue-500 hover:text-blue-400 font-medium transition-colors ${
                  (isResending || resendCooldown > 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isResending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : resendCooldown > 0 ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>
                  {isResending 
                    ? 'Sending...' 
                    : resendCooldown > 0 
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend Code'
                  }
                </span>
              </button>
            </div>

            <p className="text-center text-gray-400 mt-8">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Back to Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;