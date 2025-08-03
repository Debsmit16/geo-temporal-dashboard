'use client';

import { useState, useEffect } from 'react';
import { Globe, Settings, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export default function Navbar({ onToggleTheme, isDark = true }: NavbarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-strong border-b border-white/10">
      <div className="h-full px-6 flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-lg hover-lift">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full pulse-ring"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">
              🌍 GeoTemporal Dashboard
            </h1>
            <div className="flex items-center space-x-2 mt-0.5">
              <Activity className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-white/70 font-medium">
                Real-time Weather Intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-4">
          {/* Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-2xl glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white hover-lift"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Status Indicator */}
          <div className="flex items-center space-x-3 glass rounded-2xl px-4 py-2 border border-white/20 hover-lift">
            <div className="relative">
              <div className="w-2 h-2 bg-green-400 rounded-full glow-green"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-sm font-semibold text-green-300">Ready</span>
          </div>
        </div>
      </div>
    </nav>

  );
}
