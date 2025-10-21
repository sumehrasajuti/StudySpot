
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, MapPin, Clock, TrendingUp, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const BuildingDetails = ({ building, onClose, onUpdateOccupancy }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'green': return 'from-green-500 to-emerald-600';
      case 'yellow': return 'from-yellow-500 to-orange-600';
      case 'red': return 'from-red-500 to-rose-600';
      case 'grey': return 'from-gray-500 to-slate-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'green': return 'Plenty of Space';
      case 'yellow': return 'Half Full';
      case 'red': return 'Nearly Full';
      case 'grey': return 'Closed';
      default: return 'Unknown';
    }
  };

  const handleOccupancyChange = (roomId, change) => {
    const room = building.rooms.find(r => r.id === roomId);
    if (!room) return;

    const newOccupancy = Math.max(0, Math.min(room.capacity, room.occupied + change));
    onUpdateOccupancy(building.id, roomId, newOccupancy);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-hidden"
    >
      <Card className="h-full bg-gradient-to-br from-indigo-600/40 to-purple-600/40 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className={`bg-gradient-to-r ${getStatusColor(building.status)} p-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">{building.name}</h2>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Updated {formatTime(building.lastUpdated)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span className="text-xs text-white/80 font-medium">Occupancy</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{building.occupancy}%</div>
                </div>
                <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-white" />
                    <span className="text-xs text-white/80 font-medium">Status</span>
                  </div>
                  <div className="text-sm font-bold text-white">{getStatusText(building.status)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Rooms & Spaces
            </h3>
            
            {building.rooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{room.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Users className="w-3 h-3" />
                        <span>{room.occupied} / {room.capacity} people</span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getStatusColor(room.status)}`}></div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getStatusColor(room.status)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    {room.status !== 'grey' && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOccupancyChange(room.id, -1)}
                          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Minus className="w-4 h-4 mr-1" />
                          Less People
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOccupancyChange(room.id, 1)}
                          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          More People
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BuildingDetails;
  