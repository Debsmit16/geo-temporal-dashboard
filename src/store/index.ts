import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Polygon, TimeRange, LatLng } from '@/types';
import { generateId, createDefaultColorRules } from '@/utils';

interface AppStore {
  // State
  polygons: Polygon[];
  selectedPolygonId: string | null;
  timeRange: TimeRange;
  isDrawing: boolean;
  sidebarOpen: boolean;
  
  // Actions
  addPolygon: (coordinates: LatLng[], name?: string) => void;
  removePolygon: (id: string) => void;
  updatePolygon: (id: string, updates: Partial<Polygon>) => void;
  selectPolygon: (id: string | null) => void;
  setTimeRange: (timeRange: TimeRange) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  updatePolygonColor: (id: string, color: string) => void;
  
  // Utility actions
  clearAllPolygons: () => void;
  duplicatePolygon: (id: string) => void;
  getPolygonById: (id: string) => Polygon | undefined;
}

const createInitialTimeRange = (): TimeRange => {
  const now = new Date();
  return {
    start: now,
    end: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours later
    mode: 'single',
  };
};

const initialTimeRange = createInitialTimeRange();

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      polygons: [],
      selectedPolygonId: null,
      timeRange: initialTimeRange,
      isDrawing: false,
      sidebarOpen: false,

      // Actions
      addPolygon: (coordinates: LatLng[], name?: string) => {
        const newPolygon: Polygon = {
          id: generateId(),
          name: name || `Polygon ${get().polygons.length + 1}`,
          coordinates,
          dataSource: 'open-meteo',
          colorRules: createDefaultColorRules(),
          currentColor: '#808080',
          createdAt: new Date(),
        };

        set((state) => ({
          polygons: [...state.polygons, newPolygon],
          selectedPolygonId: newPolygon.id,
          isDrawing: false,
          sidebarOpen: true,
        }));
      },

      removePolygon: (id: string) => {
        set((state) => ({
          polygons: state.polygons.filter((p) => p.id !== id),
          selectedPolygonId: state.selectedPolygonId === id ? null : state.selectedPolygonId,
        }));
      },

      updatePolygon: (id: string, updates: Partial<Polygon>) => {
        set((state) => ({
          polygons: state.polygons.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      selectPolygon: (id: string | null) => {
        set({ selectedPolygonId: id, sidebarOpen: id !== null });
      },

      setTimeRange: (timeRange: TimeRange) => {
        set({ timeRange });
      },

      setIsDrawing: (isDrawing: boolean) => {
        set({ isDrawing });
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      updatePolygonColor: (id: string, color: string) => {
        set((state) => ({
          polygons: state.polygons.map((p) =>
            p.id === id ? { ...p, currentColor: color } : p
          ),
        }));
      },

      // Utility actions
      clearAllPolygons: () => {
        set({
          polygons: [],
          selectedPolygonId: null,
          sidebarOpen: false,
        });
      },

      duplicatePolygon: (id: string) => {
        const polygon = get().polygons.find((p) => p.id === id);
        if (polygon) {
          const duplicated: Polygon = {
            ...polygon,
            id: generateId(),
            name: `${polygon.name} (Copy)`,
            createdAt: new Date(),
          };
          
          set((state) => ({
            polygons: [...state.polygons, duplicated],
            selectedPolygonId: duplicated.id,
          }));
        }
      },

      getPolygonById: (id: string) => {
        return get().polygons.find((p) => p.id === id);
      },
    }),
    {
      name: 'map-dashboard-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return {
            getItem: (name: string) => {
              try {
                const item = localStorage.getItem(name);
                if (!item) return null;

                const parsed = JSON.parse(item);

                // Convert date strings back to Date objects
                if (parsed.state) {
                  if (parsed.state.timeRange) {
                    if (parsed.state.timeRange.start) {
                      parsed.state.timeRange.start = new Date(parsed.state.timeRange.start);
                    }
                    if (parsed.state.timeRange.end) {
                      parsed.state.timeRange.end = new Date(parsed.state.timeRange.end);
                    }
                  }

                  if (parsed.state.polygons) {
                    parsed.state.polygons = parsed.state.polygons.map((polygon: any) => ({
                      ...polygon,
                      createdAt: polygon.createdAt ? new Date(polygon.createdAt) : new Date(),
                    }));
                  }
                }

                return parsed;
              } catch (error) {
                console.warn('Failed to parse stored data:', error);
                return null;
              }
            },
            setItem: (name: string, value: string) => {
              try {
                localStorage.setItem(name, value);
              } catch (error) {
                console.warn('Failed to store data:', error);
              }
            },
            removeItem: (name: string) => {
              try {
                localStorage.removeItem(name);
              } catch (error) {
                console.warn('Failed to remove stored data:', error);
              }
            },
          };
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        polygons: state.polygons,
        timeRange: state.timeRange,
      }),
    }
  )
);

// Selector hooks for better performance
export const usePolygons = () => useAppStore((state) => state.polygons);
export const useSelectedPolygon = () => {
  const selectedId = useAppStore((state) => state.selectedPolygonId);
  const polygons = useAppStore((state) => state.polygons);
  return selectedId ? polygons.find((p) => p.id === selectedId) : null;
};
export const useTimeRange = () => useAppStore((state) => state.timeRange);
export const useIsDrawing = () => useAppStore((state) => state.isDrawing);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);

// Action hooks
export const usePolygonActions = () => ({
  addPolygon: useAppStore((state) => state.addPolygon),
  removePolygon: useAppStore((state) => state.removePolygon),
  updatePolygon: useAppStore((state) => state.updatePolygon),
  selectPolygon: useAppStore((state) => state.selectPolygon),
  duplicatePolygon: useAppStore((state) => state.duplicatePolygon),
  clearAllPolygons: useAppStore((state) => state.clearAllPolygons),
  updatePolygonColor: useAppStore((state) => state.updatePolygonColor),
});

export const useUIActions = () => ({
  setIsDrawing: useAppStore((state) => state.setIsDrawing),
  setSidebarOpen: useAppStore((state) => state.setSidebarOpen),
  setTimeRange: useAppStore((state) => state.setTimeRange),
});
