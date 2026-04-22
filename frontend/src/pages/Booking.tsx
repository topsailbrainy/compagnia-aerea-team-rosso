import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  ChevronRight, 
  Info, 
  Wifi, 
  Coffee, 
  Monitor, 
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import BookingForm from '../components/BookingForm';

const flights = [
  {
    id: 1,
    flightNumber: 'FP 102',
    departure: '08:30',
    arrival: '10:45',
    duration: '2h 15m',
    from: 'FCO',
    to: 'LHR',
    prices: { economy: 125, business: 450, first: 890 }
  },
  {
    id: 2,
    flightNumber: 'FP 205',
    departure: '12:15',
    arrival: '14:30',
    duration: '2h 15m',
    from: 'FCO',
    to: 'LHR',
    prices: { economy: 145, business: 480, first: 920 }
  },
  {
    id: 3,
    flightNumber: 'FP 308',
    departure: '18:50',
    arrival: '21:05',
    duration: '2h 15m',
    from: 'FCO',
    to: 'LHR',
    prices: { economy: 95, business: 390, first: 850 }
  }
];

const FlightCard: React.FC<{
  flight: any;
  isSelected: boolean;
  selectedCabin: string;
  onSelect: (cabin: string, price: number) => void;
  isReturn: boolean;
}> = ({ flight, isSelected, selectedCabin, onSelect, isReturn }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-3xl overflow-hidden border transition-all ${isSelected ? 'border-accent ring-1 ring-accent shadow-2xl' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 grid grid-cols-3 items-center gap-4 w-full">
            <div className="text-center md:text-left"><p className="text-2xl font-bold text-primary">{flight.departure}</p><p className="text-sm text-gray-400 font-medium">{flight.from}</p></div>
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">{flight.duration}</p>
              <div className="w-full h-[1px] bg-gray-100 relative">
                <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-gray-200 -translate-y-1/2" /><div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-gray-200 -translate-y-1/2" />
                <Plane size={14} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent ${isReturn ? '-rotate-90' : 'rotate-90'}`} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-2">Direct</p>
            </div>
            <div className="text-center md:text-right"><p className="text-2xl font-bold text-primary">{flight.arrival}</p><p className="text-sm text-gray-400 font-medium">{flight.to}</p></div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {[
              { type: 'economy', label: 'Economy', price: flight.prices.economy },
              { type: 'business', label: 'Business', price: flight.prices.business },
              { type: 'first', label: 'First Class', price: flight.prices.first }
            ].map((cabin) => (
              <button
                key={cabin.type}
                onClick={() => onSelect(cabin.type, cabin.price)}
                className={`flex-1 md:w-32 p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${ (isSelected && selectedCabin === cabin.type) ? 'bg-accent text-primary border-accent' : 'border-gray-100 hover:border-accent/30' }`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest">{cabin.label}</span>
                <span className="text-lg font-bold">€{cabin.price}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400"><Wifi size={14} /><span className="text-[10px] font-bold uppercase">Wi-Fi</span></div>
            <div className="flex items-center gap-2 text-gray-400"><Coffee size={14} /><span className="text-[10px] font-bold uppercase">Meals</span></div>
            <div className="flex items-center gap-2 text-gray-400"><Monitor size={14} /><span className="text-[10px] font-bold uppercase">In-flight Ent.</span></div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs cursor-pointer hover:text-accent transition-colors">Flight Details <ChevronDown size={14} /></div>
        </div>
      </div>
    </motion.div>
  );
};

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const { 
    from, to, departureDate, returnDate, passengers, tripType, 
    outboundFlight, returnFlight, outboundPrice, returnPrice, 
    outboundCabin, returnCabin, cabinClass, setSearch 
  } = useSearchStore();
  
  const [isModifying, setIsModifying] = useState(false);
  const [selectingReturn, setSelectingReturn] = useState(false);

  const outboundFlightsList = useMemo(() => {
    return flights.map(f => ({ ...f, from, to }));
  }, [from, to]);

  const returnFlightsList = useMemo(() => {
    return flights.map(f => ({ ...f, from: to, to: from, flightNumber: f.flightNumber.replace('FP', 'FP-R') }));
  }, [from, to]);

  const handleSelectOutbound = (flight: any, cabin: string, price: number) => {
    setSearch('outboundFlight', flight);
    setSearch('outboundPrice', price);
    setSearch('outboundCabin', cabin);
    setSearch('cabinClass', cabin);
    if (tripType === 'return' && !returnFlight) {
        setSelectingReturn(true);
        setTimeout(() => {
            const returnSection = document.getElementById('return-flights-section');
            if (returnSection) {
                returnSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
  };

  const handleSelectReturn = (flight: any, cabin: string, price: number) => {
    setSearch('returnFlight', flight);
    setSearch('returnPrice', price);
    setSearch('returnCabin', cabin);
  };

  const totalBasePrice = outboundPrice + returnPrice;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <button 
          onClick={() => {
            if (selectingReturn || returnFlight) {
                setSelectingReturn(false);
                setSearch('returnFlight', null);
                setSearch('returnPrice', 0);
                setSearch('returnCabin', '');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                navigate('/book');
            }
          }}
          className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {selectingReturn || returnFlight ? 'Clear Return Selection' : 'Back to Home'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto mb-12">
        <AnimatePresence mode="wait">
          {!isModifying ? (
            <motion.div 
              key="summary" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-primary rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex items-center gap-8">
                <div className="text-center md:text-left"><p className="text-accent text-[10px] font-black uppercase tracking-widest mb-1">Origin</p><h2 className="text-3xl font-bold">{from || 'FCO'}</h2></div>
                <div className="flex flex-col items-center"><div className="w-16 h-[2px] bg-white/20 relative"><Plane size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent rotate-90" /></div></div>
                <div className="text-center md:text-left"><p className="text-accent text-[10px] font-black uppercase tracking-widest mb-1">Destination</p><h2 className="text-3xl font-bold">{to || 'LHR'}</h2></div>
              </div>
              <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
              <div className="flex gap-12 text-center md:text-left">
                <div><p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Departure</p><p className="font-bold">{departureDate || 'Select Date'}</p></div>
                {tripType === 'return' && <div><p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Return</p><p className="font-bold">{returnDate || 'Select Date'}</p></div>}
                <div><p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Guests</p><p className="font-bold">{passengers} Guest{passengers > 1 ? 's' : ''}</p></div>
              </div>
              <button onClick={() => setIsModifying(true)} className="bg-accent text-primary font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-white transition-all shadow-lg shadow-accent/20">Modify Search</button>
            </motion.div>
          ) : (
            <motion.div 
              key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative"
            >
              <div className="absolute top-8 right-8">
                 <button onClick={() => setIsModifying(false)} className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2">Cancel <ChevronDown className="rotate-180" size={14} /></button>
              </div>
              <div className="mb-8"><h3 className="text-2xl font-bold text-primary">Modify Search</h3><p className="text-gray-400 text-sm">Update your travel details below.</p></div>
              <div className="relative [&_div]:mt-0"><BookingForm /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-12">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-black">1</span>
                Select Outbound Flight
              </h3>
              {outboundFlight && <span className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1"><Check size={14}/> Selected</span>}
            </div>

            <div className="space-y-4">
                {outboundFlightsList.map((flight) => (
                    <FlightCard 
                        key={flight.id} 
                        flight={flight} 
                        isSelected={outboundFlight?.id === flight.id}
                        selectedCabin={outboundCabin}
                        onSelect={(cabin, price) => handleSelectOutbound(flight, cabin, price)}
                        isReturn={false}
                    />
                ))}
            </div>
          </div>

          {tripType === 'return' && (
            <div id="return-flights-section" className={`space-y-6 pt-8 border-t border-gray-100 transition-all duration-500 ${!outboundFlight ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-black">2</span>
                  Select Return Flight
                </h3>
                {returnFlight && <span className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1"><Check size={14}/> Selected</span>}
              </div>

              <div className="space-y-4">
                  {returnFlightsList.map((flight) => (
                      <FlightCard 
                          key={flight.id} 
                          flight={flight} 
                          isSelected={returnFlight?.id === flight.id}
                          selectedCabin={returnCabin}
                          onSelect={(cabin, price) => handleSelectReturn(flight, cabin, price)}
                          isReturn={true}
                      />
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
            <h4 className="text-lg font-bold text-primary mb-6">Your Selection</h4>
            <div className="space-y-6">
              {outboundFlight && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Outbound</p><p className="font-bold text-primary text-sm">{outboundFlight.from} → {outboundFlight.to}</p></div>
                    <p className="font-bold text-primary">€{outboundPrice}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-1 inline-block"><span className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">{outboundCabin}</span></div>
                </div>
              )}
              {returnFlight && (
                <div className="animate-in fade-in slide-in-from-top-2 pt-4 border-t border-gray-50">
                   <div className="flex justify-between items-start mb-2">
                    <div><p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Return</p><p className="font-bold text-primary text-sm">{returnFlight.from} → {returnFlight.to}</p></div>
                    <p className="font-bold text-primary">€{returnPrice}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-1 inline-block"><span className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">{returnCabin}</span></div>
                </div>
              )}
              {outboundFlight && (tripType === 'oneway' || returnFlight) ? (
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6"><span className="text-gray-500 font-medium">Total Price</span><span className="text-3xl font-bold text-primary">€{totalBasePrice}</span></div>
                  <button onClick={() => navigate('/passenger')} className="w-full bg-accent text-primary font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3">Continue to Passenger <ArrowRight size={16} /></button>
                </div>
              ) : (
                <div className="text-center py-12"><Info size={32} className="text-gray-200 mx-auto mb-4" /><p className="text-gray-400 text-sm">{outboundFlight && tripType === 'return' ? 'Select return flight to continue' : 'Select outbound flight to continue'}</p></div>
              )}
            </div>
          </div>
          <div className="bg-accent/10 rounded-3xl p-6 border border-accent/20"><h5 className="font-bold text-primary mb-2">FlyPlus Premium</h5><p className="text-xs text-primary/60 leading-relaxed">Book with confidence. All our flights include flexible cancellation.</p></div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
