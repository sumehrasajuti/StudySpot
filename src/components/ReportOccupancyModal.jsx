
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const occupancyLevels = [
  { level: 'Empty', description: 'Lots of available seats', value: 0.1, icon: <CheckCircle className="text-green-600"/>, color: 'bg-green-100/50 text-green-800 border-green-200 hover:bg-green-100' },
  { level: 'Some Space', description: 'Plenty of room available', value: 0.4, icon: <CheckCircle className="text-green-600"/>, color: 'bg-green-100/50 text-green-800 border-green-200 hover:bg-green-100' },
  { level: 'Crowded', description: 'Limited seats available', value: 0.7, icon: <AlertTriangle className="text-yellow-600"/>, color: 'bg-yellow-100/50 text-yellow-800 border-yellow-200 hover:bg-yellow-100' },
  { level: 'Packed', description: 'No seats available', value: 0.95, icon: <XCircle className="text-red-600"/>, color: 'bg-red-100/50 text-red-800 border-red-200 hover:bg-red-100' },
];

const ReportOccupancyModal = ({ room, buildingId, onClose, onReport }) => {

  const handleReport = (value) => {
    onReport(buildingId, room.id, value);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Report Occupancy</h2>
              <p className="text-gray-600 font-medium">{room.name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">Help others by reporting current conditions.</p>

          <div className="space-y-3">
            {occupancyLevels.map((level, index) => (
              <motion.button
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleReport(level.value)}
                className={`w-full text-left p-4 rounded-lg border flex items-center gap-4 transition-all ${level.color}`}
              >
                <div className="text-2xl">{level.icon}</div>
                <div>
                  <h3 className="font-bold">{level.level}</h3>
                  <p className="text-sm">{level.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportOccupancyModal;
