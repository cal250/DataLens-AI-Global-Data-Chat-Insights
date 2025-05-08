import { Router } from 'express';
import { logger } from '../utils/logger';
import { ChatController } from '../controllers/chatController';

export const chatRouter = Router();
const chatController = new ChatController();

chatRouter.post('/query', (req, res) => chatController.processQuery(req, res));

chatRouter.post('/clear-history', (req, res) => chatController.clearHistory(req, res)); 