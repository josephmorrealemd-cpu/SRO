import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Clock, ShieldCheck, Zap, ChevronRight, Info } from "lucide-react";

interface TimelineStep {
  week: string;
  phase: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    week: "Week 1",
    phase: "Inflammation",
    title: "The Initial Response",
    description: "Your body's natural healing response is activated. Growth factors from the treatment begin signaling local cells to start the repair process. You may feel mild soreness as the regenerative environment is established.",
    icon: Zap,
    color: "bg-orange-500",
  },
  {
    week: "Week 2-4",
    phase: "Proliferation",
    title: "Tissue Reconstruction",
    description: "New collagen fibers and structural proteins begin to form. This is the 'building' phase where the cellular matrix is reinforced. Pain levels typically begin to decrease as structural integrity improves.",
    icon: Activity,
    color: "bg-teal-500",
  },
  {
    week: "Week 6-8",
    phase: "Remodeling",
    title: "Functional Strength",
    description: "The newly formed tissue matures and aligns with the natural stress patterns of your joint. This is when patients often report significant improvements in mobility and the ability to return to light activity.",
    icon: ShieldCheck,
    color: "bg-blue-500",
  },
  {
    week: "Week 12+",
    phase: "Maturation",
    title: "Peak Recovery",
    description: "The regenerative process reaches its peak. The treated area is now significantly stronger and more resilient. Most patients are back to full activity, enjoying the long-term benefits of non-surgical healing.",
    icon: Clock,
    color: "bg-indigo-500",
  },
];

export default function RecoveryTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const ActiveIcon = TIMELINE_STEPS[activeStep].icon;

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recovery Roadmap
              </h2>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">The 12-Week Healing Journey</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Regenerative medicine isn't a quick fix—it's a biological process. Use the timeline to see how your body transforms and heals in the weeks following your treatment.
              </p>
            </div>

            <div className="space-y-4">
              {TIMELINE_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`w-full flex items-center gap-6 p-6 rounded-3xl transition-all duration-300 border text-left group ${
                      activeStep === index 
                        ? "bg-white border-teal-500 shadow-xl shadow-teal-500/5" 
                        : "bg-transparent border-transparent hover:bg-white/50"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      activeStep === index ? step.color + " text-white shadow-lg" : "bg-slate-200 text-slate-400 group-hover:bg-slate-300"
                    }`}>
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                        activeStep === index ? "text-teal-600" : "text-slate-400"
                      }`}>
                        {step.week} • {step.phase}
                      </div>
                      <div className={`text-lg font-bold ${
                        activeStep === index ? "text-slate-900" : "text-slate-600"
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                      activeStep === index ? "text-teal-500 translate-x-1" : "text-slate-300"
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative w-full lg:w-[600px] aspect-square">
            {/* Background Decorative Element */}
            <div className="absolute inset-0 bg-teal-500/5 rounded-full blur-[120px] -z-10" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotate: 2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full bg-white rounded-[48px] shadow-2xl border border-slate-100 p-12 flex flex-col justify-center relative overflow-hidden"
              >
                {/* Large Background Icon */}
                <div className="absolute -top-12 -right-12 w-48 h-48 opacity-[0.03] text-teal-900">
                  <ActiveIcon className="w-full h-full" />
                </div>

                <div className="space-y-8 relative z-10">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl ${TIMELINE_STEPS[activeStep].color}`}>
                    <ActiveIcon className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {TIMELINE_STEPS[activeStep].week}
                      </span>
                      <span className={`px-3 py-1 text-white rounded-full text-[10px] font-bold uppercase tracking-widest ${TIMELINE_STEPS[activeStep].color}`}>
                        {TIMELINE_STEPS[activeStep].phase}
                      </span>
                    </div>
                    <h4 className="text-4xl font-bold text-slate-900 leading-tight">
                      {TIMELINE_STEPS[activeStep].title}
                    </h4>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {TIMELINE_STEPS[activeStep].description}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600">
                        <Info className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Clinical Note: Individual recovery times may vary based on age, activity level, and the specific joint treated.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
