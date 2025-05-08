import { saveFile, readFile } from '../config/storage';
import { logger } from '../utils/logger';

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter';

export interface ChartData {
  type: ChartType;
  data: any[];
  options: {
    title: string;
    [key: string]: any;
  };
}

interface DataPoint {
  x: number | string;
  y: number;
  label?: string;
}

export class VisualizationService {
  private static instance: VisualizationService;

  private constructor() {}

  public static getInstance(): VisualizationService {
    if (!VisualizationService.instance) {
      VisualizationService.instance = new VisualizationService();
    }
    return VisualizationService.instance;
  }

  public async generateChart(data: any[], type: ChartType, options: any): Promise<ChartData> {
    try {
      // Validate input data
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data format: data must be a non-empty array');
      }

      // Process data based on chart type
      const processedData = this.processDataForChart(data, type);
      
      // Generate chart configuration
      const chartConfig = {
        type,
        data: processedData,
        options: {
          title: options.title || 'Data Visualization',
          ...this.getDefaultOptions(type),
          ...options,
        },
      };

      // Store chart configuration
      await this.storeChartConfig(chartConfig);

      return chartConfig;
    } catch (error) {
      logger.error('Error generating chart:', error);
      throw new Error('Failed to generate chart');
    }
  }

  private processDataForChart(data: any[], type: ChartType): any[] {
    switch (type) {
      case 'line':
        return this.processLineChartData(data);
      case 'bar':
        return this.processBarChartData(data);
      case 'pie':
        return this.processPieChartData(data);
      case 'scatter':
        return this.processScatterChartData(data);
      default:
        throw new Error(`Unsupported chart type: ${type}`);
    }
  }

  private processLineChartData(data: any[]): any[] {
    // Expect data in format: [{ x: number|string, y: number, label?: string }]
    const processedData = data.map((point: DataPoint) => {
      if (typeof point.x === 'undefined' || typeof point.y === 'undefined') {
        throw new Error('Invalid data point: missing x or y value');
      }
      return [point.x, point.y, point.label || ''];
    });

    // Add header row
    return [['X', 'Y', 'Label'], ...processedData];
  }

  private processBarChartData(data: any[]): any[] {
    // Expect data in format: [{ category: string, value: number }]
    const processedData = data.map((item: { category: string; value: number }) => {
      if (typeof item.category === 'undefined' || typeof item.value === 'undefined') {
        throw new Error('Invalid data point: missing category or value');
      }
      return [item.category, item.value];
    });

    // Add header row
    return [['Category', 'Value'], ...processedData];
  }

  private processPieChartData(data: any[]): any[] {
    // Expect data in format: [{ label: string, value: number }]
    const processedData = data.map((item: { label: string; value: number }) => {
      if (typeof item.label === 'undefined' || typeof item.value === 'undefined') {
        throw new Error('Invalid data point: missing label or value');
      }
      return [item.label, item.value];
    });

    // Add header row
    return [['Label', 'Value'], ...processedData];
  }

  private processScatterChartData(data: any[]): any[] {
    // Expect data in format: [{ x: number, y: number, label?: string }]
    const processedData = data.map((point: DataPoint) => {
      if (typeof point.x !== 'number' || typeof point.y !== 'number') {
        throw new Error('Invalid data point: x and y must be numbers for scatter plot');
      }
      return [point.x, point.y, point.label || ''];
    });

    // Add header row
    return [['X', 'Y', 'Label'], ...processedData];
  }

  private getDefaultOptions(type: ChartType): any {
    const commonOptions = {
      legend: { position: 'bottom' },
      chartArea: { width: '80%', height: '70%' },
      fontSize: 12,
      colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'],
    };

    switch (type) {
      case 'line':
        return {
          ...commonOptions,
          curveType: 'function',
          pointSize: 5,
          lineWidth: 2,
        };
      case 'bar':
        return {
          ...commonOptions,
          bars: 'vertical',
          bar: { groupWidth: '75%' },
        };
      case 'pie':
        return {
          ...commonOptions,
          pieHole: 0.4,
          is3D: true,
        };
      case 'scatter':
        return {
          ...commonOptions,
          pointSize: 8,
          trendlines: { 0: { type: 'linear' } },
        };
      default:
        return commonOptions;
    }
  }

  private async storeChartConfig(chartConfig: ChartData): Promise<void> {
    try {
      const chartId = Date.now().toString();
      await saveFile(`charts/${chartId}.json`, {
        ...chartConfig,
        metadata: {
          chartType: chartConfig.type,
          timestamp: new Date().toISOString(),
        },
      });
      logger.info('Chart configuration stored successfully');
    } catch (error) {
      logger.error('Error storing chart configuration:', error);
      throw error;
    }
  }

  public async getChartConfig(chartId: string): Promise<ChartData> {
    try {
      return await readFile(`charts/${chartId}.json`);
    } catch (error) {
      logger.error('Error retrieving chart configuration:', error);
      throw error;
    }
  }
} 