import { Express } from 'express';
import { chatRouter } from './chat';
import { dataRouter } from './data';
import { authRouter } from './auth';

export const setupRoutes = (app: Express) => {
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API routes
  app.use('/api/chat', chatRouter);
  app.use('/api/data', dataRouter);
  app.use('/api/auth', authRouter);
}; 