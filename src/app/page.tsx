'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import HydrationProvider from '@/components/HydrationProvider';

// Dynamically import components to avoid SSR issues
const TimelineSlider = dynamic(() => import('@/components/Timeline/TimelineSlider'), {
  ssr: false,
  loading: () => <div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
});

const Sidebar = dynamic(() => import('@/components/Sidebar/Sidebar'), {
  ssr: false,
  loading: () => <div className="w-80 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
});

const MapComponent = dynamic(() => import('@/components/Map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

function DashboardContent() {
  const [showFullDashboard, setShowFullDashboard] = useState(false);

  useEffect(() => {
    // Delay showing the full dashboard to ensure everything is loaded
    const timer = setTimeout(() => {
      setShowFullDashboard(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!showFullDashboard) {

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Clean Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Weather Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Interactive weather visualization is loading...
          </p>
          <div className="w-8 h-8 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Clean Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
                  Ready
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
          <MapComponent />
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
