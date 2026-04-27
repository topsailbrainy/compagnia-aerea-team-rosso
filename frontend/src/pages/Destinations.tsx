import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSearchStore } from "../store";
import { motion } from "framer-motion";

// Import assets
import africaImg from "../assets/destinazioni/africa.avif";
import americaImg from "../assets/destinazioni/america.avif";
import asiaImg from "../assets/destinazioni/asia.avif";
import europaImg from "../assets/destinazioni/europa.avif";
import oceaniaImg from "../assets/destinazioni/oceania.avif";
import arabiaImg from "../assets/destinazioni/arabia.avif";

const Destinations: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSearch } = useSearchStore();

  const dests = [
    {
      name: t("destinations.africa"),
      img: africaImg,
      cities: ["16", "30"], // Athens, Tel-aviv as placeholders for Africa/nearby
      subtitle: "Wild landscapes and ancient wonders",
    },
    {
      name: t("destinations.america"),
      img: americaImg,
      cities: ["4", "6", "12"], // Paris, London, Amsterdam as placeholders
      subtitle: "From North to South, discover the New World",
    },
    {
      name: t("destinations.asia"),
      img: asiaImg,
      cities: ["29"], // Istanbul as placeholder
      subtitle: "Technological marvels and deep traditions",
    },
    {
      name: t("destinations.europe"),
      img: europaImg,
      cities: ["1", "2", "4", "6", "10", "16"], // Rome, Milan, Paris, London, Madrid, Athens
      subtitle: "History, culture and art at every corner",
    },
    {
      name: t("destinations.oceania"),
      img: oceaniaImg,
      cities: ["17"], // Lisbon as placeholder
      subtitle: "Unexplored nature and vibrant cities",
    },
    {
      name: t("destinations.middleEast"),
      img: arabiaImg,
      cities: ["29", "30"], // Istanbul, Tel-aviv
      subtitle: "Luxury and modernity in the desert",
    },
  ];

  const handleDestinationClick = React.useCallback(
    (cities: string[]) => {
      // Select a random city from the list
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      setSearch("to", randomCity);
      // Set a default from if not set (Rome ID is 1)
      setSearch("from", "1");
      navigate("/");
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [navigate, setSearch],
  );

  return (
    <div className="p-12 mt-20 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">
          {t("destinations.title")}
        </h2>
        <p className="text-gray-500 text-xl">{t("destinations.subtitle")}</p>
        <div className="w-24 h-1 bg-accent mt-6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {dests.map((dest, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleDestinationClick(dest.cities)}
            className="group relative h-96 bg-gray-100 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
          >
            <img
              src={dest.img}
              alt={dest.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2">
                {dest.name}
              </h3>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                {dest.subtitle}
              </p>
            </div>
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary shadow-xl">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
