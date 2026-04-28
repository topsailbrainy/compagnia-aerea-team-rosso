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

export interface BookedFlight {
  id: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Checked-in' | 'Cancelled';
  passengerName: string;
  lastName: string;
  cabinClass: string;
}

interface SearchState {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  cabinClass: string;
  outboundCabin: string;
  returnCabin: string;
  tripType: 'oneway' | 'return';
  outboundFlight: Flight | null;
  returnFlight: Flight | null;
  outboundPrice: number;
  returnPrice: number;
  alertsEnabled: boolean;
  isLoggedIn: boolean;
  userRole: 'user' | 'admin' | null;
  userId: number | null;
  userName: string;
  userEmail: string;
  userPassword: string;
  hasSignedUp: boolean;
  isFlyPlusGuest: boolean;
  bookings: BookedFlight[];
  selectedSeats: string[];
  selectedReturnSeats: string[];
  baggageCosts: Record<number, number>;
  assistanceCosts: Record<number, number>;
  passengerDetails: any[];
  searchTrigger: number;
  triggerSearch: () => void;
  setSearch: (key: keyof Omit<SearchState, 'setSearch' | 'addBooking' | 'updateBookingStatus' | 'triggerSearch'>, value: any) => void;
  setPassengerCost: (key: 'baggageCosts' | 'assistanceCosts', passengerId: number, cost: number) => void;
  addBooking: (booking: BookedFlight) => void;
  updateBookingStatus: (id: string, status: BookedFlight['status']) => void;
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
  outboundCabin: '',
  returnCabin: '',
  tripType: 'return',
  outboundFlight: null,
  returnFlight: null,
  outboundPrice: 0,
  returnPrice: 0,
  alertsEnabled: false,
  isLoggedIn: false,
  userRole: null,
  userId: null,
  userName: '',
  userEmail: '',
  userPassword: '',
  hasSignedUp: false,
  isFlyPlusGuest: false,
  bookings: [],
  selectedSeats: [],
  selectedReturnSeats: [],
  baggageCosts: {},
  assistanceCosts: {},
  passengerDetails: [],
  searchTrigger: 0,
  triggerSearch: () => set((state) => ({ searchTrigger: state.searchTrigger + 1 })),
  setSearch: (key, value) => set((state) => ({ ...state, [key]: value })),
  setPassengerCost: (key, passengerId, cost) => set((state) => ({
    ...state,
    [key]: { ...state[key], [passengerId]: cost }
  })),
  addBooking: (booking) => set((state) => ({ ...state, bookings: [...state.bookings, booking] })),
  updateBookingStatus: (id, status) => set((state) => ({
    ...state,
    bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
  })),
}));
