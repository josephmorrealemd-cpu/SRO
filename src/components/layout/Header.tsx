import { useState, useEffect } from "react";
import { Phone, Menu, X, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BookingDialog } from "../ui/BookingDialog";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Treatments", href: "/treatments" },
  { name: "Anatomy", href: "/anatomy" },
  { name: "Investment", href: "/investment" },
  { name: "Education", href: "/education" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md py-2 shadow-sm border-slate-100" 
          : "bg-white py-4 border-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img 
            src="/logo.png" 
            alt="Summit Regenerative Orthopedics" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              // Fallback if logo.png is missing
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.querySelector('.logo-fallback')?.classList.remove('hidden');
            }}
          />
          <div className="logo-fallback hidden flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">SUMMIT</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-teal-600 font-semibold">Regenerative Orthopedics</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-1 lg:gap-2 text-sm font-medium text-slate-600 px-4">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name}
              to={link.href} 
              className={cn(
                "px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap",
                pathname === link.href 
                  ? "text-teal-700 bg-teal-50 font-bold" 
                  : "hover:text-teal-600 hover:bg-slate-50"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          <a 
            href="tel:7207769165" 
            className="hidden lg:flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-colors"
          >
            <Phone className="w-4 h-4" />
            720-776-9165
          </a>
          
          <div className="hidden sm:block">
            <BookingDialog 
              trigger={
                <button className="bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                  Book Now
                </button>
              }
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 top-[73px] bg-white z-40 md:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl text-lg font-bold transition-colors",
                  pathname === link.href 
                    ? "bg-teal-50 text-teal-700" 
                    : "text-slate-900 hover:bg-slate-50"
                )}
              >
                {link.name}
                <ChevronRight className={cn("w-5 h-5", pathname === link.href ? "text-teal-600" : "text-slate-300")} />
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <a 
              href="tel:7207769165" 
              className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-teal-50 text-teal-700 font-bold"
            >
              <Phone className="w-5 h-5" />
              Call 720-776-9165
            </a>
            <BookingDialog 
              trigger={
                <button className="w-full bg-teal-600 text-white p-4 rounded-2xl font-bold shadow-xl shadow-teal-600/20">
                  Book Appointment
                </button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}
