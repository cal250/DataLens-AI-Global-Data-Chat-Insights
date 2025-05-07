import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChartType } from '../../backend/src/config/googleCloud';

interface DataVisualizationProps {
  data: any[];
  type: ChartType;
  options?: {
    title?: string;
    [key: string]: any;
  };
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
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    // Load Google Charts
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.async = true;
    script.onload = () => {
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(drawChart);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.google && window.google.charts) {
      drawChart();
    }
  }, [data, type, options]);

  const drawChart = () => {
    if (!chartRef.current) return;

    const chartData = window.google.visualization.arrayToDataTable(data);
    const chartOptions = {
      title: options.title || 'Data Visualization',
      ...options,
    };

    if (chartInstance.current) {
      chartInstance.current.clearChart();
    }

    switch (type) {
      case 'line':
        chartInstance.current = new window.google.visualization.LineChart(chartRef.current);
        break;
      case 'bar':
        chartInstance.current = new window.google.visualization.BarChart(chartRef.current);
        break;
      case 'pie':
        chartInstance.current = new window.google.visualization.PieChart(chartRef.current);
        break;
      case 'scatter':
        chartInstance.current = new window.google.visualization.ScatterChart(chartRef.current);
        break;
      default:
        console.error(`Unsupported chart type: ${type}`);
        return;
    }

    chartInstance.current.draw(chartData, chartOptions);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-4"
    >
      <div ref={chartRef} className="w-full h-[400px]" />
    </motion.div>
  );
}; 