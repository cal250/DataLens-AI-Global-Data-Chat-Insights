import { Router } from 'express';
import { logger } from '../utils/logger';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Implement proper authentication
    logger.info('Login attempt', { email });
    
    // Temporary mock response
    res.json({
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email,
        name: 'Test User'
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // TODO: Implement user registration
    logger.info('Registration attempt', { email });
    
    // Temporary mock response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: '1',
        email,
        name
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
}); 