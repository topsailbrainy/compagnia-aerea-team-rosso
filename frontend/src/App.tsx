import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import Book from './pages/Book';
import Manage from './pages/Manage';
import CheckIn from './pages/CheckIn';
import FlightStatus from './pages/FlightStatus';
import Auth from './pages/Auth';
import ScrollToTop from './components/ScrollToTop';
import { AnimatePresence, motion } from 'framer-motion';

// Import assets for placeholders
import africaImg from './assets/destinazioni/africa.avif';
import americaImg from './assets/destinazioni/america.avif';
import asiaImg from './assets/destinazioni/asia.avif';
import europaImg from './assets/destinazioni/europa.avif';
import oceaniaImg from './assets/destinazioni/oceania.avif';
import arabiaImg from './assets/destinazioni/arabia.avif';

import aereoImg from './assets/aerei/aereo.avif';
import sediliImg from './assets/aerei/sedili.avif';
import loungeImg from './assets/aerei/lounge.avif';
import rifornimentoImg from './assets/aerei/rifornimento.avif';

import attesaImg from './assets/persone/attesa.avif';
import caneImg from './assets/persone/cane.avif';
import famigliaImg from './assets/persone/famiglia.webp';
import gateImg from './assets/persone/gate.webp';

const DestinationsPlaceholder = () => {
  const dests = [
    { name: 'Africa', img: africaImg },
    { name: 'America', img: americaImg },
    { name: 'Asia', img: asiaImg },
    { name: 'Europe', img: europaImg },
    { name: 'Oceania', img: oceaniaImg },
    { name: 'Middle East', img: arabiaImg },
  ];

  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">World-Class Destinations</h2>
        <p className="text-gray-500 text-xl">Discover our global network across 5 continents.</p>
        <div className="w-24 h-1 bg-accent mt-6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {dests.map((dest, i) => (
          <div key={i} className="group relative h-80 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer">
            <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-2xl font-bold text-white">{dest.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FleetPlaceholder = () => {
  const fleet = [
    { name: 'Our Aircraft', desc: 'Modern and efficient fleet.', img: aereoImg },
    { name: 'Premium Cabins', desc: 'Unmatched comfort in the sky.', img: sediliImg },
    { name: 'Exclusive Lounges', desc: 'Relax before your flight.', img: loungeImg },
    { name: 'Operational Excellence', desc: 'Safety and reliability first.', img: rifornimentoImg },
  ];

  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">Our Modern Fleet</h2>
        <p className="text-gray-500 text-xl">The average age of our aircraft is only 4.5 years.</p>
        <div className="w-24 h-1 bg-accent mt-6" />
      </div>
      <div className="mt-12 space-y-12">
        {fleet.map((item, i) => (
          <div key={i} className="h-[500px] bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-100 group">
            <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/20 to-transparent" />
            <div className="absolute bottom-12 left-12 space-y-4">
              <h3 className="text-4xl font-bold text-white">{item.name}</h3>
              <p className="text-white/80 text-xl">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InfoPlaceholder = ({ title, subtitle }: { title: string, subtitle: string }) => {
  const images = [attesaImg, caneImg, famigliaImg, gateImg];
  const [randomImg] = React.useState(() => images[Math.floor(Math.random() * images.length)]);

  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">{title}</h2>
        <p className="text-gray-500 text-xl">{subtitle}</p>
        <div className="w-24 h-1 bg-accent mx-auto" />
        <div className="py-20">
          <div className="w-full h-[500px] bg-secondary rounded-3xl flex items-center justify-center overflow-hidden relative">
            <img src={randomImg} alt="Info" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <p className="text-white text-xl font-medium">Content is being prepared by our digital team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          <Route path="/login" element={<Auth />} />
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
      <ScrollToTop />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
};

export default App;
