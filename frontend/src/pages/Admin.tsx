import React, { useState, useEffect } from 'react';
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
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userRole, isLoggedIn, setSearch } = useSearchStore();
  const [activeTab, setActiveTab] = useState<
    "analytics" | "flights" | "passengers"
  >("analytics");

  const [flights, setFlights] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<any>(null);
  const [flightForm, setFlightForm] = useState({
    aeroporto_partenza_id: '',
    aeroporto_arrivo_id: '',
    aereo_id: '',
    data_partenza: '',
    data_arrivo: '',
    ora_partenza: '',
    ora_arrivo: '',
    prezzo_base: '',
    stato: 'Scheduled'
  });

  // Protective Redirect
  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
    }
  }, [isLoggedIn, userRole, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Stats from Analytics table
      const statsRes = await fetch('/api/admin/analytics', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.filter((s: any) => s.categoria === 'stats'));
      }

      // Fetch Flights
      const flightsRes = await fetch('/api/voli', { headers });
      if (flightsRes.ok) {
        const flightsData = await flightsRes.json();
        setFlights(flightsData);
      }

      // Mock popular routes for now as they are complex to calculate
      setPopularRoutes([
        { route: 'Rome → London', revenue: '€850k', change: '+12%' },
        { route: 'Milan → Paris', revenue: '€750k', change: '+8%' },
        { route: 'Rome → New York', revenue: '€650k', change: '+15%' },
        { route: 'Paris → Rome', revenue: '€550k', change: '+5%' },
      ]);

    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userRole === 'admin') {
      fetchData();
    }
  }, [isLoggedIn, userRole]);

  const handleLogout = () => {
    setSearch('isLoggedIn', false);
    setSearch('userRole', null);
    localStorage.removeItem('token');
    navigate('/book');
  };

  const handleRemoveFlight = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/voli/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setFlights(flights.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error("Error deleting flight:", err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingFlight(null);
    setFlightForm({
      aeroporto_partenza_id: '',
      aeroporto_arrivo_id: '',
      aereo_id: '',
      data_partenza: '',
      data_arrivo: '',
      ora_partenza: '',
      ora_arrivo: '',
      prezzo_base: '',
      stato: 'Scheduled'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (flight: any) => {
    setEditingFlight(flight);
    setFlightForm({
      aeroporto_partenza_id: flight.aeroporto_partenza_id,
      aeroporto_arrivo_id: flight.aeroporto_arrivo_id,
      aereo_id: flight.aereo_id,
      data_partenza: flight.data_partenza.split('T')[0],
      data_arrivo: flight.data_arrivo.split('T')[0],
      ora_partenza: flight.ora_partenza,
      ora_arrivo: flight.ora_arrivo,
      prezzo_base: flight.prezzo_base,
      stato: flight.stato
    });
    setIsModalOpen(true);
  };

  const handleSaveFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingFlight ? 'PATCH' : 'POST';
      const url = editingFlight ? `/api/voli/${editingFlight.id}` : '/api/voli';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...flightForm,
          aeroporto_partenza_id: parseInt(flightForm.aeroporto_partenza_id),
          aeroporto_arrivo_id: parseInt(flightForm.aeroporto_arrivo_id),
          aereo_id: parseInt(flightForm.aereo_id),
          prezzo_base: parseFloat(flightForm.prezzo_base)
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        alert("Error: " + (err.message || "Failed to save flight"));
      }
    } catch (err) {
      console.error("Error saving flight:", err);
    }
  };

  if (!isLoggedIn || userRole !== "admin") return null;

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
               className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 p-10 max-h-[90vh] overflow-y-auto"
             >
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight mb-8">
                  {editingFlight ? 'Edit Flight' : 'Add New Flight'}
                </h2>
                <form onSubmit={handleSaveFlight} className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Departure Airport (ID)</label>
                        <input type="number" required value={flightForm.aeroporto_partenza_id} onChange={e => setFlightForm({...flightForm, aeroporto_partenza_id: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Arrival Airport (ID)</label>
                        <input type="number" required value={flightForm.aeroporto_arrivo_id} onChange={e => setFlightForm({...flightForm, aeroporto_arrivo_id: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Date (Departure)</label>
                        <input type="date" required value={flightForm.data_partenza} onChange={e => setFlightForm({...flightForm, data_partenza: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Time (Departure)</label>
                        <input type="time" required value={flightForm.ora_partenza} onChange={e => setFlightForm({...flightForm, ora_partenza: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Date (Arrival)</label>
                        <input type="date" required value={flightForm.data_arrivo} onChange={e => setFlightForm({...flightForm, data_arrivo: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Time (Arrival)</label>
                        <input type="time" required value={flightForm.ora_arrivo} onChange={e => setFlightForm({...flightForm, ora_arrivo: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Airplane (ID)</label>
                        <input type="number" required value={flightForm.aereo_id} onChange={e => setFlightForm({...flightForm, aereo_id: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Base Price (€)</label>
                        <input type="number" step="0.01" required value={flightForm.prezzo_base} onChange={e => setFlightForm({...flightForm, prezzo_base: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Status</label>
                      <select value={flightForm.stato} onChange={e => setFlightForm({...flightForm, stato: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-accent appearance-none">
                         <option value="On Time">On Time</option>
                         <option value="Delayed">Delayed</option>
                         <option value="Scheduled">Scheduled</option>
                         <option value="Departed">Departed</option>
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
            <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">
              {t("adminPage.dashboard")}
            </h1>
            <p className="text-gray-500 font-medium">
              {t("adminPage.welcome")}
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-gray-50 transition-all shadow-sm">
              <Download size={14} className="text-accent" />{" "}
              {t("adminPage.export")}
            </button>
            <button
              onClick={handleOpenAddModal}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-lg shadow-primary/10"
            >
              <Plus size={14} /> {t("adminPage.addFlight")}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm"
            >
              <LogOut size={14} /> {t("userPage.logout")}
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => {
            const IconComponent = stat.icona === 'BarChart3' ? BarChart3 : 
                                stat.icona === 'Plane' ? Plane :
                                stat.icona === 'Users' ? Users : TrendingUp;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${stat.bg_colore} ${stat.colore} rounded-2xl flex items-center justify-center`}>
                    <IconComponent size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black ${stat.variazione.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.variazione.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.variazione}
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-primary">{stat.valore}</h3>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex bg-gray-50 p-1 rounded-2xl w-full md:w-auto">
              {[
                {
                  id: "analytics",
                  label: t("adminPage.analytics"),
                  icon: BarChart3,
                },
                {
                  id: "flights",
                  label: t("adminPage.flightManagement"),
                  icon: Plane,
                },
                {
                  id: "passengers",
                  label: t("adminPage.passengers"),
                  icon: Users,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "analytics" | "flights" | "passengers",
                    )
                  }
                  className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-primary"}`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <input
                type="text"
                placeholder={t("adminPage.searchEverything")}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/50 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-bold text-primary">
                        {t("adminPage.revenueTrend")}
                      </h4>
                      <Filter
                        size={18}
                        className="text-gray-300 cursor-pointer"
                      />
                    </div>
                    <div className="h-64 w-full bg-gray-50 rounded-3xl flex items-end justify-between p-8 gap-4">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="w-full bg-accent/20 rounded-t-lg relative group"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            €{h * 100}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-bold text-primary">
                        {t("adminPage.popularRoutes")}
                      </h4>
                      <MoreVertical
                        size={18}
                        className="text-gray-300 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-4">
                      {popularRoutes.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-primary transition-all"><Plane size={18} /></div>
                          <div className="flex-1"><p className="text-sm font-bold text-primary">{item.route}</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('adminPage.highDemand')}</p></div>
                          <div className="text-right"><p className="text-sm font-bold text-primary">{item.revenue}</p><p className="text-[10px] text-green-500 font-bold">{item.change}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "flights" && (
                <motion.div
                  key="flights"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="overflow-x-auto"
                >
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">
                          {t("adminPage.flight")}
                        </th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">
                          {t("adminPage.route")}
                        </th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">
                          {t("common.status")}
                        </th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">
                          {t("adminPage.loadFactor")}
                        </th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">
                          {t("adminPage.revenue")}
                        </th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 text-right">
                          {t("adminPage.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {flights.map((f) => (
                        <tr key={f.id} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                          <td className="py-5 px-4"><span className="text-sm font-bold text-primary">FP{f.id}</span></td>
                          <td className="py-5 px-4 flex items-center gap-2">
                            <span className="text-sm font-bold text-primary">{f.partenza_citta}</span>
                            <Plane size={12} className="text-gray-300" />
                            <span className="text-sm font-bold text-primary">{f.arrivo_citta}</span>
                          </td>
                          <td className="py-5 px-4">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              f.stato === 'On Time' ? 'bg-green-50 text-green-600' : 
                              f.stato === 'Delayed' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {f.stato === 'On Time' ? <CheckCircle2 size={12} /> : f.stato === 'Delayed' ? <AlertCircle size={12} /> : <Clock size={12} />}
                              {f.stato}
                            </div>
                          </td>
                          <td className="py-5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-accent" style={{ width: '85%' }} /></div>
                              <span className="text-xs font-bold text-primary">85%</span>
                            </div>
                          </td>
                          <td className="py-5 px-4"><span className="text-sm font-bold text-primary">€{(f.prezzo_base * 150).toLocaleString()}</span></td>
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
