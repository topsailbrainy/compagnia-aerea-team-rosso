import React from 'react';
import { CheckCircle2, QrCode, AlertCircle } from 'lucide-react';
import gateImg from '../assets/persone/gate.webp';

const CheckIn: React.FC = () => {
  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
      <div className="mb-12 text-center relative py-20 rounded-3xl overflow-hidden">
        <img src={gateImg} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Gate" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">Online Check-in</h2>
          <p className="text-gray-500 text-xl">Save time at the airport and get your boarding pass now.</p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-12 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-2xl mb-8">
          <AlertCircle className="text-accent" size={24} />
          <p className="text-sm text-primary font-medium">
            Online check-in is available 48 hours to 90 minutes before departure.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Booking Reference or E-ticket Number</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
          <button className="w-full bg-primary text-accent font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
            Check-in Now
            <CheckCircle2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto">
        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center">
          <QrCode size={32} className="text-primary mb-4" />
          <h4 className="font-bold text-primary mb-2">Digital Boarding Pass</h4>
          <p className="text-xs text-gray-500">Receive your boarding pass directly on your smartphone.</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center">
          <CheckCircle2 size={32} className="text-primary mb-4" />
          <h4 className="font-bold text-primary mb-2">Fast Bag Drop</h4>
          <p className="text-xs text-gray-500">Already checked in? Head straight to the bag drop counter.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
