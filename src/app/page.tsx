'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import HydrationProvider from '@/components/HydrationProvider';
import Navbar from '@/components/Layout/Navbar';
import ControlPanel from '@/components/Layout/ControlPanel';
import MapOverlays from '@/components/Map/MapOverlays';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { usePolygons, usePolygonActions } from '@/store';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/Map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
        <div className="text-white/80 font-medium">Loading Interactive Map</div>
        <div className="text-white/60 text-sm mt-1">Initializing weather visualization...</div>
      </div>
    </div>
  ),
});

function DashboardContent() {
  const [showFullDashboard, setShowFullDashboard] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const polygons = usePolygons();
  const { addPolygon } = usePolygonActions();
  const { addToast } = useToast();

  useEffect(() => {
    // Add sample polygon on first load
    if (polygons.length === 0) {
      const sampleCoordinates = [
        { lat: 51.505, lng: -0.09 },
        { lat: 51.51, lng: -0.08 },
        { lat: 51.515, lng: -0.095 },
        { lat: 51.51, lng: -0.11 },
        { lat: 51.505, lng: -0.105 },
      ];

      addPolygon(sampleCoordinates, 'London Sample Area');
      addToast({
        type: 'info',
        title: 'Welcome to Weather Dashboard',
        description: 'Sample polygon loaded. Start drawing your own areas!',
        duration: 4000,
      });
    }
  }, [polygons.length, addPolygon, addToast]);

  useEffect(() => {
    // Delay showing the full dashboard to ensure everything is loaded
    const timer = setTimeout(() => {
      setShowFullDashboard(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleToggleDrawing = () => {
    setIsDrawingMode(!isDrawingMode);
    addToast({
      type: isDrawingMode ? 'info' : 'success',
      title: isDrawingMode ? 'Drawing Mode Disabled' : 'Drawing Mode Enabled',
      description: isDrawingMode ? 'Click to select polygons' : 'Click on map to start drawing',
      duration: 2000,
    });
  };

  if (!showFullDashboard) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Weather Dashboard
          </h2>
          <p className="text-white/70 mb-4">
            Initializing futuristic interface...
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Futuristic Navbar */}
      <Navbar
        onToggleTheme={handleToggleTheme}
        isDark={isDarkMode}
      />

      {/* Main Layout - Split Grid */}
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Map Section - 75% Width */}
        <div className="flex-1 relative">
          <MapComponent />

          {/* Map Overlays */}
          <MapOverlays
            onToggleDrawing={handleToggleDrawing}
            isDrawing={isDrawingMode}
          />
        </div>

        {/* Control Panel - 25% Width */}
        <ControlPanel
          isCollapsed={isControlPanelCollapsed}
          onToggleCollapse={() => setIsControlPanelCollapsed(!isControlPanelCollapsed)}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <HydrationProvider>
      <ToastProvider>
        <DashboardContent />
      </ToastProvider>
    </HydrationProvider>
  );
}
