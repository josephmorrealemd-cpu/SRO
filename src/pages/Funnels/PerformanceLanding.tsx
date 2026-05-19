import React from "react";
import { motion } from "motion/react";
import { Zap, ShieldCheck, ArrowRight, LayoutGrid, Heart, Flame } from "lucide-react";
import { BookingDialog } from "@/components/ui/BookingDialog";

export default function PerformanceLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-40 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000" 
            alt="Athletic performance" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <Zap className="w-4 h-4" />
            Elite Performance Optimization
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Move Stronger. <br />
            <span className="text-amber-400">Recover Faster.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Integrated TRT, peptide therapy, and hormonal optimization protocols designed for the high-performing individual.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <BookingDialog 
              trigger={
                <button className="w-full sm:w-auto bg-amber-500 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2">
                  Check Optimization Potential
                  <ArrowRight className="w-5 h-5" />
                </button>
              }
            />
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-24 bg-white -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Energy & Vigor", desc: "Combat fatigue and listlessness with precise hormonal balance.", icon: Flame, color: "orange" },
              { title: "Lean Muscle", desc: "Optimize your body's ability to retain and build lean functional mass.", icon: LayoutGrid, color: "blue" },
              { title: "Cognitive Focus", desc: "Restore mental clarity and drive through physician-guided protocols.", icon: Zap, color: "amber" },
              { title: "Metabolic Health", desc: "Lower inflammation and optimize body composition for longevity.", icon: Heart, color: "rose" }
            ].map((pillar) => (
              <div key={pillar.title} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
                <pillar.icon className={`w-8 h-8 text-${pillar.color}-500 mb-6`} />
                <h4 className="text-lg font-bold text-slate-900 mb-2">{pillar.title}</h4>
                <p className="text-slate-500 text-sm">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Surgeon Moat */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 text-teal-600 font-bold mb-4">
            <ShieldCheck className="w-5 h-5" />
            Medical Authority
          </div>
          <h3 className="text-4xl font-bold text-slate-900 mb-8">Why High-Performers Choose Summit</h3>
          <p className="text-slate-600 text-lg leading-relaxed mb-12">
            Most optimization clinics are internet-based businesses or generic wellness spas. We are anchored in orthopedic surgical expertise. We understand how hormonal balance affects not just your "mood," but your structural longevity and injury resilience.
          </p>
          <BookingDialog 
            trigger={
              <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all">
                Schedule a Medical Case Review
              </button>
            }
          />
        </div>
      </section>
    </div>
  );
}
