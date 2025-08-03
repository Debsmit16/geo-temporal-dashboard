'use client';

import { useState } from 'react';
import { 
  Clock, 
  Database, 
  Download, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TimelineControl from './TimelineControl';

interface ControlPanelProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ControlPanel({ isCollapsed = false, onToggleCollapse }: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'weather' | 'actions'>('timeline');

  return (
    <div className={`relative h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'}`}>
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleCollapse}
        className="absolute -left-4 top-4 z-10 w-8 h-8 rounded-full glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
      >
        {isCollapsed ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>

      {/* Panel Content */}
      <div className="h-full glass-strong border-l border-white/10 overflow-hidden">
        {!isCollapsed ? (
          <div className="h-full flex flex-col">
            {/* Tab Navigation */}
            <div className="p-4 border-b border-white/10">
              <div className="flex space-x-1 glass rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'timeline'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Time</span>
                </button>
                <button
                  onClick={() => setActiveTab('weather')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'weather'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span className="hidden sm:inline">Data</span>
                </button>
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'actions'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Tools</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'timeline' && <TimelineControl />}
              
              {activeTab === 'weather' && (
                <div className="space-y-4">
                  <Card className="glass border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center space-x-2">
                        <Database className="w-4 h-4" />
                        <span>Data Source</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">Provider</span>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          Open-Meteo
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">Status</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                          Connected
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">Current Conditions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Thermometer className="w-4 h-4 text-red-400" />
                        <span className="text-white/70 text-sm">Temperature</span>
                        <span className="text-white font-medium ml-auto">22°C</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        <span className="text-white/70 text-sm">Humidity</span>
                        <span className="text-white font-medium ml-auto">65%</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Wind className="w-4 h-4 text-gray-400" />
                        <span className="text-white/70 text-sm">Wind Speed</span>
                        <span className="text-white font-medium ml-auto">12 km/h</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'actions' && (
                <div className="space-y-3">
                  <Button className="w-full glass border-white/20 hover:bg-white/10 text-white justify-start">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Map
                  </Button>
                  <Button className="w-full glass border-white/20 hover:bg-white/10 text-white justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export GeoJSON
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Collapsed state - show icons only
          <div className="p-2 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
            >
              <Clock className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
            >
              <Database className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
