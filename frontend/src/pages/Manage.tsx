import React, { useState } from 'react';
import { Search, Briefcase, ChevronRight, Plane, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import attesaImg from '../assets/persone/attesa.avif';
import { useSearchStore } from '../store';
import type { BookedFlight } from '../store';

const Manage: React.FC = () => {
  const { t } = useTranslation();
  const { bookings } = useSearchStore();
  const [ref, setRef] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchResult, setSearchResult] = useState<BookedFlight | null>(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    setSearchResult(null);

    if (!ref.trim() || !lastName.trim()) {
      setError(t('managePage.missingInfo') || 'Please enter both booking reference and last name');
      return;
    }

    const result = bookings.find(b => b.id.toUpperCase() === ref.toUpperCase() && b.lastName.toLowerCase() === lastName.toLowerCase());
    if (result) {
      setSearchResult(result);
    } else {
      setError(t('managePage.notFound'));
    }
  };

  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
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

            {searchResult && (
              <div className="mt-12 p-8 rounded-3xl border border-accent/20 bg-accent/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 block">{t('paymentPage.bookingRef')}</span>
                    <h4 className="text-2xl font-black text-primary">{searchResult.id}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{t('common.status')}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${searchResult.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {searchResult.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-8 py-8 border-y border-accent/10 mb-6">
                  <div className="text-center flex-1">
                    <p className="text-3xl font-black text-primary">{searchResult.from}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">DEP</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-[2px] bg-accent/20 relative">
                      <Plane size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" />
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-3xl font-black text-primary">{searchResult.to}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">ARR</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Calendar size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('booking.departure')}</span>
                    </div>
                    <p className="font-bold text-sm text-primary">{searchResult.date}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Time</span>
                    </div>
                    <p className="font-bold text-sm text-primary">{searchResult.time}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Briefcase size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('userPage.personalInfo')}</span>
                    </div>
                    <p className="font-bold text-sm text-primary">{searchResult.passengerName}</p>
                  </div>
                </div>
              </div>
            )}
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
