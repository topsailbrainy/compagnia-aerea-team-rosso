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
            {t("footer.services")}
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link to="/fleet" className="hover:text-accent transition-colors">
                {t("footer.business")}
              </Link>
            </li>
            <li>
              <Link to="/fleet" className="hover:text-accent transition-colors">
                {t("footer.economy")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-accent transition-colors">
                {t("footer.dining")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-accent transition-colors">
                {t("footer.loyalty")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
            {t("footer.newsletter")}
          </h4>
          <p className="text-sm mb-4">{t("footer.newsSub")}</p>
          <div className="flex">
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              className="bg-white/5 border border-white/10 px-4 py-2 rounded-l outline-none focus:border-accent w-full"
            />
            <button className="bg-accent text-primary font-bold px-4 rounded-r hover:bg-white transition-colors">
              {t("footer.join")}
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-xs flex flex-col md:flex-row justify-between gap-4">
        <p>© 2026 FlyPlus Aviation. {t("footer.allRights")}</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">
            {t("footer.privacy")}
          </a>
          <a href="#" className="hover:text-white">
            {t("footer.terms")}
          </a>
          <a href="#" className="hover:text-white">
            {t("footer.cookies")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
