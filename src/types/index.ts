// Core types for the map dashboard application

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Polygon {
  id: string;
  name: string;
  coordinates: LatLng[];
  dataSource: string;
  colorRules: ColorRule[];
  currentColor?: string;
  createdAt: Date;
}

export interface ColorRule {
  id: string;
  condition: 'less_than' | 'between' | 'greater_than';
  value1: number;
  value2?: number; // For 'between' condition
  color: string;
  label: string;
}

export interface DataSource {
  id: string;
  name: string;
  apiUrl: string;
  fields: DataField[];
}

export interface DataField {
  id: string;
  name: string;
  unit: string;
  description: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
  mode: 'single' | 'range';
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

export interface AppState {
  polygons: Polygon[];
  selectedPolygonId: string | null;
  timeRange: TimeRange;
  isDrawing: boolean;
  sidebarOpen: boolean;
}

// Map-related types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface DrawingOptions {
  minPoints: number;
  maxPoints: number;
  allowIntersection: boolean;
}

// API response types
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

// UI Component props
export interface TimelineSliderProps {
  value: Date | [Date, Date];
  onChange: (value: Date | [Date, Date]) => void;
  mode: 'single' | 'range';
  onModeChange: (mode: 'single' | 'range') => void;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPolygon: Polygon | null;
  onPolygonUpdate: (polygon: Polygon) => void;
  onPolygonDelete: (polygonId: string) => void;
}

export interface MapComponentProps {
  polygons: Polygon[];
  onPolygonCreate: (coordinates: LatLng[]) => void;
  onPolygonSelect: (polygonId: string) => void;
  onPolygonDelete: (polygonId: string) => void;
  selectedPolygonId: string | null;
  isDrawing: boolean;
  onDrawingChange: (isDrawing: boolean) => void;
}

// Utility types
export type ColorHex = `#${string}`;

export interface PolygonCenter {
  lat: number;
  lng: number;
}

export interface TemperatureReading {
  timestamp: Date;
  value: number;
  polygonId: string;
}
