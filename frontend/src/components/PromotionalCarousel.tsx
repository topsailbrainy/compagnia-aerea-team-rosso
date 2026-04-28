import React, { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store';

// Import images from assets
import aereoImg from '../assets/aerei/aereo.avif';
import loungeImg from '../assets/aerei/lounge.avif';
import romaImg from '../assets/destinazioni/roma.avif';
import maldiveImg from '../assets/destinazioni/maldive.avif';
import tokyoImg from '../assets/destinazioni/tokyo.avif';

const PromotionalCarousel: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSearch } = useSearchStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const promos = [
    { 
      id: 'deals',
      title: t('promotions.items.deals.title'), 
      category: t('promotions.items.deals.category'), 
      desc: t('promotions.items.deals.desc'), 
      image: maldiveImg,
      buttonText: t('promotions.items.deals.button', { defaultValue: t('promotions.learnMore') }),
      action: () => {
        setSearch('from', 'MLE'); // Maldives
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    { 
      id: 'stopover',
      title: t('promotions.items.stopover.title'), 
      category: t('promotions.items.stopover.category'), 
      desc: t('promotions.items.stopover.desc'), 
      image: romaImg,
      buttonText: t('promotions.items.stopover.button', { defaultValue: t('promotions.learnMore') }),
      action: () => {
        setSearch('from', 'FCO'); // Rome
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    { 
      id: 'loyalty',
      title: t('promotions.items.loyalty.title'), 
      category: t('promotions.items.loyalty.category'), 
      desc: t('promotions.items.loyalty.desc'), 
      image: aereoImg,
      buttonText: t('promotions.items.loyalty.button', { defaultValue: t('promotions.learnMore') }),
      action: () => navigate('/login?tab=signup')
    },
    { 
      id: 'suite',
      title: t('promotions.items.suite.title'), 
      category: t('promotions.items.suite.category'), 
      desc: t('promotions.items.suite.desc'), 
      image: loungeImg,
      buttonText: t('promotions.items.suite.button', { defaultValue: t('promotions.learnMore') }),
      action: () => navigate('/about')
    },
    { 
      id: 'routes',
      title: t('promotions.items.routes.title'), 
      category: t('promotions.items.routes.category'), 
      desc: t('promotions.items.routes.desc'), 
      image: tokyoImg,
      buttonText: t('promotions.items.routes.button', { defaultValue: t('promotions.learnMore') }),
      action: () => {
        setSearch('from', 'NRT'); // Tokyo
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
  ];

  // Triple the promos to create an infinite loop effect
  const extendedPromos = [...promos, ...promos, ...promos];

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      // Start in the middle set of items
      const setWidth = container.scrollWidth / 3;
      container.scrollLeft = setWidth;
    }
  }, []);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth } = container;
    const setWidth = scrollWidth / 3;

    // Jump logic for infinite loop
    if (scrollLeft <= 0) {
      container.scrollLeft = setWidth;
    } else if (scrollLeft >= setWidth * 2) {
      container.scrollLeft = setWidth;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 overflow-hidden bg-transparent">
      <div className="max-w-none ml-0">
        <div className="flex justify-between items-end mb-10 px-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t('promotions.title')}</h2>
            <div className="w-20 h-1 bg-accent" />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="p-3 border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all group bg-white/50 backdrop-blur-sm"
            >
              <ChevronLeft size={24} className="text-gray-400 group-hover:text-white" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all group bg-white/50 backdrop-blur-sm"
            >
              <ChevronRight size={24} className="text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6"
        >
          {extendedPromos.map((promo, index) => (
            <div 
              key={index}
              className="min-w-[300px] md:min-w-[420px] snap-start"
            >
              <div 
                onClick={promo.action}
                className="rounded-3xl overflow-hidden group cursor-pointer h-[500px] flex flex-col transition-all duration-500 hover:translate-y-[-8px]"
              >
                <div className="h-2/3 relative overflow-hidden">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold text-primary tracking-[0.2em] rounded-full uppercase shadow-lg">
                      {promo.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between bg-white/80 backdrop-blur-md border border-white/20 border-t-0 rounded-b-3xl">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      {promo.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {promo.desc}
                    </p>
                  </div>
                  <div className="flex items-center text-accent font-bold text-sm gap-2 group/btn">
                    <span className="relative overflow-hidden">
                      {promo.buttonText}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent transform translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300" />
                    </span>
                    <ChevronRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
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
