import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Brain } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartTracking = () => {
    const token = localStorage.getItem('investmind_token');
    if (token) {
      navigate('/portfolio');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative min-h-screen py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden flex items-center">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 opacity-15 sm:opacity-20">
        <div className="absolute top-1/4 left-1/3 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-blue-600 rounded-full filter blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-purple-600 rounded-full filter blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 sm:w-54 sm:h-54 md:w-72 md:h-72 bg-teal-600 rounded-full filter blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-gray-800/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 text-xs sm:text-sm text-blue-400 border border-gray-700/50 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="font-medium">AI-powered investment analytics</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight animate-gradient bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500 bg-clip-text text-transparent">
            Track, analyze, and grow your investments with AI
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 lg:mb-12 leading-relaxed max-w-4xl mx-auto px-2">
            Experience the future of investing with real-time asset data and personalized portfolio analytics.
            Let our AI help you make smarter investment decisions backed by data-driven insights.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 justify-center">
            <button 
              onClick={handleStartTracking}
              className="btn-primary bg-blue-600 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center text-base sm:text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <LineChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Start Tracking
            </button>
            <button 
              onClick={scrollToFeatures}
              className="btn-primary bg-gray-800 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg border border-gray-700/50 flex items-center justify-center text-base sm:text-lg hover:bg-gray-750 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;