import React from 'react';

type AssetType = 'all' | 'stocks' | 'crypto' | 'funds';

interface FilterTabsProps {
  activeFilter: AssetType;
  setActiveFilter: (filter: AssetType) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, setActiveFilter }) => {
  const tabs: { id: AssetType; label: string }[] = [
    { id: 'all', label: 'All Assets' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'funds', label: 'Funds' }
  ];

  return (
    <div className="flex flex-wrap sm:flex-nowrap space-x-1 bg-gray-800/80 backdrop-blur-sm p-1 rounded-lg sm:rounded-xl border border-gray-700/50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all duration-300 whitespace-nowrap ${
            activeFilter === tab.id
              ? 'bg-gray-700/80 text-white shadow-lg shadow-gray-700/25 transform scale-105'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/40'
          }`}
          onClick={() => setActiveFilter(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;