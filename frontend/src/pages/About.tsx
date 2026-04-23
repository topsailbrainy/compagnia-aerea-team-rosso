import React from 'react';
import { Globe, Shield, Users, Star, Plane, Award, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
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
              THE ART OF <span className="text-accent">FLIGHT</span>
            </h1>
            <p className="text-white/90 text-xl md:text-2xl font-light tracking-wide leading-relaxed">
              We are the spirit of Italy in the sky, connecting cultures and people with elegance, passion, and precision.
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
            <h2 className="text-[10px] uppercase font-black tracking-[0.5em] text-accent mb-4">Our Identity</h2>
            <h3 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tight mb-8 leading-none">
              Italian Excellence, <br/>
              <span className="text-accent italic">Global Vision</span>
            </h3>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                FlyPlus was born from a vision to redefine premium aviation. As Italy's leading global carrier, we carry the legacy of Italian craftsmanship and hospitality to every corner of the world.
              </p>
              <p>
                From our hub in Rome, we operate one of the world's youngest and most technologically advanced fleets. Every journey with us is a celebration of style, comfort, and the timeless beauty of the Italian way of life.
              </p>
              <div className="pt-10 grid grid-cols-2 gap-12">
                <div className="border-l-2 border-accent pl-6">
                  <h4 className="text-primary font-black text-4xl mb-1">150+</h4>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Global Destinations</p>
                </div>
                <div className="border-l-2 border-accent pl-6">
                  <h4 className="text-primary font-black text-4xl mb-1">4.5</h4>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Avg Fleet Age</p>
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
                <h4 className="text-primary font-black uppercase text-xl leading-tight">World Class Service</h4>
                <p className="text-primary/70 text-xs font-bold mt-2 uppercase tracking-widest">Skytrax 5-Star Rated</p>
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
           <h2 className="text-accent font-black uppercase tracking-[0.4em] text-sm mb-8">Our Commitment</h2>
           <p className="text-3xl md:text-5xl font-light text-white leading-tight max-w-5xl mx-auto italic">
            "To provide a travel experience that is as memorable as the destination itself, through innovation and sustainable growth."
           </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 px-6 md:px-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter mb-4">Driven by Purpose</h2>
            <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Safety & Reliability", 
                desc: "Uncompromising standards in maintenance and operations, ensuring the highest level of safety for every guest." 
              },
              { 
                icon: Globe, 
                title: "Sustainability", 
                desc: "Leading the industry towards a greener future with next-generation aircraft and carbon reduction initiatives." 
              },
              { 
                icon: Users, 
                title: "Guest-Centricity", 
                desc: "Every detail of our service is designed around the needs and comfort of our international travelers." 
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
          THE SKY IS <span className="text-accent">HOME</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="h-[400px] rounded-[3rem] overflow-hidden relative group">
              <img src="/src/assets/aerei/sedili.avif" alt="Cabin" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-10 left-10 text-left">
                 <h4 className="text-white text-2xl font-black uppercase italic">Signature Comfort</h4>
                 <p className="text-white/70 uppercase tracking-widest text-xs font-bold">Premium Experience</p>
              </div>
           </div>
           <div className="h-[400px] rounded-[3rem] overflow-hidden relative group">
              <img src="/src/assets/aerei/rifornimento.avif" alt="Ops" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-10 left-10 text-left">
                 <h4 className="text-white text-2xl font-black uppercase italic">Global Hub</h4>
                 <p className="text-white/70 uppercase tracking-widest text-xs font-bold">Strategic Operations</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;
