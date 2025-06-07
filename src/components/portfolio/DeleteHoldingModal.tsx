import React from 'react';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const DeleteHoldingModal: React.FC<DeleteHoldingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 w-full max-w-md mx-4">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-500/20">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Delete Holding?</h2>
            <p className="text-sm text-gray-400">This action cannot be undone</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
          Are you sure you want to delete this holding? All associated transaction history will be permanently removed.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 sm:py-3 text-gray-300 hover:text-white transition-colors text-sm sm:text-base font-medium rounded-lg hover:bg-gray-700/50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteHoldingModal;