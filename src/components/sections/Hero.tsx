import { motion } from "motion/react";
import { ArrowRight, Activity, ShieldCheck, Zap, Sparkles, HelpCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingDialog } from "../ui/BookingDialog";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-16 pb-28 sm:pb-32">
      {/* Abstract background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-teal-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-sky-100/50 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 sm:space-y-8"
        >
          <div className="inline-flex flex-wrap items-center gap-2">
            <div className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Board-Certified Orthopedic Surgeon
            </div>
            <Link 
              to="/guide/regenerative-medicine-101" 
              className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Free Biologics 101 Guide
            </Link>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Restore Cartilage. <br />
            <span className="text-slate-400">Avoid Surgery.</span> <br />
            <span className="text-teal-600 italic font-serif">Regenerate Naturally.</span>
          </h1>
          
          <div className="space-y-3 max-w-xl">
            <p className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              Advanced biologic regeneration — Wharton’s Jelly, Exosomes, PRP, and MSK Laser — delivered by a board-certified orthopedic surgeon.
            </p>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Personalized non-surgical joint restoration, cellular signaling, and image-guided tissue scaffolding designed to eliminate chronic pain and prevent joint replacement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1">
            <BookingDialog 
              title="Schedule Your Orthopedic Consultation"
              description="Meet with Dr. Joseph Morreale in Westminster, CO to review your imaging and discuss customized biologic options."
              trigger={
                <button className="bg-teal-600 text-white px-8 py-4 rounded-full font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2 group text-sm sm:text-base">
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              }
            />
            <Link
              to="/pain-quiz"
              className="bg-white border-2 border-teal-600 text-teal-800 px-6 py-4 rounded-full font-bold hover:bg-teal-50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              Take 2-Min Pain Quiz
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
            <span>Explore Options:</span>
            <Link to="/biologics-decision" className="text-teal-700 hover:text-teal-800 hover:underline">
              Biologics Decision Matrix →
            </Link>
            <span>•</span>
            <Link to="/guide/regenerative-medicine-101" className="text-teal-700 hover:text-teal-800 hover:underline">
              Free Patient Guide →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900">5,000+</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight">Procedures Performed</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-teal-700">Tier 1</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight">Wharton's Jelly & Exosomes</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900">100% MD</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight">Board-Certified Surgeon</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800&h=1000" 
              alt="Orthopedic surgeon consulting with patient" 
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Floating info cards */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Non-Surgical Recovery</div>
              <div className="text-[10px] text-slate-500">Advanced regenerative protocols</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Physician-Guided Care</div>
              <div className="text-[10px] text-slate-500">Personalized treatment oversight</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
