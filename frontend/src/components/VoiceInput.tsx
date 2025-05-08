import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onQuery: (query: string) => void;
  isListening?: boolean;
  onListeningChange?: (isListening: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onQuery,
  isListening: externalIsListening,
  onListeningChange,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let recognition: any = null;

    if ('webkitSpeechRecognition' in window) {
      recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        onListeningChange?.(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        onListeningChange?.(false);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          onQuery(transcript);
          setTranscript('');
        }
      };

      recognition.onerror = (event: any) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
        onListeningChange?.(false);
      };
    } else {
      setError('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onQuery, onListeningChange]);

  const toggleListening = () => {
    if (isListening) {
      (window as any).webkitSpeechRecognition?.stop();
    } else {
      (window as any).webkitSpeechRecognition?.start();
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`relative p-4 rounded-full shadow-lg transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-indigo-500 hover:bg-indigo-600'
        }`}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        {isListening && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-full h-full bg-red-500 rounded-full"
            />
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-lg min-w-[200px]"
          >
            <p className="text-sm text-gray-700">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg"
        >
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}
    </div>
  );
}; 