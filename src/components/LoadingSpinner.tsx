import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen
          ? 'fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50'
          : 'w-full h-full min-h-[200px]'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;