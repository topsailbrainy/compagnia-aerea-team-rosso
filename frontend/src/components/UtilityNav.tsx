import React from 'react';
import { CheckCircle, Briefcase, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const UtilityNav: React.FC = () => {
  const { t } = useTranslation();
  const items = [
    { icon: CheckCircle, label: t('utility.checkin'), desc: t('utility.checkinDesc') },
    { icon: Briefcase, label: t('utility.manage'), desc: t('utility.manageDesc') },
    { icon: Clock, label: t('utility.status'), desc: t('utility.statusDesc') },
    { icon: Calendar, label: t('utility.timetable'), desc: t('utility.timetableDesc') },
  ];

  return (
    <div className="max-w-none ml-0 relative z-40 mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 bg-primary shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-[2rem] overflow-hidden border border-white/10">
        {items.map((item, index) => (
          <motion.button 
            key={index}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            className="flex flex-col lg:flex-row items-center lg:items-start gap-4 p-8 transition-colors group text-center lg:text-left relative border-r border-white/5 last:border-r-0"
          >
            <div className="p-4 bg-accent/10 rounded-2xl text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-300 shadow-sm">
              <item.icon size={28} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-black text-white text-xs uppercase tracking-[0.2em]">{item.label}</p>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest group-hover:text-accent transition-colors">{item.desc}</p>
            </div>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-accent origin-left"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default UtilityNav;
