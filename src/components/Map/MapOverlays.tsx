'use client';

import { Thermometer, Droplets, Wind, Eye, Plus, Minus } from 'lucide-react';
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
  return (
    <>
      {/* Drawing Tools - Top Left */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDrawing}
            className={`w-12 h-12 rounded-xl glass border border-white/20 hover:bg-white/10 transition-all ${
              isDrawing 
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/25' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Button>
          
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              className="w-12 h-12 rounded-xl glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              className="w-12 h-12 rounded-xl glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Temperature Legend - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <Card className="glass-strong border-white/20 w-64 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-red-400" />
              <span>Temperature Scale</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                <span className="text-white/80 text-sm">Freezing (&lt; 0°C)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                <span className="text-white/80 text-sm">Cold (0-15°C)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                <span className="text-white/80 text-sm">Mild (15-25°C)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                <span className="text-white/80 text-sm">Hot (&gt; 25°C)</span>
              </div>
            </div>
            
            {/* Additional Weather Info */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span className="text-white/70">Humidity</span>
                </div>
                <span className="text-white font-medium">65%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Wind className="w-3 h-3 text-gray-400" />
                  <span className="text-white/70">Wind</span>
                </div>
                <span className="text-white font-medium">12 km/h</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Eye className="w-3 h-3 text-purple-400" />
                  <span className="text-white/70">Visibility</span>
                </div>
                <span className="text-white font-medium">10 km</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Polygon Info Tooltip - Will be positioned dynamically */}
      <div id="polygon-tooltip" className="absolute z-[1000] pointer-events-none opacity-0 transition-all duration-200">
        <Card className="glass-strong border-white/20 shadow-2xl">
          <CardContent className="p-3">
            <div className="space-y-1">
              <div className="font-medium text-white text-sm" id="tooltip-name">
                Polygon Name
              </div>
              <div className="text-white/70 text-xs" id="tooltip-temp">
                Temperature: --°C
              </div>
              <div className="text-white/70 text-xs" id="tooltip-coords">
                Coordinates: --, --
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
