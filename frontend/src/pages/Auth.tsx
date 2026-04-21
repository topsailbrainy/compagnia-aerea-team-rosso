import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, GitBranch, Globe, Eye, EyeOff } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const isLogin = queryParams.get('tab') !== 'signup';

  const setIsLogin = (login: boolean) => {
    navigate(`?tab=${login ? 'login' : 'signup'}`, { replace: true });
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Form submitted:', isLogin ? 'Login' : 'Signup', formData);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/book');
    }, 1500);
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
              <img src={logoImg} alt="FlyPlus" className="w-12 h-12 object-contain" />
              <span className="text-2xl font-black tracking-tighter text-white uppercase">Fly<span className="text-accent">Plus</span></span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Experience the <br />
              <span className="text-accent">Art of Aviation.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-md">
              Join our exclusive circle of travelers and unlock a world of premium benefits, seamless bookings, and personalized experiences.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-accent flex items-center justify-center text-[10px] font-bold text-primary">
                +2k
              </div>
            </div>
            <p className="text-white/40 text-sm font-medium tracking-wide">
              Trusted by over 2,000+ frequent flyers worldwide.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <div className="flex bg-secondary p-1 rounded-2xl mb-8 w-fit">
              <button 
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${isLogin ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${!isLogin ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary'}`}
              >
                Sign Up
              </button>
            </div>

            <h1 className="text-3xl font-bold text-primary mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-gray-500">
              {isLogin ? 'Please enter your details to login.' : 'Join FlyPlus and start your journey today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="Full Name"
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
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-secondary border-none rounded-xl focus:ring-2 focus:ring-accent/50 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-12 py-3.5 bg-secondary border-none rounded-xl focus:ring-2 focus:ring-accent/50 outline-none transition-all text-sm font-medium"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-accent hover:text-primary transition-colors uppercase tracking-wider">
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Login' : 'Create Account'}
                  <ArrowRight size={16} className="text-accent" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-100 rounded-xl hover:bg-secondary transition-all group">
                <Globe size={18} className="text-gray-400 group-hover:text-[#4285F4]" />
                <span className="text-xs font-bold text-primary">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-100 rounded-xl hover:bg-secondary transition-all group">
                <GitBranch size={18} className="text-gray-400 group-hover:text-black" />
                <span className="text-xs font-bold text-primary">Github</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent hover:text-primary font-bold uppercase tracking-wider transition-colors ml-1"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
