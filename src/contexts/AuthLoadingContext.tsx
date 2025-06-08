import React, { createContext, useContext, useState } from 'react';
import { Loader2, Brain } from 'lucide-react';

interface AuthLoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  startAuthLoading: (message?: string) => void;
  stopAuthLoading: () => void;
}

const AuthLoadingContext = createContext<AuthLoadingContextType | undefined>(undefined);

export const AuthLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const startAuthLoading = (message: string = 'Processing...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopAuthLoading = () => {
    setIsLoading(false);
    setLoadingMessage('');
  };

  return (
    <AuthLoadingContext.Provider value={{ 
      isLoading, 
      loadingMessage, 
      startAuthLoading, 
      stopAuthLoading 
    }}>
      {isLoading && <AuthLoadingOverlay message={loadingMessage} />}
      {children}
    </AuthLoadingContext.Provider>
  );
};

const AuthLoadingOverlay: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[100]">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-gray-700/50 shadow-2xl max-w-sm mx-4 text-center">
        {/* Animated Logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-teal-400 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="mb-6">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">
            {message}
          </h3>
          <p className="text-sm text-gray-400">
            Please wait a moment...
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export const useAuthLoading = () => {
  const context = useContext(AuthLoadingContext);
  if (context === undefined) {
    throw new Error('useAuthLoading must be used within an AuthLoadingProvider');
  }
  return context;
};