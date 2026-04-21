import React from 'react';
import { motion } from 'framer-motion';

// Import local assets
import aereoImg from '../assets/aerei/aereo.avif';

const HeroCarousel: React.FC = () => {
  return (
    <div className="hero-constrained relative w-full lg:w-[calc(100%+var(--sidebar-width))] lg:-ml-[var(--sidebar-width)] overflow-hidden transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={aereoImg}
          alt="Experience Unmatched Luxury"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
      </motion.div>
    </div>
  );
};

export default HeroCarousel;
