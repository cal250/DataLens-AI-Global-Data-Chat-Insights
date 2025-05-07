import OpenAI from 'openai';
import { logger } from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatResponse {
  response: string;
  suggestedQuestions: string[];
}

export class AIService {
  private static instance: AIService;
  private readonly systemPrompt = `You are DataLens AI, an expert data analyst assistant. Your role is to:
1. Help users understand and analyze data
2. Provide clear, concise explanations
3. Suggest relevant follow-up questions
4. Maintain a professional and helpful tone
5. Focus on data-driven insights and analysis

When responding:
- Be specific and data-focused
- Use clear, technical language when appropriate
- Suggest relevant visualizations when applicable
- Provide context for your suggestions
- Keep responses concise but informative`;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async processQuery(query: string, history: Array<{ role: string; content: string }>): Promise<ChatResponse> {
    try {
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...history,
        { role: 'user', content: query }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

      // Generate follow-up questions
      const followUpCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Generate 3 relevant follow-up questions based on the previous response. Keep them concise and data-focused.' },
          { role: 'user', content: `Based on this response: "${response}", suggest 3 follow-up questions.` }
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const followUpText = followUpCompletion.choices[0]?.message?.content || '';
      const suggestedQuestions = followUpText
        .split('\n')
        .map(q => q.replace(/^\d+\.\s*/, '').trim())
        .filter(q => q.length > 0)
        .slice(0, 3);

      return {
        response,
        suggestedQuestions,
      };
    } catch (error) {
      logger.error('Error processing AI query:', error);
      throw new Error('Failed to process query with AI service');
    }
  }
} 