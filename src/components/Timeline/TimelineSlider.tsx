'use client';

import React, { useState, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimeRange } from '@/types';
import { useTimeRange, useUIActions } from '@/store';
import { getTimelineRange, dateToTimelineValue, timelineValueToDate, formatDateTime } from '@/utils';
import { Clock, Calendar, RotateCcw } from 'lucide-react';

export default function TimelineSlider() {
  const timeRange = useTimeRange();
  const { setTimeRange } = useUIActions();
  const [mode, setMode] = useState<'single' | 'range'>('single');

  const { min, max } = getTimelineRange();
  const totalHours = Math.floor((max.getTime() - min.getTime()) / (1000 * 60 * 60));

  // Convert current time range to slider values
  const currentStartValue = dateToTimelineValue(timeRange.start);
  const currentEndValue = timeRange.mode === 'range' ? dateToTimelineValue(timeRange.end) : currentStartValue;
  
  const handleSliderChange = useCallback((values: number[]) => {
    const startDate = timelineValueToDate(values[0]);
    const endDate = mode === 'range' && values[1] !== undefined 
      ? timelineValueToDate(values[1]) 
      : startDate;
    
    const newTimeRange: TimeRange = {
      start: startDate,
      end: endDate,
      mode,
    };
    
    setTimeRange(newTimeRange);
  }, [mode, setTimeRange]);

  const handleModeChange = (newMode: 'single' | 'range') => {
    setMode(newMode);
    
    const newTimeRange: TimeRange = {
      start: timeRange.start,
      end: newMode === 'range' ? timeRange.end : timeRange.start,
      mode: newMode,
    };
    
    setTimeRange(newTimeRange);
  };

  const setToNow = () => {
    const now = new Date();
    const newTimeRange: TimeRange = {
      start: now,
      end: now,
      mode,
    };
    setTimeRange(newTimeRange);
  };

  const sliderValues = mode === 'range' 
    ? [currentStartValue, currentEndValue]
    : [currentStartValue];

  return (
    <div className="w-full glass border-t border-white/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg float">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">Timeline Control</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Navigate through time to see weather changes</p>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="flex rounded-xl bg-white/50 dark:bg-slate-800/50 p-1 border border-white/20">
              <Button
                variant={mode === 'single' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('single')}
                className={`rounded-lg transition-all flex-1 sm:flex-none ${mode === 'single' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50'}`}
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Single</span>
              </Button>
              <Button
                variant={mode === 'range' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('range')}
                className={`rounded-lg transition-all flex-1 sm:flex-none ${mode === 'range' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50'}`}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Range</span>
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={setToNow}
              className="rounded-xl border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover-lift"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Now</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Time Display */}
        <Card className="mb-8 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  {mode === 'single' ? 'Selected Time' : 'Selected Range'}
                </div>
                <div className="font-mono text-lg font-semibold text-slate-700 dark:text-slate-300">
                  {formatDateTime(timeRange.start)}
                  {mode === 'range' && (
                    <>
                      <span className="mx-3 text-slate-400">→</span>
                      {formatDateTime(timeRange.end)}
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="gradient" className="text-xs font-medium">
                  Live Weather Data
                </Badge>
                {mode === 'range' && (
                  <Badge variant="info" className="text-xs">
                    {Math.abs(Math.floor((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60)))} hours
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Slider */}
        <div className="mb-8 relative">
          <div className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20"></div>
          <Slider
            value={sliderValues}
            onValueChange={handleSliderChange}
            max={totalHours}
            min={0}
            step={1}
            className="w-full relative z-10"
          />
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20"></div>
        </div>

        {/* Enhanced Timeline Labels */}
        <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mb-6">
          <div className="text-center">
            <div className="font-medium">{formatDateTime(min).split(',')[0]}</div>
            <div className="text-xs opacity-75">15 days ago</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-600 dark:text-blue-400">TODAY</div>
            <div className="text-xs opacity-75">Current</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{formatDateTime(max).split(',')[0]}</div>
            <div className="text-xs opacity-75">15 days ahead</div>
          </div>
        </div>

        {/* Enhanced Quick Time Selections */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              yesterday.setHours(12, 0, 0, 0);
              setTimeRange({ start: yesterday, end: yesterday, mode });
            }}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Yesterday
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              tomorrow.setHours(12, 0, 0, 0);
              setTimeRange({ start: tomorrow, end: tomorrow, mode });
            }}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Tomorrow
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              weekAgo.setHours(12, 0, 0, 0);
              setTimeRange({ start: weekAgo, end: weekAgo, mode });
            }}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            1 Week Ago
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const weekAhead = new Date();
              weekAhead.setDate(weekAhead.getDate() + 7);
              weekAhead.setHours(12, 0, 0, 0);
              setTimeRange({ start: weekAhead, end: weekAhead, mode });
            }}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            1 Week Ahead
          </Button>
        </div>
      </div>
    </div>
  );
}
