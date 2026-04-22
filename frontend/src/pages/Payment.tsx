import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  ChevronRight,
  CheckCircle2,
  Info
} from 'lucide-react';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { 
    from, to, departureDate, returnDate, 
    outboundFlight, returnFlight, outboundPrice, returnPrice,
    passengers: passengerCount, outboundCabin, returnCabin, tripType 
  } = useSearchStore();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const taxesPerFlight = 34.20;
  const flightsCount = tripType === 'return' ? 2 : 1;
  const totalTaxes = taxesPerFlight * flightsCount * (passengerCount || 1);
  const totalBasePrice = (outboundPrice + returnPrice) * (passengerCount || 1);
  const totalPrice = totalBasePrice + totalTaxes;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8">
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-4xl font-bold text-primary mb-4">Booking Confirmed!</h1>
        <p className="text-gray-500 max-w-md mb-12">Your flight to {to} has been successfully booked. We've sent the confirmation and e-tickets to your email.</p>
        <div className="bg-gray-50 rounded-3xl p-8 max-w-sm w-full mb-12 text-left border border-gray-100">
            <div className="flex justify-between mb-4"><span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Booking Ref</span><span className="text-primary font-bold">FP-9928371</span></div>
            <div className="flex justify-between"><span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Status</span><span className="text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-1 rounded-md">Confirmed</span></div>
        </div>
        <button onClick={() => navigate('/book')} className="bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] px-12 py-5 rounded-2xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/10">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-xs uppercase tracking-widest mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Passengers
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <header className="mb-10"><h1 className="text-4xl font-bold text-primary mb-2">Payment Details</h1><p className="text-gray-500">Choose your preferred payment method and complete your booking.</p></header>
            <div className="flex gap-4 mb-8">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                { id: 'apple', label: 'Apple Pay', icon: Lock }
              ].map((method) => (
                <button key={method.id} onClick={() => setPaymentMethod(method.id as any)} className={`flex-1 p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 ${paymentMethod === method.id ? 'bg-white border-accent ring-1 ring-accent shadow-lg' : 'bg-white/50 border-gray-100 hover:border-accent/30'}`}>
                  <method.icon className={paymentMethod === method.id ? 'text-accent' : 'text-gray-300'} size={24} /><span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === method.id ? 'text-primary' : 'text-gray-400'}`}>{method.label}</span>
                </button>
              ))}
            </div>
            <motion.div layout className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10">
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="flex items-center gap-4 mb-8"><div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Lock size={24} /></div><h2 className="text-xl font-bold text-primary">Secure Transaction</h2></div>
                <div className="space-y-6">
                  <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">Cardholder Name</label><input type="text" required placeholder="e.g. Leonardo Da Vinci" className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all" /></div>
                  <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">Card Number</label><div className="relative"><CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={18} /><input type="text" required placeholder="0000 0000 0000 0000" className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl pl-14 pr-6 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all" /></div></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">Expiry Date</label><input type="text" required placeholder="MM/YY" className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all" /></div>
                    <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">CVV</label><input type="password" required maxLength={3} placeholder="***" className="w-full h-[54px] bg-gray-50 border border-transparent rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-accent/20 transition-all" /></div>
                  </div>
                </div>
                <div className="pt-8 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 text-green-600"><ShieldCheck size={18} /><span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Compliant Payment</span></div>
                    <button disabled={isProcessing} type="submit" className="w-full bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isProcessing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <><CreditCard size={18} /> Complete Booking • €{totalPrice.toFixed(2)}<ChevronRight size={18} /></>}
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-lg font-bold mb-6 relative z-10">Final Summary</h3>
                <div className="space-y-6 relative z-10">
                  <div className="pb-6 border-b border-white/10">
                    <p className="text-[10px] font-black uppercase text-accent tracking-widest mb-1">Flights</p>
                    <div className="space-y-2">
                        <p className="font-bold text-sm">{outboundFlight?.from} → {outboundFlight?.to}</p>
                        {tripType === 'return' && <p className="font-bold text-sm">{returnFlight?.from} → {returnFlight?.to}</p>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="text-white/50 text-sm font-medium">Guests</span><span className="font-bold">{passengerCount} Passenger{passengerCount > 1 ? 's' : ''}</span></div>
                    <div className="flex justify-between items-center"><span className="text-white/50 text-sm font-medium">Outbound Cabin</span><span className="font-bold capitalize">{outboundCabin}</span></div>
                    {tripType === 'return' && <div className="flex justify-between items-center"><span className="text-white/50 text-sm font-medium">Return Cabin</span><span className="font-bold capitalize">{returnCabin}</span></div>}
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center"><span className="text-accent font-black uppercase text-[10px] tracking-widest">Total to Pay</span><span className="text-3xl font-bold text-white">€{totalPrice.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
