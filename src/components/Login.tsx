import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Brain, X, CheckCircle2, AlertCircle } from "lucide-react";
import { login } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { useAuthLoading } from "../contexts/AuthLoadingContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { startAuthLoading, stopAuthLoading } = useAuthLoading();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("investmind_token");
    if (token) {
      navigate("/portfolio");
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setError(""); // Clear general error

    if (newEmail && !validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return email && password && validateEmail(email) && !emailError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    startAuthLoading("Signing you in...");
    setError("");

    try {
      const { token, user } = await login(email, password);
      localStorage.setItem("investmind_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
          >
            <div className="flex-shrink-0 text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-100">
                Welcome back, {user.firstName || "Investor"}!
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

      // Short delay to show the success message
      setTimeout(() => {
        stopAuthLoading();
        navigate("/portfolio");
      }, 800);
    } catch (err: any) {
      stopAuthLoading();
      const message =
        err.response?.data?.message || "Invalid email or password";

      // Auto-redirect if email needs verification
      if (err.response?.data?.needsVerification) {
        const email = err.response.data.email;

        // Store in localStorage so verifyEmail.tsx can access it
        localStorage.setItem("unverifiedEmail", email);

        // Show toast to confirm OTP was sent
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } toast-warning max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
            >
              <div className="flex-shrink-0 text-yellow-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-100">
                  Your email is not verified. We've sent a new OTP.
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
          { duration: 3000 }
        );

        // Redirect to verify-email page
        navigate("/verify-email");
        return;
      } else {
        setError(message);
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
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
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000,
          className: "bg-transparent border-0 shadow-none p-0 m-0",
        }}
      />

      {/* Close Button - Fixed Position */}
      <button
        onClick={() => navigate("/")}
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
            <h1 className="text-4xl font-bold mb-6">Welcome Back, Investor!</h1>
            <p className="text-xl text-blue-100">
              Securely log in to access your dashboard, portfolios, and AI
              insights.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <p className="text-sm text-blue-100">
              "InvestMinD has revolutionized how I manage my investments. The AI
              insights are incredibly valuable."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Testimonial"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">Michael Roberts</p>
                <p className="text-sm text-blue-200">Day Trader</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:hidden">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Brain className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">InvestMinD</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">Log In</h2>

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
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700"
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(""); // Clear error when user types
                    }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {/* Forgot Password Link */}
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                !isFormValid()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Log In
            </button>

            <p className="text-center text-gray-400 mt-8">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;