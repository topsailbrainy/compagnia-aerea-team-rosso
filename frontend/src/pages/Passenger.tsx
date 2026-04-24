import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Mail, 
  Phone, 
  ChevronRight, 
  ShieldCheck,
  Info,
  ArrowLeft,
  Globe,
  Plus,
  ChevronDown,
  ChevronUp,
  CreditCard,
  HeartPulse,
  CheckCircle2,
  Briefcase,
  Star,
  Award
} from 'lucide-react';

interface PassengerDetails {
  id: number;
  type: 'Adult' | 'Child' | 'Infant';
  title: string;
  firstName: string;
  lastName: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  nationality: string;
}

const countryKeys = [
  "Italy", "United Kingdom", "United States", "France", "Germany", 
  "Spain", "United Arab Emirates", "Japan", "China", "Australia", 
  "Canada", "Brazil", "India", "Russia", "South Africa"
];

const titleKeys = ["Mr", "Mrs", "Ms", "Miss", "Dr"];
const monthKeys = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const Passenger: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    from, to, departureDate, returnDate, 
    outboundFlight, returnFlight, outboundPrice, returnPrice,
    passengers: passengerCount, outboundCabin, returnCabin, tripType,
    baggageCosts, assistanceCosts, setSearch, setPassengerCost,
    isFlyPlusGuest
  } = useSearchStore();
  
  const [passengers, setPassengers] = useState<PassengerDetails[]>([]);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    countryCode: '+39'
  });
  
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    const count = passengerCount || 1;
    const initialPassengers: PassengerDetails[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      type: 'Adult',
      title: 'Mr',
      firstName: '',
      lastName: '',
      dobDay: '',
      dobMonth: '',
      dobYear: '',
      nationality: 'Italy',
    }));
    setPassengers(initialPassengers);
    
    const initialExpanded: Record<number, boolean> = {};
    initialPassengers.forEach(p => {
        initialExpanded[p.id] = p.id === 0;
    });
    setExpandedSections(initialExpanded);
  }, [passengerCount]);

  const handlePassengerChange = (id: number, field: keyof PassengerDetails, value: string) => {
    setPassengers(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const toggleSection = (id: number) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBaggage = (pid: number) => {
    const currentCost = baggageCosts[pid] || 0;
    setPassengerCost('baggageCosts', pid, currentCost === 0 ? 45 : 0);
  };

  const toggleAssistance = (pid: number) => {
    const currentCost = assistanceCosts[pid] || 0;
    setPassengerCost('assistanceCosts', pid, currentCost === 0 ? 25 : 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Comprehensive validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const p of passengers) {
      if (!p.firstName.trim() || !p.lastName.trim()) {
        setError(`${t('passengerPage.guest')} ${p.id + 1}: ${t('passengerPage.requiredInfo')}`);
        setExpandedSections(prev => ({ ...prev, [p.id]: true }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (!p.dobDay || !p.dobMonth || !p.dobYear) {
        setError(`${t('passengerPage.guest')} ${p.id + 1}: Please complete date of birth`);
        setExpandedSections(prev => ({ ...prev, [p.id]: true }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const birthDate = new Date(parseInt(p.dobYear), parseInt(p.dobMonth) - 1, parseInt(p.dobDay));
      if (birthDate > today) {
        setError(`${t('passengerPage.guest')} ${p.id + 1}: Date of birth cannot be in the future`);
        setExpandedSections(prev => ({ ...prev, [p.id]: true }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (!/^\d{10}$/.test(contactInfo.phone)) {
      setError('Phone number must be exactly 10 digits (numbers only, no spaces or dashes)');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!contactInfo.email.trim() || !contactInfo.phone.trim()) {
      setError('Please complete contact information');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSearch('passengerDetails', passengers);
    navigate('/seat');
  };

  const totalBaggageCost = Object.values(baggageCosts || {}).reduce((acc, curr) => acc + (curr || 0), 0);
  const totalAssistanceCost = Object.values(assistanceCosts || {}).reduce((acc, curr) => acc + (curr || 0), 0);

  const taxesPerFlight = 34.20;
  const flightsCount = tripType === 'return' ? 2 : 1;
  const totalTaxes = taxesPerFlight * flightsCount * (passengerCount || 1);
  const totalBasePrice = (outboundPrice + returnPrice) * (passengerCount || 1);
  const totalPrice = totalBasePrice + totalTaxes + totalBaggageCost + totalAssistanceCost;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-xs uppercase tracking-widest mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('passengerPage.backFlights')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <header className="mb-10">
              <h1 className="text-4xl font-bold text-primary mb-2">{t('passengerPage.guestDetails')}</h1>
              <p className="text-gray-500">{t('passengerPage.passportDesc')}</p>
            </header>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold uppercase tracking-widest text-xs"
              >
                <Info size={18} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {passengers.map((p, idx) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div 
                    onClick={() => toggleSection(p.id)}
                    className="p-8 md:p-10 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                        <User size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-primary">{t(`passengerPage.${p.type?.toLowerCase() || 'adult'}`)} {idx + 1}</h2>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">
                          {p.firstName && p.lastName ? `${t(`titles.${p.title}`)} ${p.firstName} ${p.lastName}` : t('passengerPage.requiredInfo')}
                        </p>
                      </div>
                    </div>
                    {expandedSections[p.id] ? <ChevronUp className="text-gray-300" /> : <ChevronDown className="text-gray-300" />}
                  </div>

                  <AnimatePresence initial={false}>
                    {expandedSections[p.id] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-gray-50 overflow-hidden"
                      >
                        <div className="p-8 md:p-10 pt-4 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">{t('passengerPage.title')}</label>
                              <div className="relative">
                                <select 
                                  value={p.title}
                                  onChange={(e) => handlePassengerChange(p.id, 'title', e.target.value)}
                                  className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-4 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all appearance-none"
                                >
                                  {titleKeys.map(key => <option key={key} value={key}>{t(`titles.${key}`)}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                            <div className="md:col-span-5">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">{t('passengerPage.firstName')}</label>
                              <input 
                                type="text"
                                required
                                placeholder={t('passengerPage.passportPlaceholder')}
                                value={p.firstName}
                                onChange={(e) => handlePassengerChange(p.id, 'firstName', e.target.value)}
                                className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all"
                              />
                            </div>
                            <div className="md:col-span-5">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">{t('passengerPage.lastName')}</label>
                              <input 
                                type="text"
                                required
                                placeholder={t('passengerPage.passportPlaceholder')}
                                value={p.lastName}
                                onChange={(e) => handlePassengerChange(p.id, 'lastName', e.target.value)}
                                className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all"
                              />
                            </div>
                            <div className="md:col-span-7">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">{t('passengerPage.dob')}</label>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="relative">
                                  <select 
                                    required
                                    value={p.dobDay}
                                    onChange={(e) => handlePassengerChange(p.id, 'dobDay', e.target.value)}
                                    className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-4 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all appearance-none text-center"
                                  >
                                    <option value="">{t('passengerPage.day')}</option>
                                    {Array.from({ length: 31 }).map((_, i) => (<option key={i+1} value={String(i+1)}>{i+1}</option>))}
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                  <select 
                                    required
                                    value={p.dobMonth}
                                    onChange={(e) => handlePassengerChange(p.id, 'dobMonth', e.target.value)}
                                    className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-4 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all appearance-none"
                                  >
                                    <option value="">{t('passengerPage.month')}</option>
                                    {monthKeys.map((m, i) => <option key={m} value={String(i+1)}>{t(`months.${m}`)}</option>)}
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                  <select 
                                    required
                                    value={p.dobYear}
                                    onChange={(e) => handlePassengerChange(p.id, 'dobYear', e.target.value)}
                                    className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-4 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all appearance-none text-center"
                                  >
                                    <option value="">{t('passengerPage.year')}</option>
                                    {Array.from({ length: 100 }).map((_, i) => (<option key={2026-i} value={String(2026-i)}>{2026-i}</option>))}
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-5">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">{t('passengerPage.nationality')}</label>
                              <div className="relative">
                                <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" />
                                <select 
                                  required
                                  value={p.nationality}
                                  onChange={(e) => handlePassengerChange(p.id, 'nationality', e.target.value)}
                                  className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl pl-14 pr-10 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all appearance-none"
                                >
                                  {countryKeys.map(c => <option key={c} value={c}>{t(`countries.${c}`)}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                          <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button 
                                type="button" 
                                onClick={() => toggleBaggage(p.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all group text-left ${(baggageCosts?.[p.id] || 0) > 0 ? 'border-accent bg-accent/5' : 'border-gray-100 hover:border-accent/30 hover:bg-gray-50'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${(baggageCosts?.[p.id] || 0) > 0 ? 'bg-accent text-primary' : 'bg-accent/5 text-accent'}`}>
                                    <Briefcase size={18} />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-primary">Extra Baggage</span>
                                    <span className="text-xs text-gray-400 font-medium">Add 23kg checked bag</span>
                                </div>
                                {(baggageCosts?.[p.id] || 0) > 0 ? <CheckCircle2 size={16} className="ml-auto text-accent" /> : <Plus size={14} className="ml-auto text-gray-300" />}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => toggleAssistance(p.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all group text-left ${(assistanceCosts?.[p.id] || 0) > 0 ? 'border-red-200 bg-red-50' : 'border-gray-100 hover:border-accent/30 hover:bg-gray-50'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${(assistanceCosts?.[p.id] || 0) > 0 ? 'bg-red-400 text-white' : 'bg-red-50 text-red-400'}`}>
                                    <HeartPulse size={18} />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-primary">{t('passengerPage.specialAssistance')}</span>
                                    <span className="text-xs text-gray-400 font-medium">{t('passengerPage.specialAssistanceDesc')}</span>
                                </div>
                                {(assistanceCosts?.[p.id] || 0) > 0 ? <CheckCircle2 size={16} className="ml-auto text-red-400" /> : <Plus size={14} className="ml-auto text-gray-300" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Mail size={24} /></div>
                  <div><h2 className="text-xl font-bold text-primary">{t('passengerPage.contactDetails')}</h2><p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">{t('passengerPage.contactDesc')}</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">{t('passengerPage.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={18} />
                      <input type="email" required placeholder={t('paymentPage.emailPlaceholder')} value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl pl-14 pr-6 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">{t('passengerPage.phone')}</label>
                    <div className="flex gap-3">
                        <div className="w-24 relative flex-shrink-0">
                            <select value={contactInfo.countryCode} onChange={(e) => setContactInfo({...contactInfo, countryCode: e.target.value})}
                                className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-4 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all appearance-none text-center" >
                                <option>+39</option><option>+44</option><option>+1</option><option>+971</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative flex-1">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={18} />
                            <input type="tel" required placeholder={t('paymentPage.phonePlaceholder')} value={contactInfo.phone} onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                                className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl pl-14 pr-6 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all" />
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><ShieldCheck size={20} /></div><span className="text-sm font-bold text-primary/60">{t('passengerPage.dataSafe')}</span></div>
                <button type="submit" className="bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] px-12 py-5 rounded-2xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/10 flex items-center gap-3">{t('passengerPage.confirmContinue')} <ChevronRight size={18} /></button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-lg font-bold mb-6 relative z-10">{t('passengerPage.bookingSummary')}</h3>
                <div className="space-y-6 relative z-10">
                  <div className="pb-6 border-b border-white/10">
                    <p className="text-[10px] font-black uppercase text-accent tracking-widest mb-1">{t('passengerPage.flights')}</p>
                    <div className="space-y-2">
                        <p className="font-bold text-sm">{outboundFlight?.from} → {outboundFlight?.to} ({departureDate})</p>
                        {tripType === 'return' && <p className="font-bold text-sm">{returnFlight?.from} → {returnFlight?.to} ({returnDate})</p>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="text-white/50 text-sm font-medium">{t('passengerPage.outboundCabin')}</span><span className="font-bold capitalize">{t(`bookingPage.${outboundCabin}`)}</span></div>
                    {tripType === 'return' && <div className="flex justify-between items-center"><span className="text-white/50 text-sm font-medium">{t('passengerPage.returnCabin')}</span><span className="font-bold capitalize">{t(`bookingPage.${returnCabin}`)}</span></div>}
                    <div className="flex justify-between items-center"><span className="text-white/50 text-sm font-medium">{t('common.guests')}</span><span className="font-bold">{passengerCount} {passengerCount > 1 ? t('passengerPage.passengers') : t('passengerPage.passenger')}</span></div>
                    {totalBaggageCost > 0 && <div className="flex justify-between items-center animate-in fade-in"><span className="text-white/50 text-sm font-medium">Extra Baggage</span><span className="font-bold">€{totalBaggageCost.toFixed(2)}</span></div>}
                    {totalAssistanceCost > 0 && <div className="flex justify-between items-center animate-in fade-in"><span className="text-white/50 text-sm font-medium">Special Assistance</span><span className="font-bold">€{totalAssistanceCost.toFixed(2)}</span></div>}
                    
                    {isFlyPlusGuest && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-accent/10 border border-accent/20 rounded-2xl space-y-2 mt-4"
                      >
                        <div className="flex items-center gap-2 text-accent">
                          <Star size={14} fill="currentColor" />
                          <span className="text-[10px] font-black uppercase tracking-widest">FlyPlus Guest Member</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[9px] font-bold text-white/70 uppercase">
                            <ShieldCheck size={10} className="text-accent" /> Lounge Access Included
                          </div>
                          <div className="flex items-center gap-2 text-[9px] font-bold text-white/70 uppercase">
                            <Award size={10} className="text-accent" /> Priority Boarding Active
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-2"><span className="text-white/50 text-sm">{t('passengerPage.baseFare')}</span><span className="font-bold">€{totalBasePrice.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center mb-6"><span className="text-white/50 text-sm">{t('passengerPage.taxes')}</span><span className="font-bold">€{totalTaxes.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-accent font-black uppercase text-[10px] tracking-widest">{t('common.total')}</span><span className="text-3xl font-bold text-white">€{totalPrice.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passenger;
