import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, Scale, Activity, ArrowRight, MessageSquare, Dumbbell, ShieldCheck, HeartPulse, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import BMICalculator from "@/components/BMICalculator";

export default function MetabolicSection() {
  return (
    <section id="metabolic" className="py-24 bg-slate-900 text-white overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-teal-400 font-bold uppercase tracking-widest text-sm">Metabolic & Anabolic Optimization</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">The Modern Orthopedic Framework</h3>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              We integrate GLP-1 therapies and Testosterone Replacement (TRT) to address obesity-related joint loading, muscle preservation, and bone health.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* GLP-1 Section */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center">
                  <Scale className="w-8 h-8 text-teal-400" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold">GLP-1 Metabolic Support</h4>
                  <p className="text-slate-300 leading-relaxed">
                    GLP-1 receptor agonists (Semaglutide, Tirzepatide) achieve substantial weight loss (12–24%), significantly reducing the mechanical stress on your joints. 
                    <span className="block mt-4 text-emerald-400 font-medium">Orthopedic Relevance:</span>
                    Reduced joint loading in Osteoarthritis (OA) and potential systemic anti-inflammatory effects.
                  </p>
                </div>

                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex gap-4">
                  <Info className="w-8 h-8 text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-50/80 leading-relaxed italic">
                    <span className="font-bold">Clinical Note:</span> Approximately 30% of weight lost on GLP-1 alone can be lean mass (muscle). Muscle preservation via exercise and supplemental support is critical for orthopedic health.
                  </p>
                </div>
              </div>
            </div>

            {/* TRT Section */}
            <div className="space-y-8">
              <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700 space-y-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <Dumbbell className="w-8 h-8 text-blue-400" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold">Anabolic Support (TRT)</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Testosterone Therapy increases lean body mass and bone density. This creates the anabolic foundation needed to recover from surgery or injury.
                    <span className="block mt-4 text-blue-400 font-medium">Orthopedic Relevance:</span>
                    Reduces sarcopenia (muscle loss), enhances surgical recovery, and improves bone mineral density in hypogonadal men.
                  </p>
                </div>

                <ul className="grid gap-4">
                  {[
                    "Improve muscle mass for better joint stabilization",
                    "Enhance recovery from major surgeries",
                    "Support bone density and reduce fracture risk",
                    "Counteract muscle loss associated with rapid weight loss"
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-slate-300 text-sm">
                      <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-2xl group shadow-lg shadow-blue-600/20"
                  >
                    <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Message Us to Discuss TRT
                  </Button>
                </div>
              </div>

              {/* Combined Axis */}
              <div className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="text-xl font-bold">The Strategic Combined Approach</h5>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  By combining fat loss (GLP-1) with lean mass preservation (TRT + Exercise), we optimize your body composition for surgical recovery and long-term functional success. This reduces frailty and improves long-term outcome.
                </p>
              </div>
            </div>
          </div>

          {/* Integration Table (Desktop Only or Simplified mobile) */}
          <div className="hidden md:block overflow-hidden rounded-[2.5rem] border border-slate-700 bg-slate-800/30">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Intervention</th>
                  <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Effect on Lean Mass</th>
                  <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Effect on Bone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <tr>
                  <td className="p-6 font-bold text-rose-400">GLP-1 RA alone</td>
                  <td className="p-6 text-slate-300">Significant loss (≈6 kg)</td>
                  <td className="p-6 text-slate-300 font-medium italic">Hip and spine BMD reduction</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-emerald-400">Exercise alone</td>
                  <td className="p-6 text-slate-300">Increased lean mass</td>
                  <td className="p-6 text-slate-300">Preserved BMD</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-teal-400">GLP-1 RA + Exercise</td>
                  <td className="p-6 text-slate-300">Intermediate (Reduced loss)</td>
                  <td className="p-6 text-slate-300">Preserved hip/spine BMD</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t border-slate-800 text-center space-y-4">
            <p className="text-xs text-slate-500 italic max-w-2xl mx-auto uppercase tracking-wide">
              Medical Disclaimer
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Metabolic and hormone therapies require clinical evaluation including laboratory testing and personalized risk assessment. GLP-1 receptor agonists and TRT are prescription medications indicated for specific clinical conditions. Personal and family medical history must be reviewed prior to initiation. 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
