import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, X, AlertCircle, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';
import { requestPasswordReset } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthLoading } from '../contexts/AuthLoadingContext';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { startAuthLoading, stopAuthLoading } = useAuthLoading();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('investmind_token');
    if (token) {
      navigate('/portfolio');
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setError(''); // Clear general error

    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return email && validateEmail(email) && !emailError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    startAuthLoading('Sending reset code...');
    setError('');

    try {
      await requestPasswordReset(email);

      toast.custom(
        (t) => (
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
                Reset code sent to your email!
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ),
        { duration: 1000 }
      );

      // Redirect to reset password page with email
      setTimeout(() => {
        stopAuthLoading();
        navigate('/reset-password', { state: { email } });
      }, 1000);
    } catch (err: any) {
      stopAuthLoading();
      const message = err.response?.data?.message || 'Failed to send reset code. Please try again.';
      setError(message);
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } toast-error max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
          >
            <div className="flex-shrink-0 text-red-400">
              <X className="h-6 w-6" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-100">{message}</p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ),
        { duration: 4000 }
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          className: 'bg-transparent border-0 shadow-none p-0 m-0',
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
            <h1 className="text-4xl font-bold mb-6">Reset Your Password</h1>
            <p className="text-xl text-blue-100">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-8 w-8 text-blue-200" />
              <div>
                <p className="font-medium">Secure Reset Process</p>
                <p className="text-sm text-blue-200">We'll send a verification code</p>
              </div>
            </div>
            <p className="text-sm text-blue-100">
              Your account security is our priority. The reset code will expire in 10 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:hidden">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Brain className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">InvestMinD</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex items-center text-gray-400 hover:text-white transition-colors group mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Login</span>
            </button>

            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Forgot Password?</h2>
              <p className="text-gray-400 text-sm">
                No worries! Enter your email and we'll send you a reset code.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    emailError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-700'
                  }`}
                  placeholder="Enter your email address"
                  required
                />
                {emailError && (
                  <div className="mt-2 flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                !isFormValid()
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              Send Reset Code
            </button>

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

export default ForgotPassword;