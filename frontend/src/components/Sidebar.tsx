import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plane, Briefcase, CheckCircle2, Clock, MapPin, LayoutGrid, Info, Phone, Menu, X, ChevronRight } from 'lucide-react';
import { useUIStore } from '../store';
import { GlassCard } from 'react-glass-ui';

const Sidebar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const navItems = [
    { id: 'book', label: 'Book', icon: Plane, path: '/book' },
    { id: 'manage', label: 'Manage', icon: Briefcase, path: '/manage' },
    { id: 'check-in', label: 'Check-in', icon: CheckCircle2, path: '/check-in' },
    { id: 'flight-status', label: 'Flight Status', icon: Clock, path: '/flight-status' },
  ];

  const secondaryItems = [
    { id: 'destinations', label: 'Destinations', icon: MapPin, path: '/destinations' },
    { id: 'fleet', label: 'Our Fleet', icon: LayoutGrid, path: '/fleet' },
    { id: 'about', label: 'Company Info', icon: Info, path: '/about' },
    { id: 'contact', label: 'Contact Us', icon: Phone, path: '/contact' },
  ];

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-primary text-accent rounded-md lg:hidden"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div 
        className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40 bg-primary border-r border-white/10
          ${isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          {/* Logo Section */}
          <div className="sidebar-brand mt-8 mb-12">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-2 shadow-lg shadow-accent/20">
              <Plane className="text-primary" size={32} />
            </div>
            {isSidebarOpen && (
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tighter text-white m-0">FLY<span className="text-accent">PLUS</span></h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent/80 -mt-1 font-semibold">Aviation Excellence</p>
              </div>
            )}
          </div>

          {/* Primary Navigation */}
          <nav className="flex-1 space-y-1">
            <div className="px-4 mb-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {isSidebarOpen ? 'Services' : ''}
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
              {isSidebarOpen ? 'Explore' : ''}
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

          {/* Bottom Info */}
          {isSidebarOpen && (
            <div className="p-6">
              <GlassCard className="p-4 border-white/5 bg-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Premium Member Support</p>
                <p className="text-accent font-bold text-sm">+39 02 123 4567</p>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
