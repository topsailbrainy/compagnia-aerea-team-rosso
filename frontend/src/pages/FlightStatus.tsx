import React, { useState } from "react";
import {
  Search,
  PlaneTakeoff,
  PlaneLanding,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import aereoImg from "../assets/aerei/aereo.avif";
import { motion } from "framer-motion";

const CustomDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  label: string;
  disabled?: boolean;
}> = ({ value, onChange, label, disabled }) => {
  const dateValue = value ? new Date(value) : null;

  const handleDateChange = (date: any) => {
    if (date instanceof Date) {
      // Adjust for timezone to get YYYY-MM-DD correctly
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange("");
    }
  };

  return (
    <div
      className={`flex flex-col gap-1.5 transition-all duration-500 ${disabled ? "opacity-30 grayscale" : "opacity-100"}`}
    >
      <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] ml-2">
        {label}
      </label>
      <div className={`relative group ${!disabled ? "cursor-pointer" : ""}`}>
        <CalendarIcon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-accent group-hover:scale-110 transition-transform pointer-events-none z-10"
        />
        <DatePicker
          value={dateValue}
          onChange={handleDateChange}
          disabled={disabled}
          clearIcon={null}
          calendarIcon={null}
          format="dd/MM/yyyy"
          className="flyplus-datepicker"
        />
      </div>
    </div>
  );
};

const FlightStatus: React.FC = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState<string>("");
  const [flightNum, setFlightNum] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const locations = [
    { value: "FCO", label: t("booking.locations.FCO") },
    { value: "MXP", label: t("booking.locations.MXP") },
    { value: "LHR", label: t("booking.locations.LHR") },
    { value: "CDG", label: t("booking.locations.CDG") },
    { value: "JFK", label: t("booking.locations.JFK") },
  ];

  const handleSearch = async () => {
    if (!flightNum || !date) return;
    setError("");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    const diffTime = searchDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < -3 || diffDays > 7) {
      setError(
        "Flight status is only available for dates between 3 days ago and 7 days from now.",
      );
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    // Extract ID from flight number (e.g. FP102 -> 2)
    const num = flightNum.replace(/[^0-9]/g, "");
    const id = parseInt(num) - 100;

    if (isNaN(id) || id <= 0) {
      setIsSearching(false);
      setError("Flight not found");
      return;
    }

    try {
      const response = await fetch(`/api/voli/${id}`);
      if (!response.ok) {
        throw new Error("Flight not found");
      }

      const data = await response.json();
      setSearchResult({
        number: flightNum.toUpperCase().startsWith("FP")
          ? flightNum.toUpperCase()
          : "FP" + flightNum,
        from: String(data.aeroporto_partenza_id),
        to: String(data.aeroporto_arrivo_id),
        status: "On Time",
        departure: data.ora_partenza.slice(0, 5),
        arrival: data.ora_arrivo.slice(0, 5),
        gate: "A" + Math.floor(1 + Math.random() * 20),
      });
    } catch (err) {
      setError("Flight not found");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">
            {t("statusPage.title")}
          </h2>
          <p className="text-gray-500 text-xl">{t("statusPage.desc")}</p>
          <div className="w-24 h-1 bg-accent mt-6 shadow-glow" />
        </div>
        <div className="w-full md:w-64 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
          <img
            src={aereoImg}
            className="w-full h-full object-cover"
            alt={t("statusPage.title")}
          />
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] ml-2">
                  {t("statusPage.flightNumber")}
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-black z-10">
                    FP
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. 102"
                    value={flightNum}
                    onChange={(e) => setFlightNum(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 p-4 pl-10 rounded-2xl focus:ring-2 focus:ring-accent outline-none text-sm font-bold text-primary h-[50px] transition-all"
                  />
                </div>
              </div>
              <CustomDatePicker
                label={t("statusPage.departureDate")}
                value={date}
                onChange={(val) => setDate(val)}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold uppercase tracking-widest text-[10px]">
                {error}
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={isSearching || !flightNum || !date}
              className="w-full md:w-auto bg-primary text-accent font-black px-12 py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95 disabled:opacity-50"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              ) : (
                <Search size={18} />
              )}
              {t("statusPage.checkStatus")}
            </button>

            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl border border-accent/20 bg-accent/5 mt-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-4xl font-black text-primary">
                        {searchResult.from}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        DEP
                      </p>
                    </div>
                    <div className="w-20 flex flex-col items-center">
                      <div className="w-full h-[2px] bg-accent/20 relative">
                        <PlaneTakeoff
                          size={18}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent"
                        />
                      </div>
                      <span className="text-[10px] font-black text-primary mt-2">
                        {searchResult.number}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-black text-primary">
                        {searchResult.to}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        ARR
                      </p>
                    </div>
                  </div>

                  <div className="h-16 w-[1px] bg-accent/20 hidden md:block" />

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {t("common.status")}
                      </p>
                      <p
                        className={`font-black text-sm uppercase ${searchResult.status === "Delayed" ? "text-accent" : "text-green-600"}`}
                      >
                        {searchResult.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Gate
                      </p>
                      <p className="font-black text-sm text-primary">
                        {searchResult.gate}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:w-1/3 bg-secondary rounded-[2.5rem] p-8 flex flex-col justify-center">
            <h4 className="font-black text-primary mb-8 flex items-center gap-3 uppercase tracking-widest text-xs">
              <Clock size={18} className="text-accent" />
              {t("statusPage.latestUpdates")}
            </h4>
            <div className="space-y-8">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <PlaneTakeoff size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-primary uppercase tracking-tight">
                    FP 102 {t("statusPage.to")} LHR
                  </p>
                  <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1">
                    {t("adminPage.onTime")} - 10:45
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <PlaneLanding size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-primary uppercase tracking-tight">
                    FP 305 {t("statusPage.from")} JFK
                  </p>
                  <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-1">
                    {t("adminPage.delayed")} - 14:20
                  </p>
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
