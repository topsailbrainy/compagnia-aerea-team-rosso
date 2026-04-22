import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plane, Briefcase, CheckCircle2, Clock, MapPin, LayoutGrid, Info, Phone, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { useUIStore, useSearchStore } from '../store';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { userRole, isLoggedIn } = useSearchStore();

  const navItems = [
    { id: 'book', label: t('sidebar.book'), icon: Plane, path: '/book' },
    { id: 'manage', label: t('sidebar.manage'), icon: Briefcase, path: '/manage' },
    { id: 'check-in', label: t('sidebar.checkin'), icon: CheckCircle2, path: '/check-in' },
    { id: 'flight-status', label: t('sidebar.status'), icon: Clock, path: '/flight-status' },
  ];

  const secondaryItems = [
    { id: 'destinations', label: t('sidebar.destinations'), icon: MapPin, path: '/destinations' },
    { id: 'fleet', label: t('sidebar.fleet'), icon: LayoutGrid, path: '/fleet' },
    { id: 'about', label: t('sidebar.about'), icon: Info, path: '/about' },
    { id: 'contact', label: t('sidebar.contact'), icon: Phone, path: '/contact' },
  ];

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-[160] p-2 bg-primary text-accent rounded-md lg:hidden"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div 
        className={`fixed top-0 left-0 h-screen transition-all duration-300 z-[150] bg-primary border-r border-white/10
          ${isSidebarOpen ? 'w-56' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Logo Section */}
          <div className="sidebar-brand mt-8 mb-12 flex flex-col items-center">
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-24 h-24' : 'w-12 h-12'} mb-2`}>
              <img src="/logo.png" alt="FlyPlus Logo" className="w-full h-full object-contain" />
            </div>
            {isSidebarOpen && (
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tighter text-white m-0 uppercase">Fly<span className="text-accent">Plus</span></h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80 -mt-1 font-semibold">{t('sidebar.excellence')}</p>
              </div>
            )}
          </div>

          {/* Primary Navigation */}
          <nav className="flex-1 space-y-1">
            {isLoggedIn && userRole === 'admin' && (
              <div className="mb-6">
                <div className="px-4 mb-2 text-[10px] font-bold text-accent uppercase tracking-widest">
                  {isSidebarOpen ? t('sidebar.admin') : ''}
                </div>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => 
                    `w-full nav-link group ${isActive ? 'active' : ''}`
                  }
                >
                  <ShieldCheck size={22} className={isSidebarOpen ? 'mr-4' : 'mx-auto text-accent'} />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left font-bold text-accent">{t('sidebar.ceoPortal')}</span>
                    </>
                  )}
                </NavLink>
              </div>
            )}

            <div className="px-4 mb-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {isSidebarOpen ? t('sidebar.services') : ''}
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => 
                  `w-full nav-link group ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={22} className={isSidebarOpen ? 'mr-4' : 'mx-auto'} />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    <ChevronRight size={16} className="text-accent opacity-0 group-[.active]:opacity-100 transition-opacity" />
                  </>
                )}
              </NavLink>
            ))}

            <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {isSidebarOpen ? t('sidebar.explore') : ''}
            </div>
            {secondaryItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => 
                  `w-full nav-link group ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={20} className={isSidebarOpen ? 'mr-4' : 'mx-auto opacity-70'} />
                {isSidebarOpen && (
                  <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
