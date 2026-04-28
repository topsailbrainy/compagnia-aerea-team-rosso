import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, MessageSquare, Clock, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const contactMethods = [
// ... (rest of contactMethods remains same)
    {
      icon: Phone,
      title: t('contactPage.methods.call.title'),
      value: "+39 02 123 4567",
      desc: t('contactPage.methods.call.desc')
    },
    {
      icon: Mail,
      title: t('contactPage.methods.email.title'),
      value: "support@flyplus.it",
      desc: t('contactPage.methods.email.desc')
    },
    {
      icon: MapPin,
      title: t('contactPage.methods.visit.title'),
      value: "Via Montenapoleone 1, Milano, Italy",
      desc: t('contactPage.methods.visit.desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-4"
          >
            {t('contactPage.title').split(' ').slice(0, -1).join(' ')} <span className="text-accent italic">{t('contactPage.title').split(' ').pop()}</span>
          </motion.h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">
            {t('contactPage.subtitle')}
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-8" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {contactMethods.map((method, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all group"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-primary transition-colors">
                <method.icon size={32} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">{method.title}</h3>
              <p className="text-2xl font-black text-primary tracking-tight mb-4">{method.value}</p>
              <p className="text-gray-500 text-sm font-medium">{method.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary rounded-[4rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div className="p-12 lg:p-20 flex-1">
            <div className="flex items-center gap-3 text-accent font-black uppercase tracking-[0.4em] text-xs mb-6">
              <MessageSquare size={16} />
              {t('contactPage.form.sendMsg')}
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-12">
              {t('contactPage.form.question')} <br/>
              <span className="text-white/40 italic">{t('contactPage.form.help')}</span>
            </h2>
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      type="text" 
                      required
                      placeholder={t('contactPage.form.fullName')}
                      className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
                    />
                    <input 
                      type="email" 
                      required
                      placeholder={t('contactPage.form.email')}
                      className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder={t('contactPage.form.subject')}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
                  />
                  <textarea 
                    placeholder={t('contactPage.form.message')}
                    required
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-colors resize-none"
                  />
                  <button type="submit" className="w-full bg-accent text-primary font-black uppercase tracking-widest py-6 rounded-2xl hover:bg-white transition-all shadow-xl shadow-accent/20 active:scale-[0.98]">
                    {t('contactPage.form.send')}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-primary mb-8 shadow-glow">
                    <Check size={48} strokeWidth={3} />
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
                    {t('contactPage.form.successTitle')}
                  </h3>
                  <p className="text-white/60 font-bold uppercase tracking-widest text-sm max-w-md">
                    {t('contactPage.form.successDesc')}
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-12 text-accent font-black uppercase tracking-widest text-xs border-b-2 border-accent pb-1 hover:text-white hover:border-white transition-all"
                  >
                    {t('common.back')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="lg:w-1/3 bg-accent p-12 lg:p-20 flex flex-col justify-between">
            <div className="space-y-12">
              <div>
                <h4 className="text-primary font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                  <Clock size={16} />
                  {t('contactPage.operatingHours')}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-primary/80">
                    <span>{t('contactPage.monFri')}</span>
                    <span>{t('contactPage.h24')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-primary/80">
                    <span>{t('contactPage.satSun')}</span>
                    <span>08:00 - 22:00</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-primary font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                  <Globe size={16} />
                  {t('contactPage.globalOffices')}
                </h4>
                <ul className="space-y-4 font-bold text-primary">
                  <li>Milan (HQ)</li>
                  <li>London Heathrow</li>
                  <li>New York JFK</li>
                  <li>Dubai International</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-12">
              <p className="text-primary font-black text-4xl italic uppercase tracking-tighter">
                FLY<span className="text-white">PLUS</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
