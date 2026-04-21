import React from 'react';
import { Search, PlaneTakeoff, PlaneLanding, Clock } from 'lucide-react';
import aereoImg from '../assets/aerei/aereo.avif';

const FlightStatus: React.FC = () => {
  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">Flight Status</h2>
          <p className="text-gray-500 text-xl">Real-time information on all FlyPlus flights.</p>
          <div className="w-24 h-1 bg-accent mt-6" />
        </div>
        <div className="w-full md:w-64 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
          <img src={aereoImg} className="w-full h-full object-cover" alt="Flight" />
        </div>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex gap-4 mb-4">
              <button className="px-6 py-2 bg-primary text-accent font-bold rounded-full text-sm">By Flight Number</button>
              <button className="px-6 py-2 text-gray-400 font-bold rounded-full text-sm hover:bg-gray-50">By Route</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Flight Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">FP</span>
                  <input 
                    type="text" 
                    placeholder="e.g. 102" 
                    className="w-full bg-gray-50 border-none p-4 pl-10 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Departure Date</label>
                <input 
                  type="date" 
                  className="w-full bg-gray-50 border-none p-4 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
            </div>
            <button className="w-full md:w-auto bg-primary text-accent font-bold px-12 py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              <Search size={20} />
              Check Status
            </button>
          </div>
          
          <div className="lg:w-1/3 bg-secondary rounded-2xl p-8 flex flex-col justify-center">
            <h4 className="font-bold text-primary mb-6 flex items-center gap-2">
              <Clock size={20} className="text-accent" />
              Latest Updates
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                  <PlaneTakeoff size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">FP 102 to Rome</p>
                  <p className="text-xs text-green-600 font-medium">On time - Departed 10:45</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                  <PlaneLanding size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">FP 305 from Dubai</p>
                  <p className="text-xs text-accent font-medium">Delayed - Expected 14:20</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightStatus;
