import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#1a2831] text-white/60 py-20 px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="w-16 h-16 mb-6">
            <img
              src="/logo.png"
              alt={t("footer.logoAlt")}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 uppercase">
            Fly<span className="text-accent">Plus</span>
          </h1>
          <p className="text-sm leading-relaxed mb-8">{t("footer.desc")}</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
            {t("footer.links")}
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link to="/" className="hover:text-accent transition-colors">
                {t("footer.bookFlight")}
              </Link>
            </li>
            <li>
              <Link
                to="/manage"
                className="hover:text-accent transition-colors"
              >
                {t("footer.manageBooking")}
              </Link>
            </li>
            <li>
              <Link
                to="/flight-status"
                className="hover:text-accent transition-colors"
              >
                {t("footer.flightStatus")}
              </Link>
            </li>
            <li>
              <Link
                to="/check-in"
                className="hover:text-accent transition-colors"
              >
                {t("footer.checkin")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
            {t("sidebar.explore")}
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link
                to="/destinations"
                className="hover:text-accent transition-colors"
              >
                {t("sidebar.destinations")}
              </Link>
            </li>
            <li>
              <Link to="/fleet" className="hover:text-accent transition-colors">
                {t("sidebar.fleet")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-accent transition-colors">
                {t("sidebar.about")}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-accent transition-colors"
              >
                {t("sidebar.contact")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          {/* This empty div preserves the grid layout if needed, or you can adjust grid-cols */}
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-xs flex flex-col md:flex-row justify-between gap-4">
        <p>© 2026 FlyPlus Aviation. {t("footer.allRights")}</p>
        <div className="flex gap-6">
          <span>{t("footer.privacy")}</span>
          <span>{t("footer.terms")}</span>
          <span>{t("footer.cookies")}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
