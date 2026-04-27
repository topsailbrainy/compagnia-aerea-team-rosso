import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import logoImg from "../assets/logo.png";

import { useSearchStore } from "../store";

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setSearch,
    hasSignedUp,
    userEmail: storedEmail,
    userPassword: storedPassword,
    addBooking,
  } = useSearchStore();
  const queryParams = new URLSearchParams(location.search);
  const isLogin = queryParams.get("tab") !== "signup";

  const setIsLogin = (login: boolean) => {
    navigate(`?tab=${login ? "login" : "signup"}`, { replace: true });
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data.message || t("authPage.errorInvalidCredentials"),
          );
        }

        const { token, user } = await response.json();
        setSearch("isLoggedIn", true);
        setSearch("userRole", user.ruolo);
        setSearch("userId", user.id);
        setSearch("userName", `${user.nome} ${user.cognome}`);
        setSearch("userEmail", user.email);

        if (user.ruolo === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        const nameParts = formData.fullName.trim().split(/\s+/);
        if (nameParts.length < 2) {
          throw new Error(t("authPage.errorNameRequired"));
        }

        const nome = nameParts[0];
        const cognome = nameParts.slice(1).join(" ");

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome,
            cognome,
            email: formData.email,
            password: formData.password,
            telefono: "", // Optional
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Signup failed");
        }

        const user = await response.json();
        setSearch("isLoggedIn", true);
        setSearch("userRole", user.ruolo);
        setSearch("userId", user.id);
        setSearch("userName", `${user.nome} ${user.cognome}`);
        setSearch("userEmail", user.email);

        navigate("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-primary/10 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Visual/Info (Desktop) */}
        <div className="hidden md:flex md:w-1/2 bg-primary relative overflow-hidden p-12 flex-col justify-between">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <img
                src={logoImg}
                alt="FlyPlus"
                className="w-12 h-12 object-contain"
              />
              <span className="text-2xl font-black tracking-tighter text-white uppercase">
                Fly<span className="text-accent">Plus</span>
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {t("authPage.experience")} <br />
              <span className="text-accent">{t("authPage.artOfAviation")}</span>
            </h2>
            <p className="text-white/60 text-lg max-w-md">
              {t("authPage.joinCircle")}
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-primary bg-gray-200 overflow-hidden"
                >
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-accent flex items-center justify-center text-[10px] font-bold text-primary">
                +2k
              </div>
            </div>
            <p className="text-white/40 text-sm font-medium tracking-wide">
              {t("authPage.trustedBy")}
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <div className="flex bg-secondary p-1 rounded-2xl mb-8 w-fit">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${isLogin ? "bg-white text-primary shadow-sm" : "text-primary/40 hover:text-primary"}`}
              >
                {t("authPage.login")}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${!isLogin ? "bg-white text-primary shadow-sm" : "text-primary/40 hover:text-primary"}`}
              >
                {t("authPage.signup")}
              </button>
            </div>

            <h1 className="text-3xl font-bold text-primary mb-2">
              {isLogin
                ? t("authPage.welcomeBack")
                : t("authPage.createAccount")}
            </h1>
            <p className="text-gray-500">
              {isLogin ? t("authPage.loginDesc") : t("authPage.signupDesc")}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold uppercase tracking-wider"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="fullName"
                      placeholder={t("authPage.fullName")}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-secondary border-none rounded-xl focus:ring-2 focus:ring-accent/50 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                placeholder={t("authPage.email")}
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-secondary border-none rounded-xl focus:ring-2 focus:ring-accent/50 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("authPage.password")}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-12 py-3.5 bg-secondary border-none rounded-xl focus:ring-2 focus:ring-accent/50 outline-none transition-all text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-accent hover:text-primary transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? t("authPage.login") : t("authPage.signup")}
                  <ArrowRight size={16} className="text-accent" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400 font-medium">
            {isLogin
              ? t("authPage.dontHaveAccount")
              : t("authPage.alreadyHaveAccount")}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent hover:text-primary font-bold uppercase tracking-wider transition-colors ml-1"
            >
              {isLogin ? t("authPage.signup") : t("authPage.login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
