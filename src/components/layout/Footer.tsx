import { Phone, Mail, MapPin, Printer, Facebook, Twitter, Linkedin, ShieldCheck, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="Summit Regenerative Orthopedics" 
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105 brightness-0 invert"
                onError={(e) => {
                  // Fallback if logo.png is missing
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.logo-fallback')?.classList.remove('hidden');
                }}
              />
              <div className="logo-fallback hidden flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-slate-900 font-bold text-lg group-hover:scale-105 transition-transform">
                  S
                </div>
                <span className="font-bold text-xl text-white tracking-tight">SUMMIT</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              Leading the way in regenerative orthopedic medicine. We help patients return to their active lifestyles without surgery.
            </p>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={(e) => e.preventDefault()} 
                className="hover:text-teal-400 transition-colors cursor-pointer"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={(e) => e.preventDefault()} 
                className="hover:text-teal-400 transition-colors cursor-pointer"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={(e) => e.preventDefault()} 
                className="hover:text-teal-400 transition-colors cursor-pointer"
              >
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/treatments" className="hover:text-teal-400 transition-colors">Treatments</Link></li>
              <li><Link to="/anatomy" className="hover:text-teal-400 transition-colors">Interactive Anatomy</Link></li>
              <li><Link to="/investment" className="hover:text-teal-400 transition-colors">Investment Comparison</Link></li>
              <li><Link to="/education" className="hover:text-teal-400 transition-colors">Patient Education</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Contact Us</Link></li>
              <li className="pt-2 border-t border-slate-800">
                <Link to="/admin" className="text-teal-400 hover:text-teal-300 font-medium transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-500 shrink-0" />
                <span>8753 Yates Drive, Suite 110<br />Westminster, CO 80031</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-500 shrink-0" />
                <a href="tel:7207769165" className="hover:text-teal-400 transition-colors">720-776-9165</a>
              </li>
              <li className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-teal-500 shrink-0" />
                <span>720-915-2817 (Fax)</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Office Hours</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between"><span>Mon - Thu</span><span>8:00 AM - 5:00 PM</span></li>
              <li className="flex justify-between"><span>Friday</span><span>8:00 AM - 1:00 PM</span></li>
              <li className="flex justify-between"><span>Sat - Sun</span><span>Closed</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Summit Regenerative Orthopedics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link 
              to="/privacy" 
              className="hover:text-slate-300 transition-colors cursor-pointer text-xs"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="hover:text-slate-300 transition-colors cursor-pointer text-xs"
            >
              Terms of Service
            </Link>
            <Link 
              to="/admin" 
              className="hover:text-teal-400 transition-colors cursor-pointer text-xs flex items-center gap-1 text-slate-400"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Staff / Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
