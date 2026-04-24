import React from 'react';
import { Globe, Shield, Users, Award, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-50">
           <img 
            src="/src/assets/aerei/aereo.avif" 
            alt="FlyPlus Aircraft" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-primary" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic mb-6">
              {t('aboutPage.heroTitle').split(' ').slice(0, -1).join(' ')} <span className="text-accent">{t('aboutPage.heroTitle').split(' ').pop()}</span>
            </h1>
            <p className="text-white/90 text-xl md:text-2xl font-light tracking-wide leading-relaxed">
              {t('aboutPage.heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Identity Section */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[10px] uppercase font-black tracking-[0.5em] text-accent mb-4">{t('aboutPage.identityTag')}</h2>
            <h3 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tight mb-8 leading-none">
              {t('aboutPage.identityTitle').split(',')[0]}, <br/>
              <span className="text-accent italic">{t('aboutPage.identityTitle').split(',')[1]}</span>
            </h3>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                {t('aboutPage.identityDesc1')}
              </p>
              <p>
                {t('aboutPage.identityDesc2')}
              </p>
              <div className="pt-10 grid grid-cols-2 gap-12">
                <div className="border-l-2 border-accent pl-6">
                  <h4 className="text-primary font-black text-4xl mb-1">150+</h4>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">{t('aboutPage.destinationsLabel')}</p>
                </div>
                <div className="border-l-2 border-accent pl-6">
                  <h4 className="text-primary font-black text-4xl mb-1">4.5</h4>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">{t('aboutPage.fleetAgeLabel')}</p>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="relative">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
             >
                <img src="/src/assets/aerei/lounge.avif" alt="Lounge" className="w-full h-full object-cover" />
             </motion.div>
             <div className="absolute -bottom-10 -left-10 bg-accent p-10 rounded-[2.5rem] shadow-xl hidden md:block max-w-[280px]">
                <Award className="text-primary mb-4" size={40} />
                <h4 className="text-primary font-black uppercase text-xl leading-tight">{t('aboutPage.serviceTitle')}</h4>
                <p className="text-primary/70 text-xs font-bold mt-2 uppercase tracking-widest">{t('aboutPage.serviceSub')}</p>
             </div>
          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="bg-primary py-32 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Landmark size={600} className="text-white -mr-40" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
           <h2 className="text-accent font-black uppercase tracking-[0.4em] text-sm mb-8">{t('aboutPage.commitmentTag')}</h2>
           <p className="text-3xl md:text-5xl font-light text-white leading-tight max-w-5xl mx-auto italic">
            {t('aboutPage.commitmentQuote')}
           </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 px-6 md:px-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter mb-4">{t('aboutPage.purposeTitle')}</h2>
            <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: t('aboutPage.values.safety.title'), 
                desc: t('aboutPage.values.safety.desc') 
              },
              { 
                icon: Globe, 
                title: t('aboutPage.values.sustainability.title'), 
                desc: t('aboutPage.values.sustainability.desc') 
              },
              { 
                icon: Users, 
                title: t('aboutPage.values.guest.title'), 
                desc: t('aboutPage.values.guest.desc') 
              }
            ].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-gray-100 group"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent transition-colors duration-500">
                  <v.icon className="text-accent group-hover:text-primary transition-colors" size={40} />
                </div>
                <h3 className="text-2xl font-black text-primary uppercase tracking-tight mb-4">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed text-lg">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-12 italic">
          {t('aboutPage.skyHome').split(' ').slice(0, -1).join(' ')} <span className="text-accent">{t('aboutPage.skyHome').split(' ').pop()}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="h-[400px] rounded-[3rem] overflow-hidden relative group">
              <img src="/src/assets/aerei/sedili.avif" alt="Cabin" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-10 left-10 text-left">
                 <h4 className="text-white text-2xl font-black uppercase italic">{t('aboutPage.comfortTitle')}</h4>
                 <p className="text-white/70 uppercase tracking-widest text-xs font-bold">{t('aboutPage.comfortSub')}</p>
              </div>
           </div>
           <div className="h-[400px] rounded-[3rem] overflow-hidden relative group">
              <img src="/src/assets/aerei/rifornimento.avif" alt="Ops" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-10 left-10 text-left">
                 <h4 className="text-white text-2xl font-black uppercase italic">{t('aboutPage.hubTitle')}</h4>
                 <p className="text-white/70 uppercase tracking-widest text-xs font-bold">{t('aboutPage.hubSub')}</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;
