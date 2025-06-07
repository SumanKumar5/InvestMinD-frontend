import React from 'react';
import { TrendingUp, Sparkles, BarChart3 } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Why Choose <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">Smart Investor?</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover the powerful features that make our platform the preferred choice for smart investors worldwide.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Real-Time Market Data */}
          <div className="group bg-gradient-to-b from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 hover:scale-[1.02]">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 rounded-xl p-4 sm:p-5 w-fit mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
              <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-400 group-hover:text-emerald-300 transition-colors" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white group-hover:text-emerald-300 transition-colors">
              Real-Time Market Data
            </h3>
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors text-sm sm:text-base">
              Stay up-to-date with global asset prices, volumes, and trends. Get instant notifications on market movements that matter to your portfolio.
            </p>
          </div>

          {/* AI-Powered Insights */}
          <div className="group bg-gradient-to-b from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 hover:scale-[1.02]">
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/5 rounded-xl p-4 sm:p-5 w-fit mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
              <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-purple-400 group-hover:text-purple-300 transition-colors" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white group-hover:text-purple-300 transition-colors">
              AI-Powered Insights
            </h3>
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors text-sm sm:text-base">
              Get personalized recommendations from our advanced AI assistant. Leverage machine learning to identify opportunities and optimize your strategy.
            </p>
          </div>

          {/* Portfolio Analytics */}
          <div className="group bg-gradient-to-b from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1 hover:scale-[1.02] md:col-span-2 lg:col-span-1">
            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 rounded-xl p-4 sm:p-5 w-fit mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
              <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white group-hover:text-cyan-300 transition-colors">
              Portfolio Analytics
            </h3>
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors text-sm sm:text-base">
              Visualize sector exposure, gains, and growth with intuitive dashboards. Track performance metrics and make data-driven decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;