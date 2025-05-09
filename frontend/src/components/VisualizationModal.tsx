import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ChartType } from '../hooks/useChartSelection';

interface VisualizationModalProps {
  onClose: () => void;
  chartType: ChartType;
  data?: any;
  options?: any;
}

export const VisualizationModal: React.FC<VisualizationModalProps> = ({
  onClose,
  chartType,
  data,
  options
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Data Visualization</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 h-[500px] flex items-center justify-center">
          {/* Chart will be rendered here */}
          <div className="text-gray-400">
            {chartType} chart visualization will be displayed here
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 