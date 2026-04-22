import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { User, Globe, Bell, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative w-full px-4 md:px-8 py-3 bg-transparent"
    >
      <div className="flex items-center justify-end border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-6 mr-6 pr-6 border-r border-white/10">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-accent transition-all flex items-center gap-2">
              <Globe size={14} className="text-accent" />
              EN
            </button>
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-accent transition-all flex items-center gap-2">
              <Bell size={14} className="text-accent" />
              Alerts
            </button>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <NavLink 
              to="/login?tab=login"
              className={({ isActive }) => `
                text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 py-2 px-2 md:px-4 rounded-lg hover:bg-white/5
                ${isActive && !location.search.includes('tab=signup') ? 'text-accent bg-white/5' : 'text-white/60 hover:text-accent'}
              `}
            >
              <User size={14} className="text-accent" />
              <span className="hidden sm:inline">Login</span>
            </NavLink>
            
            <NavLink 
              to="/login?tab=signup"
              className="bg-accent hover:bg-white text-primary px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-accent/20 active:scale-95 inline-block text-center"
            >
              Sign Up
            </NavLink>
            
            <button 
              className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <Menu size={24} className="text-accent" /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
                  <Globe size={14} className="text-accent" /> EN
                </button>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
                  <Bell size={14} className="text-accent" /> Alerts
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
