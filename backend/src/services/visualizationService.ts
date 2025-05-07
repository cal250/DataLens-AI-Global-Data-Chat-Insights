import { storage, BUCKET_NAME, CHART_TYPES, ChartType } from '../config/googleCloud';
import { logger } from '../utils/logger';

export interface ChartData {
  type: ChartType;
  data: any[];
  options: {
    title: string;
    [key: string]: any;
  };
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
      // Process data based on chart type
      const processedData = this.processDataForChart(data, type);
      
      // Generate chart configuration
      const chartConfig = {
        type,
        data: processedData,
        options: {
          title: options.title || 'Data Visualization',
          ...options,
        },
      };

      // Store chart configuration in Google Cloud Storage
      await this.storeChartConfig(chartConfig);

      return chartConfig;
    } catch (error) {
      logger.error('Error generating chart:', error);
      throw new Error('Failed to generate chart');
    }
  }

  private processDataForChart(data: any[], type: ChartType): any[] {
    switch (type) {
      case CHART_TYPES.LINE:
        return this.processLineChartData(data);
      case CHART_TYPES.BAR:
        return this.processBarChartData(data);
      case CHART_TYPES.PIE:
        return this.processPieChartData(data);
      case CHART_TYPES.SCATTER:
        return this.processScatterChartData(data);
      default:
        throw new Error(`Unsupported chart type: ${type}`);
    }
  }

  private processLineChartData(data: any[]): any[] {
    // Implement line chart data processing
    return data;
  }

  private processBarChartData(data: any[]): any[] {
    // Implement bar chart data processing
    return data;
  }

  private processPieChartData(data: any[]): any[] {
    // Implement pie chart data processing
    return data;
  }

  private processScatterChartData(data: any[]): any[] {
    // Implement scatter chart data processing
    return data;
  }

  private async storeChartConfig(chartConfig: ChartData): Promise<void> {
    try {
      const bucket = storage.bucket(BUCKET_NAME);
      const file = bucket.file(`charts/${Date.now()}.json`);
      
      await file.save(JSON.stringify(chartConfig), {
        contentType: 'application/json',
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
      const bucket = storage.bucket(BUCKET_NAME);
      const file = bucket.file(`charts/${chartId}.json`);
      
      const [content] = await file.download();
      return JSON.parse(content.toString());
    } catch (error) {
      logger.error('Error retrieving chart configuration:', error);
      throw error;
    }
  }
} 