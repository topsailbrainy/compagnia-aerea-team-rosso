import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const PromotionalCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const promos = [
    { title: 'Book our latest deals', category: 'OFFERS', desc: 'Explore the world with our special fares.' },
    { title: 'Italy Stopover', category: 'EXPERIENCE', desc: 'Enjoy a free hotel stay in Rome or Milan.' },
    { title: 'FlyPlus Guest', category: 'LOYALTY', desc: 'Earn miles every time you fly with us.' },
    { title: 'Sky Suite', category: 'LUXURY', desc: 'Experience the world\'s most private suite in the sky.' },
    { title: 'Our New Routes', category: 'EXPLORE', desc: 'Discover our expanding global network.' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Discover more</h2>
            <div className="w-20 h-1 bg-accent" />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="p-3 border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all group"
            >
              <ChevronLeft size={24} className="text-gray-400 group-hover:text-white" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all group"
            >
              <ChevronRight size={24} className="text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {promos.map((promo, index) => (
            <div 
              key={index}
              className="min-w-[300px] md:min-w-[380px] snap-start"
            >
              <div className="bg-secondary rounded-2xl overflow-hidden group cursor-pointer h-[450px] flex flex-col">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {/* Image Placeholder */}
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-primary tracking-widest rounded-full uppercase">
                      {promo.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between border-t border-gray-100">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      {promo.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {promo.desc}
                    </p>
                  </div>
                  <div className="flex items-center text-accent font-bold text-sm gap-2">
                    Learn more <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalCarousel;
