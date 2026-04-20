import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109c05e?q=80&w=2070&auto=format&fit=crop',
    title: 'Experience Unmatched Luxury',
    subtitle: 'Our Airbus A350 fleet connects you to the world with premium comfort.'
  },
  {
    url: 'https://images.unsplash.com/photo-1517400273894-91cc35824570?q=80&w=2070&auto=format&fit=crop',
    title: 'Italy Within Reach',
    subtitle: 'From the canals of Venice to the rolling hills of Tuscany.'
  },
  {
    url: 'https://images.unsplash.com/photo-1464012391122-383726056345?q=80&w=2070&auto=format&fit=crop',
    title: 'Fly Beyond Horizons',
    subtitle: 'Direct flights to major global hubs across five continents.'
  }
];

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  return (
    <div className="hero-constrained relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-24 max-w-4xl pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          key={`content-${currentIndex}`}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="pointer-events-auto"
        >
          <span className="text-accent uppercase tracking-widest font-bold mb-4 block">FlyPlus Aviation</span>
          <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
            {images[currentIndex].title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl leading-relaxed">
            {images[currentIndex].subtitle}
          </p>
          <button className="accent-button text-lg px-10 py-4 shadow-xl shadow-accent/20">
            Discover Our Fleet
          </button>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-20">
        <button 
          onClick={prev}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/20 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={next}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/20 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-24 flex gap-3">
        {images.map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-12 bg-accent' : 'w-4 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
