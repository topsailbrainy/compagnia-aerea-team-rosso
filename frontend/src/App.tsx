import React from 'react';
import Layout from './Layout';
import Home from './pages/Home';
import { useUIStore } from './store';
import { AnimatePresence, motion } from 'framer-motion';

const DestinationsPlaceholder = () => (
  <div className="p-12 text-center mt-20">
    <h2 className="text-4xl font-bold text-primary mb-4">World-Class Destinations</h2>
    <p className="text-gray-500">Discover our global network across 5 continents.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

const FleetPlaceholder = () => (
  <div className="p-12 text-center mt-20">
    <h2 className="text-4xl font-bold text-primary mb-4">Our Modern Fleet</h2>
    <p className="text-gray-500">The average age of our aircraft is only 4.5 years.</p>
    <div className="mt-12 space-y-8">
      {[1, 2].map(i => (
        <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const { activePage } = useUIStore();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'destinations':
        return <DestinationsPlaceholder />;
      case 'fleet':
        return <FleetPlaceholder />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-primary">Section coming soon</h2>
            <p className="text-gray-500">We are preparing this premium content for you.</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default App;
