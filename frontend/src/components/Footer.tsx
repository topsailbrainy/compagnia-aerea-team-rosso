import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a2831] text-white/60 py-20 px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <h1 className="text-2xl font-bold text-white mb-6">FLY<span className="text-accent">PLUS</span></h1>
          <p className="text-sm leading-relaxed mb-8">
            A premium aviation experience connecting Italy to the world with the youngest and most modern fleet.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/book" className="hover:text-accent transition-colors">Book a flight</Link></li>
            <li><Link to="/manage" className="hover:text-accent transition-colors">Manage booking</Link></li>
            <li><Link to="/flight-status" className="hover:text-accent transition-colors">Flight status</Link></li>
            <li><Link to="/check-in" className="hover:text-accent transition-colors">Check-in</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Services</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/fleet" className="hover:text-accent transition-colors">Business Class</Link></li>
            <li><Link to="/fleet" className="hover:text-accent transition-colors">Economy Class</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">In-flight dining</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">Sky Loyalty</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Newsletter</h4>
          <p className="text-sm mb-4">Subscribe to get the latest offers.</p>
          <div className="flex">
            <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 px-4 py-2 rounded-l outline-none focus:border-accent w-full" />
            <button className="bg-accent text-primary font-bold px-4 rounded-r hover:bg-white transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-xs flex flex-col md:flex-row justify-between gap-4">
        <p>© 2026 FlyPlus Aviation. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
