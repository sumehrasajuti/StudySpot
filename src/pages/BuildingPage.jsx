
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Wifi, Zap, Volume2, UserCheck, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReportOccupancyModal from '@/components/ReportOccupancyModal';

const statusInfo = {
  green: { text: 'Plenty of Space', color: 'text-green-600', dot: 'bg-green-500', progress: 'bg-green-500' },
  yellow: { text: 'Some Space', color: 'text-yellow-600', dot: 'bg-yellow-500', progress: 'bg-yellow-500' },
  red: { text: 'Crowded / Full', color: 'text-red-600', dot: 'bg-red-500', progress: 'bg-red-500' },
  grey: { text: 'Closed', color: 'text-gray-600', dot: 'bg-gray-500', progress: 'bg-gray-500' },
};

const tagIcons = {
  wifi: <Wifi className="w-3 h-3" />,
  outlets: <Zap className="w-3 h-3" />,
  quiet: <Volume2 className="w-3 h-3" />,
  'group study': <Users className="w-3 h-3" />,
  computers: <UserCheck className="w-3 h-3" />,
  whiteboard: <HelpCircle className="w-3 h-3" />,
  silent: <Volume2 className="w-3 h-3" />,
};

const BuildingPage = ({ buildings, onUpdateRoomOccupancy }) => {
  const { buildingId } = useParams();
  const building = buildings.find(b => b.id === buildingId);
  const [reportingRoom, setReportingRoom] = useState(null);

  if (!building) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold">Building not found</h2>
        <Link to="/" className="text-blue-600">Go back home</Link>
      </div>
    );
  }

  const buildingStatus = statusInfo[building.status];

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  return (
    <>
      <Helmet>
        <title>{building.name} - StudySpot</title>
      </Helmet>
      <div className="p-4">
        <header className="flex items-center gap-4 mb-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{building.name}</h1>
            <p className="text-sm text-gray-500">Open until {building.openUntil}</p>
          </div>
        </header>

        <Card className="p-4 mb-6">
          <p className="text-gray-700 mb-4">{building.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {building.rooms.length} study spaces</span>
            <span className={`flex items-center gap-2 font-medium ${buildingStatus.color}`}>
              <div className={`w-2 h-2 rounded-full ${buildingStatus.dot}`}></div>
              {buildingStatus.text}
            </span>
          </div>
        </Card>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Study Spaces</h2>
          <div className="space-y-4">
            {building.rooms.map(room => {
              const occupancy = Math.round((room.occupied / room.capacity) * 100);
              const roomStatus = statusInfo[room.status];
              return (
                <Card key={room.id} className="p-4 bg-gray-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${roomStatus.dot}`}></span>
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-500">Floor {room.floor} &bull; Capacity: {room.capacity}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${roomStatus.color}`}>{occupancy}%</p>
                      <p className="text-xs text-gray-500 -mt-1">occupied</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                    <motion.div
                      className={`h-1.5 rounded-full ${roomStatus.progress}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${occupancy}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      {room.tags.map(tag => (
                        <div key={tag} className="flex items-center gap-1.5 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {tagIcons[tag]}
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                   <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-400">Updated {formatTime(room.lastUpdated)}</p>
                    <Button size="sm" onClick={() => setReportingRoom(room)}>Report Status</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
      {reportingRoom && (
        <ReportOccupancyModal
          room={reportingRoom}
          buildingId={building.id}
          onClose={() => setReportingRoom(null)}
          onReport={onUpdateRoomOccupancy}
        />
      )}
    </>
  );
};

export default BuildingPage;
