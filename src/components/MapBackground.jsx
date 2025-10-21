import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapBackground = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // prevent multiple maps

    const sfuCoords = [-122.9199, 49.2781]; // SFU Burnaby

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: sfuCoords,
      zoom: 15,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
  }, []);

  return (
    <div
      ref={mapContainer}
      className="absolute inset-0 z-0"
      style={{
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    />
  );
};

export default MapBackground;
