'use client';

import { useState, useEffect } from 'react';
import { Cloud, Zap, Settings, Moon, Sun } from 'lucide-react';
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
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full pulse-ring"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              Weather Dashboard
            </h1>
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-200 font-medium">
                Powered by AI
              </span>
            </div>
          </div>
        </div>

        {/* Center: Status */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="glass rounded-full px-4 py-2 border border-white/20">
            <span className="text-sm font-medium text-white/90">
              Interactive Weather Visualization
            </span>
          </div>
        </div>

        {/* Right: Status and Controls */}
        <div className="flex items-center space-x-4">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2 glass rounded-full px-3 py-1.5 border border-white/20">
            <div className="relative">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-sm font-medium text-green-300">Ready</span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
