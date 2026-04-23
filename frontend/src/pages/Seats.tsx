import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchStore } from '../store';
import { ChevronLeft, ChevronRight, User, Info, CheckCircle2, Plane } from 'lucide-react';

const Seats: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { passengers, outboundFlight, returnFlight, outboundPrice, returnPrice, cabinClass, selectedSeats, setSearch, baggageCost, assistanceCost } = useSearchStore();

  const [currentSelection, setCurrentSelection] = useState<string[]>(selectedSeats);

  const seatClasses = {
    first: { rows: [1, 2], cols: ['A', 'B', 'E', 'F'], price: 150 },
    business: { rows: [3, 4, 5, 6], cols: ['A', 'B', 'C', 'D', 'E', 'F'], price: 80 },
    economy: { rows: [7, 8, 9, 10, 11, 12, 13, 14, 15], cols: ['A', 'B', 'C', 'D', 'E', 'F'], price: 0 }
  };

  const toggleSeat = (seatId: string) => {
    if (currentSelection.includes(seatId)) {
      setCurrentSelection(prev => prev.filter(s => s !== seatId));
    } else {
      if (currentSelection.length < passengers) {
        setCurrentSelection(prev => [...prev, seatId]);
      }
    }
  };

  const handleContinue = () => {
    setSearch('selectedSeats', currentSelection);
    navigate('/payment');
  };

  const taxesPerFlight = 34.20;
  const flightsCount = returnFlight ? 2 : 1;
  const totalTaxes = taxesPerFlight * flightsCount * (passengers || 1);
  const totalPrice = ((outboundPrice + returnPrice) * (passengers || 1)) + totalTaxes + baggageCost + assistanceCost;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Seat Selection Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-primary uppercase tracking-tight">{t('bookingPage.selectOutbound')}</h1>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">
                  {outboundFlight?.from} → {outboundFlight?.to} | {passengers} {t('booking.passengers')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded-sm" />
                  <span className="text-[10px] font-bold uppercase text-gray-400">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded-sm" />
                  <span className="text-[10px] font-bold uppercase text-gray-400">Available</span>
                </div>
              </div>
            </div>

            {/* Airplane Layout with Background Shape */}
            <div className="relative bg-gray-50 rounded-[4rem] p-16 overflow-hidden border border-gray-100 min-h-[1200px] flex justify-center">
              
              {/* Animated Airplane Background Shape - Adjusted to show from tail up to cockpit, avoiding the nose overflow */}
              <div className="absolute inset-0 flex justify-center pt-0 opacity-[0.04] pointer-events-none">
                <svg width="800" height="2000" viewBox="0 0 600 1200" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-[2.2] origin-top translate-y-[-150px]">
                  <path d="M300 20C240 20 180 80 180 200V400L20 600V700L180 650V900L100 1000V1080L300 1040L500 1080V1000L420 900V650L580 700V600L420 400V200C420 80 360 20 300 20Z" fill="currentColor" className="text-primary"/>
                </svg>
              </div>

              {/* Seats Content - Centered in the body of the plane */}
              <div className="relative z-10 w-full max-w-md space-y-12 mt-64">
                
                {/* First Class */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">First Class</span>
                    <div className="h-[1px] flex-1 bg-accent/20 mx-4" />
                  </div>
                  {seatClasses.first.rows.map(row => (
                    <div key={row} className="flex justify-center gap-4">
                      {seatClasses.first.cols.map(col => {
                        const id = `${row}${col}`;
                        const isSelected = currentSelection.includes(id);
                        return (
                          <button
                            key={id}
                            onClick={() => toggleSeat(id)}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white text-primary border border-gray-100 hover:border-accent'}`}
                          >
                            {id}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Business Class */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Business</span>
                    <div className="h-[1px] flex-1 bg-blue-100 mx-4" />
                  </div>
                  {seatClasses.business.rows.map(row => (
                    <div key={row} className="flex justify-center gap-2">
                      {seatClasses.business.cols.map((col, idx) => {
                        const id = `${row}${col}`;
                        const isSelected = currentSelection.includes(id);
                        return (
                          <React.Fragment key={id}>
                            <button
                              onClick={() => toggleSeat(id)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white text-primary border border-gray-100 hover:border-blue-400'}`}
                            >
                              {id}
                            </button>
                            {idx === 2 && <div className="w-8" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Economy Class */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Economy</span>
                    <div className="h-[1px] flex-1 bg-gray-200 mx-4" />
                  </div>
                  {seatClasses.economy.rows.map(row => (
                    <div key={row} className="flex justify-center gap-2">
                      {seatClasses.economy.cols.map((col, idx) => {
                        const id = `${row}${col}`;
                        const isSelected = currentSelection.includes(id);
                        return (
                          <React.Fragment key={id}>
                            <button
                              onClick={() => toggleSeat(id)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white text-primary border border-gray-100 hover:border-primary'}`}
                            >
                              {id}
                            </button>
                            {idx === 2 && <div className="w-8" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-28"
          >
            <h2 className="text-xl font-black text-primary mb-6 uppercase tracking-widest">{t('bookingPage.yourSelection')}</h2>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-gray-400">{t('bookingPage.outbound')}</span>
                  <span className="text-[10px] font-black uppercase text-accent">{outboundFlight?.flightNumber}</span>
                </div>
                <p className="font-bold text-primary">{outboundFlight?.from} → {outboundFlight?.to}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentSelection.length > 0 ? currentSelection.map(s => (
                    <span key={s} className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg">{s}</span>
                  )) : (
                    <span className="text-[10px] text-gray-400 font-bold italic">No seats selected</span>
                  )}
                </div>
              </div>
              
              {baggageCost > 0 && <div className="flex justify-between items-center px-2 animate-in fade-in"><span className="text-[10px] font-black uppercase text-gray-400">Extra Baggage</span><span className="text-xs font-bold text-primary">€{baggageCost.toFixed(2)}</span></div>}
              {assistanceCost > 0 && <div className="flex justify-between items-center px-2 animate-in fade-in"><span className="text-[10px] font-black uppercase text-gray-400">Assistance</span><span className="text-xs font-bold text-primary">€{assistanceCost.toFixed(2)}</span></div>}
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 font-bold text-xs uppercase">{t('booking.passengers')}</span>
                <span className="font-bold text-primary">{passengers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-primary uppercase tracking-tighter">{t('bookingPage.totalPrice')}</span>
                <span className="text-2xl font-black text-accent">€{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleContinue}
              disabled={currentSelection.length < passengers}
              className="w-full bg-primary text-accent font-black py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {currentSelection.length < passengers ? `Select ${passengers - currentSelection.length} more` : t('common.continue')}
              <ChevronRight size={18} />
            </button>
            
            {currentSelection.length < passengers && (
              <div className="mt-4 flex items-start gap-2 text-red-400">
                <Info size={14} className="shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold leading-tight">Please select a seat for each passenger to continue.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Seats;
