import React from 'react';
import { useSearchStore } from '../store';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User as UserIcon, 
  Mail, 
  LogOut, 
  Plane, 
  Clock,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const User: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, setSearch, userName, userEmail, bookings } = useSearchStore();

  // Protective Redirect
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    setSearch('isLoggedIn', false);
    setSearch('userRole', null);
    navigate('/book');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">{t('userPage.title')}</h1>
            <div className="w-20 h-1 bg-accent shadow-glow" />
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white border border-red-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm active:scale-95"
          >
            <LogOut size={14} /> {t('userPage.logout')}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-28"
            >
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20 mx-auto border-4 border-accent/20">
                <UserIcon size={40} />
              </div>
              
              <h2 className="text-xl font-black text-primary text-center mb-8 uppercase tracking-widest">{t('userPage.personalInfo')}</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('userPage.fullName')}</p>
                    <p className="font-bold text-primary">{userName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('userPage.email')}</p>
                    <p className="font-bold text-primary break-all">{userEmail}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[400px]"
            >
              <h2 className="text-2xl font-black text-primary mb-8 uppercase tracking-tight">{t('userPage.bookings')}</h2>
              
              {bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="p-6 rounded-3xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="text-center">
                            <p className="text-3xl font-black text-primary tracking-tighter">{booking.from}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DEP</p>
                          </div>
                          
                          <div className="flex-1 md:w-24 flex flex-col items-center">
                            <div className="w-full h-[1px] bg-gray-200 relative">
                              <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent rotate-90" />
                            </div>
                            <span className="text-[8px] font-black text-accent uppercase tracking-widest mt-2">{booking.flightNumber}</span>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-3xl font-black text-primary tracking-tighter">{booking.to}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ARR</p>
                          </div>
                        </div>

                        <div className="h-10 w-[1px] bg-gray-200 hidden md:block" />

                        <div className="grid grid-cols-2 gap-8 flex-1 md:flex-none">
                          <div>
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                              <Calendar size={12} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{t('statusPage.departureDate')}</span>
                            </div>
                            <p className="font-bold text-xs text-primary">{booking.date}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                              <Clock size={12} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{t('common.status')}</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${booking.status === 'Checked-in' ? 'bg-green-100 text-green-700' : 'bg-primary/5 text-primary'}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          {booking.status === 'Confirmed' ? (
                            <button 
                              onClick={() => navigate('/check-in')}
                              className="flex-1 md:flex-none bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
                            >
                              Check-in
                            </button>
                          ) : (
                            <button 
                              onClick={() => navigate('/manage')}
                              className="flex-1 md:flex-none bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-accent hover:text-primary transition-all duration-300"
                            >
                              Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
                    <Plane size={40} />
                  </div>
                  <p className="text-gray-400 font-medium">{t('userPage.noBookings')}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
