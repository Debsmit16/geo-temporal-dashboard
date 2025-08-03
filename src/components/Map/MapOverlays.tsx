'use client';

import { useState } from 'react';
import { Thermometer, Droplets, Wind, Eye, Palette, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MapOverlaysProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleDrawing?: () => void;
  isDrawing?: boolean;
}

export default function MapOverlays({
  onZoomIn,
  onZoomOut,
  onToggleDrawing,
  isDrawing = false
}: MapOverlaysProps) {
  const [isDrawingPanelExpanded, setIsDrawingPanelExpanded] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);

  return (
    <>
      {/* Top-Left: Drawing Tools Panel */}
      <div className="absolute top-6 left-6 z-[1000]">
        <div className="glass-strong rounded-2xl border border-white/20 overflow-hidden hover-lift">
          {/* Minimized State */}
          {!isDrawingPanelExpanded && (
            <div className="p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDrawingPanelExpanded(true)}
                className="w-10 h-10 rounded-xl hover:bg-white/10 text-white/80 hover:text-white p-0"
              >
                <Palette className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Expanded State */}
          {isDrawingPanelExpanded && (
            <div className="p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Drawing Tools</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDrawingPanelExpanded(false)}
                  className="w-6 h-6 rounded-lg hover:bg-white/10 text-white/60 hover:text-white p-0"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleDrawing}
                  className={`w-full justify-start rounded-xl transition-all ${
                    isDrawing
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 glow'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Draw Polygon
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start rounded-xl text-white/80 hover:text-white hover:bg-white/10"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Manage Layers
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom-Left: Weather Legend */}
      <div className="absolute bottom-6 left-6 z-[1000]">
        <div className="glass-strong rounded-2xl border border-white/20 overflow-hidden hover-lift">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Weather Legend</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                className="w-6 h-6 rounded-lg hover:bg-white/10 text-white/60 hover:text-white p-0"
              >
                {isLegendExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Content */}
          {isLegendExpanded && (
            <div className="p-4 space-y-4 min-w-[280px]">
              {/* Temperature Scale */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                    <Thermometer className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-white font-medium">Temperature</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                  </div>
                  <span className="text-xs text-white/70">-10°C to 40°C</span>
                </div>
              </div>

              {/* Humidity */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Droplets className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-white font-medium">Humidity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 rounded-full bg-gray-400 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-300 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-700 shadow-sm"></div>
                  </div>
                  <span className="text-xs text-white/70">0% to 100%</span>
                </div>
              </div>

              {/* Wind Speed */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                    <Wind className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-white font-medium">Wind Speed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 rounded-full bg-green-400 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-orange-400 shadow-sm"></div>
                    <div className="w-4 h-4 rounded-full bg-red-400 shadow-sm"></div>
                  </div>
                  <span className="text-xs text-white/70">0 to 50+ km/h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
