import { DataService } from '../services/dataService';
import { initializeStorage } from '../config/storage';
import sampleDataset from '../data/sample-dataset.json';

async function uploadSampleData() {
  try {
    // Initialize storage
    await initializeStorage();

    // Get data service instance
    const dataService = DataService.getInstance();

    // Upload sample dataset
    await dataService.uploadDataset(
      {
        id: sampleDataset.id,
        name: sampleDataset.name,
        description: sampleDataset.description,
        type: sampleDataset.type as any,
        source: sampleDataset.source,
        lastUpdated: sampleDataset.metadata.lastUpdated,
      },
      sampleDataset.data
    );

    console.log('Sample dataset uploaded successfully');
  } catch (error) {
    console.error('Error uploading sample dataset:', error);
    process.exit(1);
  }
}

uploadSampleData(); 