import React from 'react';
import { X, Brain } from 'lucide-react';
import TypewriterText from './TypewriterText';

interface AIInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  insight: string;
}

const AIInsightModal: React.FC<AIInsightModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  insight
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 sm:mb-6 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              AI Portfolio Insight
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto min-h-0">
          <div className="pr-2">
            <TypewriterText
              text={insight}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 flex justify-end flex-shrink-0 pt-4 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-3 text-gray-300 hover:text-white transition-colors text-sm sm:text-base font-medium rounded-lg hover:bg-gray-700/50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightModal;