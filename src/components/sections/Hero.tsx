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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3 h-3" />
            Advanced Orthopedic Care
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Heal Naturally. <br />
            <span className="text-teal-600 italic font-serif">Move Freely.</span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            Leading Westminster in regenerative medicine and non-operative orthopedics. From Wharton's Jelly and Exosomes to <strong>Musculoskeletal Laser</strong> and expert surgical second opinions, we help you avoid surgery and return to your active lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <BookingDialog 
              trigger={
                <button className="bg-teal-600 text-white px-8 py-4 rounded-full font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2 group">
                  Start Your Recovery
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              }
            />
            <Link to="/treatments" className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              View Treatments
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900">95%</div>
              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Patient Success</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900">15+</div>
              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Years Experience</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900">5k+</div>
              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Procedures Done</div>
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
              src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800&h=1000" 
              alt="Active lifestyle in nature" 
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
              <div className="text-sm font-bold text-slate-900">Real-time Recovery</div>
              <div className="text-[10px] text-slate-500">Monitoring your progress</div>
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
              <div className="text-sm font-bold text-slate-900">Safe & Effective</div>
              <div className="text-[10px] text-slate-500">Expert Clinical Oversight</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
