import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Activity, ArrowRight, CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingDialog } from "@/components/ui/BookingDialog";

export default function KneePainLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000" 
            alt="Medical imaging background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <ShieldCheck className="w-4 h-4" />
            Board-Certified Orthopedic Solutions
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Avoid Knee Surgery. <br />
            <span className="text-teal-400">Restore Your Mobility.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Advanced regenerative injections and non-surgical protocols designed by board-certified orthopedic surgeons to heal knee pain at the source.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <BookingDialog 
              trigger={
                <button className="w-full sm:w-auto bg-teal-500 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2">
                  Check Your Eligibility
                  <ArrowRight className="w-5 h-5" />
                </button>
              }
            />
            <button className="flex items-center gap-3 text-slate-300 hover:text-white font-semibold transition-colors">
              <PlayCircle className="w-6 h-6 text-teal-400" />
              Watch Patient Results
            </button>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-teal-600 font-bold uppercase tracking-widest text-sm">The Reality of Surgery</h2>
              <h3 className="text-4xl font-bold text-slate-900 leading-tight">Total Knee Replacement Isn't Your Only Option</h3>
              <p className="text-slate-600 text-lg">
                For active adults, surgery often means months of painful rehab and potential complications. Our evidence-informed protocols aim to delay or entirely prevent surgical intervention.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  "Avoid long hospital stays",
                  "Minimal downtime vs. surgery",
                  "Heal with your own biology",
                  "Return to the activities you love"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 relative group">
              <img 
                src="https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800"
                alt="Medical anatomical view"
                className="rounded-2xl w-full h-auto mb-6 group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute -top-6 -right-6 bg-teal-600 text-white p-6 rounded-2xl shadow-xl font-bold text-lg">
                PRP & Exosome <br /> Specialized
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Diagnostic Precision</h4>
              <p className="text-slate-500 text-sm">
                We use an elite level of diagnostic assessment to identify the exact source of your structural limitation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Moat */}
      <section className="py-24 bg-white border-y border-slate-100 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">Guided by Board-Certified Orthopedic Surgeons</h2>
          <p className="text-slate-600 text-lg mb-12">
            Most "regenerative clinics" are run by general practitioners or mid-level providers. At Summit, your knee recovery protocol is designed by specialists with thousands of hours of surgical anatomical knowledge.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50">
              <div className="text-4xl font-bold text-teal-600 mb-2">5k+</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Procedures Done</p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50">
              <div className="text-4xl font-bold text-teal-600 mb-2">15+</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Years Experience</p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50">
              <div className="text-4xl font-bold text-teal-600 mb-2">Expert</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Diagnostics</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to Avoid Surgery?</h2>
          <p className="text-xl text-teal-100 mb-12 max-w-2xl mx-auto">
            Schedule a medical assessment with our board-certified team to see if you are a candidate for regenerative intervention.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <BookingDialog 
              trigger={
                <button className="bg-white text-teal-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-slate-100 transition-all shadow-2xl">
                  Book Your Consultation
                </button>
              }
            />
            <Link to="/education" className="text-white font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
              Learn the Science <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
