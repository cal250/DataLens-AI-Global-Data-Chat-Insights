import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const setupMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Log request
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Add response logging
  const originalSend = res.send;
  res.send = function (body) {
    logger.info(`Response ${res.statusCode}`, {
      path: req.path,
      method: req.method
    });
    return originalSend.call(this, body);
  };

  next();
}; 