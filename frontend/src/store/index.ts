import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

interface Flight {
  id: number;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  from: string;
  to: string;
  prices: {
    economy: number;
    business: number;
    first: number;
  };
}

interface SearchState {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  cabinClass: string;
  tripType: 'oneway' | 'return';
  outboundFlight: Flight | null;
  returnFlight: Flight | null;
  outboundPrice: number;
  returnPrice: number;
  setSearch: (key: keyof Omit<SearchState, 'setSearch'>, value: string | number | Flight | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));

export const useSearchStore = create<SearchState>((set) => ({
  from: '',
  to: '',
  departureDate: '',
  returnDate: '',
  passengers: 1,
  cabinClass: 'economy',
  tripType: 'return',
  outboundFlight: null,
  returnFlight: null,
  outboundPrice: 0,
  returnPrice: 0,
  setSearch: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
