import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DataVisualizationProps {
  datasetId?: string;
  type?: 'line' | 'bar';
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  datasetId = '1',
  type = 'line',
}) => {
  const [data, setData] = useState<ChartData<'line' | 'bar'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/data/visualization/${datasetId}?type=${type}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch visualization data');
        }

        const visualizationData = await response.json();
        setData(visualizationData);
      } catch (err) {
        setError('Failed to load visualization data');
        console.error('Error fetching visualization:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [datasetId, type]);

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter',
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Data Visualization',
        font: {
          family: 'Inter',
          size: 18,
          weight: 600,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter',
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter',
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full min-h-[300px] p-6 bg-white rounded-2xl shadow-lg flex items-center justify-center"
      >
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full min-h-[300px] p-6 bg-white rounded-2xl shadow-lg flex items-center justify-center text-red-500"
      >
        {error}
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full min-h-[300px] p-6 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-500"
      >
        No data available
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full min-h-[300px] p-6 bg-white rounded-2xl shadow-lg"
    >
      {type === 'line' ? (
        <Line data={data as ChartData<'line'>} options={options} />
      ) : (
        <Bar data={data as ChartData<'bar'>} options={options} />
      )}
    </motion.div>
  );
}; 