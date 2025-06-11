import React from 'react';
import { usePriceFormatter } from '../../hooks/usePriceFormatter';
import { formatPercentage } from '../../utils/formatters';

interface Analytics {
  totalInvestment: number;
  currentValue: number;
  profitLossPercentage: number;
  CAGR: number;
}

interface AnalyticsCardsProps {
  analytics: Analytics | null;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ analytics }) => {
  const formatPrice = usePriceFormatter();
  const cards = [
    {
      title: 'Total Investment',
      value: formatPrice(analytics?.totalInvestment || 0),
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5'
    },
    {
      title: 'Current Value',
      value: formatPrice(analytics?.currentValue || 0),
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-500/10 to-emerald-600/5'
    },
    {
      title: 'Profit/Loss',
      value: formatPercentage(analytics?.profitLossPercentage),
      gradient: (analytics?.profitLossPercentage || 0) >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600',
      bgGradient: (analytics?.profitLossPercentage || 0) >= 0 ? 'from-emerald-500/10 to-emerald-600/5' : 'from-red-500/10 to-red-600/5',
      textColor: (analytics?.profitLossPercentage || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
    },
    {
      title: 'CAGR',
      value: formatPercentage(analytics?.CAGR),
      gradient: (analytics?.CAGR || 0) >= 0 ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600',
      bgGradient: (analytics?.CAGR || 0) >= 0 ? 'from-purple-500/10 to-purple-600/5' : 'from-red-500/10 to-red-600/5',
      textColor: (analytics?.CAGR || 0) >= 0 ? 'text-purple-400' : 'text-red-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="group bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1"
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          <div className="relative z-10">
            <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${card.gradient} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-full" />
            </div>
            
            <h3 className="text-sm sm:text-base font-medium text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">
              {card.title}
            </h3>
            
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
              card.textColor || 'text-white'
            } group-hover:scale-105 transition-transform duration-300`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;