import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import BookingForm from '../components/BookingForm';
import UtilityNav from '../components/UtilityNav';
import PromotionalCarousel from '../components/PromotionalCarousel';
import InfoCards from '../components/InfoCards';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, Globe, ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import local assets
import romaImg from '../assets/destinazioni/roma.avif';
import genovaImg from '../assets/destinazioni/genova.avif';
import dubaiImg from '../assets/destinazioni/dubai.avif';

const Book: React.FC = () => {
  const { t } = useTranslation();
  const features = [
    { icon: Shield, title: t('bookPage.safe'), desc: t('bookPage.safeDesc') },
    { icon: Clock, title: t('bookPage.onTime'), desc: t('bookPage.onTimeDesc') },
    { icon: Award, title: t('bookPage.award'), desc: t('bookPage.awardDesc') },
    { icon: Globe, title: t('bookPage.global'), desc: t('bookPage.globalDesc') }
  ];

  return (
    <div className="flex flex-col">
      <HeroCarousel />
      
      <div className="pl-4 pr-6 md:pr-12">
        <BookingForm />

        {/* Features Section */}
        <section className="py-24 max-w-none ml-0">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 tracking-tight">{t('bookPage.whyTitle')}</h2>
            <p className="text-gray-500 max-w-2xl">{t('bookPage.whyDesc')}</p>
            <div className="w-24 h-1 bg-accent mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-start text-left p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <f.icon className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <PromotionalCarousel />

        <section className="max-w-none ml-0 mb-20">
          <div className="bg-primary rounded-3xl p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full -ml-24 -mb-24 blur-2xl" />
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-accent font-bold mb-4">
                <Star size={20} fill="currentColor" />
                <span className="uppercase tracking-[0.2em] text-sm">{t('bookPage.guestLabel')}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('bookPage.loyaltyTitle')}</h2>
              <p className="text-white/70 text-lg mb-8 max-w-xl">
                {t('bookPage.loyaltyDesc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="accent-button px-8 py-3">{t('bookPage.joinNow')}</button>
                <button className="text-white border border-white/20 px-8 py-3 rounded hover:bg-white/10 transition-colors">{t('bookPage.learnMore')}</button>
              </div>
            </div>
            <div className="relative z-10 w-full md:w-1/3 aspect-square bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
              <Star size={48} className="text-accent mb-4" />
              <p className="text-white font-bold text-xl mb-2">{t('bookPage.privileges')}</p>
              <p className="text-white/40 text-xs">{t('bookPage.privilegesDesc')}</p>
            </div>
          </div>
        </section>

        <InfoCards />

        <section className="py-24 bg-primary -mx-4 md:-mx-12 px-6 md:px-12 text-white overflow-hidden">
          <div className="max-w-none ml-0">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-accent uppercase tracking-[0.3em] font-bold mb-4 block">{t('sidebar.destinations')}</span>
                <h2 className="text-4xl md:text-6xl font-bold">{t('destinations.exploreWorld')}</h2>
              </div>
              <button className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded hover:bg-white transition-all group">
                {t('destinations.viewAll')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: t('destinations.rome'), img: romaImg, price: '129' },
                { name: t('destinations.genoa'), img: genovaImg, price: '89' },
                { name: t('destinations.dubai'), img: dubaiImg, price: '450' }
              ].map((dest, i) => (
                <div key={i} className="group relative h-[500px] overflow-hidden rounded-2xl cursor-pointer">
                  <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                  <img 
                    src={dest.img} 
                    alt={dest.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent z-20" />
                  <div className="absolute bottom-8 left-8 right-8 z-30">
                    <h3 className="text-3xl font-bold mb-2">{dest.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-accent font-semibold tracking-wide">{t('destinations.from')} €{dest.price}</p>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Book;
