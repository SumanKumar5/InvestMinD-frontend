import React from 'react';
import { X, Plus, Loader2 } from 'lucide-react';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'buy' | 'sell';
  setActiveTab: (tab: 'buy' | 'sell') => void;
  newHolding: {
    symbol: string;
    quantity: string;
    buyPrice: string;
    notes: string;
  };
  setNewHolding: (holding: {
    symbol: string;
    quantity: string;
    buyPrice: string;
    notes: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const AddHoldingModal: React.FC<AddHoldingModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  newHolding,
  setNewHolding,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            Add Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex space-x-1 bg-gray-700/50 p-1 rounded-lg mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-2 sm:py-2.5 rounded-md transition-all text-sm sm:text-base font-medium ${
              activeTab === 'buy'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-2 sm:py-2.5 rounded-md transition-all text-sm sm:text-base font-medium ${
              activeTab === 'sell'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
            }`}
          >
            Sell
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
          {/* Symbol Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Symbol <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newHolding.symbol}
              onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value.toUpperCase() })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm sm:text-base"
              placeholder="e.g., AAPL, TSLA"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={newHolding.quantity}
              onChange={(e) => setNewHolding({ ...newHolding, quantity: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm sm:text-base"
              placeholder="Number of shares"
              required
              min="0"
              step="any"
              disabled={isSubmitting}
            />
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price per Unit <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">$</span>
              <input
                type="number"
                value={newHolding.buyPrice}
                onChange={(e) => setNewHolding({ ...newHolding, buyPrice: e.target.value })}
                className="w-full pl-8 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="0.00"
                required
                min="0"
                step="any"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={newHolding.notes}
              onChange={(e) => setNewHolding({ ...newHolding, notes: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm sm:text-base resize-none"
              rows={3}
              placeholder="Add any notes about this transaction..."
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 sm:py-3 text-gray-300 hover:text-white transition-colors text-sm sm:text-base font-medium rounded-lg hover:bg-gray-700/50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newHolding.symbol || !newHolding.quantity || !newHolding.buyPrice}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                activeTab === 'buy'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{activeTab === 'buy' ? 'Buy' : 'Sell'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHoldingModal;