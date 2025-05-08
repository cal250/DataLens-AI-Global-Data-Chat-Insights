import { Ollama } from 'ollama-node';
import { vertexAI, MODEL_CONFIG } from '../config/googleCloud';
import { logger } from '../utils/logger';

const ollama = new Ollama();

export interface ChatResponse {
  response: string;
  suggestedQuestions: string[];
  model: 'ollama' | 'vertex';
}

interface Message {
  role: string;
  content: string;
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

  private getVertexAIResponse(result: any): string {
    const text = result.response.candidates[0]?.content.parts[0]?.text;
    if (!text) {
      throw new Error('Failed to get response from Vertex AI');
    }
    return text;
  }

  public async processQuery(query: string, history: Array<Message>, model: 'ollama' | 'vertex' = 'ollama'): Promise<ChatResponse> {
    try {
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...history,
        { role: 'user', content: query }
      ];

      let response: string;
      if (model === 'ollama') {
        const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        const completion = await ollama.generate(prompt);
        response = completion.output || 'I apologize, but I could not generate a response.';
      } else {
        // Use Vertex AI
        const model = vertexAI.preview.getGenerativeModel(MODEL_CONFIG);
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: query }] }],
        });
        response = this.getVertexAIResponse(result);
      }

      // Generate follow-up questions using the same model
      const followUpPrompt = `System: Generate 3 relevant follow-up questions based on the previous response. Keep them concise and data-focused.\nUser: Based on this response: "${response}", suggest 3 follow-up questions.`;
      
      let followUpText: string;
      if (model === 'ollama') {
        const followUpCompletion = await ollama.generate(followUpPrompt);
        followUpText = followUpCompletion.output || '';
      } else {
        const model = vertexAI.preview.getGenerativeModel(MODEL_CONFIG);
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: followUpPrompt }] }],
        });
        followUpText = this.getVertexAIResponse(result);
      }

      const suggestedQuestions = followUpText
        .split('\n')
        .map((q: string) => q.replace(/^\d+\.\s*/, '').trim())
        .filter((q: string) => q.length > 0)
        .slice(0, 3);

      return {
        response,
        suggestedQuestions,
        model,
      };
    } catch (error) {
      logger.error('Error processing AI query:', error);
      throw new Error('Failed to process query with AI service');
    }
  }
} 