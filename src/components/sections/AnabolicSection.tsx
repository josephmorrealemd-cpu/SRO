import React from "react";
import { motion } from "motion/react";
import { Dumbbell, ShieldCheck, MessageSquare, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "../ui/BookingDialog";

export default function AnabolicSection() {
  return (
    <section id="anabolic" className="py-24 bg-slate-900 text-white overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <h2 className="text-blue-400 font-bold uppercase tracking-widest text-sm">Anabolic Support</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Testosterone Replacement (TRT)</h3>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Optimizing hormone levels to preserve muscle mass, enhance bone density, and accelerate recovery from orthopedic injury or surgery.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700 space-y-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <Dumbbell className="w-8 h-8 text-blue-400" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-bold">The Anabolic Foundation</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Testosterone Therapy increases lean body mass and bone density. This creates the foundation needed to recover from surgery or injury.
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
                  <BookingDialog 
                    title="TRT & Hormonal Optimization"
                    description="Discuss how testosterone replacement therapy can optimize your orthopedic recovery and muscle preservation. Fill out the form below to connect with our clinical team."
                    trigger={
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-2xl group shadow-lg shadow-blue-600/20"
                      >
                        <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Message Us to Discuss TRT
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                  <h5 className="text-2xl font-bold">Surgical Optimization</h5>
                </div>
                <div className="space-y-6">
                  <p className="text-slate-300 leading-relaxed">
                    Patients with low testosterone often face longer recovery times and higher risks of muscle atrophy following major orthopedic procedures like joint replacements. 
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    By optimizing your hormone profile, we ensure your body is in an anabolic state—ready to build tissue and regain strength during the critical rehabilitation window.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Clinical Focus</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl text-center">
                      <div className="text-2xl font-bold text-blue-400">Bone</div>
                      <div className="text-[10px] text-slate-500 uppercase">Mineral Density</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl text-center">
                      <div className="text-2xl font-bold text-teal-400">Muscle</div>
                      <div className="text-[10px] text-slate-500 uppercase">Preservation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
