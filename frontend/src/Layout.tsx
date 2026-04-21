import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useUIStore } from './store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarOpen } = useUIStore();

  return (
    <div 
      className="flex min-h-screen bg-secondary max-w-full overflow-x-hidden"
      style={{ '--sidebar-width': isSidebarOpen ? '224px' : '80px' } as React.CSSProperties}
    >
      <Sidebar />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 lg:pl-[var(--sidebar-width)] min-w-0 relative`}
      >
        <header className={`fixed top-0 right-0 z-[100] transition-all duration-300 ${isSidebarOpen ? 'lg:left-56' : 'lg:left-20'} left-0 bg-primary/90 backdrop-blur-md border-b border-white/5`}>
          <Navbar />
        </header>
        <main className="flex-1 relative z-0 pt-[73px]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
