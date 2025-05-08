import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartType } from '../types/chart';
import { DataVisualization } from './DataVisualization';

interface VisualizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  type: ChartType;
  title?: string;
  onError?: (error: string) => void;
}

export const VisualizationModal: React.FC<VisualizationModalProps> = ({
  isOpen,
  onClose,
  data,
  type,
  title,
  onError,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full h-full max-w-7xl mx-4 my-8 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {title || `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`}
                </h2>
                <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                  {type}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 h-[calc(100%-5rem)]">
              <DataVisualization
                data={data}
                type={type}
                options={{
                  title: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
                  height: '100%',
                }}
                onError={onError}
              />
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Add download functionality here
                    console.log('Download chart');
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 