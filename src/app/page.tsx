'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import HydrationProvider from '@/components/HydrationProvider';
import Navbar from '@/components/Layout/Navbar';
import ControlPanel from '@/components/Layout/ControlPanel';
import MapOverlays from '@/components/Map/MapOverlays';
import TimelineControl from '@/components/Layout/TimelineControl';
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
    <div className="min-h-screen overflow-hidden">
      {/* Layer 1: Fixed Navbar */}
      <Navbar
        onToggleTheme={handleToggleTheme}
        isDark={isDarkMode}
      />

      {/* Layer 2: Main Content Grid */}
      <main className="h-screen pt-16">
        <div className="h-full flex">
          {/* Map Section - Full Width with Margins */}
          <div className="flex-1 relative px-4 py-4">
            <div className="h-full w-full relative rounded-3xl overflow-hidden shadow-2xl">
              <MapComponent />

              {/* Map Overlays */}
              <MapOverlays
                onToggleDrawing={handleToggleDrawing}
                isDrawing={isDrawingMode}
              />
            </div>
          </div>

          {/* Layer 3: Responsive Drawer Overlay */}
          {/* Desktop: Right Drawer */}
          <div className={`hidden lg:block fixed top-16 right-0 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ease-in-out ${
            isControlPanelCollapsed ? 'translate-x-full' : 'translate-x-0'
          }`}>
            <ControlPanel
              isCollapsed={isControlPanelCollapsed}
              onToggleCollapse={() => setIsControlPanelCollapsed(!isControlPanelCollapsed)}
            />
          </div>

          {/* Mobile: Bottom Drawer */}
          <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
            isControlPanelCollapsed ? 'translate-y-full' : 'translate-y-0'
          }`}>
            <div className="h-[60vh] glass-strong rounded-t-3xl border-t border-l border-r border-white/10 overflow-hidden animate-slide-in-bottom">
              {/* Mobile Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-xl gradient-primary flex items-center justify-center">
                      <Activity className="w-3 h-3 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Controls</h2>
                  </div>
                  <button
                    onClick={() => setIsControlPanelCollapsed(true)}
                    className="w-8 h-8 rounded-xl hover:bg-white/10 text-white/80 hover:text-white p-0 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Drag Handle */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full"></div>
              </div>

              {/* Mobile Content */}
              <div className="h-[calc(100%-5rem)] overflow-y-auto p-4">
                <TimelineControl />
              </div>
            </div>
          </div>

          {/* Drawer Toggle Button (when collapsed) */}
          {isControlPanelCollapsed && (
            <>
              {/* Desktop Toggle */}
              <button
                onClick={() => setIsControlPanelCollapsed(false)}
                className="hidden lg:block fixed top-20 right-4 z-50 w-12 h-12 rounded-2xl glass-strong border border-white/20 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 hover-lift"
              >
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsControlPanelCollapsed(false)}
                className="lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 rounded-2xl glass-strong border border-white/20 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 hover-lift"
              >
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </button>
            </>
          )}
        </div>
      </main>
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
