import React, { useState } from 'react';
import { useSearchStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  Users, 
  Plane, 
  TrendingUp, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userRole, isLoggedIn, setSearch } = useSearchStore();
  const [activeTab, setActiveTab] = useState<'analytics' | 'flights' | 'passengers'>('analytics');

  const [flights, setFlights] = useState([
    { id: 1, flight: 'FP 102', from: 'FCO', to: 'LHR', status: 'On Time', load: '92%', revenue: '€18,400', time: '10:30' },
    { id: 2, flight: 'FP 205', from: 'MXP', to: 'CDG', status: 'Delayed', load: '78%', revenue: '€12,200', time: '14:20' },
    { id: 3, flight: 'FP 308', from: 'FCO', to: 'JFK', status: 'On Time', load: '95%', revenue: '€42,800', time: '09:15' },
    { id: 4, flight: 'FP 412', from: 'CDG', to: 'FCO', status: 'Scheduled', load: '64%', revenue: '€9,100', time: '18:50' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<any>(null);
  const [flightForm, setFlightForm] = useState({
    flight: '',
    from: '',
    to: '',
    status: 'Scheduled',
    time: ''
  });

  // Protective Redirect
  React.useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
    }
  }, [isLoggedIn, userRole, navigate]);

  const handleLogout = () => {
    setSearch('isLoggedIn', false);
    setSearch('userRole', null);
    navigate('/book');
  };

  const handleRemoveFlight = (id: number) => {
    setFlights(flights.filter(f => f.id !== id));
  };

  const handleOpenAddModal = () => {
    setEditingFlight(null);
    setFlightForm({ flight: 'FP ' + Math.floor(100 + Math.random() * 900), from: '', to: '', status: 'Scheduled', time: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (flight: any) => {
    setEditingFlight(flight);
    setFlightForm({ ...flight });
    setIsModalOpen(true);
  };

  const handleSaveFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFlight) {
      setFlights(flights.map(f => f.id === editingFlight.id ? { ...f, ...flightForm } : f));
    } else {
      const newFlight = {
        ...flightForm,
        id: Date.now(),
        load: '0%',
        revenue: '€0'
      };
      setFlights([newFlight, ...flights]);
    }
    setIsModalOpen(false);
  };

  const stats = [
    { label: t('adminPage.totalRevenue'), value: '€4.2M', change: '+12.5%', icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
    { label: t('adminPage.activeBookings'), value: '1,284', change: '+8.2%', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('adminPage.totalPassengers'), value: '12.5k', change: '-2.4%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: t('adminPage.loadFactor'), value: '88%', change: '+4.1%', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  if (!isLoggedIn || userRole !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12">
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-primary/40 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 p-10"
             >
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight mb-8">
                  {editingFlight ? 'Edit Flight' : 'Add New Flight'}
                </h2>
                <form onSubmit={handleSaveFlight} className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Flight Number</label>
                        <input type="text" required value={flightForm.flight} onChange={e => setFlightForm({...flightForm, flight: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Time</label>
                        <input type="time" required value={flightForm.time} onChange={e => setFlightForm({...flightForm, time: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">From</label>
                        <input type="text" required placeholder="e.g. FCO" value={flightForm.from} onChange={e => setFlightForm({...flightForm, from: e.target.value.toUpperCase()})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">To</label>
                        <input type="text" required placeholder="e.g. JFK" value={flightForm.to} onChange={e => setFlightForm({...flightForm, to: e.target.value.toUpperCase()})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Status</label>
                      <select value={flightForm.status} onChange={e => setFlightForm({...flightForm, status: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent appearance-none">
                         <option>On Time</option><option>Delayed</option><option>Scheduled</option><option>Departed</option>
                      </select>
                   </div>
                   <div className="pt-4 flex gap-4">
                      <button type="submit" className="flex-1 bg-primary text-accent font-black uppercase tracking-widest py-4 rounded-xl hover:bg-primary/90 transition-all">
                        {editingFlight ? 'Update Flight' : 'Create Flight'}
                      </button>
                      <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-gray-100 text-gray-400 font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">{t('adminPage.dashboard')}</h1>
            <p className="text-gray-500 font-medium">{t('adminPage.welcome')}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-gray-50 transition-all shadow-sm">
                <Download size={14} className="text-accent" /> {t('adminPage.export')}
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-lg shadow-primary/10"
            >
                <Plus size={14} /> {t('adminPage.addFlight')}
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm"
            >
              <LogOut size={14} /> {t('userPage.logout')}
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex bg-gray-50 p-1 rounded-2xl w-full md:w-auto">
              {[
                { id: 'analytics', label: t('adminPage.analytics'), icon: BarChart3 },
                { id: 'flights', label: t('adminPage.flightManagement'), icon: Plane },
                { id: 'passengers', label: t('adminPage.passengers'), icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'analytics' | 'flights' | 'passengers')}
                  className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'}`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder={t('adminPage.searchEverything')}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none transition-all text-sm font-medium"
                />
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'analytics' && (
                <motion.div 
                  key="analytics" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4"><h4 className="text-lg font-bold text-primary">{t('adminPage.revenueTrend')}</h4><Filter size={18} className="text-gray-300 cursor-pointer" /></div>
                    <div className="h-64 w-full bg-gray-50 rounded-3xl flex items-end justify-between p-8 gap-4">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-full bg-accent/20 rounded-t-lg relative group">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">€{h*100}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4"><h4 className="text-lg font-bold text-primary">{t('adminPage.popularRoutes')}</h4><MoreVertical size={18} className="text-gray-300 cursor-pointer" /></div>
                    <div className="space-y-4">
                      {['Rome → London', 'Milan → Paris', 'Rome → New York', 'Paris → Rome'].map((route, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-primary transition-all"><Plane size={18} /></div>
                          <div className="flex-1"><p className="text-sm font-bold text-primary">{route}</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('adminPage.highDemand')}</p></div>
                          <div className="text-right"><p className="text-sm font-bold text-primary">€{850 - (i*100)}k</p><p className="text-[10px] text-green-500 font-bold">+12%</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'flights' && (
                <motion.div 
                   key="flights" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                   className="overflow-x-auto"
                >
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">{t('adminPage.flight')}</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">{t('adminPage.route')}</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">{t('common.status')}</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">{t('adminPage.loadFactor')}</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">{t('adminPage.revenue')}</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 text-right">{t('adminPage.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flights.map((f) => (
                        <tr key={f.id} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                          <td className="py-5 px-4"><span className="text-sm font-bold text-primary">{f.flight}</span></td>
                          <td className="py-5 px-4 flex items-center gap-2"><span className="text-sm font-bold text-primary">{f.from}</span><Plane size={12} className="text-gray-300" /><span className="text-sm font-bold text-primary">{f.to}</span></td>
                          <td className="py-5 px-4">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              f.status === 'On Time' ? 'bg-green-50 text-green-600' : 
                              f.status === 'Delayed' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {f.status === 'On Time' ? <CheckCircle2 size={12} /> : f.status === 'Delayed' ? <AlertCircle size={12} /> : <Clock size={12} />}
                              {f.status}
                            </div>
                          </td>
                          <td className="py-5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-accent" style={{ width: f.load }} /></div>
                              <span className="text-xs font-bold text-primary">{f.load}</span>
                            </div>
                          </td>
                          <td className="py-5 px-4"><span className="text-sm font-bold text-primary">{f.revenue}</span></td>
                          <td className="py-5 px-4">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleOpenEditModal(f)}
                                className="p-2 text-gray-300 hover:text-primary transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleRemoveFlight(f.id)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
