import { Storage } from '@google-cloud/storage';
import { VertexAI } from '@google-cloud/vertexai';
import { logger } from '../utils/logger';

// Initialize Google Cloud Storage
export const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Initialize Vertex AI
export const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
});

// Bucket configuration
export const BUCKET_NAME = process.env.GOOGLE_CLOUD_BUCKET || 'datalens-data';

// Ensure bucket exists
export const initializeStorage = async () => {
  try {
    const [exists] = await storage.bucket(BUCKET_NAME).exists();
    if (!exists) {
      await storage.createBucket(BUCKET_NAME, {
        location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
        storageClass: 'STANDARD',
      });
      logger.info(`Created bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    logger.error('Error initializing Google Cloud Storage:', error);
    throw error;
  }
};

// Data visualization configuration
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  SCATTER: 'scatter',
} as const;

export type ChartType = typeof CHART_TYPES[keyof typeof CHART_TYPES];

// Vertex AI model configuration
export const MODEL_CONFIG = {
  model: 'gemini-pro',
  temperature: 0.7,
  maxOutputTokens: 1024,
  topP: 0.8,
  topK: 40,
}; 