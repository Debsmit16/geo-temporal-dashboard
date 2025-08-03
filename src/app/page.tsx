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
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Clean Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Weather Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Interactive weather visualization
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  {polygons.length} Area{polygons.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Live Data
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 relative">
          <div className="h-full">
            <MapComponent />
          </div>

          {/* Map Controls - Top Left */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
              <div className="flex flex-col space-y-1">
                <button className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Temperature Legend - Bottom Left */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Temperature Scale</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Freezing (&lt; 0°C)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Cold (0-15°C)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Mild (15-25°C)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Hot (&gt; 25°C)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Timeline Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <TimelineSlider />
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
