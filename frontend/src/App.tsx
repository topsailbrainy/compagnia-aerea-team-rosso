import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import Book from './pages/Book';
import Manage from './pages/Manage';
import CheckIn from './pages/CheckIn';
import FlightStatus from './pages/FlightStatus';
import { AnimatePresence, motion } from 'framer-motion';

const DestinationsPlaceholder = () => (
  <div className="p-12 mt-20 max-w-7xl mx-auto">
    <div className="mb-12">
      <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">World-Class Destinations</h2>
      <p className="text-gray-500 text-xl">Discover our global network across 5 continents.</p>
      <div className="w-24 h-1 bg-accent mt-6" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="group relative h-80 bg-gray-100 rounded-2xl overflow-hidden cursor-wait">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          <div className="absolute bottom-6 left-6 h-4 w-32 bg-white/20 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const FleetPlaceholder = () => (
  <div className="p-12 mt-20 max-w-7xl mx-auto">
    <div className="mb-12">
      <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">Our Modern Fleet</h2>
      <p className="text-gray-500 text-xl">The average age of our aircraft is only 4.5 years.</p>
      <div className="w-24 h-1 bg-accent mt-6" />
    </div>
    <div className="mt-12 space-y-12">
      {[1, 2].map(i => (
        <div key={i} className="h-[500px] bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="absolute bottom-12 left-12 space-y-4">
            <div className="h-8 w-64 bg-primary/10 rounded animate-pulse" />
            <div className="h-4 w-96 bg-primary/5 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const InfoPlaceholder = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="p-12 mt-20 max-w-7xl mx-auto">
    <div className="text-center max-w-3xl mx-auto space-y-6">
      <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">{title}</h2>
      <p className="text-gray-500 text-xl">{subtitle}</p>
      <div className="w-24 h-1 bg-accent mx-auto" />
      <div className="py-20">
        <div className="w-full h-96 bg-secondary rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Content is being prepared by our digital team.</p>
        </div>
      </div>
    </div>
  </div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/book" replace />} />
          <Route path="/book" element={<Book />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/flight-status" element={<FlightStatus />} />
          <Route path="/destinations" element={<DestinationsPlaceholder />} />
          <Route path="/fleet" element={<FleetPlaceholder />} />
          <Route path="/about" element={<InfoPlaceholder title="Company Excellence" subtitle="Learn about our commitment to premium aviation." />} />
          <Route path="/contact" element={<InfoPlaceholder title="Get in Touch" subtitle="Our global support team is available 24/7." />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <h2 className="text-2xl font-bold text-primary">Section coming soon</h2>
              <p className="text-gray-500">We are preparing this premium content for you.</p>
            </div>
          } />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
};

export default App;
