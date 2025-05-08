import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { ChartSelector } from '../components/ChartSelector';
import { DataVisualization } from '../components/DataVisualization';
import { VisualizationModal } from '../components/VisualizationModal';
import { ChartType } from '../types/chart';

// Sample data for demonstration
const sampleData = {
  line: [
    { x: 'Jan', y: 10, label: 'January' },
    { x: 'Feb', y: 20, label: 'February' },
    { x: 'Mar', y: 15, label: 'March' },
    { x: 'Apr', y: 25, label: 'April' },
    { x: 'May', y: 30, label: 'May' },
  ],
  bar: [
    { category: 'Category A', value: 30 },
    { category: 'Category B', value: 45 },
    { category: 'Category C', value: 25 },
    { category: 'Category D', value: 60 },
  ],
  pie: [
    { label: 'Product A', value: 40 },
    { label: 'Product B', value: 30 },
    { label: 'Product C', value: 20 },
    { label: 'Product D', value: 10 },
  ],
  scatter: [
    { x: 1, y: 5, label: 'Point 1' },
    { x: 2, y: 8, label: 'Point 2' },
    { x: 3, y: 12, label: 'Point 3' },
    { x: 4, y: 15, label: 'Point 4' },
    { x: 5, y: 20, label: 'Point 5' },
  ],
};

export const DataVisualizationPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ChartType>('line');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Interactive Data Visualization
            </h1>
            <p className="text-lg text-gray-600">
              Select a chart type and explore your data with beautiful visualizations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <ChartSelector
                selectedType={selectedType}
                onTypeChange={setSelectedType}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="relative group">
                <DataVisualization
                  data={sampleData[selectedType]}
                  type={selectedType}
                  options={{
                    title: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart Example`,
                  }}
                  onError={setError}
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <VisualizationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={sampleData[selectedType]}
            type={selectedType}
            title={`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart - Full View`}
            onError={setError}
          />
        </div>
      </div>
    </Layout>
  );
}; 