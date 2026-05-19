import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Scale, ArrowRight, CheckCircle2, TrendingDown, Target } from "lucide-react";
import { BookingDialog } from "@/components/ui/BookingDialog";

export default function WeightLoss() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-sky-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2000" 
            alt="Healthy meal and lifestyle" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <TrendingDown className="w-4 h-4" />
            Physician-Guided Metabolic Health
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Medical Weight Loss. <br />
            <span className="text-sky-400">Sustainable Results.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Advanced GLP-1 programs integrated with hormone optimization and muscle preservation—managed by board-certified orthopedic specialists.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <BookingDialog 
              trigger={
                <button className="w-full sm:w-auto bg-sky-500 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2">
                  Start Your Assessment
                  <ArrowRight className="w-5 h-5" />
                </button>
              }
            />
          </div>
        </div>
      </section>

      {/* Why We Are Different */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-sky-600 font-bold uppercase tracking-widest text-sm mb-4">Beyond the Medication</h2>
            <h3 className="text-4xl font-bold text-slate-900">The Summit Metabolic Protocol</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Physician Oversite</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Direct management by board-certified surgeons who understand the critical link between systemic weight and joint longevity.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Muscle Preservation</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                We integrate peptide therapy and targeted nutrition to ensure you lose body fat, not the lean muscle required for mobility.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Labs-First Approach</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                No standard dosages. Full hormonal panels and metabolic labs drive every decision in your weight loss journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Health?</h2>
          <BookingDialog 
            trigger={
              <button className="bg-sky-500 text-slate-900 px-10 py-5 rounded-full font-bold text-xl hover:bg-sky-400 transition-all">
                Request Program Details
              </button>
            }
          />
        </div>
      </section>
    </div>
  );
}
