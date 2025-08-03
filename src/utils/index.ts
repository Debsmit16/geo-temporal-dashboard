import { LatLng, ColorRule, PolygonCenter, OpenMeteoResponse } from '@/types';

// Utility functions for the map dashboard

/**
 * Calculate the center point of a polygon
 */
export function calculatePolygonCenter(coordinates: LatLng[]): PolygonCenter {
  if (coordinates.length === 0) {
    return { lat: 0, lng: 0 };
  }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / coordinates.length,
    lng: sum.lng / coordinates.length,
  };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Format date for API requests (YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get the color for a temperature value based on rules
 */
export function getColorForValue(value: number, rules: ColorRule[]): string {
  for (const rule of rules) {
    switch (rule.condition) {
      case 'less_than':
        if (value < rule.value1) return rule.color;
        break;
      case 'greater_than':
        if (value > rule.value1) return rule.color;
        break;
      case 'between':
        if (rule.value2 !== undefined && value >= rule.value1 && value <= rule.value2) {
          return rule.color;
        }
        break;
    }
  }
  return '#808080'; // Default gray color
}

/**
 * Fetch weather data from Open-Meteo API
 */
export async function fetchWeatherData(
  lat: number,
  lng: number,
  startDate: Date,
  endDate: Date
): Promise<OpenMeteoResponse> {
  const start = formatDateForAPI(startDate);
  const end = formatDateForAPI(endDate);
  
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${start}&end_date=${end}&hourly=temperature_2m`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get temperature for a specific time from weather data
 */
export function getTemperatureAtTime(
  weatherData: OpenMeteoResponse,
  targetTime: Date
): number | null {
  const targetISOString = targetTime.toISOString().slice(0, 13) + ':00'; // Round to hour
  
  const timeIndex = weatherData.hourly.time.findIndex(time => time === targetISOString);
  
  if (timeIndex === -1) {
    return null;
  }
  
  return weatherData.hourly.temperature_2m[timeIndex];
}

/**
 * Create default color rules for temperature
 */
export function createDefaultColorRules(): ColorRule[] {
  return [
    {
      id: generateId(),
      condition: 'less_than',
      value1: 0,
      color: '#3B82F6', // Blue
      label: 'Freezing (< 0°C)',
    },
    {
      id: generateId(),
      condition: 'between',
      value1: 0,
      value2: 15,
      color: '#10B981', // Green
      label: 'Cold (0-15°C)',
    },
    {
      id: generateId(),
      condition: 'between',
      value1: 15,
      value2: 25,
      color: '#F59E0B', // Yellow
      label: 'Mild (15-25°C)',
    },
    {
      id: generateId(),
      condition: 'greater_than',
      value1: 25,
      color: '#EF4444', // Red
      label: 'Hot (> 25°C)',
    },
  ];
}

/**
 * Validate polygon coordinates (minimum 3 points, maximum 12 points)
 */
export function validatePolygonCoordinates(coordinates: LatLng[]): boolean {
  return coordinates.length >= 3 && coordinates.length <= 12;
}

/**
 * Calculate the area of a polygon (approximate, for validation)
 */
export function calculatePolygonArea(coordinates: LatLng[]): number {
  if (coordinates.length < 3) return 0;
  
  let area = 0;
  const n = coordinates.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordinates[i].lat * coordinates[j].lng;
    area -= coordinates[j].lat * coordinates[i].lng;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Get date range for the timeline (15 days before and after today)
 */
export function getTimelineRange(): { min: Date; max: Date } {
  const today = new Date();
  const min = new Date(today);
  min.setDate(today.getDate() - 15);
  min.setHours(0, 0, 0, 0);
  
  const max = new Date(today);
  max.setDate(today.getDate() + 15);
  max.setHours(23, 59, 59, 999);
  
  return { min, max };
}

/**
 * Convert timestamp to hours since timeline start
 */
export function dateToTimelineValue(date: Date | string): number {
  const { min } = getTimelineRange();
  const safeDate = date instanceof Date ? date : new Date(date);

  if (isNaN(safeDate.getTime())) {
    console.warn('Invalid date provided to dateToTimelineValue:', date);
    return 0;
  }

  return Math.floor((safeDate.getTime() - min.getTime()) / (1000 * 60 * 60));
}

/**
 * Convert hours since timeline start to timestamp
 */
export function timelineValueToDate(value: number): Date {
  const { min } = getTimelineRange();

  if (typeof value !== 'number' || isNaN(value)) {
    console.warn('Invalid value provided to timelineValueToDate:', value);
    return new Date();
  }

  return new Date(min.getTime() + value * 60 * 60 * 1000);
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
