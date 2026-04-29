import React, { useState } from 'react';
import { Search, Briefcase, ChevronRight, Plane, Calendar, Clock, AlertCircle, LogOut, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import attesaImg from '../assets/persone/attesa.avif';
import { useSearchStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const Manage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ref, setRef] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async () => {
    setError('');
    setSearchResult(null);

    if (!ref.trim() || !lastName.trim()) {
      setError(t('managePage.missingInfo') || 'Please enter both booking reference and last name');
      return;
    }

    // Extract ID from ref (e.g. FP-123 -> 123)
    const id = ref.replace(/[^0-9]/g, '');
    if (!id) {
        setError(t('managePage.notFound'));
        return;
    }

    try {
      const response = await fetch(`/api/prenotazioni/search?id=${id}&cognome=${encodeURIComponent(lastName)}`);
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || t('managePage.notFound'));
        return;
      }

      const data = await response.json();
      
      const mappedResult = {
        id: `FP-${data.id}`,
        flightNumber: `FP ${100 + data.volo_id}`,
        from: data.partenza_citta,
        to: data.arrivo_citta,
        date: new Date(data.volo_data_partenza).toLocaleDateString(),
        time: data.ora_partenza ? data.ora_partenza.slice(0, 5) : "10:00",
        status: data.classe === "Checked-in" ? "Checked-in" : "Confirmed",
        passengerName: `${data.utente_nome} ${data.utente_cognome}`,
        lastName: data.utente_cognome,
        cabinClass: data.classe
      };

      setSearchResult(mappedResult);
      setIsModalOpen(true);
    } catch (err) {
      setError('An error occurred during search');
    }
  };

  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
      <AnimatePresence>
        {isModalOpen && searchResult && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100"
            >
              <div className="bg-primary p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
                      Conferma Prenotazione
                    </span>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                      {searchResult.id}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <LogOut className="rotate-180" size={18} />
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between gap-6 px-4">
                  <div className="text-center">
                    <p className="text-5xl font-black text-primary tracking-tighter">
                      {searchResult.from}
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                      Città di Partenza
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-[2px] bg-gray-100 relative">
                      <Plane
                        size={24}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent rotate-90"
                      />
                    </div>
                    <span className="text-xs font-black text-accent uppercase tracking-widest">
                      {searchResult.flightNumber}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-black text-primary tracking-tighter">
                      {searchResult.to}
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                      Città di Arrivo
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Data del Viaggio
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {searchResult.date}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Orario di Partenza
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {searchResult.time}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Classe di Cabina
                    </p>
                    <p className="text-lg font-bold text-primary capitalize">
                      {searchResult.cabinClass}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Stato Prenotazione
                    </p>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg inline-block mt-1 ${
                        searchResult.status === "Checked-in"
                          ? "bg-green-500 text-white"
                          : "bg-primary text-accent"
                      }`}
                    >
                      {searchResult.status === "Checked-in"
                        ? "Effettuato"
                        : searchResult.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {searchResult.status === "Confirmed" ? (
                    <button
                      onClick={() => navigate("/check-in")}
                      className="flex-1 bg-accent text-primary font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
                    >
                      Effettua Check-in <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button className="flex-1 bg-green-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl cursor-default flex items-center justify-center gap-3">
                      Check-in Completato <ShieldCheck size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-50 text-gray-400 font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-gray-100 hover:text-primary transition-all flex items-center justify-center gap-3"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">{t('managePage.title')}</h2>
          <p className="text-gray-500 text-xl">{t('managePage.desc')}</p>
          <div className="w-24 h-1 bg-accent mt-6" />
        </div>
        <div className="w-full md:w-80 h-48 rounded-3xl overflow-hidden shadow-2xl relative group">
          <img src={attesaImg} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={t('managePage.title')} />
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-primary mb-8">{t('managePage.retrieve')}</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('managePage.bookingRef')}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. FP1234" 
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('managePage.lastName')}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rossi" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold text-primary"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-xl text-sm font-bold uppercase tracking-wider">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <button 
                onClick={handleSearch}
                className="w-full bg-primary text-accent font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Search size={20} />
                {t('managePage.findBooking')}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary p-8 rounded-3xl">
            <Briefcase className="text-accent mb-4" size={32} />
            <h4 className="text-xl font-bold text-primary mb-2">{t('managePage.whyManage')}</h4>
            <ul className="space-y-4 mt-6">
              {[
                t('managePage.manageOptions.seats'),
                t('managePage.manageOptions.baggage'),
                t('managePage.manageOptions.meals'),
                t('managePage.manageOptions.upgrade')
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                  <ChevronRight size={14} className="text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
