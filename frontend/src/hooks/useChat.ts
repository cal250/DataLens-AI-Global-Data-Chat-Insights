import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'code' | 'chart' | 'analysis';
  metadata?: {
    model?: string;
    confidence?: number;
    processingTime?: number;
    tokens?: number;
  };
}

interface SystemStatus {
  model: string;
  memory: number;
  cpu: number;
  uptime: number;
  requests: number;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<'gpt4' | 'claude' | 'grok'>('gpt4');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    model: 'gpt4',
    memory: 45,
    cpu: 30,
    uptime: 3600,
    requests: 0
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content,
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: content,
          history: messages,
          model,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        type: data.type || 'text',
        metadata: {
          model: data.model,
          confidence: data.confidence,
          processingTime: data.processingTime,
          tokens: data.tokens
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSystemStatus(prev => ({
        ...prev,
        requests: prev.requests + 1,
        memory: Math.min(100, prev.memory + 5),
        cpu: Math.min(100, prev.cpu + 10)
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        type: 'text'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, model, isLoading]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    clearHistory,
    isLoading,
    error,
    model,
    setModel,
    systemStatus
  };
}; 