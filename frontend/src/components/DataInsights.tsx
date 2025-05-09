import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, ChartBarIcon, BeakerIcon, LightBulbIcon } from '@heroicons/react/24/solid';

interface DataInsightsProps {
  onClose: () => void;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'prediction';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

export const DataInsights: React.FC<DataInsightsProps> = ({ onClose }) => {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const insights: Insight[] = [
    {
      id: '1',
      title: 'Rising Trend in User Engagement',
      description: 'User engagement has increased by 25% over the last 30 days, with peak activity during evening hours.',
      type: 'trend',
      confidence: 0.92,
      impact: 'high'
    },
    {
      id: '2',
      title: 'Unusual Pattern Detected',
      description: 'Anomaly detected in system response times during peak hours. Investigation recommended.',
      type: 'anomaly',
      confidence: 0.85,
      impact: 'medium'
    },
    {
      id: '3',
      title: 'Strong Correlation Found',
      description: 'Positive correlation between user satisfaction and response time (r = 0.78).',
      type: 'correlation',
      confidence: 0.88,
      impact: 'high'
    },
    {
      id: '4',
      title: 'Future Growth Prediction',
      description: 'Based on current trends, user base is predicted to grow by 40% in the next quarter.',
      type: 'prediction',
      confidence: 0.75,
      impact: 'medium'
    }
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:3000/api/analyze/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to analyze data');
      }

      const data = await response.json();
      // Handle new insights
    } catch (error) {
      console.error('Error analyzing data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

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
          <div className="flex items-center space-x-2">
            <LightBulbIcon className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Data Insights</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <button
                key={insight.id}
                onClick={() => setSelectedInsight(insight)}
                className={`bg-gray-700 rounded-lg p-4 text-left hover:bg-gray-600 transition-colors ${
                  selectedInsight?.id === insight.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                    <p className="text-gray-400 text-sm">{insight.description}</p>
                  </div>
                  <span className={`text-sm font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact.toUpperCase()}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Confidence: {Math.round(insight.confidence * 100)}%
                  </span>
                  <span className="text-sm text-gray-400">
                    Type: {insight.type}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <BeakerIcon className="h-5 w-5" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Data'}</span>
            </button>
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