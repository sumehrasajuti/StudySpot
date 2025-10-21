
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Wifi, Zap, Volume2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import MapBackground from "@/components/MapBackground";


const statusInfo = {
  green: { text: 'Plenty of Space', color: 'text-green-600', dot: 'bg-green-500' },
  yellow: { text: 'Half Full', color: 'text-yellow-600', dot: 'bg-yellow-500' },
  red: { text: 'Packed', color: 'text-red-600', dot: 'bg-red-500' },
  grey: { text: 'Closed', color: 'text-gray-600', dot: 'bg-gray-500' },
};

const buildingPositions = {
    'aq': { x: '50%', y: '40%' },
    'wac-bennett-library': { x: '30%', y: '60%' },
    'tsc1': { x: '70%', y: '60%' },
    'sub': { x: '40%', y: '20%' },
    'rcb': { x: '60%', y: '80%' }
};


const BubbleMap = ({ buildings }) => {
    return (
        <div className="relative w-full h-64 my-4">
            {buildings.map((building, i) => {
                const pos = buildingPositions[building.id] || { x: '50%', y: '50%' };
                const size = 60 + building.rooms.length * 10;
                const colorClass = {
                    green: 'bg-green-400/80 border-green-500/90',
                    yellow: 'bg-yellow-400/80 border-yellow-500/90',
                    red: 'bg-red-400/80 border-red-500/90',
                    grey: 'bg-gray-400/80 border-gray-500/90'
                }[building.status];

                return (
                    <motion.div
                        key={building.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                        className={`absolute flex flex-col items-center justify-center rounded-full text-white shadow-lg ${colorClass} border-2 backdrop-blur-sm`}
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            top: pos.y,
                            left: pos.x,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <span className="font-bold text-sm">{building.id.toUpperCase()}</span>
                        <span className="text-xs">{building.rooms.length} rooms</span>
                    </motion.div>
                );
            })}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray-100/80 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow">
                <MapPin className="w-3 h-3"/>
                SFU Burnaby
            </div>
        </div>
    );
};


const HomePage = ({ buildings }) => {
  return (
    <>
      <Helmet>
        <title>StudySpot - Find Your Perfect Study Space at SFU</title>
        <meta name="description" content="Real-time campus occupancy map for Simon Fraser University Burnaby Campus." />
      </Helmet>
      <div className="p-4 pb-16">
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">StudySpot</h1>
          <p className="text-gray-500">Find your perfect study space at SFU</p>
        </header>

        <div className="relative w-full h-72 my-4 rounded-2xl overflow-hidden shadow-md">
        {/* Map background */}
        <MapBackground />

       {/* Bubbles overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <BubbleMap buildings={buildings} />
    </div>
</div>

        
        <p className="text-center text-sm text-gray-500 mb-4">Room Availability Map</p>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">All Buildings</h2>
          <div className="space-y-3">
            {buildings.map(building => (
              <Link to={`/building/${building.id}`} key={building.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="p-4 flex items-center gap-4 transition-all hover:shadow-md">
                    <div className={`w-3 h-3 rounded-full ${statusInfo[building.status]?.dot}`}></div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{building.name}</h3>
                      <p className="text-sm text-gray-500">{building.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                        <span>{building.rooms.length} study spaces</span>
                        <span className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${statusInfo[building.status]?.dot}`}></div>
                          {statusInfo[building.status]?.text}
                        </span>
                        <span>Open until {building.openUntil}</span>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
