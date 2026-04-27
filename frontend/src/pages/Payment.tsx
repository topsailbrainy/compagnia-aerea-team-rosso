import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Star,
  Award,
} from "lucide-react";

type PaymentMethod = "card" | "paypal" | "apple";

const Payment: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if this is a membership purchase
  const queryParams = new URLSearchParams(location.search);
  const isMembershipPurchase = queryParams.get("type") === "membership";

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
    baggageCosts,
    assistanceCosts,
    selectedSeats = [],
    selectedReturnSeats = [],
    isFlyPlusGuest,
    userId,
    passengerDetails,
    setSearch,
  } = useSearchStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [bookingRef] = useState(() => `FP-${Math.floor(Date.now() / 1000)}`);

  const totalBaggageCost = Object.values(baggageCosts || {}).reduce(
    (acc, curr) => acc + (curr || 0),
    0,
  );
  const totalAssistanceCost = Object.values(assistanceCosts || {}).reduce(
    (acc, curr) => acc + (curr || 0),
    0,
  );

  const taxesPerFlight = 34.2;
  const flightsCount = tripType === "return" ? 2 : 1;
  const totalTaxes = taxesPerFlight * flightsCount * (passengerCount || 1);
  const totalBasePrice = (outboundPrice + returnPrice) * (passengerCount || 1);

  // Final calculation based on purchase type
  const membershipFee = 49.99;
  const totalPrice = isMembershipPurchase
    ? membershipFee
    : totalBasePrice + totalTaxes + totalBaggageCost + totalAssistanceCost;

  const steps = isMembershipPurchase
    ? [
        "FlyPlus: Opening Priority Gates...",
        "Validating Excellence Status...",
        "Activating Lounge Credentials...",
        "Securing Premium Benefits...",
        "Finalizing Membership Elite...",
      ]
    : [
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
    paypalEmail: "",
    appleEmail: "",
  });
  const [errors, setErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    paypalEmail: "",
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
      } else if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation based on method
    if (paymentMethod === "card") {
      if (
        formData.cardNumber.replace(/\s/g, "").length < 16 ||
        errors.expiry ||
        formData.expiry.length < 5 ||
        formData.cvv.length < 3
      ) {
        return;
      }
    } else if (paymentMethod === "paypal") {
      if (!formData.paypalEmail.includes("@")) {
        setErrors({ ...errors, paypalEmail: "Enter a valid PayPal email" });
        return;
      }
    }

    setIsProcessing(true);
    setProcessingStep(0);

    const mappedPassengers = passengerDetails.map((p) => ({
      nome: p.firstName,
      cognome: p.lastName,
      data_nascita: `${p.dobYear}-${String(p.dobMonth).padStart(2, "0")}-${String(p.dobDay).padStart(2, "0")}`,
      nazionalita: p.nationality,
    }));

    try {
      if (!isMembershipPurchase && outboundFlight) {
        // Create outbound booking
        const outRes = await fetch("/api/prenotazioni", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            utente_id: userId || 1, // Fallback to 1 for demo if not logged in
            volo_id: outboundFlight.id,
            prezzo_finale: (outboundPrice + taxesPerFlight) * passengerCount,
            posto: selectedSeats[0] || "12A",
            classe: outboundCabin,
            tipo_bagaglio: baggageCosts[0] > 0 ? "Da stiva 20kg" : "Solo zaino",
            passeggeri: mappedPassengers,
          }),
        });

        if (!outRes.ok) throw new Error("Failed to create outbound booking");

        if (tripType === "return" && returnFlight) {
          // Create return booking
          const retRes = await fetch("/api/prenotazioni", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              utente_id: userId || 1,
              volo_id: returnFlight.id,
              prezzo_finale: (returnPrice + taxesPerFlight) * passengerCount,
              posto: selectedReturnSeats[0] || "12B",
              classe: returnCabin,
              tipo_bagaglio:
                baggageCosts[0] > 0 ? "Da stiva 20kg" : "Solo zaino",
              passeggeri: mappedPassengers,
            }),
          });
          if (!retRes.ok) throw new Error("Failed to create return booking");
        }
      }

      // Simulate step progression for UX
      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(i);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setIsProcessing(false);
      setIsSuccess(true);
      if (isMembershipPurchase) {
        setSearch("isFlyPlusGuest", true);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Payment/Booking failed:", error);
      setIsProcessing(false);
      alert("An error occurred during booking. Please try again.");
    }
  };

  const getPaymentMethodAnimation = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden h-[220px] justify-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="w-full flex justify-between items-start mb-4">
              <div className="w-12 h-8 bg-accent/40 rounded-md border border-accent/20" />
              <CreditCard size={32} className="text-accent" />
            </div>
            <div className="w-full space-y-4">
              <div className="h-2 w-full bg-white/20 rounded-full" />
              <div className="h-2 w-2/3 bg-white/20 rounded-full" />
            </div>
            <div className="w-full flex justify-between mt-4">
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
            className="flex flex-col items-center justify-center gap-4 p-8 bg-[#003087]/5 rounded-[2.5rem] border-2 border-dashed border-[#003087]/20 h-[220px]"
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
            className="flex flex-col items-center justify-center gap-6 p-8 bg-black rounded-[2.5rem] border border-white/10 shadow-2xl relative h-[220px]"
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
        {/* Confetti Celebration Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: "100vh", x: "50vw", scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: "-10vh",
                x: `${(i * 37) % 100}vw`,
                scale: [0, 1, 0.5],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                delay: 2 + i * 0.2,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 5,
              }}
              className="absolute text-accent/30"
            >
              <Star size={((i * 7) % 20) + 10} fill="currentColor" />
            </motion.div>
          ))}
        </div>

        {/* Cinematic Success Animation */}
        <div className="relative w-full max-w-2xl h-64 mb-8 flex items-center justify-center">
          {/* Runway */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="absolute h-1.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-full rounded-full"
          />

          {/* Airplane Cinematic Path */}
          <motion.div
            initial={{ x: "-400%", y: 50, rotate: 0, scale: 0.4, opacity: 0 }}
            animate={{
              x: ["-200%", "0%", "400%"],
              y: [50, 0, -400],
              rotate: [0, -5, -45],
              scale: [0.6, 1.2, 2.5],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              times: [0, 0.4, 1],
              ease: "easeInOut",
            }}
            className="absolute z-20"
          >
            <div className="relative">
              {isMembershipPurchase ? (
                <Star
                  size={120}
                  className="text-accent fill-accent drop-shadow-[0_20px_50px_rgba(205,164,52,0.4)]"
                />
              ) : (
                <Plane
                  size={120}
                  className="text-primary fill-primary drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                />
              )}
              {/* Engine Trail */}
              <motion.div
                initial={{ opacity: 0.8, scaleX: 0 }}
                animate={{ opacity: 0, scaleX: 4, scaleY: 2 }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute right-full top-1/2 -translate-y-1/2 w-32 h-2 bg-gradient-to-l from-accent/60 to-transparent origin-right blur-sm"
              />
            </div>
          </motion.div>

          {/* Success Checkmark */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              delay: 1.8,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="z-10"
          >
            <div className="w-40 h-40 bg-accent rounded-full flex items-center justify-center text-primary shadow-[0_20px_80px_rgba(205,164,52,0.4)] border-[12px] border-white relative">
              <CheckCircle2 size={80} strokeWidth={2.5} />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border-4 border-white/30"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="relative z-10 w-full max-w-4xl"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="text-6xl md:text-7xl font-black text-primary mb-2 uppercase tracking-tighter italic"
          >
            {isMembershipPurchase ? "ELITE STATUS ACTIVE" : "FLYPLUS CONFIRMED"}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="text-gray-500 max-w-md mx-auto mb-16 font-black uppercase tracking-[0.4em] text-xs"
          >
            {isMembershipPurchase
              ? "Welcome to the inner circle of excellence"
              : `Your premium journey to ${to || "the world"} is secured`}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-16">
            {/* Left Box */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.8 }}
              className="bg-primary rounded-[3rem] p-12 text-left relative overflow-hidden shadow-2xl border border-white/5"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-accent/60 uppercase tracking-widest">
                    {isMembershipPurchase
                      ? "Membership ID"
                      : "Booking Reference"}
                  </p>
                  <p className="text-3xl font-black text-white tracking-widest">
                    {isMembershipPurchase
                      ? `FP-GUEST-${Math.floor(1000 + Math.random() * 9000)}`
                      : bookingRef}
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                  {isMembershipPurchase ? (
                    <Award size={32} className="text-accent" />
                  ) : (
                    <Navigation size={32} className="text-accent rotate-45" />
                  )}
                </div>
              </div>

              {isMembershipPurchase ? (
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                      Privileges Activated
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-white font-bold">
                        <ShieldCheck className="text-accent" size={20} /> Lounge
                        Access Worldwide
                      </div>
                      <div className="flex items-center gap-4 text-white font-bold">
                        <Award className="text-accent" size={20} /> Priority
                        Boarding & Check-in
                      </div>
                      <div className="flex items-center gap-4 text-white font-bold">
                        <Star className="text-accent" size={20} /> Exclusive
                        Cabin Upgrades
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                      Flight Itinerary
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-6">
                        <span className="text-4xl font-black text-white tracking-tighter">
                          {outboundFlight?.from}
                        </span>
                        <div className="flex-1 h-[2px] bg-gradient-to-r from-accent/50 to-transparent relative">
                          <Plane
                            size={16}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-accent"
                          />
                        </div>
                        <span className="text-4xl font-black text-white tracking-tighter">
                          {outboundFlight?.to}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-[10px] font-black bg-accent text-primary px-3 py-1 rounded-full uppercase tracking-widest">
                          {outboundCabin} Class
                        </span>
                        {tripType === "return" && (
                          <span className="text-[10px] font-black bg-white/10 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                            Return Included
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Recap Box Right */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 3.2, duration: 0.8 }}
              className="bg-white rounded-[3rem] p-12 text-left relative overflow-hidden shadow-2xl border-2 border-gray-50 flex flex-col justify-between"
            >
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full -ml-24 -mb-24 blur-3xl" />
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight">
                    Payment Recap
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                      {isMembershipPurchase ? "Activation Fee" : "Base Fare"}
                    </span>
                    <span className="font-black text-primary">
                      €
                      {isMembershipPurchase
                        ? membershipFee.toFixed(2)
                        : totalBasePrice.toFixed(2)}
                    </span>
                  </div>
                  {!isMembershipPurchase && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                          Taxes & Fees
                        </span>
                        <span className="font-black text-primary">
                          €{totalTaxes.toFixed(2)}
                        </span>
                      </div>
                      {(totalBaggageCost > 0 || totalAssistanceCost > 0) && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Services
                          </span>
                          <span className="font-black text-primary">
                            €
                            {(totalBaggageCost + totalAssistanceCost).toFixed(
                              2,
                            )}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-50">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                      Payment Method
                    </span>
                    <span className="font-black text-primary uppercase">
                      {paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-10">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Total Confirmed
                    </p>
                    <p className="text-5xl font-black text-accent tracking-tighter italic">
                      €{totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600 font-black uppercase text-[10px] tracking-widest mb-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                      Paid
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(isMembershipPurchase ? "/user" : "/")}
                  className="w-full group relative bg-primary text-white font-black text-[10px] uppercase tracking-[0.4em] py-6 rounded-2xl overflow-hidden shadow-2xl transition-all hover:bg-accent hover:text-primary active:scale-95"
                >
                  <span className="relative z-10">
                    {isMembershipPurchase
                      ? "Return to Profile"
                      : t("paymentPage.returnHome")}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 4 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              <Info size={14} />A confirmation{" "}
              {isMembershipPurchase ? "statement" : "email"} has been sent to
              your primary address
            </div>
          </motion.div>
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
                    {isMembershipPurchase ? (
                      <Star
                        className="text-accent"
                        size={64}
                        fill="currentColor"
                      />
                    ) : (
                      <Plane className="text-accent" size={48} />
                    )}
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
              {isMembershipPurchase ? "MEMBERSHIP" : "FLY"}PLUS
            </h2>
            <p className="text-accent/60 text-[10px] font-black uppercase tracking-[0.6em] mb-8">
              {isMembershipPurchase
                ? "Activating Excellence"
                : "Securing Your Journey"}
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
          {isMembershipPurchase
            ? "Back to Profile"
            : t("paymentPage.backPassengers")}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <header className="mb-10">
              <h1 className="text-4xl font-black text-primary mb-2 uppercase tracking-tight">
                {isMembershipPurchase
                  ? "Activation Fee"
                  : t("paymentPage.paymentDetails")}
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                {isMembershipPurchase
                  ? "Join our elite circle of premium travelers"
                  : t("paymentPage.paymentDesc")}
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
                      {paymentMethod === "card"
                        ? t("paymentPage.secureTransaction")
                        : paymentMethod === "paypal"
                          ? "PayPal Checkout"
                          : "Apple Pay"}
                    </h2>
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">
                      FlyPlus Security Protocol
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {paymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">
                          {t("paymentPage.cardholder")}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cardholder}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardholder: e.target.value,
                            })
                          }
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
                            className={`w-full h-[58px] bg-gray-50 border-2 ${errors.cardNumber ? "border-red-300" : "border-transparent"} rounded-2xl pl-14 pr-6 font-bold text-primary outline-none focus:bg-white focus:border-primary/20 transition-all`}
                          />
                        </div>
                        {errors.cardNumber && (
                          <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-widest">
                            {errors.cardNumber}
                          </p>
                        )}
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
                            className={`w-full h-[58px] bg-gray-50 border-2 ${errors.expiry ? "border-red-300" : "border-transparent"} rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-primary/20 transition-all`}
                          />
                          {errors.expiry && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-widest">
                              {errors.expiry}
                            </p>
                          )}
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
                            className={`w-full h-[58px] bg-gray-50 border-2 ${errors.cvv ? "border-red-300" : "border-transparent"} rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-primary/20 transition-all`}
                          />
                          {errors.cvv && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-widest">
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "paypal" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block ml-2">
                          PayPal Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.paypalEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paypalEmail: e.target.value,
                            })
                          }
                          placeholder="your-email@example.com"
                          className={`w-full h-[58px] bg-gray-50 border-2 ${errors.paypalEmail ? "border-red-300" : "border-transparent"} rounded-2xl px-6 font-bold text-primary outline-none focus:bg-white focus:border-[#0070ba]/20 transition-all`}
                        />
                        {errors.paypalEmail && (
                          <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-widest">
                            {errors.paypalEmail}
                          </p>
                        )}
                      </div>
                      <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                        <p className="text-[10px] font-bold text-blue-800 leading-relaxed uppercase tracking-widest">
                          You will be redirected to PayPal to complete your
                          purchase safely.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "apple" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="p-8 bg-black rounded-3xl flex flex-col items-center gap-4 text-white">
                        <Apple size={32} />
                        <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-[0.2em]">
                            Apple Pay Ready
                          </p>
                          <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">
                            Confirm with Touch ID or Face ID
                          </p>
                        </div>
                      </div>
                      <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest text-center">
                          Please ensure you are using a compatible Apple device.
                        </p>
                      </div>
                    </motion.div>
                  )}
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
                        {isMembershipPurchase ? (
                          <Award size={20} className="text-accent" />
                        ) : (
                          <Plane size={20} className="text-accent" />
                        )}{" "}
                        {paymentMethod === "card"
                          ? isMembershipPurchase
                            ? "Activate Membership"
                            : t("paymentPage.completeBooking")
                          : paymentMethod === "paypal"
                            ? "Pay with PayPal"
                            : "Pay with Apple Pay"}{" "}
                        • €{totalPrice.toFixed(2)}
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
            <div className="sticky top-28 space-y-6 self-start">
              <motion.div
                layout
                className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-10 relative z-10 text-accent">
                  {isMembershipPurchase
                    ? "Excellence Plan"
                    : t("paymentPage.finalSummary")}
                </h3>

                <div className="space-y-8 relative z-10">
                  {isMembershipPurchase ? (
                    <div className="pb-8 border-b border-white/10 space-y-6">
                      <p className="text-[10px] font-black uppercase text-accent/60 tracking-widest mb-4">
                        Elite Benefits Included
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <ShieldCheck size={16} className="text-accent" />{" "}
                          Lounge Access Worldwide
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <Award size={16} className="text-accent" /> Priority
                          Boarding
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <Star size={16} className="text-accent" /> Cabin
                          Upgrades
                        </div>
                      </div>
                    </div>
                  ) : (
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
                  )}

                  {!isMembershipPurchase && (
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
                          Seats (Outbound)
                        </span>
                        <span className="font-black text-sm text-accent tracking-widest">
                          {Array.isArray(selectedSeats) &&
                          selectedSeats.length > 0
                            ? selectedSeats.join(", ")
                            : "---"}
                        </span>
                      </div>
                      {tripType === "return" && (
                        <div className="flex justify-between items-center">
                          <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                            Seats (Return)
                          </span>
                          <span className="font-black text-sm text-accent tracking-widest">
                            {Array.isArray(selectedReturnSeats) &&
                            selectedReturnSeats.length > 0
                              ? selectedReturnSeats.join(", ")
                              : "---"}
                          </span>
                        </div>
                      )}
                      {(totalBaggageCost > 0 || totalAssistanceCost > 0) && (
                        <div className="pt-4 space-y-4 border-t border-white/5">
                          {totalBaggageCost > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-white/40 font-black uppercase text-[10px]">
                                Extra Baggage
                              </span>
                              <span className="font-black text-accent">
                                €{totalBaggageCost.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {totalAssistanceCost > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-white/40 font-black uppercase text-[10px]">
                                Assistance
                              </span>
                              <span className="font-black text-accent">
                                €{totalAssistanceCost.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {isFlyPlusGuest && (
                        <div className="pt-4 mt-2 bg-accent/5 rounded-2xl border border-accent/10 p-4 space-y-2">
                          <div className="flex items-center gap-2 text-accent">
                            <Star size={12} fill="currentColor" />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                              FlyPlus Guest Member
                            </span>
                          </div>
                          <p className="text-[8px] text-white/50 font-bold uppercase tracking-widest leading-relaxed">
                            Lounge & Priority included with your active
                            membership
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-10 border-t-2 border-dashed border-white/10 mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                        {isMembershipPurchase ? "Plan Term" : "Global Taxes"}
                      </span>
                      <span className="font-black text-xs text-white/50">
                        {isMembershipPurchase
                          ? "Lifetime Access"
                          : `€${totalTaxes.toFixed(2)}`}
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
              </motion.div>
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
