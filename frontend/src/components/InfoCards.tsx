import React from 'react';
import { ShieldCheck, Headphones, Globe2, CreditCard } from 'lucide-react';

const InfoCards: React.FC = () => {
  const cards = [
    {
      icon: ShieldCheck,
      title: 'Travel Insurance',
      desc: 'Fly with peace of mind. Protect your journey with our comprehensive coverage.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      desc: 'Our dedicated team is always here to help you with any request, anywhere.'
    },
    {
      icon: Globe2,
      title: 'Baggage Info',
      desc: 'Check your allowance and find out what you can bring on your FlyPlus flight.'
    },
    {
      icon: CreditCard,
      title: 'Flexible Payment',
      desc: 'Book now and pay in installments with our partner financial services.'
    }
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
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
