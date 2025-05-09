import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, CpuChipIcon, SparklesIcon, BeakerIcon } from '@heroicons/react/24/solid';

interface ModelSelectorProps {
  model: 'gpt4' | 'claude' | 'grok';
  onModelChange: (model: 'gpt4' | 'claude' | 'grok') => void;
}

const models = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    icon: SparklesIcon,
    color: 'text-blue-500'
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Balanced performance and efficiency',
    icon: BeakerIcon,
    color: 'text-purple-500'
  },
  {
    id: 'grok',
    name: 'Grok',
    description: 'Fast and efficient for quick responses',
    icon: CpuChipIcon,
    color: 'text-green-500'
  }
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({ model, onModelChange }) => {
  return (
    <div className="relative">
      <select
        value={model}
        onChange={(e) => onModelChange(e.target.value as 'gpt4' | 'claude' | 'grok')}
        className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <XMarkIcon className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}; 