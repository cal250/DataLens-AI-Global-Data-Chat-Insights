import { saveFile, readFile, listFiles, deleteFile } from '../config/storage';
import { logger } from '../utils/logger';

export interface Dataset {
  id: string;
  name: string;
  description: string;
  type: 'time-series' | 'tabular' | 'categorical';
  source: string;
  lastUpdated: string;
}

export class DataService {
  private static instance: DataService;

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public async getDatasets(): Promise<Dataset[]> {
    try {
      const files = await listFiles('datasets');
      const datasets: Dataset[] = [];
      
      for (const file of files) {
        const dataset = await readFile(`datasets/${file}`);
        datasets.push({
          ...dataset,
          id: file.replace('.json', ''),
          lastUpdated: dataset.metadata?.lastUpdated || new Date().toISOString(),
        });
      }

      return datasets;
    } catch (error) {
      logger.error('Error fetching datasets:', error);
      throw new Error('Failed to fetch datasets');
    }
  }

  public async getDatasetData(datasetId: string): Promise<any> {
    try {
      return await readFile(`datasets/${datasetId}.json`);
    } catch (error) {
      logger.error('Error fetching dataset data:', error);
      throw new Error('Failed to fetch dataset data');
    }
  }

  public async uploadDataset(dataset: Dataset, data: any): Promise<void> {
    try {
      const datasetData = {
        ...data,
        metadata: {
          ...data.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };
      
      await saveFile(`datasets/${dataset.id}.json`, datasetData);
      logger.info(`Dataset uploaded successfully: ${dataset.id}`);
    } catch (error) {
      logger.error('Error uploading dataset:', error);
      throw new Error('Failed to upload dataset');
    }
  }

  public async deleteDataset(datasetId: string): Promise<void> {
    try {
      await deleteFile(`datasets/${datasetId}.json`);
      logger.info(`Dataset deleted successfully: ${datasetId}`);
    } catch (error) {
      logger.error('Error deleting dataset:', error);
      throw new Error('Failed to delete dataset');
    }
  }
} 