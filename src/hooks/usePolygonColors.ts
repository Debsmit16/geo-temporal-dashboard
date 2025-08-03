import { useEffect } from 'react';
import { Polygon } from '@/types';
import { usePolygonActions } from '@/store';
import { getColorForValue } from '@/utils';
import { useWeatherData } from './useWeatherData';

interface UsePolygonColorsProps {
  polygons: Polygon[];
  selectedTime: Date;
}

export function usePolygonColors({ polygons, selectedTime }: UsePolygonColorsProps) {
  const { updatePolygonColor } = usePolygonActions();
  const { getTemperatureForPolygon, isLoadingForPolygon } = useWeatherData({
    polygons,
    selectedTime,
  });

  // Update polygon colors when temperature data or rules change
  useEffect(() => {
    polygons.forEach(polygon => {
      const temperature = getTemperatureForPolygon(polygon.id);
      const isLoading = isLoadingForPolygon(polygon.id);
      
      let newColor: string;
      
      if (isLoading) {
        // Show loading state with a pulsing gray color
        newColor = '#9CA3AF'; // Gray-400
      } else if (temperature === null) {
        // Show error/no data state with a darker gray
        newColor = '#6B7280'; // Gray-500
      } else {
        // Apply color rules based on temperature
        newColor = getColorForValue(temperature, polygon.colorRules);
      }
      
      // Only update if color has changed to avoid unnecessary re-renders
      if (polygon.currentColor !== newColor) {
        updatePolygonColor(polygon.id, newColor);
      }
    });
  }, [polygons, selectedTime, getTemperatureForPolygon, isLoadingForPolygon, updatePolygonColor]);

  // Helper function to get color explanation for a polygon
  const getColorExplanation = (polygonId: string): string => {
    const polygon = polygons.find(p => p.id === polygonId);
    if (!polygon) return 'Unknown polygon';
    
    const temperature = getTemperatureForPolygon(polygonId);
    const isLoading = isLoadingForPolygon(polygonId);
    
    if (isLoading) {
      return 'Loading temperature data...';
    }
    
    if (temperature === null) {
      return 'No temperature data available';
    }
    
    // Find the matching rule
    for (const rule of polygon.colorRules) {
      let matches = false;
      
      switch (rule.condition) {
        case 'less_than':
          matches = temperature < rule.value1;
          break;
        case 'greater_than':
          matches = temperature > rule.value1;
          break;
        case 'between':
          matches = rule.value2 !== undefined && 
                   temperature >= rule.value1 && 
                   temperature <= rule.value2;
          break;
      }
      
      if (matches) {
        return `${temperature.toFixed(1)}°C - ${rule.label}`;
      }
    }
    
    return `${temperature.toFixed(1)}°C - No matching rule`;
  };

  // Helper function to get all color rules with their current status
  const getColorRuleStatus = (polygonId: string) => {
    const polygon = polygons.find(p => p.id === polygonId);
    if (!polygon) return [];
    
    const temperature = getTemperatureForPolygon(polygonId);
    
    return polygon.colorRules.map(rule => {
      let matches = false;
      let description = '';
      
      if (temperature !== null) {
        switch (rule.condition) {
          case 'less_than':
            matches = temperature < rule.value1;
            description = `< ${rule.value1}°C`;
            break;
          case 'greater_than':
            matches = temperature > rule.value1;
            description = `> ${rule.value1}°C`;
            break;
          case 'between':
            matches = rule.value2 !== undefined && 
                     temperature >= rule.value1 && 
                     temperature <= rule.value2;
            description = `${rule.value1}°C - ${rule.value2}°C`;
            break;
        }
      }
      
      return {
        ...rule,
        matches,
        description,
        currentTemperature: temperature,
      };
    });
  };

  return {
    getColorExplanation,
    getColorRuleStatus,
  };
}
