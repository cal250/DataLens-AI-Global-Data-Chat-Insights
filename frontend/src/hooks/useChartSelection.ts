import { useState, useCallback } from 'react';

export type ChartType = 'line' | 'bar' | 'scatter' | 'pie' | 'area' | 'heatmap' | '3d';

interface ChartData {
  type: ChartType;
  data: any;
  options?: any;
}

export const useChartSelection = () => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('line');
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  const handleChartSelect = useCallback((type: ChartType) => {
    setSelectedChart(type);
    setShowChartSelector(false);
  }, []);

  const updateChartData = useCallback((data: any, options?: any) => {
    setChartData({
      type: selectedChart,
      data,
      options
    });
  }, [selectedChart]);

  return {
    selectedChart,
    showChartSelector,
    chartData,
    setShowChartSelector,
    handleChartSelect,
    updateChartData
  };
}; 