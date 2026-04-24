import React, { useState } from 'react';
import { CheckCircle2, QrCode, AlertCircle, Plane, Calendar, Clock, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import gateImg from '../assets/persone/gate.webp';
import { useSearchStore } from '../store';
import type { BookedFlight } from '../store';

const CheckIn: React.FC = () => {
  const { t } = useTranslation();
  const { bookings, updateBookingStatus } = useSearchStore();
  const [ref, setRef] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchResult, setSearchResult] = useState<BookedFlight | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSearch = () => {
    setError('');
    setSuccess(false);
    setSearchResult(null);
    
    if (!ref.trim() || !lastName.trim()) {
      setError(t('managePage.missingInfo') || 'Please enter both booking reference and last name');
      return;
    }

    const result = bookings.find(b => b.id.toUpperCase() === ref.toUpperCase() && b.lastName.toLowerCase() === lastName.toLowerCase());
    if (result) {
      if (result.status === 'Checked-in') {
        setError(t('checkinPage.alreadyCheckedIn') || 'Already checked in');
        setSearchResult(result);
      } else {
        setSearchResult(result);
      }
    } else {
      setError(t('managePage.notFound'));
    }
  };

  const handleCheckIn = () => {
    if (searchResult) {
      updateBookingStatus(searchResult.id, 'Checked-in');
      setSuccess(true);
      setSearchResult({ ...searchResult, status: 'Checked-in' });
    }
  };

  return (
    <div className="px-6 md:px-12 pt-8 pb-12 mt-16 max-w-7xl mx-auto">
      <div className="mb-8 text-center relative py-12 rounded-3xl overflow-hidden shadow-2xl bg-primary">
        <img src={gateImg} className="absolute inset-0 w-full h-full object-cover opacity-30" alt={t('checkinPage.title')} />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">{t('checkinPage.title')}</h2>
          <p className="text-white/60 text-lg">{t('checkinPage.desc')}</p>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 shadow-glow" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto -mt-4">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative z-20">
          <div className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/10 rounded-2xl mb-8">
            <AlertCircle className="text-accent" size={24} />
            <p className="text-sm text-primary font-bold uppercase tracking-wide">
              {t('checkinPage.available')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t('checkinPage.refOrTicket')}</label>
                <input 
                  type="text" 
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="e.g. FP1234"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold text-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t('checkinPage.lastName')}</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Rossi"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold text-primary"
                />
              </div>
            </div>

            {error && !success && (
              <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-xl text-sm font-bold uppercase tracking-wider">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {!searchResult && (
              <button 
                onClick={handleSearch}
                className="w-full bg-primary text-accent font-black py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs active:scale-[0.98]"
              >
                <Search size={18} />
                {t('managePage.findBooking')}
              </button>
            )}
          </div>

          {searchResult && !success && searchResult.status !== 'Checked-in' && (
            <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{searchResult.id}</p>
                  <p className="text-xl font-bold text-primary">{searchResult.from} → {searchResult.to}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('booking.departure')}</p>
                  <p className="text-sm font-bold text-primary">{searchResult.date} | {searchResult.time}</p>
                </div>
              </div>
              <button 
                onClick={handleCheckIn}
                className="w-full bg-accent text-primary font-black py-4 rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs active:scale-[0.98]"
              >
                {t('checkinPage.checkinNow')}
                <CheckCircle2 size={18} />
              </button>
            </div>
          )}

          {success && (
            <div className="mt-8 p-8 bg-green-50 border border-green-100 rounded-3xl text-center animate-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-green-500/20">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-green-800 mb-2">{t('checkinPage.success') || 'Check-in Successful!'}</h4>
              <p className="text-green-700/70 text-sm font-medium mb-6">
                {t('checkinPage.successDesc') || 'Your boarding pass is ready. You can find it in your profile.'}
              </p>
              <div className="bg-white p-4 rounded-2xl border border-green-100 inline-block">
                <QrCode size={120} className="text-primary" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
          <QrCode size={32} className="text-accent mb-4" />
          <h4 className="font-black text-primary mb-2 uppercase tracking-widest text-xs">{t('checkinPage.digitalPass')}</h4>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">{t('checkinPage.digitalPassDesc')}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
          <CheckCircle2 size={32} className="text-accent mb-4" />
          <h4 className="font-black text-primary mb-2 uppercase tracking-widest text-xs">{t('checkinPage.fastBagDrop')}</h4>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">{t('checkinPage.fastBagDropDesc')}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
