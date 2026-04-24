import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar as CalendarIcon, ArrowRightLeft, Users, ChevronDown, AlertCircle, X } from 'lucide-react';
import { useSearchStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CustomSelect: React.FC<{
  value: string | number;
  onChange: (val: string | number) => void;
  options: { value: string | number; label: string }[];
  icon?: React.ReactNode;
  onOpenStateChange?: (isOpen: boolean) => void;
}> = ({ value, onChange, options, icon, onOpenStateChange }) => {
  const { t } = useTranslation();
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
        <span className="text-[0.85rem] font-black uppercase tracking-tight text-primary flex-1 truncate">{selectedLabel || t('booking.select')}</span>
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
  const [searchTerm, setSearchTerm] = useState('');
  const selectedLabel = options.find(o => o.value === value)?.label || '';

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    opt.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) setSearchTerm('');
    onOpenStateChange?.(newState);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] ml-2">{label}</label>
      <div className="relative group">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent group-hover:scale-110 transition-transform z-10" size={16} />
        <div 
          onClick={toggleOpen}
          className="w-full pl-12 pr-6 h-[50px] bg-gray-50 border border-gray-100 rounded-2xl flex items-center cursor-pointer hover:bg-white hover:border-accent/20 transition-all"
        >
          {isOpen ? (
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search city or airport..."
              className="bg-transparent border-none outline-none w-full text-[0.85rem] font-black text-primary placeholder:text-gray-300"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={`text-[0.85rem] font-black ${selectedLabel ? 'text-primary' : 'text-gray-300'}`}>
              {selectedLabel || placeholder}
            </span>
          )}
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
                className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[70] overflow-hidden max-h-60 overflow-y-auto"
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
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
                  ))
                ) : (
                  <div className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">No destinations found</div>
                )}
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
  const dateValue = value ? new Date(value) : null;

  const handleDateChange: DatePickerProps['onChange'] = (date) => {
    if (date instanceof Date) {
      // Adjust for timezone to get YYYY-MM-DD correctly
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange('');
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 transition-all duration-500 ${disabled ? 'opacity-30 grayscale' : 'opacity-100'}`}>
      <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] ml-2">{label}</label>
      <div className={`relative group ${!disabled ? 'cursor-pointer' : ''}`}>
        <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent group-hover:scale-110 transition-transform pointer-events-none z-10" />
        <DatePicker
          value={dateValue}
          onChange={handleDateChange}
          disabled={disabled}
          clearIcon={null}
          calendarIcon={null}
          format="dd/MM/yyyy"
          className="flyplus-datepicker"
        />
      </div>
    </div>
  );
};

const BookingForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [locations, setLocations] = useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch('/api/aeroporti');
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map((a: any) => ({
            value: String(a.id),
            label: `${a.citta}, ${a.nome}`
          }));
          setLocations(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch airports:', error);
      }
    };
    fetchAirports();
  }, []);

  const { from, to, departureDate, returnDate, passengers, tripType, setSearch } = useSearchStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState<{ title: string; desc: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for missing fields
    if (!from || !to || !departureDate || (tripType === 'return' && !returnDate)) {
      setValidationError({
        title: t('booking.missingInfo'),
        desc: t('booking.missingInfoDesc')
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validation: Origin and Destination must be different
    if (from === to) {
      setValidationError({
        title: "Invalid Destination",
        desc: "Origin and destination cannot be the same city."
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const depDate = new Date(departureDate);
    depDate.setHours(0, 0, 0, 0);

    // Validation: Departure date cannot be in the past
    if (depDate < today) {
      setValidationError({
        title: "Invalid Departure Date",
        desc: "Departure date cannot be in the past."
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validation: Return date cannot be before departure date
    if (tripType === 'return' && returnDate) {
      const retDate = new Date(returnDate);
      retDate.setHours(0, 0, 0, 0);
      if (retDate < depDate) {
        setValidationError({
          title: "Invalid Return Date",
          desc: "Return date cannot be earlier than departure date."
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
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
    <div className="relative">
      <AnimatePresence>
        {validationError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-24 left-0 right-0 z-[130] mx-auto max-w-2xl px-4"
          >
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-900">{validationError.title}</h4>
                  <p className="text-xs text-red-700">{validationError.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => setValidationError(null)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-400"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  { id: 'return', label: t('booking.returnTrip') },
                  { id: 'oneway', label: t('booking.oneWay') }
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
                <CalendarIcon size={14} className="text-accent" />
                {t('booking.premiumEngine')}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-end">
              {/* Origin & Destination Container */}
              <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <LocationSelect 
                  label={t('booking.origin')}
                  placeholder={t('booking.origin')}
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
                  label={t('booking.destination')}
                  placeholder={t('booking.destination')}
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
                    label={t('booking.departure')}
                    value={departureDate}
                    onChange={(val) => setSearch('departureDate', val)}
                  />
                </div>
                <div className="flex-1">
                  <CustomDatePicker 
                    label={t('booking.return')}
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
                    { value: 1, label: `1 ${t('booking.passenger')}` },
                    { value: 2, label: `2 ${t('booking.passengers')}` },
                    { value: 3, label: `3 ${t('booking.passengers')}` },
                    { value: 4, label: `4 ${t('booking.passengers')}` },
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
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('booking.searchFlights')}</span>
                </div>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingForm;
