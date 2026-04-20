import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import BookingForm from '../components/BookingForm';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, Globe } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    { icon: Shield, title: 'Safe & Secure', desc: 'Industry-leading safety protocols and secure booking systems.' },
    { icon: Clock, title: 'Always On Time', desc: 'Ranked top 5 globally for on-time performance and reliability.' },
    { icon: Award, title: 'Award Winning', desc: '5-star service recognized by Skytrax for 10 consecutive years.' },
    { icon: Globe, title: 'Global Network', desc: 'Connecting you to over 150 destinations worldwide from Italy.' }
  ];

  return (
    <div className="flex flex-col">
      <HeroCarousel />
      
      <div className="px-6 md:px-12">
        <BookingForm />

        {/* Features Section */}
        <section className="py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Why Choose FlyPlus?</h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <f.icon className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Destinations Preview */}
        <section className="py-24 bg-primary -mx-12 px-12 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-accent uppercase tracking-[0.3em] font-bold mb-4 block">Destinations</span>
                <h2 className="text-4xl md:text-6xl font-bold">Explore the World</h2>
              </div>
              <button className="accent-button">View All Destinations</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Rome, Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop', price: '129' },
                { name: 'Milan, Italy', img: 'https://images.unsplash.com/photo-1520440229334-962aee4d1b97?q=80&w=1974&auto=format&fit=crop', price: '89' },
                { name: 'Dubai, UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop', price: '450' }
              ].map((dest, i) => (
                <div key={i} className="group relative h-[500px] overflow-hidden rounded-2xl cursor-pointer">
                  <img 
                    src={dest.img} 
                    alt={dest.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-bold mb-2">{dest.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-accent font-semibold tracking-wide">From €{dest.price}</p>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                        <Globe size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2831] text-white/60 py-20 px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h1 className="text-2xl font-bold text-white mb-6">FLY<span className="text-accent">PLUS</span></h1>
            <p className="text-sm leading-relaxed mb-8">
              A premium aviation experience connecting Italy to the world with the youngest and most modern fleet.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Book a flight</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Manage booking</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Flight status</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Check-in</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Services</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Business Class</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Economy Class</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">In-flight dining</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Sky Loyalty</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to get the latest offers.</p>
            <div className="flex">
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 px-4 py-2 rounded-l outline-none focus:border-accent w-full" />
              <button className="bg-accent text-primary font-bold px-4 rounded-r hover:bg-white transition-colors">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-xs flex flex-col md:flex-row justify-between gap-4">
          <p>© 2026 FlyPlus Aviation. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
