import React, { useState } from 'react';
import { Search, MapPin, Calendar, ArrowRightLeft, Users, ChevronDown } from 'lucide-react';
import { useSearchStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect: React.FC<{
  value: any;
  onChange: (val: any) => void;
  options: { value: any; label: string }[];
  icon?: React.ReactNode;
}> = ({ value, onChange, options, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || '';

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-white border border-gray-100 hover:border-accent/30 rounded-xl cursor-pointer transition-all group"
      >
        {icon && <div className="text-accent group-hover:scale-110 transition-transform">{icon}</div>}
        <span className="text-xs font-black uppercase tracking-widest text-primary flex-1">{selectedLabel}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[70] overflow-hidden"
            >
              {options.map((opt) => (
                <div 
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-6 py-4 text-xs font-black uppercase tracking-widest cursor-pointer transition-colors ${
                    value === opt.value ? 'bg-accent text-primary' : 'hover:bg-gray-50 text-gray-500'
                  }`}
                >
                  {opt.label}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  label: string;
  disabled?: boolean;
}> = ({ value, onChange, label, disabled }) => {
  return (
    <div className={`flex flex-col gap-3 transition-all duration-500 ${disabled ? 'opacity-30 grayscale' : 'opacity-100'}`}>
      <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] ml-2">{label}</label>
      <div className="relative group">
        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent group-hover:scale-110 transition-transform pointer-events-none z-10" />
        <input 
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl transition-all font-black text-sm uppercase tracking-widest text-primary outline-none ${!disabled && 'hover:bg-white hover:border-accent/30 cursor-pointer'}`}
          style={{ colorScheme: 'light' }}
        />
      </div>
    </div>
  );
};

const BookingForm: React.FC = () => {
  const { from, to, departureDate, returnDate, passengers, setSearch } = useSearchStore();
  const [tripType, setTripType] = React.useState<'return' | 'oneway' | 'multi'>('return');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) {
      alert('Please fill in both origin and destination.');
      return;
    }
    console.log('Searching flights for:', { tripType, from, to, departureDate, returnDate, passengers });
  };

  const swapLocations = () => {
    const temp = from;
    setSearch('from', to);
    setSearch('to', temp);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-50 mx-auto max-w-6xl -mt-32 px-4"
    >
      <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* Trip Type Selector */}
          <div className="flex items-center justify-between border-b border-gray-50 pb-6">
            <div className="flex gap-10">
              {[
                { id: 'return', label: 'Return Trip' },
                { id: 'oneway', label: 'One Way' },
                { id: 'multi', label: 'Multi-city' }
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setTripType(type.id as 'return' | 'oneway' | 'multi')}
                  className={`text-xs font-black uppercase tracking-[0.3em] pb-4 transition-all relative ${
                    tripType === type.id ? 'text-primary' : 'text-gray-300 hover:text-gray-500'
                  }`}
                >
                  {type.label}
                  {tripType === type.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-[-1px] left-0 right-0 h-1 bg-accent rounded-full" 
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3 text-primary/30 text-[10px] font-black uppercase tracking-[0.4em]">
              <Search size={14} className="text-accent" />
              Premium Booking Engine
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Origin & Destination Container */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] ml-2">Origin</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-accent group-focus-within:scale-110 transition-transform" size={20} />
                  <input 
                    type="text" 
                    placeholder="Where from?"
                    value={from}
                    onChange={(e) => setSearch('from', e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent/20 focus:ring-8 focus:ring-accent/5 outline-none transition-all font-bold text-primary placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <motion.button 
                  whileHover={{ rotate: 180, backgroundColor: '#263A46', color: '#FFF' }}
                  whileTap={{ scale: 0.9 }}
                  type="button" 
                  onClick={swapLocations}
                  className="p-4 rounded-2xl bg-accent/10 text-accent transition-all shadow-sm"
                >
                  <ArrowRightLeft size={20} />
                </motion.button>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] ml-2">Destination</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-accent group-focus-within:scale-110 transition-transform" size={20} />
                  <input 
                    type="text" 
                    placeholder="Where to?"
                    value={to}
                    onChange={(e) => setSearch('to', e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent/20 focus:ring-8 focus:ring-accent/5 outline-none transition-all font-bold text-primary placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Dates Container */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <CustomDatePicker 
                label="Departure"
                value={departureDate}
                onChange={(val) => setSearch('departureDate', val)}
              />
              <CustomDatePicker 
                label="Return"
                value={returnDate}
                onChange={(val) => setSearch('returnDate', val)}
                disabled={tripType !== 'return'}
              />
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="w-full bg-primary text-white h-[68px] rounded-2xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center group relative overflow-hidden"
              >
                <motion.div 
                  initial={false}
                  className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
                />
                <Search size={28} className="relative z-10 group-hover:text-primary transition-colors duration-300" />
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-50">
            <div className="flex gap-4">
              <CustomSelect 
                value={passengers}
                onChange={(val) => setSearch('passengers', val)}
                icon={<Users size={16} />}
                options={[
                  { value: 1, label: '1 Passenger' },
                  { value: 2, label: '2 Passengers' },
                  { value: 3, label: '3 Passengers' },
                  { value: 4, label: '4+ Passengers' },
                ]}
              />
              <CustomSelect 
                value="economy"
                onChange={() => {}}
                icon={<ArrowRightLeft size={16} />}
                options={[
                  { value: 'economy', label: 'Economy' },
                  { value: 'business', label: 'Business' },
                  { value: 'first', label: 'First Class' },
                ]}
              />
            </div>
            <div className="flex items-center gap-3 bg-secondary/50 px-6 py-3 rounded-full">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest">Best price guaranteed direct booking</p>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default BookingForm;
