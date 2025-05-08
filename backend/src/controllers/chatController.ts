import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { AIService } from '../services/aiService';

export class ChatController {
  private aiService: AIService;
  private chatHistory: Map<string, Array<{ role: string; content: string }>>;

  constructor() {
    this.aiService = AIService.getInstance();
    this.chatHistory = new Map();
  }

  public async processQuery(req: Request, res: Response): Promise<void> {
    try {
      const { query, sessionId = 'default', model = 'ollama' } = req.body;
      console.log('Received request:', { query, sessionId, model });

      if (!query) {
        res.status(400).json({ error: 'Query is required' });
        return;
      }

      // logger.info('Processing chat query', { query, model, timestamp: new Date().toISOString() });

      // Get or initialize chat history for this session
      if (!this.chatHistory.has(sessionId)) {
        this.chatHistory.set(sessionId, []);
      }
      const history = this.chatHistory.get(sessionId)!;

      // Process query with AI service
      const result = await this.aiService.processQuery(query, history, model);

      // Update chat history
      history.push({ role: 'user', content: query });
      history.push({ role: 'assistant', content: result.response });

      // Keep only last 10 messages to manage context window
      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }

      res.json({
        response: result.response,
        suggestedQuestions: result.suggestedQuestions,
        model: result.model,
      });

      // logger.info('Response sent', {
      //   method: req.method,
      //   path: req.path,
      //   model: result.model,
      //   timestamp: new Date().toISOString(),
      // });
    } catch (error) {
      logger.error('Error processing chat query:', error);
      res.status(500).json({ error: 'Failed to process query' });
    }
  }

  public clearHistory(req: Request, res: Response): void {
    const { sessionId = 'default' } = req.body;
    this.chatHistory.delete(sessionId);
    res.json({ message: 'Chat history cleared' });
  }
} 