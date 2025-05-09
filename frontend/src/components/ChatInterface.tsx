import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MicrophoneIcon, 
  PaperAirplaneIcon, 
  CpuChipIcon, 
  CommandLineIcon, 
  ChartBarIcon, 
  CogIcon,
  BeakerIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

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

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'ollama' | 'vertex'>('ollama');
  const [showTechnicalPanel, setShowTechnicalPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'analysis'>('chat');
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setShowChat(true);
    const userMessage: Message = { 
      role: 'user', 
      content: input,
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          history: messages,
          model: selectedModel,
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
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        type: 'text'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex">
      {/* Left Sidebar - Technical Tools */}
      <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`p-3 rounded-lg mb-4 ${activeTab === 'chat' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
        >
          <SparklesIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`p-3 rounded-lg mb-4 ${activeTab === 'code' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
        >
          <CodeBracketIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`p-3 rounded-lg mb-4 ${activeTab === 'analysis' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
        >
          <BeakerIcon className="h-6 w-6" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowTechnicalPanel(!showTechnicalPanel)}
          className={`p-3 rounded-lg ${showTechnicalPanel ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
        >
          <CogIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-black">
        {/* Header */}
        <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <RocketLaunchIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-white">DataLens AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as 'ollama' | 'vertex')}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ollama">Ollama</option>
              <option value="vertex">Vertex AI</option>
            </select>
          </div>
        </div>

        {/* Messages Area */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600'
                        : message.role === 'system'
                        ? 'bg-gray-800'
                        : 'bg-gray-900'
                    }`}
                  >
                    <div className="prose prose-invert max-w-none">
                      {message.content}
                    </div>
                    {message.metadata && (
                      <div className="mt-2 text-xs text-gray-400 flex items-center space-x-4">
                        <span>Model: {message.metadata.model}</span>
                        <span>Confidence: {message.metadata.confidence}%</span>
                        <span>Time: {message.metadata.processingTime}ms</span>
                        <span>Tokens: {message.metadata.tokens}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area - Now at the bottom */}
        <div className="fixed bottom-0 left-16 right-0 p-6 bg-gray-900 border-t border-gray-800">
          <form onSubmit={handleSubmit} className="flex space-x-4 max-w-7xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="w-full p-4 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="p-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>

      {/* Technical Panel */}
      <AnimatePresence>
        {showTechnicalPanel && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 400 }}
            exit={{ width: 0 }}
            className="bg-gray-900 border-l border-gray-800 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Technical Panel</h2>
                <button
                  onClick={() => setShowTechnicalPanel(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">System Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>CPU Usage</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Memory Usage</span>
                      <span>2.3GB</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>GPU Usage</span>
                      <span>78%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Model Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Response Time</span>
                      <span>245ms</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Token Rate</span>
                      <span>120/s</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Context Length</span>
                      <span>8K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 