import React from 'react';
import { Search, MapPin, Calendar, Users, ArrowRightLeft } from 'lucide-react';
import { useSearchStore } from '../store';
import { GlassCard } from 'react-glass-ui';

const BookingForm: React.FC = () => {
  const { from, to, departureDate, returnDate, passengers, setSearch } = useSearchStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching flights for:', { from, to, departureDate, returnDate, passengers });
    alert('Flight search initiated! Looking for the best FlyPlus routes...');
  };

  return (
    <GlassCard className="booking-card -mt-24 relative z-30 mx-auto max-w-6xl p-8 border-white/20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-primary font-bold text-xl uppercase tracking-wider flex items-center gap-2">
            <Search size={20} className="text-accent" />
            Book Your Journey
          </h3>
          <div className="flex gap-4">
            <button type="button" className="text-sm font-semibold border-b-2 border-accent text-primary">Return</button>
            <button type="button" className="text-sm font-semibold text-gray-400 hover:text-primary transition-colors">One Way</button>
            <button type="button" className="text-sm font-semibold text-gray-400 hover:text-primary transition-colors">Multi-city</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Origin */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={18} />
              <input 
                type="text" 
                placeholder="Origin City"
                value={from}
                onChange={(e) => setSearch('from', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-gray-200 rounded focus:border-accent outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Swap Button (Mobile hidden) */}
          <div className="hidden lg:flex items-end pb-3">
            <button type="button" className="p-2 rounded-full bg-white border border-gray-100 shadow-sm text-accent hover:bg-accent hover:text-white transition-all transform hover:rotate-180">
              <ArrowRightLeft size={16} />
            </button>
          </div>

          {/* Destination */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={18} />
              <input 
                type="text" 
                placeholder="Destination"
                value={to}
                onChange={(e) => setSearch('to', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-gray-200 rounded focus:border-accent outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-col gap-1 lg:col-span-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Departure - Return</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={18} />
              <input 
                type="text" 
                placeholder="Select Dates"
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-gray-200 rounded focus:border-accent outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Passengers */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={18} />
              <select 
                value={passengers}
                onChange={(e) => setSearch('passengers', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-gray-200 rounded focus:border-accent outline-none transition-all font-medium appearance-none"
              >
                <option value={1}>1 Adult</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Adults</option>
                <option value={4}>Family (4+)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <button type="submit" className="accent-button w-full md:w-auto px-16 py-4 flex items-center justify-center gap-3">
            Search Flights
            <ArrowRightLeft size={18} className="rotate-90" />
          </button>
        </div>
      </form>
    </GlassCard>
  );
};

export default BookingForm;
