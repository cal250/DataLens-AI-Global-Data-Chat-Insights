import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChatInterface } from './components/ChatInterface'
import { DataVisualization } from './components/DataVisualization'
import './App.css'

function App() {
  const [selectedDataset, setSelectedDataset] = useState<string>('1')
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900"
          >
            DataLens AI – Global Data Chat & Insights
          </motion.h1>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white shadow-lg rounded-2xl overflow-hidden"
          >
            <ChatInterface />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white shadow-lg rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Data Visualization</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded-lg ${
                    chartType === 'line'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 rounded-lg ${
                    chartType === 'bar'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
            <DataVisualization datasetId={selectedDataset} type={chartType} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

export default App
