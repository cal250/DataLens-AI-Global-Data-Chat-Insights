import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

// Storage configuration
const STORAGE_DIR = path.join(process.cwd(), 'storage');
const DATASETS_DIR = path.join(STORAGE_DIR, 'datasets');
const CHARTS_DIR = path.join(STORAGE_DIR, 'charts');

// Ensure storage directories exist
export const initializeStorage = async () => {
  try {
    [STORAGE_DIR, DATASETS_DIR, CHARTS_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.info(`Created directory: ${dir}`);
      }
    });
  } catch (error) {
    logger.error('Error initializing storage:', error);
    throw error;
  }
};

// Storage helper functions
export const saveFile = async (filePath: string, data: any): Promise<void> => {
  try {
    const fullPath = path.join(STORAGE_DIR, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await fs.promises.writeFile(fullPath, JSON.stringify(data, null, 2));
    logger.info(`File saved successfully: ${filePath}`);
  } catch (error) {
    logger.error('Error saving file:', error);
    throw error;
  }
};

export const readFile = async (filePath: string): Promise<any> => {
  try {
    const fullPath = path.join(STORAGE_DIR, filePath);
    const content = await fs.promises.readFile(fullPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    logger.error('Error reading file:', error);
    throw error;
  }
};

export const listFiles = async (dirPath: string): Promise<string[]> => {
  try {
    const fullPath = path.join(STORAGE_DIR, dirPath);
    const files = await fs.promises.readdir(fullPath);
    return files.filter(file => file.endsWith('.json'));
  } catch (error) {
    logger.error('Error listing files:', error);
    throw error;
  }
};

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fullPath = path.join(STORAGE_DIR, filePath);
    await fs.promises.unlink(fullPath);
    logger.info(`File deleted successfully: ${filePath}`);
  } catch (error) {
    logger.error('Error deleting file:', error);
    throw error;
  }
}; 