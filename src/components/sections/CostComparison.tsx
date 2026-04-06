import React from "react";
import { motion } from "motion/react";
import { Check, X, TrendingDown, Clock, ShieldCheck, Wallet } from "lucide-react";
import { BookingDialog } from "../ui/BookingDialog";

const COMPARISON_DATA = [
  {
    feature: "Recovery Time",
    regenerative: "1-3 Days",
    surgery: "3-6 Months",
    icon: Clock,
  },
  {
    feature: "Time Off Work",
    regenerative: "Minimal to None",
    surgery: "2-6 Weeks",
    icon: TrendingDown,
  },
  {
    feature: "Anesthesia Risk",
    regenerative: "None (Local only)",
    surgery: "General Anesthesia",
    icon: ShieldCheck,
  },
  {
    feature: "Hospital Stay",
    regenerative: "In-Office (1 Hour)",
    surgery: "1-3 Days Hospital",
    icon: Wallet,
  },
];

export default function CostComparison() {
  return (
    <section id="cost-comparison" className="py-24 bg-slate-950 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Side: Content */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest">The Investment</h2>
              <h3 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Regenerative Medicine vs. <span className="text-slate-500">Traditional Surgery</span>
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                While surgery often seems "covered," the hidden costs—high deductibles, time off work, and lengthy physical therapy—often exceed the investment in regenerative therapies.
              </p>
            </div>

            <div className="grid gap-4">
              {COMPARISON_DATA.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">{item.feature}</p>
                      <p className="text-sm font-bold text-teal-400">{item.regenerative}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Surgery</p>
                      <p className="text-sm font-bold text-slate-400">{item.surgery}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <BookingDialog 
                title="Financial Consultation"
                description="We offer transparent pricing and flexible payment options. Request a consultation to discuss your specific treatment plan."
                trigger={
                  <button className="bg-teal-500 text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20 active:scale-95">
                    Discuss Pricing & Options
                  </button>
                }
              />
            </div>
          </div>

          {/* Right Side: Visual Comparison Card */}
          <div className="w-full lg:w-[450px] relative">
            <div className="absolute inset-0 bg-teal-500/20 blur-[120px] rounded-full" />
            <div className="relative bg-slate-900 border border-white/10 rounded-[40px] p-8 shadow-2xl space-y-8">
              <div className="text-center space-y-2">
                <h4 className="text-xl font-bold">Total Value Analysis</h4>
                <p className="text-slate-400 text-sm">Estimated for Knee Replacement Alternative</p>
              </div>

              <div className="space-y-6">
                {/* Regenerative Row */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-teal-400">Regenerative Therapy</span>
                    <span>Regenerative Focus</span>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-teal-500"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                    <span>No Hospital Fees</span>
                    <span>No PT Required</span>
                  </div>
                </div>

                {/* Surgery Row */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>Traditional Surgery</span>
                    <span>High Hidden Costs</span>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "65%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-slate-600"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                    <span>Deductibles</span>
                    <span>Lost Wages</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">Treatment Series:</span> PRP and Wharton's Jelly protocols typically involve a 3-treatment series for optimal results.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">Avoid the "Gap":</span> Surgery often leaves patients with thousands in out-of-pocket costs even with insurance.
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-center text-slate-500 italic">
                *Comparison based on average US orthopedic surgical outcomes and costs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
