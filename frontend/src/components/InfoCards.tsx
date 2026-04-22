import React from 'react';
import { ShieldCheck, Headphones, Globe, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const InfoCards: React.FC = () => {
  const { t } = useTranslation();
  const cards = [
    {
      icon: ShieldCheck,
      title: t('info.insurance'),
      desc: t('info.insuranceDesc')
    },
    {
      icon: Headphones,
      title: t('info.support'),
      desc: t('info.supportDesc')
    },
    {
      icon: Globe,
      title: t('info.baggage'),
      desc: t('info.baggageDesc')
    },
    {
      icon: CreditCard,
      title: t('info.payment'),
      desc: t('info.paymentDesc')
    }
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="max-w-none ml-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                <card.icon size={24} className="text-primary group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCards;
