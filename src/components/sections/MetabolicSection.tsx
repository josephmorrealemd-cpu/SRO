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
            <h2 className="text-teal-400 font-bold uppercase tracking-widest text-sm">Metabolic Optimization</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">GLP-1 Weighted Joint Support</h3>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              We integrate GLP-1 therapies to address obesity-related joint loading and systemic inflammation, creating a better environment for regenerative healing.
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

                <div className="pt-6">
                  <h5 className="text-lg font-bold mb-4">Treatment Integration</h5>
                  <div className="grid gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <div className="text-teal-400 font-bold text-sm mb-1">Pre-Regenerative</div>
                      <p className="text-xs text-slate-400">Reduce systemic inflammation before PRP or cell-based therapies.</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <div className="text-teal-400 font-bold text-sm mb-1">Mechanical Decompression</div>
                      <p className="text-xs text-slate-400">Lowering body weight reduces the PSI on knee and hip cartilage.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BMI Calculator Integration */}
            <div className="space-y-8">
              <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-700/50">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-bold mb-2">Check Your Joint Load</h4>
                  <p className="text-slate-400 text-sm">Calculate your BMI to understand its impact on your joint health.</p>
                </div>
                <BMICalculator />
              </div>

              {/* Integration Table (Desktop Only or Simplified mobile) */}
              <div className="hidden md:block overflow-hidden rounded-[2.5rem] border border-slate-700 bg-slate-800/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="p-4 font-bold text-slate-400 uppercase tracking-widest">Intervention</th>
                      <th className="p-4 font-bold text-slate-400 uppercase tracking-widest">Lean Mass</th>
                      <th className="p-4 font-bold text-slate-400 uppercase tracking-widest">Bone BMD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    <tr>
                      <td className="p-4 font-bold text-rose-400">GLP-1 RA alone</td>
                      <td className="p-4 text-slate-300">Loss (≈6 kg)</td>
                      <td className="p-4 text-slate-300">Reduction</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-emerald-400">GLP-1 + Exercise</td>
                      <td className="p-4 text-slate-300">Reduced loss</td>
                      <td className="p-4 text-slate-300">Preserved</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-slate-800 text-center space-y-4">
            <p className="text-xs text-slate-500 italic max-w-2xl mx-auto uppercase tracking-wide">
              Medical Disclaimer
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Metabolic therapies require clinical evaluation including laboratory testing and personalized risk assessment. GLP-1 receptor agonists are prescription medications indicated for specific clinical conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
