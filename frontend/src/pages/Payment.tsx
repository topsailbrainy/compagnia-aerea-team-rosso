import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Info,
  Plane,
  Apple,
  Navigation,
  Globe,
} from "lucide-react";

type PaymentMethod = "card" | "paypal" | "apple";

const Payment: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    to,
    departureDate,
    outboundFlight,
    returnFlight,
    outboundPrice,
    returnPrice,
    passengers: passengerCount,
    outboundCabin,
    returnCabin,
    tripType,
    baggageCost,
    assistanceCost,
    selectedSeats = [],
  } = useSearchStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const bookingRef = useMemo(() => `FP-${Math.floor(Math.random() * 10000000)}`, []);

  const taxesPerFlight = 34.2;
  const flightsCount = tripType === "return" ? 2 : 1;
  const totalTaxes = taxesPerFlight * flightsCount * (passengerCount || 1);
  const totalBasePrice = (outboundPrice + returnPrice) * (passengerCount || 1);
  const totalPrice = totalBasePrice + totalTaxes + baggageCost + assistanceCost;

  const steps = [
    "FlyPlus: Fueling the transaction...",
    "Clearing weather for payment...",
    "Requesting clearance from Tower...",
    "FlyPlus: Preparing for takeoff...",
    "Lining up on the runway...",
  ];

  const [formData, setFormData] = useState({
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let formattedValue = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formattedValue += " ";
      formattedValue += value[i];
    }
    setFormData({ ...formData, cardNumber: formattedValue.trim() });
    if (value.length < 16) {
      setErrors({ ...errors, cardNumber: "Card number must be 16 digits" });
    } else {
      setErrors({ ...errors, cardNumber: "" });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setFormData({ ...formData, expiry: value.substring(0, 5) });
    
    if (value.length === 5) {
      const [month, year] = value.split("/").map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (month < 1 || month > 12) {
        setErrors({ ...errors, expiry: "Invalid month" });
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        setErrors({ ...errors, expiry: "Card expired" });
      } else {
        setErrors({ ...errors, expiry: "" });
      }
    } else {
      setErrors({ ...errors, expiry: "Format MM/YY" });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    setFormData({ ...formData, cvv: value });
    if (value.length < 3) {
      setErrors({ ...errors, cvv: "CVV must be 3 digits" });
    } else {
      setErrors({ ...errors, cvv: "" });
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (formData.cardNumber.replace(/\s/g, "").length < 16 || 
        errors.expiry || formData.expiry.length < 5 ||
        formData.cvv.length < 3) {
      return;
    }

    setIsProcessing(true);
    setProcessingStep(0);

    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const getPaymentMethodAnimation = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="w-full flex justify-between items-start mb-8">
              <div className="w-12 h-8 bg-accent/40 rounded-md border border-accent/20" />
              <CreditCard size={32} className="text-accent" />
            </div>
            <div className="w-full space-y-4">
              <div className="h-2 w-full bg-white/20 rounded-full" />
              <div className="h-2 w-2/3 bg-white/20 rounded-full" />
            </div>
            <div className="w-full flex justify-between mt-8">
              <div className="h-2 w-20 bg-white/10 rounded-full" />
              <div className="h-2 w-12 bg-white/10 rounded-full" />
            </div>
          </motion.div>
        );
      case "paypal":
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 p-8 bg-[#003087]/5 rounded-[2.5rem] border-2 border-dashed border-[#003087]/20"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-[#003087]/10"
            >
              <span className="font-black italic text-3xl text-[#003087]">
                P<span className="text-[#0070ba]">P</span>
              </span>
            </motion.div>
            <div className="text-center">
              <p className="text-xs font-black uppercase text-[#003087] tracking-widest">
                PayPal Express Checkout
              </p>
              <p className="text-[10px] font-bold text-[#0070ba]/60 uppercase mt-1 tracking-[0.2em]">
                One-touch payment active
              </p>
            </div>
          </motion.div>
        );
      case "apple":
        return (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center justify-center gap-6 p-8 bg-black rounded-[2.5rem] border border-white/10 shadow-2xl relative"
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Apple size={48} className="text-white fill-white" />
            </motion.div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-accent flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-4 h-4 bg-accent rounded-full"
                />
              </div>
              <p className="text-[10px] font-black uppercase text-white tracking-[0.3em]">
                Double-click to Pay
              </p>
            </div>
          </motion.div>
        );
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-12 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Creative Success Animation: Airplane Takeoff */}
        <div className="relative w-full max-w-lg h-64 mb-8 flex items-center justify-center">
          {/* Runway Background */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute h-1 bg-primary/10 w-full rounded-full"
          />

          <motion.div
            initial={{ x: "-300%", y: 0, rotate: 0, scale: 0.5 }}
            animate={{ x: "400%", y: -300, rotate: -35, scale: 1.5 }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
            className="absolute z-20"
          >
            <div className="relative">
              <Plane
                size={100}
                className="text-primary fill-primary drop-shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0.8, scaleX: 0 }}
                animate={{ opacity: 0, scaleX: 3 }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute right-full top-1/2 -translate-y-1/2 w-48 h-1 bg-gradient-to-l from-accent to-transparent origin-right"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: "spring", stiffness: 100 }}
            className="z-10"
          >
            <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center text-primary shadow-[0_0_50px_rgba(205,164,52,0.3)] border-8 border-white">
              <CheckCircle2 size={64} />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.3 }}
        >
          <h1 className="text-5xl font-black text-primary mb-4 uppercase tracking-tighter italic">
            FLY<span className="text-accent">PLUS</span> CONFIRMED
          </h1>
          <p className="text-gray-500 max-w-md mb-12 font-bold uppercase tracking-widest text-xs">
            {t("paymentPage.confirmedDesc", { to: to || "your destination" })}
          </p>

          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full mx-auto mb-12 text-left border-2 border-primary/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16" />
            <div className="flex justify-between mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-accent" />
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {t("paymentPage.bookingRef")}
                </span>
              </div>
              <span className="text-primary font-black tracking-widest text-lg">
                {bookingRef}
              </span>
            </div>
            <div className="space-y-6 mb-10 relative z-10">
              <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                  <p className="text-[10px] font-black text-gray-300 uppercase mb-1">
                    Route
                  </p>
                  <p className="text-2xl font-black text-primary tracking-tighter">
                    {outboundFlight?.from || "---"} →{" "}
                    {outboundFlight?.to || "---"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-300 uppercase mb-1">
                    Seats
                  </p>
                  <p className="text-xl font-black text-accent">
                    {Array.isArray(selectedSeats)
                      ? selectedSeats.join(", ")
                      : "---"}
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm font-bold text-primary/60 uppercase tracking-widest">
                <span>{departureDate || "---"}</span>
                <span>
                  {passengerCount} {t("common.guest")}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-8 border-t-2 border-dashed border-gray-100 relative z-10">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                Boarding Status
              </span>
              <span className="text-green-600 font-black uppercase text-[10px] tracking-[0.2em] bg-green-50 px-4 py-2 rounded-xl border border-green-100 shadow-sm">
                Ready for departure
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/book")}
            className="group relative bg-primary text-white font-black text-[10px] uppercase tracking-[0.3em] px-16 py-6 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 transition-all hover:bg-accent hover:text-primary active:scale-95"
          >
            <span className="relative z-10">{t("paymentPage.returnHome")}</span>
            <motion.div
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12 relative">
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            {/* FlyPlus Branded Loading Reference */}
            <div className="relative w-48 h-48 mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-accent/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-4 border border-accent/10 rounded-full"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Plane className="text-accent" size={48} />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-accent rounded-full -z-10"
                  />
                </div>
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0"
              >
                <Navigation
                  size={16}
                  className="text-accent absolute top-0 left-1/2 -translate-x-1/2 rotate-90"
                />
              </motion.div>
            </div>

            <h2 className="text-white text-4xl font-black uppercase tracking-tighter mb-2 italic">
              FLY<span className="text-accent">PLUS</span>
            </h2>
            <p className="text-accent/60 text-[10px] font-black uppercase tracking-[0.6em] mb-8">
              Securing Your Journey
            </p>

            <motion.p
              key={steps[processingStep]}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white font-bold tracking-widest text-sm uppercase"
            >
              {steps[processingStep]}
            </motion.p>

            <div className="mt-12 flex gap-3">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    scale: i === processingStep ? 1.2 : 1,
                    backgroundColor:
                      i <= processingStep ? "#CDA434" : "rgba(255,255,255,0.1)",
                  }}
                  className="w-12 h-1.5 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-xs uppercase tracking-widest mb-8 transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          {t("paymentPage.backPassengers")}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <header className="mb-10">
              <h1 className="text-4xl font-black text-primary mb-2 uppercase tracking-tight">
                {t("paymentPage.paymentDetails")}
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                {t("paymentPage.paymentDesc")}
              </p>
            </header>

            <div className="flex gap-4 mb-8">
              {[
                {
                  id: "card",
                  label: t("paymentPage.creditCard"),
                  icon: CreditCard,
                },
                {
                  id: "paypal",
                  label: t("paymentPage.paypal"),
                  icon: ShieldCheck,
                },
                { id: "apple", label: t("paymentPage.applePay"), icon: Apple },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`flex-1 p-6 rounded-[2.5rem] border transition-all flex flex-col items-center gap-3 ${paymentMethod === method.id ? "bg-white border-primary shadow-2xl scale-[1.02] z-10" : "bg-white/50 border-gray-100 hover:border-primary/30 opacity-60"}`}
                >
                  <method.icon
                    className={
                      paymentMethod === method.id
                        ? "text-primary"
                        : "text-gray-300"
                    }
                    size={24}
                  />
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === method.id ? "text-primary" : "text-gray-400"}`}
                  >
                    {method.label}
                  </span>
                </button>
              ))}
            </div>

            <motion.div
              layout
              className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 md:p-12 relative overflow-hidden"
            >
              {/* Payment Method Specific Content */}
              <div className="mb-12">
                <AnimatePresence mode="wait">
                  <div key={paymentMethod} className="max-w-sm mx-auto">
                    {getPaymentMethodAnimation()}
                  </div>
                </AnimatePresence>
              </div>

              <form onSubmit={handlePayment} className="space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-accent shadow-xl shadow-primary/20">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">
                      {t("paymentPage.secureTransaction")}
                    </h2>
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">
                      FlyPlus Security Protocol
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">
                      {t("paymentPage.cardholder")}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cardholder}
                      onChange={(e) => setFormData({ ...formData, cardholder: e.target.value })}
                      placeholder={t("paymentPage.cardholderPlaceholder")}
                      className="w-full h-[58px] bg-gray-50 border-2 border-transparent rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">
                      {t("paymentPage.cardNumber")}
                    </label>
                    <div className="relative">
                      <CreditCard
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-primary"
                        size={20}
                      />
                      <input
                        type="text"
                        required
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        className={`w-full h-[58px] bg-gray-50 border-2 ${errors.cardNumber ? 'border-red-300' : 'border-transparent'} rounded-2xl pl-14 pr-6 font-bold text-primary outline-none focus:bg-white focus:border-primary/20 transition-all`}
                      />
                    </div>
                    {errors.cardNumber && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-widest">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">
                        {t("paymentPage.expiry")}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className={`w-full h-[58px] bg-gray-50 border-2 ${errors.expiry ? 'border-red-300' : 'border-transparent'} rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-primary/20 transition-all`}
                      />
                      {errors.expiry && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-widest">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">
                        {t("paymentPage.cvv")}
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.cvv}
                        onChange={handleCvvChange}
                        maxLength={3}
                        placeholder="***"
                        className={`w-full h-[58px] bg-gray-50 border-2 ${errors.cvv ? 'border-red-300' : 'border-transparent'} rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-primary/20 transition-all`}
                      />
                      {errors.cvv && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-widest">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-2 text-primary font-black bg-accent px-6 py-2.5 rounded-full shadow-lg shadow-accent/20">
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {t("paymentPage.pci")}
                    </span>
                  </div>
                  <button
                    disabled={isProcessing}
                    type="submit"
                    className="w-full bg-primary text-white font-black text-[12px] uppercase tracking-[0.4em] py-6 rounded-2xl hover:bg-accent hover:text-primary transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Plane size={20} className="text-accent" />{" "}
                        {t("paymentPage.completeBooking")} • €
                        {totalPrice.toFixed(2)}
                        <ChevronRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-10 relative z-10 text-accent">
                  {t("paymentPage.finalSummary")}
                </h3>
                <div className="space-y-8 relative z-10">
                  <div className="pb-8 border-b border-white/10">
                    <p className="text-[10px] font-black uppercase text-accent/60 tracking-widest mb-4">
                      {t("passengerPage.flights")}
                    </p>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-white font-black text-lg tracking-tighter uppercase">
                          {outboundFlight?.from || "---"} →{" "}
                          {outboundFlight?.to || "---"}
                        </span>
                        <span className="text-[9px] bg-accent text-primary px-2 py-0.5 rounded w-fit font-black uppercase tracking-widest">
                          {outboundCabin || "---"}
                        </span>
                      </div>
                      {tripType === "return" && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-white font-black text-lg tracking-tighter uppercase">
                            {returnFlight?.from || "---"} →{" "}
                            {returnFlight?.to || "---"}
                          </span>
                          <span className="text-[9px] bg-accent text-primary px-2 py-0.5 rounded w-fit font-black uppercase tracking-widest">
                            {returnCabin || "---"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                        {t("common.guests")}
                      </span>
                      <span className="font-black text-sm">
                        {passengerCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                        Seats
                      </span>
                      <span className="font-black text-sm text-accent tracking-widest">
                        {Array.isArray(selectedSeats)
                          ? selectedSeats.join(", ")
                          : "---"}
                      </span>
                    </div>
                    {(baggageCost > 0 || assistanceCost > 0) && (
                      <div className="pt-4 space-y-4 border-t border-white/5">
                        {baggageCost > 0 && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40 font-black uppercase text-[10px]">
                              Extra Baggage
                            </span>
                            <span className="font-black text-accent">
                              €{baggageCost.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {assistanceCost > 0 && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/40 font-black uppercase text-[10px]">
                              Assistance
                            </span>
                            <span className="font-black text-accent">
                              €{assistanceCost.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="pt-10 border-t-2 border-dashed border-white/10 mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                        Global Taxes
                      </span>
                      <span className="font-black text-xs text-white/50">
                        €{totalTaxes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-accent font-black uppercase text-[14px] tracking-[0.3em] pb-1">
                        {t("paymentPage.totalToPay")}
                      </span>
                      <span className="text-5xl font-black text-white tracking-tighter italic">
                        €{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border-2 border-primary/5 flex items-center gap-5 shadow-sm hover:border-accent transition-colors">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-accent/20">
                  <Info size={24} />
                </div>
                <p className="text-[10px] font-black text-primary uppercase leading-relaxed tracking-widest">
                  All transactions are managed through FlyPlus Premium Secure
                  Gateway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
