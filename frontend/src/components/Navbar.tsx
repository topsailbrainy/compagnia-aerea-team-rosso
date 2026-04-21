import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plane, User, Globe, Bell, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative w-full px-4 md:px-8 py-3 bg-transparent"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-4 lg:gap-12">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <Plane className="text-primary fill-primary" size={16} />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white">FLY<span className="text-accent">PLUS</span></span>
          </NavLink>
          
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Book', path: '/book' },
              { label: 'Manage', path: '/manage' },
              { label: 'Check-in', path: '/check-in' },
              { label: 'Status', path: '/flight-status' }
            ].map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ y: -2 }}
                className="relative"
              >
                <NavLink 
                  to={link.path}
                  className={({ isActive }) => `
                    text-xs font-black uppercase tracking-[0.2em] transition-all relative py-2 px-3 rounded-lg
                    ${isActive ? 'text-accent' : 'text-white/60 hover:text-accent hover:bg-white/5'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div 
                          layoutId="navUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>

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
              to="/login"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-accent transition-all flex items-center gap-2 py-2 px-2 md:px-4 rounded-lg hover:bg-white/5"
            >
              <User size={14} className="text-accent" />
              <span className="hidden sm:inline">Login</span>
            </NavLink>
            
            <button className="bg-accent hover:bg-white text-primary px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-accent/20 active:scale-95">
              Sign Up
            </button>
            
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
              {[
                { label: 'Book', path: '/book' },
                { label: 'Manage', path: '/manage' },
                { label: 'Check-in', path: '/check-in' },
                { label: 'Status', path: '/flight-status' }
              ].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    text-sm font-black uppercase tracking-[0.2em] py-3 px-4 rounded-xl transition-all
                    ${isActive ? 'bg-accent text-primary' : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {link.label}
                </NavLink>
              ))}
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
