import { motion } from "motion/react";
import { ArrowRight, Activity, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingDialog } from "../ui/BookingDialog";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-20 pb-32">
      {/* Abstract background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-teal-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-sky-100/50 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex flex-wrap items-center gap-2">
            <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Board-Certified Orthopedic Excellence
            </div>
            <div className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Non-Operative Precision
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Restore Recovery. <br />
            <span className="text-slate-400">Reduce Pain.</span> <br />
            <span className="text-teal-600 italic font-serif">Optimize Performance.</span>
          </h1>
          
          <div className="space-y-4 max-w-xl">
            <p className="text-xl font-bold text-slate-900 leading-tight">
              Advanced regenerative injections and non-operative orthopedic care delivered by board-certified orthopedic surgeons.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Personalized recovery, metabolic health, and hormone optimization programs designed to help you stay active, strong, and resilient.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <BookingDialog 
              title="Schedule Your Medical Consultation"
              description="Take the first step toward recovery. Schedule a personalized consultation with our specialized medical team to discuss your treatment goals."
              trigger={
                <button className="bg-teal-600 text-white px-8 py-4 rounded-full font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2 group">
                  Schedule Your Medical Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              }
            />
            <button 
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              Explore Programs
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900">5,000+</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight">Procedures Performed</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900">15+</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight">Years Clinical Experience</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900">Expert</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight">Board-Certified Specialists</div>
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
