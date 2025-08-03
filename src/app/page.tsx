'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import TimelineSlider from '@/components/Timeline/TimelineSlider';
import Sidebar from '@/components/Sidebar/Sidebar';
import HydrationProvider from '@/components/HydrationProvider';
import { usePolygons, usePolygonActions } from '@/store';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/Map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Loading Interactive Map
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Initializing weather visualization...
        </p>
      </div>
    </div>
  ),
});

function DashboardContent() {
  const polygons = usePolygons();
  const { addPolygon } = usePolygonActions();

  // Add a sample polygon on first load for demonstration
  useEffect(() => {
    if (polygons.length === 0) {
      // Create a sample polygon around London
      const sampleCoordinates = [
        { lat: 51.505, lng: -0.09 },
        { lat: 51.51, lng: -0.08 },
        { lat: 51.515, lng: -0.095 },
        { lat: 51.51, lng: -0.11 },
        { lat: 51.505, lng: -0.105 },
      ];

      addPolygon(sampleCoordinates, 'Sample Polygon - London');
    }
  }, [polygons.length, addPolygon]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Header with Glass Morphism */}
      <header className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-3xl"></div>

        {/* Header Content */}
        <div className="relative glass border-0 border-b border-white/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Logo/Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg float">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>

              {/* Title and Description */}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Weather Map Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
                  Interactive weather visualization with intelligent polygon mapping
                </p>
              </div>
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
              {/* Polygon Counter */}
              <div className="glass rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 border border-white/20 hover-lift">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 pulse-ring"></div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {polygons.length} Polygon{polygons.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="glass rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 border border-white/20 hover-lift">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 glow"></div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                    Live Data
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Map Container with Enhanced Styling */}
        <div className="flex-1 relative p-3 sm:p-4 lg:p-6">
          <div className="h-64 sm:h-80 lg:h-full rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 hover-lift">
            <MapComponent />
          </div>

          {/* Map Legend - Responsive positioning */}
          <div className="absolute bottom-3 sm:bottom-6 lg:bottom-10 left-3 sm:left-6 lg:left-10 z-10">
            <div className="glass rounded-lg lg:rounded-xl p-3 lg:p-4 border border-white/20 shadow-lg max-w-xs hover-lift">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Temperature Legend</h3>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-500 shimmer"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Freezing (&lt; 0°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-500 shimmer"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Cold (0-15°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-yellow-500 shimmer"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Mild (15-25°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-red-500 shimmer"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Hot (&gt; 25°C)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <Sidebar />
      </div>

      {/* Enhanced Timeline */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50"></div>
        <div className="relative">
          <TimelineSlider />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <HydrationProvider>
      <DashboardContent />
    </HydrationProvider>
  );
}
