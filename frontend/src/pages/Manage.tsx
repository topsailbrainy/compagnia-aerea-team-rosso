import React from 'react';
import { Search, Briefcase, ChevronRight } from 'lucide-react';
import attesaImg from '../assets/persone/attesa.avif';

const Manage: React.FC = () => {
  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">Manage Your Booking</h2>
          <p className="text-gray-500 text-xl">View, change or upgrade your flight with ease.</p>
          <div className="w-24 h-1 bg-accent mt-6" />
        </div>
        <div className="w-full md:w-80 h-48 rounded-3xl overflow-hidden shadow-2xl relative group">
          <img src={attesaImg} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Manage Booking" />
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-primary mb-8">Retrieve your booking</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Booking Reference</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ABC123" 
                    className="w-full bg-gray-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rossi" 
                    className="w-full bg-gray-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>
              <button className="w-full bg-primary text-accent font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                <Search size={20} />
                Find Booking
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary p-8 rounded-3xl">
            <Briefcase className="text-accent mb-4" size={32} />
            <h4 className="text-xl font-bold text-primary mb-2">Why Manage Online?</h4>
            <ul className="space-y-4 mt-6">
              {['Select seats in advance', 'Add extra baggage', 'Request special meals', 'Upgrade to Business Class'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                  <ChevronRight size={14} className="text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
