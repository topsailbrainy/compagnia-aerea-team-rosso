import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRightLeft, Users, ChevronDown } from 'lucide-react';
import { useSearchStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const locations = [
  { value: 'FCO', label: 'Rome (FCO)' },
  { value: 'MXP', label: 'Milan (MXP)' },
  { value: 'LHR', label: 'London (LHR)' },
  { value: 'CDG', label: 'Paris (CDG)' },
  { value: 'JFK', label: 'New York (JFK)' },
];

const CustomSelect: React.FC<{
  value: string | number;
  onChange: (val: string | number) => void;
  options: { value: string | number; label: string }[];
  icon?: React.ReactNode;
  onOpenStateChange?: (isOpen: boolean) => void;
}> = ({ value, onChange, options, icon, onOpenStateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || '';

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenStateChange?.(newState);
  };

  return (
    <div className="relative w-full md:w-56">
      <div 
        onClick={toggleOpen}
        className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-white border border-gray-100 hover:border-accent/30 rounded-2xl cursor-pointer transition-all group h-[48px]"
      >
        {icon && <div className="text-accent group-hover:scale-110 transition-transform flex-shrink-0">{icon}</div>}
        <span className="text-[10px] font-black uppercase tracking-widest text-primary flex-1 truncate">{selectedLabel || 'Select...'}</span>
        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => { setIsOpen(false); onOpenStateChange?.(false); }} />
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
                    onOpenStateChange?.(false);
                  }}
                  className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors ${
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

const LocationSelect: React.FC<{
  value: string;
  onChange: (val: string) => void;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onOpenStateChange?: (isOpen: boolean) => void;
}> = ({ value, onChange, label, placeholder, options, onOpenStateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || '';

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenStateChange?.(newState);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] ml-2">{label}</label>
      <div className="relative group">
        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-accent group-hover:scale-110 transition-transform z-10" size={18} />
        <div 
          onClick={toggleOpen}
          className="w-full pl-14 pr-6 h-[50px] bg-gray-50 border border-transparent rounded-2xl flex items-center cursor-pointer hover:bg-white hover:border-accent/20 transition-all"
        >
          <span className={`text-sm font-bold ${selectedLabel ? 'text-primary' : 'text-gray-300'}`}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown size={14} className={`ml-auto text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => { setIsOpen(false); onOpenStateChange?.(false); }} />
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
                      onOpenStateChange?.(false);
                    }}
                    className={`px-6 py-4 text-sm font-bold cursor-pointer transition-colors ${
                      value === opt.value ? 'bg-accent text-primary' : 'hover:bg-gray-50 text-primary'
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
    </div>
  );
};

const CustomDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  label: string;
  disabled?: boolean;
}> = ({ value, onChange, label, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (!disabled && inputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 transition-all duration-500 ${disabled ? 'opacity-30 grayscale' : 'opacity-100'}`}>
      <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] ml-2">{label}</label>
      <div 
        className={`relative group ${!disabled ? 'cursor-pointer' : ''}`}
        onClick={handleContainerClick}
      >
        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent group-hover:scale-110 transition-transform pointer-events-none z-10" />
        <input 
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
          className={`min-w-[180px] w-full md:w-fit pl-12 pr-4 h-[50px] bg-gray-50 border border-gray-100 rounded-2xl transition-all font-black text-xs uppercase tracking-widest text-primary outline-none ${!disabled && 'hover:bg-white hover:border-accent/30 cursor-pointer'}`}
          style={{ colorScheme: 'light' }}
        />
      </div>
    </div>
  );
};

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { from, to, departureDate, returnDate, passengers, tripType, setSearch } = useSearchStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !departureDate || (tripType === 'return' && !returnDate)) {
      alert('Please fill in all sections: Origin, Destination, Departure and Return date.');
      return;
    }
    // Reset selected flights when searching again
    setSearch('outboundFlight', null);
    setSearch('returnFlight', null);
    setSearch('outboundPrice', 0);
    setSearch('returnPrice', 0);
    navigate('/booking');
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
      className={`relative ${isDropdownOpen ? 'z-[120]' : 'z-40'} mx-auto max-w-6xl px-4 transition-all duration-500 ease-in-out ${isDropdownOpen ? '-mt-[55vh]' : '-mt-[50vh]'}`}
    >
      <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] p-6 md:p-8 border border-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Trip Type Selector */}
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <div className="flex gap-10">
              {[
                { id: 'return', label: 'Return Trip' },
                { id: 'oneway', label: 'One Way' }
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSearch('tripType', type.id as 'return' | 'oneway')}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] pb-3 transition-all relative ${
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

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-end">
            {/* Origin & Destination Container */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <LocationSelect 
                label="ORIGIN"
                placeholder="Origin"
                value={from}
                onChange={(val) => setSearch('from', val)}
                options={locations}
                onOpenStateChange={setIsDropdownOpen}
              />

              <div className="flex justify-center pt-5">
                <motion.button 
                  whileHover={{ rotate: 180, backgroundColor: '#263A46', color: '#FFF' }}
                  whileTap={{ scale: 0.9 }}
                  type="button" 
                  onClick={swapLocations}
                  className="p-3.5 rounded-2xl bg-accent/10 text-accent transition-all shadow-sm"
                >
                  <ArrowRightLeft size={18} />
                </motion.button>
              </div>

              <LocationSelect 
                label="DESTINATION"
                placeholder="Destination"
                value={to}
                onChange={(val) => setSearch('to', val)}
                options={locations}
                onOpenStateChange={setIsDropdownOpen}
              />
            </div>

            {/* Dates Container */}
            <div className="lg:col-span-5 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <CustomDatePicker 
                  label="Departure"
                  value={departureDate}
                  onChange={(val) => setSearch('departureDate', val)}
                />
              </div>
              <div className="flex-1">
                <CustomDatePicker 
                  label="Return"
                  value={returnDate}
                  onChange={(val) => setSearch('returnDate', val)}
                  disabled={tripType !== 'return'}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-50">
            <div className="flex gap-4 items-center">
              <CustomSelect 
                value={passengers}
                onChange={(val) => setSearch('passengers', val)}
                icon={<Users size={16} />}
                onOpenStateChange={setIsDropdownOpen}
                options={[
                  { value: 1, label: '1 Passenger' },
                  { value: 2, label: '2 Passengers' },
                  { value: 3, label: '3 Passengers' },
                  { value: 4, label: '4 Passengers' },
                ]}
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full md:w-[300px] bg-primary text-white h-[48px] rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center group relative overflow-hidden"
            >
              <motion.div 
                initial={false}
                className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
              />
              <div className="relative z-10 flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
                <Search size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Search Flights</span>
              </div>
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default BookingForm;
