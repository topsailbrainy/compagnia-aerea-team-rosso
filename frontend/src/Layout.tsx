import React from 'react';
import Sidebar from './components/Sidebar';
import { useUIStore } from './store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar />
      <main 
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
