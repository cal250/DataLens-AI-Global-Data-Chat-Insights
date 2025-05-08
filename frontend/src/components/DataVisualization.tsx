import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartType } from '../types/chart';

interface DataVisualizationProps {
  data: any[];
  type: ChartType;
  options?: any;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  type,
  options = {},
  onError,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGoogleCharts = async () => {
      try {
        setIsLoading(true);
        if (!window.google) {
          const script = document.createElement('script');
          script.src = 'https://www.gstatic.com/charts/loader.js';
          script.async = true;
          script.onload = () => {
            window.google.charts.load('current', { packages: ['corechart'] });
            window.google.charts.setOnLoadCallback(() => {
              drawChart();
              setIsLoading(false);
            });
          };
          document.body.appendChild(script);
        } else {
          drawChart();
          setIsLoading(false);
        }
      } catch (err) {
        const errorMessage = 'Failed to load Google Charts';
        setError(errorMessage);
        onError?.(errorMessage);
        setIsLoading(false);
      }
    };

    loadGoogleCharts();
  }, []);

  useEffect(() => {
    if (chart && data) {
      drawChart();
    }
  }, [data, type, options]);

  const drawChart = () => {
    try {
      if (!window.google || !chartRef.current) return;

      const chartData = new window.google.visualization.DataTable();
      
      // Add columns based on data structure
      if (data.length > 0) {
        const firstRow = data[0];
        if (Array.isArray(firstRow)) {
          // If data is already in array format with headers
          firstRow.forEach((header: string) => {
            chartData.addColumn(typeof header === 'number' ? 'number' : 'string', header);
          });
          data.slice(1).forEach((row: any[]) => {
            chartData.addRow(row);
          });
        } else {
          // If data is in object format
          const columns = Object.keys(firstRow);
          columns.forEach((column) => {
            const isNumeric = typeof firstRow[column] === 'number';
            chartData.addColumn(isNumeric ? 'number' : 'string', column);
          });
          data.forEach((row) => {
            chartData.addRow(columns.map((col) => row[col]));
          });
        }
      }

      const chartOptions = {
        ...options,
        width: '100%',
        height: 500,
        backgroundColor: 'transparent',
        chartArea: {
          ...options.chartArea,
          backgroundColor: 'transparent',
        },
        legend: {
          ...options.legend,
          textStyle: {
            color: '#4B5563',
            fontSize: 14,
          },
        },
        titleTextStyle: {
          color: '#1F2937',
          fontSize: 20,
          bold: true,
        },
        hAxis: {
          textStyle: {
            color: '#4B5563',
          },
        },
        vAxis: {
          textStyle: {
            color: '#4B5563',
          },
        },
      };

      let newChart;
      switch (type) {
        case 'line':
          newChart = new window.google.visualization.LineChart(chartRef.current);
          break;
        case 'bar':
          newChart = new window.google.visualization.BarChart(chartRef.current);
          break;
        case 'pie':
          newChart = new window.google.visualization.PieChart(chartRef.current);
          break;
        case 'scatter':
          newChart = new window.google.visualization.ScatterChart(chartRef.current);
          break;
        default:
          throw new Error(`Unsupported chart type: ${type}`);
      }

      newChart.draw(chartData, chartOptions);
      setChart(newChart);
      setError(null);
    } catch (err) {
      const errorMessage = `Failed to draw chart: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-[500px]"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-red-50 border-2 border-red-200 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div ref={chartRef} className="w-full h-[500px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 