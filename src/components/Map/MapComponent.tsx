'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon as LeafletPolygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { Polygon, LatLng } from '@/types';
import { usePolygons, usePolygonActions, useSelectedPolygon, useUIActions, useTimeRange } from '@/store';
import { usePolygonColors } from '@/hooks/usePolygonColors';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DrawControlProps {
  onPolygonCreate: (coordinates: LatLng[]) => void;
}

function DrawControl({ onPolygonCreate }: DrawControlProps) {
  const map = useMap();
  const { setIsDrawing } = useUIActions();
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: '#e1e100',
            message: '<strong>Error:</strong> Shape edges cannot cross!',
          },
          shapeOptions: {
            color: '#97c93d',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.4,
          },
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    const handleDrawCreated = (e: L.DrawEvents.Created) => {
      const { layer } = e;
      const leafletLayer = layer as L.Polygon;
      const coordinates: LatLng[] = (leafletLayer.getLatLngs()[0] as L.LatLng[]).map((latlng: L.LatLng) => ({
        lat: latlng.lat,
        lng: latlng.lng,
      }));

      // Validate polygon (3-12 points)
      if (coordinates.length >= 3 && coordinates.length <= 12) {
        onPolygonCreate(coordinates);
        drawnItems.addLayer(leafletLayer);
      } else {
        alert('Polygon must have between 3 and 12 points');
      }
      setIsDrawing(false);
    };

    const handleDrawStart = () => {
      setIsDrawing(true);
    };

    const handleDrawStop = () => {
      setIsDrawing(false);
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);
    map.on(L.Draw.Event.DRAWSTART, handleDrawStart);
    map.on(L.Draw.Event.DRAWSTOP, handleDrawStop);

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
      map.off(L.Draw.Event.DRAWSTART, handleDrawStart);
      map.off(L.Draw.Event.DRAWSTOP, handleDrawStop);
    };
  }, [map, onPolygonCreate, setIsDrawing]);

  return null;
}

interface PolygonLayerProps {
  polygon: Polygon;
  isSelected: boolean;
  onSelect: () => void;
}

function PolygonLayer({ polygon, isSelected, onSelect }: PolygonLayerProps) {
  const positions: [number, number][] = polygon.coordinates.map(coord => [coord.lat, coord.lng]);

  const pathOptions = {
    color: isSelected ? '#3b82f6' : polygon.currentColor || '#64748b',
    weight: isSelected ? 4 : 3,
    opacity: isSelected ? 1 : 0.8,
    fillOpacity: isSelected ? 0.3 : 0.2,
    fillColor: polygon.currentColor || '#64748b',
    dashArray: isSelected ? '10, 5' : undefined,
    className: 'polygon-layer transition-all duration-300 hover:brightness-110',
  };

  return (
    <LeafletPolygon
      positions={positions}
      pathOptions={pathOptions}
      eventHandlers={{
        click: onSelect,
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 4,
            opacity: 1,
            fillOpacity: 0.4,
          });
        },
        mouseout: (e) => {
          const layer = e.target;
          layer.setStyle(pathOptions);
        },
      }}
    />
  );
}

export default function MapComponent() {
  const polygons = usePolygons();
  const selectedPolygon = useSelectedPolygon();
  const timeRange = useTimeRange();
  const { addPolygon, selectPolygon } = usePolygonActions();

  // Initialize polygon coloring system
  usePolygonColors({
    polygons,
    selectedTime: timeRange.start,
  });

  const handlePolygonCreate = (coordinates: LatLng[]) => {
    addPolygon(coordinates);
  };

  const handlePolygonSelect = (polygonId: string) => {
    selectPolygon(polygonId);
  };

  return (
    <div className="h-full w-full relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        className="h-full w-full rounded-2xl shadow-inner"
        zoomControl={false}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        {/* Enhanced Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        <DrawControl onPolygonCreate={handlePolygonCreate} />

        {polygons.map((polygon) => (
          <PolygonLayer
            key={polygon.id}
            polygon={polygon}
            isSelected={selectedPolygon?.id === polygon.id}
            onSelect={() => handlePolygonSelect(polygon.id)}
          />
        ))}
      </MapContainer>

      {/* Loading Overlay */}
      {polygons.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Ready to Create Polygons
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Use the drawing tools to create your first polygon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
