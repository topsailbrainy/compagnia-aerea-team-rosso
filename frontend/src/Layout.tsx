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
    <div className="flex min-h-screen bg-secondary max-w-full overflow-x-hidden">
      <Sidebar />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} min-w-0`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
