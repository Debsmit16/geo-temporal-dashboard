'use client';

import { useState, useCallback } from 'react';
import { Calendar, Clock, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useTimeRange, useUIActions } from '@/store';
import { formatDateTime, getTimelineRange, dateToTimelineValue, timelineValueToDate } from '@/utils';

export default function TimelineControl() {
  const timeRange = useTimeRange();
  const { setTimeRange } = useUIActions();
  const [mode, setMode] = useState<'single' | 'range'>('single');
  const [isPlaying, setIsPlaying] = useState(false);

  // Ensure timeRange dates are proper Date objects
  const safeTimeRange = {
    start: timeRange.start instanceof Date ? timeRange.start : new Date(timeRange.start),
    end: timeRange.end instanceof Date ? timeRange.end : new Date(timeRange.end),
    mode: timeRange.mode,
  };

  const { min, max } = getTimelineRange();
  const currentValue = dateToTimelineValue(safeTimeRange.start);
  const totalHours = Math.floor((max.getTime() - min.getTime()) / (1000 * 60 * 60));

  const handleSliderChange = useCallback((values: number[]) => {
    const newDate = timelineValueToDate(values[0]);
    setTimeRange({
      start: newDate,
      end: mode === 'range' ? timelineValueToDate(values[1] || values[0]) : newDate,
      mode,
    });
  }, [mode, setTimeRange]);

  const handleQuickSelect = useCallback((offset: number) => {
    const now = new Date();
    const targetDate = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
    setTimeRange({
      start: targetDate,
      end: targetDate,
      mode: 'single',
    });
  }, [setTimeRange]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
    // TODO: Implement auto-advance timeline
  }, [isPlaying]);

  return (
    <div className="space-y-4">
      {/* Current Time Display */}
      <Card className="glass border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Selected Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {formatDateTime(safeTimeRange.start).split(' ')[1]}
            </div>
            <div className="text-sm text-white/70">
              {formatDateTime(safeTimeRange.start).split(' ')[0]}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Slider */}
      <Card className="glass border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex space-x-1 glass rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mode === 'single'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setMode('range')}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mode === 'range'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Range
            </button>
          </div>

          {/* Slider */}
          <div className="px-2">
            <Slider
              value={[currentValue]}
              onValueChange={handleSliderChange}
              max={totalHours}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>-15 days</span>
              <span>Today</span>
              <span>+15 days</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSliderChange([Math.max(0, currentValue - 24)])}
              className="w-8 h-8 rounded-full glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
            >
              <SkipBack className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSliderChange([Math.min(totalHours, currentValue + 24)])}
              className="w-8 h-8 rounded-full glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
            >
              <SkipForward className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Select */}
      <Card className="glass border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">Quick Select</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(-7)}
              className="glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white text-xs"
            >
              1 Week Ago
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(-1)}
              className="glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white text-xs"
            >
              Yesterday
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(0)}
              className="glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white text-xs"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickSelect(7)}
              className="glass border border-white/20 hover:bg-white/10 text-white/80 hover:text-white text-xs"
            >
              1 Week Ahead
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
