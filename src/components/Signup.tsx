import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Brain, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signup } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthLoading } from '../contexts/AuthLoadingContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { startAuthLoading, stopAuthLoading } = useAuthLoading();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('investmind_token');
    if (token) {
      navigate('/portfolio');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Check if passwords match
  const passwordsMatch = (): boolean => {
    return formData.password === formData.confirmPassword;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError(''); // Clear general error when user types

    // Real-time email validation
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }

    // Real-time password matching validation
    if (name === 'password' || name === 'confirmPassword') {
      const newPassword = name === 'password' ? value : formData.password;
      const newConfirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (newConfirmPassword && newPassword !== newConfirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      validateEmail(formData.email) &&
      validatePassword(formData.password) &&
      passwordsMatch() &&
      !emailError &&
      !passwordError
    );
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    startAuthLoading('Creating your account...');
    setError('');

    try {
      await signup(formData.fullName, formData.email, formData.password);
      
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
              OTP sent to your email!
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

      // Redirect to verify email page with email in state
      setTimeout(() => {
        stopAuthLoading();
        navigate('/verify-email', { state: { email: formData.email } });
      }, 1000);
    } catch (err: any) {
      stopAuthLoading();
      const message = err.response?.data?.message || 'An error occurred during signup';
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
            <h1 className="text-4xl font-bold mb-6">Create Your Free Account</h1>
            <p className="text-xl text-blue-100">
              Join thousands of smart investors. Access AI insights, live prices, and personalized analytics.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <p className="text-sm text-blue-100">
              "The AI-powered insights have helped me make better investment decisions consistently."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <img
                src="https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Testimonial"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">Rachel Martinez</p>
                <p className="text-sm text-blue-200">Crypto Investor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:hidden">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Brain className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">InvestMinD</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">Sign Up</h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    emailError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-700'
                  }`}
                  placeholder="Enter your email"
                  required
                />
                {emailError && (
                  <div className="mt-2 flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formData.password && formData.password.length < 6 && (
                  <div className="mt-2 flex items-center space-x-2 text-yellow-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Password must be at least 6 characters</span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                      passwordError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-700'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordError && (
                  <div className="mt-2 flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}
                {formData.confirmPassword && !passwordError && passwordsMatch() && (
                  <div className="mt-2 flex items-center space-x-2 text-green-400 text-sm">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Create Account
            </button>

            <p className="text-center text-gray-400 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;