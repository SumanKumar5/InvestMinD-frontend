import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { usePriceFormatter } from '../../hooks/usePriceFormatter';
import { formatPercentage } from '../../utils/formatters';

// Updated interface to include companyName
interface BestWorst {
  best: {
    symbol: string;
    companyName: string;
    gain: number;
    percent: number;
  };
  worst: {
    symbol: string;
    companyName: string;
    gain: number;
    percent: number;
  };
}

interface PerformersCardsProps {
  bestWorst: BestWorst | null;
}

const PerformersCards: React.FC<PerformersCardsProps> = ({ bestWorst }) => {
  const formatPrice = usePriceFormatter();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Best Performer */}
      <div className="group bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Best Performer
            </h3>
          </div>
          {bestWorst?.best ? (
            <div className="space-y-1"> {/* CHANGED: Reduced space for a tighter look */}
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                {/* CHANGED: Cleaned up the symbol */}
                {bestWorst.best.symbol.replace(/\.NS|-USD/g, '')}
              </p>
              {/* CHANGED: Added company name */}
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors pb-2">
                {bestWorst.best.companyName}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                <span className="text-emerald-400 font-mono text-sm sm:text-base font-semibold">
                  +{formatPrice(bestWorst.best.gain)}
                </span>
                <span className="text-emerald-400 font-mono text-sm sm:text-base">
                  ({formatPercentage(bestWorst.best.percent)})
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg sm:text-xl text-gray-400">No data available</p>
              <p className="text-sm text-gray-500">Add holdings to see performance</p>
            </div>
          )}
        </div>
      </div>

      {/* Worst Performer */}
      <div className="group bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
              Worst Performer
            </h3>
          </div>
          {bestWorst?.worst ? (
            <div className="space-y-1"> {/* CHANGED: Reduced space for a tighter look */}
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-red-300 transition-colors">
                {/* CHANGED: Cleaned up the symbol */}
                {bestWorst.worst.symbol.replace(/\.NS|-USD/g, '')}
              </p>
              {/* CHANGED: Added company name */}
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors pb-2">
                {bestWorst.worst.companyName}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                <span className="text-red-400 font-mono text-sm sm:text-base font-semibold">
                  {formatPrice(bestWorst.worst.gain)}
                </span>
                <span className="text-red-400 font-mono text-sm sm:text-base">
                  ({formatPercentage(bestWorst.worst.percent)})
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg sm:text-xl text-gray-400">No data available</p>
              <p className="text-sm text-gray-500">Add holdings to see performance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformersCards;