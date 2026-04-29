import React, { useState } from "react";
import { useSearchStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  User as UserIcon,
  Mail,
  LogOut,
  Plane,
  Clock,
  Calendar,
  Star,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Info,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const User: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    isLoggedIn,
    setSearch,
    userName,
    userEmail,
    bookings,
    isFlyPlusGuest,
  } = useSearchStore();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Protective Redirect
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const fetchBookings = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("/api/prenotazioni", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            const mappedBookings = data.map((b: any) => ({
              id: `FP-${b.id}`,
              flightNumber: `FP ${100 + b.volo_id}`,
              from: b.partenza_citta || String(b.aeroporto_partenza_id),
              to: b.arrivo_citta || String(b.aeroporto_arrivo_id),
              date: new Date(b.data_partenza || b.data_prenotazione).toLocaleDateString(),
              time: b.ora_partenza ? b.ora_partenza.slice(0, 5) : "10:00",
              status: b.classe === "Checked-in" ? "Checked-in" : "Confirmed",
              passengerName: userName,
              lastName: userName.split(" ").pop() || "",
              cabinClass: b.classe,
            }));
            setSearch("bookings", mappedBookings);
          }
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        }
      };
      fetchBookings();
    }
  }, [isLoggedIn, navigate, userName, setSearch]);

  const handleLogout = () => {
    setSearch("isLoggedIn", false);
    setSearch("userRole", null);
    localStorage.removeItem("token");
    navigate("/");
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEliminateAccount = () => {
    // Clear all user data from store
    setSearch("isLoggedIn", false);
    setSearch("userRole", null);
    setSearch("userName", "");
    setSearch("userEmail", "");
    setSearch("userPassword", "");
    setSearch("hasSignedUp", false);
    setSearch("isFlyPlusGuest", false);
    setSearch("bookings", []);
    navigate("/");
  };

  const handleActivateMembership = () => {
    // Redirect to payment with a special flag for membership
    navigate("/payment?type=membership");
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-12 relative overflow-hidden">
      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-8">
              <Trash2 size={40} />
            </div>
            <h2 className="text-white text-3xl font-black uppercase tracking-tighter mb-4">
              Elimina Account?
            </h2>
            <p className="text-white/60 max-w-md mb-12 font-medium">
              Questa azione è permanente. Tutti i tuoi dati, le prenotazioni e
              lo status FlyPlus Guest verranno eliminati definitivamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={handleEliminateAccount}
                className="flex-1 bg-red-600 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-red-700 transition-all shadow-2xl shadow-red-900/40"
              >
                Sì, Elimina
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-white/10 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-white/20 transition-all"
              >
                Annulla
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100"
            >
              {/* Modal Header */}
              <div className="bg-primary p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
                      Conferma Prenotazione
                    </span>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                      {selectedBooking.id}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <LogOut className="rotate-180" size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-10 space-y-10">
                {/* Flight Path */}
                <div className="flex items-center justify-between gap-6 px-4">
                  <div className="text-center">
                    <p className="text-5xl font-black text-primary tracking-tighter">
                      {selectedBooking.from}
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                      Città di Partenza
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-[2px] bg-gray-100 relative">
                      <Plane
                        size={24}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent rotate-90"
                      />
                    </div>
                    <span className="text-xs font-black text-accent uppercase tracking-widest">
                      {selectedBooking.flightNumber}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-black text-primary tracking-tighter">
                      {selectedBooking.to}
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                      Città di Arrivo
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Data del Viaggio
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {selectedBooking.date}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Orario di Partenza
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {selectedBooking.time}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Classe di Cabina
                    </p>
                    <p className="text-lg font-bold text-primary capitalize">
                      {selectedBooking.cabinClass}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Stato Prenotazione
                    </p>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg inline-block mt-1 ${
                        selectedBooking.status === "Checked-in"
                          ? "bg-green-500 text-white"
                          : "bg-primary text-accent"
                      }`}
                    >
                      {selectedBooking.status === "Checked-in"
                        ? "Effettuato"
                        : selectedBooking.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedBooking.status === "Confirmed" ? (
                    <button
                      onClick={() => navigate("/check-in")}
                      className="flex-1 bg-accent text-primary font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
                    >
                      Effettua Check-in <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button className="flex-1 bg-green-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl cursor-default flex items-center justify-center gap-3">
                      Check-in Completato <ShieldCheck size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/manage")}
                    className="flex-1 bg-gray-50 text-gray-400 font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-gray-100 hover:text-primary transition-all flex items-center justify-center gap-3"
                  >
                    Gestisci Volo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">
              {t("userPage.title")}
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-20 h-1 bg-accent shadow-glow" />
              {isFlyPlusGuest && (
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20 flex items-center gap-1.5">
                  <Star size={10} fill="currentColor" />{" "}
                  {t("userPage.guestActive") || "FlyPlus Guest Attivo"}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm active:scale-95"
            >
              <Trash2 size={14} /> Elimina Account
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-lg shadow-primary/10 active:scale-95"
            >
              <LogOut size={14} /> {t("userPage.logout")}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile & Membership */}
          <div className="lg:col-span-4 space-y-8">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
            >
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20 mx-auto border-4 border-accent/20">
                <UserIcon size={40} />
              </div>

              <h2 className="text-xl font-black text-primary text-center mb-8 uppercase tracking-widest">
                {t("userPage.personalInfo")}
              </h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                      {t("userPage.fullName")}
                    </p>
                    <p className="font-bold text-primary">{userName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                      {t("userPage.email")}
                    </p>
                    <p className="font-bold text-primary break-all">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FlyPlus Guest Membership Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-8 rounded-[2.5rem] border relative overflow-hidden transition-all duration-500 ${isFlyPlusGuest ? "bg-primary border-primary shadow-2xl text-white" : "bg-white border-gray-100 shadow-sm"}`}
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl ${isFlyPlusGuest ? "bg-accent/20" : "bg-accent/5"}`}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isFlyPlusGuest ? "bg-accent text-primary" : "bg-accent/10 text-accent"}`}
                  >
                    <Star
                      size={24}
                      fill={isFlyPlusGuest ? "currentColor" : "none"}
                    />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-black uppercase tracking-tight ${isFlyPlusGuest ? "text-white" : "text-primary"}`}
                    >
                      FlyPlus Guest
                    </h3>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${isFlyPlusGuest ? "text-accent" : "text-gray-400"}`}
                    >
                      {isFlyPlusGuest
                        ? "Status Premium Attivo"
                        : "Abbonamento Excellence"}
                    </p>
                  </div>
                </div>

                {!isFlyPlusGuest ? (
                  <div className="space-y-6">
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Sblocca privilegi esclusivi, lounge aeroportuali e imbarco
                      prioritario con una quota di attivazione una tantum.
                    </p>
                    <div className="space-y-3">
                      {[
                        "Accesso Lounge in tutto il mondo",
                        "Check-in e Imbarco Prioritario",
                        "Franchigia Bagaglio Extra",
                        "Upgrade di Cabina Esclusivi",
                      ].map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs font-bold text-primary/70"
                        >
                          <ShieldCheck size={14} className="text-accent" /> {p}
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-50">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          Quota di Attivazione
                        </span>
                        <span className="text-2xl font-black text-primary">
                          €49.99
                        </span>
                      </div>
                      <button
                        onClick={handleActivateMembership}
                        className="w-full bg-primary text-accent font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                      >
                        Iscriviti Ora{" "}
                        <ChevronRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-white/70 text-sm leading-relaxed">
                      Benvenuto nella cerchia elitaria dei viaggiatori FlyPlus.
                      Tutti i tuoi vantaggi sono attivi per ogni viaggio.
                    </p>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="flex items-center gap-3 text-accent mb-2">
                        <Info size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          ID Membro
                        </span>
                      </div>
                      <p className="font-mono text-lg font-bold tracking-widest">
                        FP-GUEST-{userName.substring(0, 3).toUpperCase()}-2026
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-accent font-black uppercase tracking-widest text-[10px]">
                      <ShieldCheck size={16} /> Dati Protetti e Verificati
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bookings */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[600px]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">
                  {t("userPage.bookings")}
                </h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                    Totale: {bookings.length}
                  </span>
                </div>
              </div>

              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="p-6 rounded-[2rem] border border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all duration-500 group cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                            <Plane size={18} className="rotate-90" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-primary tracking-tight">
                              {booking.from} → {booking.to}
                            </p>
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest">
                              {booking.flightNumber} • {booking.date}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${
                            booking.status === "Checked-in"
                              ? "bg-green-500 text-white border-green-400"
                              : "bg-primary/5 text-primary border-primary/10"
                          }`}
                        >
                          {booking.status === "Checked-in"
                            ? "Effettuato"
                            : booking.status}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-8 border-2 border-dashed border-gray-200">
                    <Plane size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2 uppercase tracking-tight">
                    {t("userPage.noBookings")}
                  </h3>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-[0.2em]">
                    Pronto per la tua prossima avventura?
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
