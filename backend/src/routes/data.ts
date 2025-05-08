import { Router } from 'express';
import { DataService } from '../services/dataService';
import { VisualizationService } from '../services/visualizationService';
import { logger } from '../utils/logger';

const dataRouter = Router();
const dataService = DataService.getInstance();
const visualizationService = VisualizationService.getInstance();

dataRouter.get('/datasets', async (req, res) => {
  try {
    const datasets = await dataService.getDatasets();
    res.json(datasets);
  } catch (error) {
    logger.error('Error fetching datasets:', error);
    res.status(500).json({ error: 'Failed to fetch datasets' });
  }
});

dataRouter.get('/datasets/:id', async (req, res) => {
  try {
    const dataset = await dataService.getDatasetData(req.params.id);
    res.json(dataset);
  } catch (error) {
    logger.error('Error fetching dataset:', error);
    res.status(500).json({ error: 'Failed to fetch dataset' });
  }
});

dataRouter.post('/datasets', async (req, res) => {
  try {
    const { dataset, data } = req.body;
    await dataService.uploadDataset(dataset, data);
    res.json({ message: 'Dataset uploaded successfully' });
  } catch (error) {
    logger.error('Error uploading dataset:', error);
    res.status(500).json({ error: 'Failed to upload dataset' });
  }
});

dataRouter.delete('/datasets/:id', async (req, res) => {
  try {
    await dataService.deleteDataset(req.params.id);
    res.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    logger.error('Error deleting dataset:', error);
    res.status(500).json({ error: 'Failed to delete dataset' });
  }
});

dataRouter.get('/visualization/:datasetId', async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { type = 'line' } = req.query;
    
    const data = await dataService.getDatasetData(datasetId);
    const chartConfig = await visualizationService.generateChart(data, type as any, {
      title: `Visualization of ${datasetId}`,
    });
    
    res.json(chartConfig);
  } catch (error) {
    logger.error('Error generating visualization:', error);
    res.status(500).json({ error: 'Failed to generate visualization' });
  }
});

export { dataRouter }; 