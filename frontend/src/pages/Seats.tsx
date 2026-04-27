import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchStore } from '../store';
import { ChevronRight, Info, Star, ShieldCheck, ArrowLeftRight } from 'lucide-react';

const Seats: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    passengers, 
    outboundFlight, 
    returnFlight, 
    outboundPrice, 
    returnPrice, 
    selectedSeats, 
    selectedReturnSeats,
    setSearch, 
    baggageCosts, 
    assistanceCosts, 
    outboundCabin, 
    returnCabin,
    isFlyPlusGuest,
    tripType
  } = useSearchStore();

  const [selectionPhase, setSelectionPhase] = useState<'outbound' | 'return'>('outbound');
  const [outboundSelection, setOutboundSelection] = useState<string[]>(selectedSeats);
  const [returnSelection, setReturnSelection] = useState<string[]>(selectedReturnSeats);

  const isReturn = tripType === 'return' && returnFlight;
  const currentSelection = selectionPhase === 'outbound' ? outboundSelection : returnSelection;
  const setCurrentSelection = selectionPhase === 'outbound' ? setOutboundSelection : setReturnSelection;

  // Fallback to 'economy' if cabin not selected (for safety)
  const activeCabin = (selectionPhase === 'outbound' ? outboundCabin : returnCabin) || 'economy';
  const activeFlight = selectionPhase === 'outbound' ? outboundFlight : returnFlight;

  const totalBaggageCost = Object.values(baggageCosts || {}).reduce((acc, curr) => acc + (curr || 0), 0);
  const totalAssistanceCost = Object.values(assistanceCosts || {}).reduce((acc, curr) => acc + (curr || 0), 0);

  const seatClasses = {
    first: { rows: [1, 2], cols: ['A', 'B', 'E', 'F'], price: 150 },
    business: { rows: [3, 4, 5, 6], cols: ['A', 'B', 'C', 'D', 'E', 'F'], price: 80 },
    economy: { rows: [7, 8, 9, 10, 11, 12, 13, 14, 15], cols: ['A', 'B', 'C', 'D', 'E', 'F'], price: 0 }
  };

  const toggleSeat = (seatId: string) => {
    if (currentSelection.includes(seatId)) {
      setCurrentSelection(prev => prev.filter(s => s !== seatId));
    } else {
      if (currentSelection.length < (passengers || 1)) {
        setCurrentSelection(prev => [...prev, seatId]);
      }
    }
  };

  const handleContinue = () => {
    if (selectionPhase === 'outbound' && isReturn) {
      setSelectionPhase('return');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSearch('selectedSeats', outboundSelection);
      setSearch('selectedReturnSeats', returnSelection);
      navigate('/payment');
    }
  };

  const taxesPerFlight = 34.20;
  const flightsCount = isReturn ? 2 : 1;
  const totalTaxes = taxesPerFlight * flightsCount * (passengers || 1);
  const totalPrice = ((outboundPrice + (isReturn ? returnPrice : 0)) * (passengers || 1)) + totalTaxes + totalBaggageCost + totalAssistanceCost;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Seat Selection Map */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectionPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-primary uppercase tracking-tight">
                    {selectionPhase === 'outbound' ? t('bookingPage.selectOutbound') : t('bookingPage.selectReturn')}
                  </h1>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">
                    {activeFlight?.from} → {activeFlight?.to} | {passengers} {t('booking.passengers')}
                  </p>
                  <div className="mt-2 inline-block px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">{activeCabin} Class</span>
                  </div>
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

              {/* Airplane Layout */}
              <div className="relative bg-gray-50 rounded-[4rem] p-16 overflow-hidden border border-gray-100 flex flex-col items-center">
                
                {/* Cockpit Indicator */}
                <div className="w-32 h-16 bg-white border border-gray-100 rounded-t-full mb-12 flex items-center justify-center">
                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Cockpit</span>
                </div>

                {/* Column Labels (Window/Aisle) */}
                <div className="w-full max-w-md flex justify-between px-4 mb-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                  <div className="flex gap-12"><span>Window</span><span>Window</span></div>
                  <div className="flex gap-12"><span>Window</span><span>Window</span></div>
                </div>

                {/* Seats Content */}
                <div className="relative z-10 w-full max-w-md space-y-12">
                  
                  {/* First Class */}
                  {(activeCabin === 'first') && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-4">
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">First Class</span>
                        <div className="h-[1px] flex-1 bg-accent/20 mx-4" />
                      </div>
                      {seatClasses.first.rows.map(row => (
                        <div key={row} className="flex justify-center gap-4 relative">
                          <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">{row}</span>
                          {seatClasses.first.cols.map((col, idx) => {
                            const id = `${row}${col}`;
                            const isSelected = currentSelection.includes(id);
                            return (
                              <React.Fragment key={id}>
                                <button
                                  onClick={() => toggleSeat(id)}
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white text-primary border border-gray-100 hover:border-accent'}`}
                                >
                                  {id}
                                </button>
                                {idx === 1 && <div className="w-12 flex items-center justify-center"><span className="text-[8px] font-black text-gray-200 rotate-90">AISLE</span></div>}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Business Class */}
                  {(activeCabin === 'business') && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-4">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Business</span>
                        <div className="h-[1px] flex-1 bg-blue-100 mx-4" />
                      </div>
                      {seatClasses.business.rows.map(row => (
                        <div key={row} className="flex justify-center gap-2 relative">
                          <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">{row}</span>
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
                                {idx === 2 && <div className="w-8 flex items-center justify-center"><span className="text-[7px] font-black text-gray-200 rotate-90 tracking-tighter">AISLE</span></div>}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Economy Class */}
                  {(activeCabin === 'economy') && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Economy</span>
                        <div className="h-[1px] flex-1 bg-gray-200 mx-4" />
                      </div>
                      {seatClasses.economy.rows.map(row => (
                        <div key={row} className="flex justify-center gap-2 relative">
                          <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">{row}</span>
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
                                {idx === 2 && <div className="w-8 flex items-center justify-center"><span className="text-[7px] font-black text-gray-200 rotate-90 tracking-tighter">AISLE</span></div>}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tail Indicator */}
              <div className="w-48 h-32 bg-white border border-gray-100 rounded-b-[4rem] mt-12 flex flex-col items-center justify-center gap-4">
                 <div className="w-16 h-1 bg-gray-100 rounded-full" />
                 <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Rear of Aircraft</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Summary */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-28"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-primary uppercase tracking-widest">{t('bookingPage.yourSelection')}</h2>
              {selectionPhase === 'return' && (
                <button 
                  onClick={() => setSelectionPhase('outbound')}
                  className="text-[10px] font-black text-accent uppercase flex items-center gap-1 hover:underline"
                >
                  <ArrowLeftRight size={12} />
                  Change Outbound
                </button>
              )}
            </div>
            
            <div className="space-y-4 mb-8">
              <div className={`p-4 rounded-2xl border transition-all ${selectionPhase === 'outbound' ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-gray-400">{t('bookingPage.outbound')}</span>
                  <span className="text-[10px] font-black uppercase text-accent">{outboundFlight?.flightNumber}</span>
                </div>
                <p className="font-bold text-primary">{outboundFlight?.from} → {outboundFlight?.to}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {outboundSelection.length > 0 ? outboundSelection.map(s => (
                    <span key={s} className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg">{s}</span>
                  )) : (
                    <span className="text-[10px] text-gray-400 font-bold italic">No seats selected</span>
                  )}
                </div>
              </div>

              {isReturn && (
                <div className={`p-4 rounded-2xl border transition-all ${selectionPhase === 'return' ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-gray-400">{t('bookingPage.return')}</span>
                    <span className="text-[10px] font-black uppercase text-accent">{returnFlight?.flightNumber}</span>
                  </div>
                  <p className="font-bold text-primary">{returnFlight?.from} → {returnFlight?.to}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {returnSelection.length > 0 ? returnSelection.map(s => (
                      <span key={s} className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg">{s}</span>
                    )) : (
                      <span className="text-[10px] text-gray-400 font-bold italic">No seats selected</span>
                    )}
                  </div>
                </div>
              )}
              
              {totalBaggageCost > 0 && <div className="flex justify-between items-center px-2 animate-in fade-in"><span className="text-[10px] font-black uppercase text-gray-400">Extra Baggage</span><span className="text-xs font-bold text-primary">€{totalBaggageCost.toFixed(2)}</span></div>}
              {totalAssistanceCost > 0 && <div className="flex justify-between items-center px-2 animate-in fade-in"><span className="text-[10px] font-black uppercase text-gray-400">Assistance</span><span className="text-xs font-bold text-primary">€{totalAssistanceCost.toFixed(2)}</span></div>}
              
              {isFlyPlusGuest && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-accent/10 border border-accent/20 rounded-2xl space-y-2 mt-2"
                >
                  <div className="flex items-center gap-2 text-accent">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[9px] font-black uppercase tracking-widest">FlyPlus Guest Member</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[8px] font-bold text-primary/60 uppercase">
                      <ShieldCheck size={10} className="text-accent" /> Lounge Access Included
                    </div>
                  </div>
                </motion.div>
              )}
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
              {currentSelection.length < passengers 
                ? `Select ${passengers - currentSelection.length} more` 
                : (selectionPhase === 'outbound' && isReturn ? 'Select Return Seats' : t('common.continue'))
              }
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
