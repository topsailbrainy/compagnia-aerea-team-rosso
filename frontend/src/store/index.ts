import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  activePage: string;
  setSidebarOpen: (isOpen: boolean) => void;
  setActivePage: (page: string) => void;
}

interface SearchState {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  setSearch: (key: keyof Omit<SearchState, 'setSearch'>, value: string | number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  activePage: 'home',
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setActivePage: (page) => set({ activePage: page }),
}));

export const useSearchStore = create<SearchState>((set) => ({
  from: '',
  to: '',
  departureDate: '',
  returnDate: '',
  passengers: 1,
  setSearch: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
