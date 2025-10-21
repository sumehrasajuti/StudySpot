
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, MapPin, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

const StatsPanel = ({ buildings }) => {
  const totalRooms = buildings.reduce((sum, b) => sum + b.rooms.length, 0);
  const availableSpots = buildings.filter(b => b.status === 'green').length;
  const avgOccupancy = Math.round(
    buildings.reduce((sum, b) => sum + b.occupancy, 0) / buildings.length
  );

  const stats = [
    {
      icon: MapPin,
      label: 'Buildings',
      value: buildings.length,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      label: 'Total Rooms',
      value: totalRooms,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      label: 'Available',
      value: availableSpots,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Activity,
      label: 'Avg Occupancy',
      value: `${avgOccupancy}%`,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 p-4 hover:from-white/15 hover:to-white/10 transition-all">
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsPanel;
  