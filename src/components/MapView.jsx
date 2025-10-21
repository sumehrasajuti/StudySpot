
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';

const MapUpdater = ({ selectedBuilding }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedBuilding) {
      map.flyTo(selectedBuilding.position, 17, {
        duration: 1.5,
        easeLinearity: 0.5
      });
    }
  }, [selectedBuilding, map]);

  return null;
};

const MapView = ({ buildings, onBuildingClick, selectedBuilding }) => {
  const mapRef = useRef(null);

  const createCustomIcon = (status, occupancy) => {
    const statusClass = `status-${status}`;
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="occupancy-bubble ${statusClass}">
          ${occupancy}%
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <MapContainer
        center={[49.2781, -122.9199]}
        zoom={16}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater selectedBuilding={selectedBuilding} />

        {buildings.map((building) => (
          <Marker
            key={building.id}
            position={building.position}
            icon={createCustomIcon(building.status, building.occupancy)}
            eventHandlers={{
              click: () => onBuildingClick(building)
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-1">{building.name}</h3>
                <p className="text-sm">Occupancy: {building.occupancy}%</p>
                <p className="text-xs mt-1 opacity-80">Click for details</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
  