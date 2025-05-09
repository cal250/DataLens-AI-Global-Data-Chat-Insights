import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, CpuChipIcon, ServerIcon, CircleStackIcon } from '@heroicons/react/24/solid';

interface SystemStatusProps {
  onClose: () => void;
  status: {
    model: string;
    memory: number;
    cpu: number;
    uptime: number;
    requests: number;
  };
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ onClose, status }) => {
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
        className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">System Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CpuChipIcon className="h-5 w-5 text-blue-500" />
              <span className="text-white">Model Status</span>
            </div>
            <div className="text-gray-300">
              <p>Active Model: {status.model}</p>
              <p>Requests: {status.requests}</p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ServerIcon className="h-5 w-5 text-green-500" />
              <span className="text-white">System Resources</span>
            </div>
            <div className="text-gray-300">
              <p>CPU Usage: {status.cpu}%</p>
              <p>Memory Usage: {status.memory}%</p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CircleStackIcon className="h-5 w-5 text-purple-500" />
              <span className="text-white">Database Status</span>
            </div>
            <div className="text-gray-300">
              <p>Connected</p>
              <p>Uptime: {Math.floor(status.uptime / 3600)}h {Math.floor((status.uptime % 3600) / 60)}m</p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CpuChipIcon className="h-5 w-5 text-yellow-500" />
              <span className="text-white">Performance</span>
            </div>
            <div className="text-gray-300">
              <p>Response Time: ~200ms</p>
              <p>Active Connections: 1</p>
            </div>
          </div>
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