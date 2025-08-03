import { useState, useEffect, useCallback } from 'react';
import { Polygon, OpenMeteoResponse, TemperatureReading } from '@/types';
import { fetchWeatherData, getTemperatureAtTime, calculatePolygonCenter, debounce } from '@/utils';

interface UseWeatherDataProps {
  polygons: Polygon[];
  selectedTime: Date;
}

interface WeatherDataState {
  data: Map<string, OpenMeteoResponse>;
  loading: Set<string>;
  errors: Map<string, string>;
  temperatures: Map<string, number | null>;
}

export function useWeatherData({ polygons, selectedTime }: UseWeatherDataProps) {
  const [state, setState] = useState<WeatherDataState>({
    data: new Map(),
    loading: new Set(),
    errors: new Map(),
    temperatures: new Map(),
  });

  // Debounced fetch function to avoid too many API calls
  const debouncedFetch = useCallback(
    debounce(async (polygon: Polygon, time: Date) => {
      const center = calculatePolygonCenter(polygon.coordinates);
      
      // Set loading state
      setState(prev => ({
        ...prev,
        loading: new Set([...prev.loading, polygon.id]),
        errors: new Map([...prev.errors].filter(([key]) => key !== polygon.id)),
      }));

      try {
        // Calculate date range (we need at least the day of the selected time)
        const startDate = new Date(time);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(time);
        endDate.setHours(23, 59, 59, 999);

        const weatherData = await fetchWeatherData(
          center.lat,
          center.lng,
          startDate,
          endDate
        );

        // Get temperature for the specific time
        const temperature = getTemperatureAtTime(weatherData, time);

        setState(prev => {
          const newData = new Map(prev.data);
          const newLoading = new Set(prev.loading);
          const newTemperatures = new Map(prev.temperatures);
          
          newData.set(polygon.id, weatherData);
          newLoading.delete(polygon.id);
          newTemperatures.set(polygon.id, temperature);

          return {
            ...prev,
            data: newData,
            loading: newLoading,
            temperatures: newTemperatures,
          };
        });
      } catch (error) {
        console.error(`Error fetching weather data for polygon ${polygon.id}:`, error);
        
        setState(prev => {
          const newLoading = new Set(prev.loading);
          const newErrors = new Map(prev.errors);
          
          newLoading.delete(polygon.id);
          newErrors.set(polygon.id, error instanceof Error ? error.message : 'Unknown error');

          return {
            ...prev,
            loading: newLoading,
            errors: newErrors,
          };
        });
      }
    }, 500),
    [setState]
  );

  // Fetch weather data when polygons or selected time changes
  useEffect(() => {
    polygons.forEach(polygon => {
      // Only fetch if we don't have data for this polygon or if the time changed significantly
      const existingData = state.data.get(polygon.id);
      const shouldFetch = !existingData || 
        !existingData.hourly.time.some(timeStr => {
          const dataTime = new Date(timeStr);
          return Math.abs(dataTime.getTime() - selectedTime.getTime()) < 60 * 60 * 1000; // Within 1 hour
        });

      if (shouldFetch) {
        debouncedFetch(polygon, selectedTime);
      } else {
        // Update temperature from existing data
        const temperature = getTemperatureAtTime(existingData, selectedTime);
        setState(prev => ({
          ...prev,
          temperatures: new Map([...prev.temperatures, [polygon.id, temperature]]),
        }));
      }
    });
  }, [polygons, selectedTime, debouncedFetch, state.data]);

  // Clean up data for removed polygons
  useEffect(() => {
    const polygonIds = new Set(polygons.map(p => p.id));
    
    setState(prev => {
      const newData = new Map<string, OpenMeteoResponse>();
      const newLoading = new Set<string>();
      const newErrors = new Map<string, string>();
      const newTemperatures = new Map<string, number | null>();

      // Keep only data for existing polygons
      for (const [id, data] of prev.data) {
        if (polygonIds.has(id)) {
          newData.set(id, data);
        }
      }

      for (const id of prev.loading) {
        if (polygonIds.has(id)) {
          newLoading.add(id);
        }
      }

      for (const [id, error] of prev.errors) {
        if (polygonIds.has(id)) {
          newErrors.set(id, error);
        }
      }

      for (const [id, temp] of prev.temperatures) {
        if (polygonIds.has(id)) {
          newTemperatures.set(id, temp);
        }
      }

      return {
        data: newData,
        loading: newLoading,
        errors: newErrors,
        temperatures: newTemperatures,
      };
    });
  }, [polygons]);

  // Helper functions
  const getTemperatureForPolygon = useCallback((polygonId: string): number | null => {
    return state.temperatures.get(polygonId) || null;
  }, [state.temperatures]);

  const isLoadingForPolygon = useCallback((polygonId: string): boolean => {
    return state.loading.has(polygonId);
  }, [state.loading]);

  const getErrorForPolygon = useCallback((polygonId: string): string | null => {
    return state.errors.get(polygonId) || null;
  }, [state.errors]);

  const getWeatherDataForPolygon = useCallback((polygonId: string): OpenMeteoResponse | null => {
    return state.data.get(polygonId) || null;
  }, [state.data]);

  // Get all temperature readings for display/analysis
  const getAllTemperatureReadings = useCallback((): TemperatureReading[] => {
    const readings: TemperatureReading[] = [];
    
    for (const [polygonId, temperature] of state.temperatures) {
      if (temperature !== null) {
        readings.push({
          polygonId,
          timestamp: selectedTime,
          value: temperature,
        });
      }
    }
    
    return readings;
  }, [state.temperatures, selectedTime]);

  return {
    getTemperatureForPolygon,
    isLoadingForPolygon,
    getErrorForPolygon,
    getWeatherDataForPolygon,
    getAllTemperatureReadings,
    isLoading: state.loading.size > 0,
    hasErrors: state.errors.size > 0,
  };
}
