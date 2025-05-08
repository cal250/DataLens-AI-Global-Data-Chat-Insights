import React from 'react';
import { motion } from 'framer-motion';
import { ChartType } from '../types/chart';

interface ChartSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
}

const chartTypes: { type: ChartType; label: string; description: string; icon: string }[] = [
  {
    type: 'line',
    label: 'Line Chart',
    description: 'Best for showing trends over time or continuous data',
    icon: '📈',
  },
  {
    type: 'bar',
    label: 'Bar Chart',
    description: 'Best for comparing quantities across categories',
    icon: '📊',
  },
  {
    type: 'pie',
    label: 'Pie Chart',
    description: 'Best for showing proportions of a whole',
    icon: '🥧',
  },
  {
    type: 'scatter',
    label: 'Scatter Plot',
    description: 'Best for showing relationships between two variables',
    icon: '🎯',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export const ChartSelector: React.FC<ChartSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  return (
    <div className="p-6 space-y-6">
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Select Chart Type
      </motion.h3>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {chartTypes.map(({ type, label, description, icon }) => (
          <motion.button
            key={type}
            variants={itemVariants}
            onClick={() => onTypeChange(type)}
            className={`relative rounded-xl border-2 p-6 text-left transition-all duration-300 ${
              selectedType === type
                ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-[1.02]'
                : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{icon}</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{label}</h4>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              </div>
              {selectedType === type && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center"
                >
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}; 