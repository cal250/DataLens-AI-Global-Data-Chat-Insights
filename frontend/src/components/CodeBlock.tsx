import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, CodeBracketIcon, DocumentDuplicateIcon, PlayIcon } from '@heroicons/react/24/solid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  onClose: () => void;
  code?: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ onClose, code = '', language = 'typescript' }) => {
  const [copied, setCopied] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/analyze/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing code:', error);
      setAnalysis('Failed to analyze code. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <CodeBracketIcon className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Code Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-700">
              <span className="text-sm text-gray-300">{language}</span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <DocumentDuplicateIcon className="h-5 w-5" />
              </button>
            </div>
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0 0 0.5rem 0.5rem',
                padding: '1rem',
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleAnalyze}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlayIcon className="h-5 w-5" />
              <span>Analyze Code</span>
            </button>
          </div>

          {analysis && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Analysis Results</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{analysis}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 