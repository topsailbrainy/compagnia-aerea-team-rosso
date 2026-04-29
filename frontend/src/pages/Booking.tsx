import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Plane,
  ChevronRight,
  Info,
  Wifi,
  Coffee,
  Monitor,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import BookingForm from "../components/BookingForm";

const FlightCard: React.FC<{
  flight: any;
  isSelected: boolean;
  selectedCabin: string;
  onSelect: (cabin: string, price: number) => void;
  isReturn: boolean;
}> = ({ flight, isSelected, selectedCabin, onSelect, isReturn }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-3xl overflow-hidden border transition-all ${isSelected ? "border-accent ring-1 ring-accent shadow-2xl" : "border-gray-100 shadow-sm hover:shadow-md"}`}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 grid grid-cols-3 items-center gap-4 w-full">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-primary">
                {flight.departure}
              </p>
              <p className="text-sm text-gray-400 font-medium">{flight.from}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">
                {flight.duration}
              </p>
              <div className="w-full h-[1px] bg-gray-100 relative">
                <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-gray-200 -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-gray-200 -translate-y-1/2" />
                <Plane
                  size={14}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent ${isReturn ? "-rotate-90" : "rotate-90"}`}
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-2">
                {t("bookingPage.direct")}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-2xl font-bold text-primary">
                {flight.arrival}
              </p>
              <p className="text-sm text-gray-400 font-medium">{flight.to}</p>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {[
              {
                type: "economy",
                label: t("bookingPage.economy"),
                price: flight.prices.economy,
              },
              {
                type: "business",
                label: t("bookingPage.business"),
                price: flight.prices.business,
              },
              {
                type: "first",
                label: t("bookingPage.first"),
                price: flight.prices.first,
              },
            ].map((cabin) => (
              <button
                key={cabin.type}
                onClick={() => onSelect(cabin.type, cabin.price)}
                className={`flex-1 md:w-32 p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${isSelected && selectedCabin === cabin.type ? "bg-accent text-primary border-accent" : "border-gray-100 hover:border-accent/30"}`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {cabin.label}
                </span>
                <span className="text-lg font-bold">€{cabin.price}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Wifi size={14} />
                <span className="text-[10px] font-bold uppercase">
                  {t("bookingPage.wifi")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Coffee size={14} />
                <span className="text-[10px] font-bold uppercase">
                  {t("bookingPage.meals")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Monitor size={14} />
                <span className="text-[10px] font-bold uppercase">
                  {t("bookingPage.entertainment")}
                </span>
              </div>
            </div>
            <div 
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-primary font-bold text-xs cursor-pointer hover:text-accent transition-colors"
            >
              {t("bookingPage.flightDetails")} <ChevronDown size={14} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </div>
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Aircraft Information</p>
                    <p className="text-sm font-bold text-primary">{flight.airplaneModello || "Boeing 787-9 Dreamliner"}</p>
                    <p className="text-[10px] text-gray-400 uppercase mt-1">Operated by FlyPlus Premium</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Flight Number</p>
                    <p className="text-sm font-bold text-primary">{flight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Cabin Class</p>
                    <p className="text-sm font-bold text-primary">All Classes Available</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    from,
    to,
    departureDate,
    returnDate,
    passengers,
    tripType,
    outboundFlight,
    returnFlight,
    outboundPrice,
    returnPrice,
    outboundCabin,
    returnCabin,
    cabinClass,
    searchTrigger,
    setSearch,
  } = useSearchStore();

  const [isModifying, setIsModifying] = useState(false);
  const [selectingReturn, setSelectingReturn] = useState(false);
  const [outboundFlightsList, setOutboundFlightsList] = useState<any[]>([]);
  const [returnFlightsList, setReturnFlightsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [airports, setAirports] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await fetch("/api/aeroporti");
        if (res.ok) {
          const data = await res.json();
          setAirports(data);
        }
      } catch (error) {
        console.error("Failed to fetch airports:", error);
      }
    };
    fetchAirports();
  }, []);

  const fromAirportName = useMemo(() => {
    const airport = airports.find(a => String(a.id) === String(from));
    return airport ? `${airport.citta}, ${airport.nome}` : from;
  }, [airports, from]);

  const toAirportName = useMemo(() => {
    const airport = airports.find(a => String(a.id) === String(to));
    return airport ? `${airport.citta}, ${airport.nome}` : to;
  }, [airports, to]);

  const mapFlight = (f: any) => {
    const departureTime = f.ora_partenza.slice(0, 5);
    const arrivalTime = f.ora_arrivo.slice(0, 5);

    // Simple duration calculation (for display)
    const [dH, dM] = departureTime.split(":").map(Number);
    const [aH, aM] = arrivalTime.split(":").map(Number);
    let durationH = aH - dH;
    let durationM = aM - dM;
    if (durationM < 0) {
      durationM += 60;
      durationH -= 1;
    }
    const duration = `${durationH}h ${durationM}m`;

    return {
      id: f.id,
      flightNumber: `FP ${100 + f.id}`,
      departure: departureTime,
      arrival: arrivalTime,
      duration,
      from: String(f.partenza_citta || f.aeroporto_partenza_id),
      to: String(f.arrivo_citta || f.aeroporto_arrivo_id),
      airplaneModello: f.aereo_modello,
      prices: {
        economy: Number(f.prezzo_base),
        business: Math.round(Number(f.prezzo_base) * 2.5),
        first: Math.round(Number(f.prezzo_base) * 5),
      },
    };
  };

  React.useEffect(() => {
    const fetchFlights = async () => {
      if (!from || !to || !departureDate) return;
      setIsLoading(true);
      setIsModifying(false); // Close modify form on search
      try {
        // Fetch outbound
        const outRes = await fetch("/api/voli/ricerca", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aeroporto_partenza: Number(from),
            aeroporto_arrivo: Number(to),
            data_partenza: departureDate,
          }),
        });
        if (outRes.ok) {
          const data = await outRes.json();
          setOutboundFlightsList(data.map(mapFlight));
        }

        // Fetch return
        if (tripType === "return" && returnDate) {
          const retRes = await fetch("/api/voli/ricerca", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              aeroporto_partenza: Number(to),
              aeroporto_arrivo: Number(from),
              data_partenza: returnDate,
            }),
          });
          if (retRes.ok) {
            const data = await retRes.json();
            setReturnFlightsList(data.map(mapFlight));
          }
        }
      } catch (error) {
        console.error("Failed to fetch flights:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlights();
  }, [searchTrigger]);

  const handleSelectOutbound = (flight: any, cabin: string, price: number) => {
    setSearch("outboundFlight", flight);
    setSearch("outboundPrice", price);
    setSearch("outboundCabin", cabin);
    setSearch("cabinClass", cabin);
    if (tripType === "return" && !returnFlight) {
      setSelectingReturn(true);
    }
  };

  const handleSelectReturn = (flight: any, cabin: string, price: number) => {
    setSearch("returnFlight", flight);
    setSearch("returnPrice", price);
    setSearch("returnCabin", cabin);
  };

  const totalBasePrice = outboundPrice + returnPrice;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => {
            if (selectingReturn || returnFlight) {
              setSelectingReturn(false);
              setSearch("returnFlight", null);
              setSearch("returnPrice", 0);
              setSearch("returnCabin", "");
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }}
          className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          {selectingReturn || returnFlight
            ? t("bookingPage.clearReturn")
            : t("bookingPage.backHome")}
        </button>
      </div>

      <div className="max-w-7xl mx-auto mb-12">
        <AnimatePresence mode="wait">
          {!isModifying ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-primary rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex items-center gap-8">
                <div className="text-center md:text-left">
                  <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-1">
                    {t("booking.origin")}
                  </p>
                  <h2 className="text-xl font-bold">{fromAirportName}</h2>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-[2px] bg-white/20 relative">
                    <Plane
                      size={16}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent rotate-90"
                    />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-1">
                    {t("booking.destination")}
                  </p>
                  <h2 className="text-xl font-bold">{toAirportName}</h2>
                </div>
              </div>
              <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
              <div className="flex gap-12 text-center md:text-left">
                <div>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
                    {t("booking.departure")}
                  </p>
                  <p className="font-bold">
                    {departureDate || t("common.selectDate")}
                  </p>
                </div>
                {tripType === "return" && (
                  <div>
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
                      {t("booking.return")}
                    </p>
                    <p className="font-bold">
                      {returnDate || t("common.selectDate")}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
                    {t("booking.passengers")}
                  </p>
                  <p className="font-bold">
                    {passengers}{" "}
                    {passengers > 1 ? t("common.guests") : t("common.guest")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModifying(true)}
                className="bg-accent text-primary font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-white transition-all shadow-lg shadow-accent/20"
              >
                {t("bookingPage.modifySearch")}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative"
            >
              <div className="absolute top-8 right-8">
                <button
                  onClick={() => setIsModifying(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2"
                >
                  {t("common.cancel")}{" "}
                  <ChevronDown className="rotate-180" size={14} />
                </button>
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-primary">
                  {t("bookingPage.modifySearch")}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t("bookingPage.updateDetails")}
                </p>
              </div>
              <div className="relative [&_div]:mt-0">
                <BookingForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-black">
                  1
                </span>
                {t("bookingPage.selectOutbound")}
              </h3>
              {outboundFlight && (
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                  <Check size={14} /> {t("bookingPage.selected")}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{t("bookingPage.searchingOutbound")}</p>
                </div>
              ) : outboundFlightsList.length > 0 ? (
                outboundFlightsList.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isSelected={outboundFlight?.id === flight.id}
                    selectedCabin={outboundCabin}
                    onSelect={(cabin, price) =>
                      handleSelectOutbound(flight, cabin, price)
                    }
                    isReturn={false}
                  />
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Plane size={32} />
                  </div>
                  <h4 className="text-primary font-bold mb-1">{t("bookingPage.noFlightsTitle")}</h4>
                  <p className="text-gray-400 text-sm">{t("bookingPage.noFlightsDesc")}</p>
                </div>
              )}
            </div>
          </div>

          {tripType === "return" && (
            <div
              id="return-flights-section"
              className={`space-y-6 pt-8 border-t border-gray-100 transition-all duration-500 ${!outboundFlight ? "opacity-30 grayscale pointer-events-none" : "opacity-100"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-black">
                    2
                  </span>
                  {t("bookingPage.selectReturn")}
                </h3>
                <div className="flex flex-col items-end">
                   <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-1">Step 2 of 2</p>
                   {returnFlight && (
                    <span className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                      <Check size={14} /> {t("bookingPage.selected")}
                    </span>
                   )}
                </div>
              </div>

              <div className="bg-accent/5 border border-accent/10 rounded-2xl p-6 mb-4">
                <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">Return Flight Search Active</p>
                <p className="text-primary/60 text-[11px] font-medium leading-relaxed">
                  Please select your preferred flight and cabin for the return journey from {toAirportName} to {fromAirportName}.
                </p>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{t("bookingPage.searchingReturn")}</p>
                  </div>
                ) : returnFlightsList.length > 0 ? (
                  returnFlightsList.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      isSelected={returnFlight?.id === flight.id}
                      selectedCabin={returnCabin}
                      onSelect={(cabin, price) =>
                        handleSelectReturn(flight, cabin, price)
                      }
                      isReturn={true}
                    />
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                      <Plane size={32} className="-rotate-180" />
                    </div>
                    <h4 className="text-primary font-bold mb-1">{t("bookingPage.noFlightsTitle")}</h4>
                    <p className="text-gray-400 text-sm">{t("bookingPage.noFlightsDescReturn")}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6 self-start">
            <motion.div 
              layout
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm overflow-hidden"
            >
              <h4 className="text-lg font-black text-primary mb-6 uppercase tracking-widest">
                {t("bookingPage.yourSelection")}
              </h4>
              <div className="space-y-6">
                {outboundFlight && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
                          {t("bookingPage.outbound")}
                        </p>
                        <p className="font-bold text-primary text-sm">
                          {outboundFlight.from} → {outboundFlight.to}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">€{outboundPrice * passengers}</p>
                        {passengers > 1 && (
                          <p className="text-[9px] text-gray-400 font-bold">€{outboundPrice} x {passengers}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-1 inline-block">
                      <span className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">
                        {outboundCabin}
                      </span>
                    </div>
                  </div>
                )}
                {returnFlight && (
                  <div className="animate-in fade-in slide-in-from-top-2 pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
                          {t("bookingPage.return")}
                        </p>
                        <p className="font-bold text-primary text-sm">
                          {returnFlight.from} → {returnFlight.to}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">€{returnPrice * passengers}</p>
                        {passengers > 1 && (
                          <p className="text-[9px] text-gray-400 font-bold">€{returnPrice} x {passengers}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-1 inline-block">
                      <span className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">
                        {returnCabin}
                      </span>
                    </div>
                  </div>
                )}
                {outboundFlight && (tripType === "oneway" || returnFlight) ? (
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-500 font-medium">
                        {t("booking.passengers")}
                      </span>
                      <span className="text-primary font-bold">
                        {passengers} {passengers > 1 ? t("common.guests") : t("common.guest")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-gray-500 font-medium">
                        {t("bookingPage.totalPrice")}
                      </span>
                      <span className="text-3xl font-bold text-primary">
                        €{totalBasePrice * passengers}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate("/passenger")}
                      className="w-full bg-accent text-primary font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      {t("bookingPage.continuePassenger")}{" "}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Info size={32} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">
                      {outboundFlight && tripType === "return"
                        ? t("bookingPage.selectReturnToContinue")
                        : t("bookingPage.selectOutboundToContinue")}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
            <div className="bg-accent/10 rounded-3xl p-6 border border-accent/20">
              <h5 className="font-bold text-primary mb-2">
                {t("bookingPage.premiumTitle")}
              </h5>
              <p className="text-xs text-primary/60 leading-relaxed">
                {t("bookingPage.premiumDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;