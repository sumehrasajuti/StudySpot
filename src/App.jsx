
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import BuildingPage from '@/pages/BuildingPage';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

const getStatusFromOccupancy = (occupied, capacity) => {
  if (capacity === 0) return { status: 'grey', percentage: 0 };
  const percentage = Math.round((occupied / capacity) * 100);
  let status = 'green';
  if (percentage >= 80) status = 'red';
  else if (percentage >= 50) status = 'yellow';
  return { status, percentage };
};

function App() {
  const [buildings, setBuildings] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedBuildings = localStorage.getItem('studyspot-buildings-v2');
    if (storedBuildings) {
      setBuildings(JSON.parse(storedBuildings));
    } else {
      const initialData = [
        {
          id: 'aq',
          name: 'Academic Quadrangle',
          description: 'Main academic building with multiple study lounges',
          openUntil: '11:00 PM',
          rooms: [
            { id: 'aq-3153', name: 'AQ 3153 Lounge', floor: 3, capacity: 40, occupied: 12, tags: ['wifi', 'outlets', 'quiet'], lastUpdated: new Date().toISOString() },
            { id: 'aq-5000', name: 'AQ 5000 Lounge', floor: 5, capacity: 25, occupied: 8, tags: ['wifi', 'outlets', 'quiet', 'whiteboard'], lastUpdated: new Date().toISOString() },
            { id: 'aq-4100', name: 'AQ 4100 Study Area', floor: 4, capacity: 30, occupied: 25, tags: ['wifi', 'outlets', 'group study'], lastUpdated: new Date().toISOString() },
          ],
        },
        {
          id: 'W.A.C',
          name: 'W.A.C. Bennett Library',
          description: 'Main campus library with extensive study spaces',
          openUntil: '12:00 AM',
          rooms: [
            { id: 'lib-2', name: 'Floor 2', floor: 2, capacity: 200, occupied: 110, tags: ['wifi', 'outlets', 'quiet', 'computers'], lastUpdated: new Date().toISOString() },
            { id: 'lib-3', name: 'Floor 3 (Group)', floor: 3, capacity: 150, occupied: 90, tags: ['wifi', 'outlets', 'group study', 'whiteboard'], lastUpdated: new Date().toISOString() },
            { id: 'lib-6', name: 'Floor 6 (Silent)', floor: 6, capacity: 100, occupied: 30, tags: ['wifi', 'outlets', 'silent'], lastUpdated: new Date().toISOString() },
          ],
        },
        {
          id: 'tsc1',
          name: 'Technology and Science Complex 1',
          description: 'Engineering and science building',
          openUntil: '10:00 PM',
          rooms: [
            { id: 'tsc1-lounge', name: 'Atrium Lounge', floor: 1, capacity: 50, occupied: 35, tags: ['wifi', 'outlets'], lastUpdated: new Date().toISOString() },
            { id: 'tsc1-lab', name: 'Open Computer Lab', floor: 2, capacity: 40, occupied: 20, tags: ['wifi', 'outlets', 'computers'], lastUpdated: new Date().toISOString() },
          ],
        },
        {
            id: 'sub',
            name: 'Student Union Building',
            description: 'Student center with casual study spaces',
            openUntil: '11:00 PM',
            rooms: [
                { id: 'sub-lounge', name: 'Main Lounge', floor: 2, capacity: 80, occupied: 20, tags: ['wifi', 'outlets', 'group study'], lastUpdated: new Date().toISOString() },
                { id: 'sub-quiet', name: 'Quiet Study Room', floor: 4, capacity: 30, occupied: 5, tags: ['wifi', 'outlets', 'quiet'], lastUpdated: new Date().toISOString() },
            ]
        },
        {
            id: 'rcb',
            name: 'Robert C. Brown Hall',
            description: 'Science building with study areas',
            openUntil: '10:00 PM',
            rooms: [
                { id: 'rcb-atrium', name: 'Atrium Study Area', floor: 1, capacity: 60, occupied: 15, tags: ['wifi', 'outlets'], lastUpdated: new Date().toISOString() },
            ]
        },
      ];

      const processedData = initialData.map(building => {
        const roomsWithStatus = building.rooms.map(room => ({
          ...room,
          status: getStatusFromOccupancy(room.occupied, room.capacity).status,
        }));
        const totalOccupied = roomsWithStatus.reduce((acc, room) => acc + room.occupied, 0);
        const totalCapacity = roomsWithStatus.reduce((acc, room) => acc + room.capacity, 0);
        
        return {
          ...building,
          rooms: roomsWithStatus,
          status: getStatusFromOccupancy(totalOccupied, totalCapacity).status,
        };
      });

      setBuildings(processedData);
      localStorage.setItem('studyspot-buildings-v2', JSON.stringify(processedData));
    }
  }, []);

  const updateRoomOccupancy = (buildingId, roomId, newOccupancyValue) => {
    setBuildings(prevBuildings => {
      const newBuildings = prevBuildings.map(building => {
        if (building.id === buildingId) {
          let targetRoom = null;
          const updatedRooms = building.rooms.map(room => {
            if (room.id === roomId) {
              const newOccupied = Math.round(newOccupancyValue * room.capacity);
              const { status } = getStatusFromOccupancy(newOccupied, room.capacity);
              targetRoom = { ...room, occupied: newOccupied, status, lastUpdated: new Date().toISOString() };
              return targetRoom;
            }
            return room;
          });
          
          const totalOccupied = updatedRooms.reduce((acc, room) => acc + room.occupied, 0);
          const totalCapacity = updatedRooms.reduce((acc, room) => acc + room.capacity, 0);
          const { status: buildingStatus } = getStatusFromOccupancy(totalOccupied, totalCapacity);

          return { ...building, rooms: updatedRooms, status: buildingStatus };
        }
        return building;
      });

      localStorage.setItem('studyspot-buildings-v2', JSON.stringify(newBuildings));
      
      toast({
        title: "✅ Status Reported!",
        description: "Thanks for helping your fellow students find a spot.",
        duration: 3000,
      });

      return newBuildings;
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg h-screen overflow-y-auto">
      <Routes>
        <Route path="/" element={<HomePage buildings={buildings} />} />
        <Route path="/building/:buildingId" element={<BuildingPage buildings={buildings} onUpdateRoomOccupancy={updateRoomOccupancy} />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
