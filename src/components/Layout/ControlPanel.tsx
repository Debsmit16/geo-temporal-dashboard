'use client';

import { useState } from 'react';
import {
  Clock,
  Database,
  Download,
  RotateCcw,
  X,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Settings,
  Layers
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
    <div className="w-96 h-full glass-strong rounded-l-3xl border-l border-t border-b border-white/10 overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Control Panel</h2>
              <p className="text-xs text-white/70">Weather & Timeline Controls</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-xl hover:bg-white/10 text-white/80 hover:text-white p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-5rem)] overflow-y-auto">
        <div className="p-6 space-y-6">{/* Tab Navigation */}
          <div className="glass rounded-2xl p-1 border border-white/20">
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
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
                className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'weather'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Thermometer className="w-4 h-4" />
                <span className="hidden sm:inline">Data</span>
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'actions'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Tools</span>
              </button>
            </div>
          </div>
          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'timeline' && (
              <div className="space-y-4 animate-fade-in">
                <TimelineControl />
              </div>
            )}

            {activeTab === 'weather' && (
              <div className="space-y-4 animate-fade-in">
                {/* Weather Data Section */}
                <Card className="glass border-white/20 hover-lift">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center space-x-2">
                      <Database className="w-4 h-4" />
                      <span>Weather Data</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current Weather */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 glass-subtle rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                            <Thermometer className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">Temperature</div>
                            <div className="text-xs text-white/70">Current reading</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">22°C</div>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Normal</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 glass-subtle rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Droplets className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">Humidity</div>
                            <div className="text-xs text-white/70">Relative humidity</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">65%</div>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Moderate</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 glass-subtle rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                            <Wind className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">Wind Speed</div>
                            <div className="text-xs text-white/70">Current conditions</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">12 km/h</div>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Light</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-4 animate-fade-in">
                {/* Actions Section */}
                <Card className="glass border-white/20 hover-lift">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-xl glass-subtle border border-white/10 hover:bg-white/10 text-white/80 hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-3" />
                      Export Data
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-xl glass-subtle border border-white/10 hover:bg-white/10 text-white/80 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-3" />
                      Reset View
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-xl glass-subtle border border-white/10 hover:bg-white/10 text-white/80 hover:text-white"
                    >
                      <Layers className="w-4 h-4 mr-3" />
                      Manage Layers
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
