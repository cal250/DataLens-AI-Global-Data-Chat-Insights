import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ChartType } from '../hooks/useChartSelection';

interface ChartSelectorProps {
  onClose: () => void;
  onSelect: (type: ChartType) => void;
}

const chartTypes: { type: ChartType; label: string; description: string }[] = [
  {
    type: 'line',
    label: 'Line Chart',
    description: 'Display trends over time or categories'
  },
  {
    type: 'bar',
    label: 'Bar Chart',
    description: 'Compare values across categories'
  },
  {
    type: 'scatter',
    label: 'Scatter Plot',
    description: 'Show relationships between variables'
  },
  {
    type: 'pie',
    label: 'Pie Chart',
    description: 'Show proportions of a whole'
  },
  {
    type: 'area',
    label: 'Area Chart',
    description: 'Show cumulative values over time'
  },
  {
    type: 'heatmap',
    label: 'Heatmap',
    description: 'Visualize data density and patterns'
  },
  {
    type: '3d',
    label: '3D Visualization',
    description: 'Explore data in three dimensions'
  }
];

export const ChartSelector: React.FC<ChartSelectorProps> = ({ onClose, onSelect }) => {
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
        className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Select Chart Type</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chartTypes.map((chart) => (
            <button
              key={chart.type}
              onClick={() => {
                onSelect(chart.type);
                onClose();
              }}
              className="bg-gray-700 rounded-lg p-4 text-left hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{chart.label}</h3>
              <p className="text-gray-400 text-sm">{chart.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 