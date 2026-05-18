import React from "react";
import { motion } from "motion/react";
import { ClipboardList, FlaskConical, Stethoscope, LineChart } from "lucide-react";

const steps = [
  {
    title: "Medical Consultation",
    description: "Expert evaluation with our clinical team to understand your history and goals.",
    icon: Stethoscope,
    color: "teal"
  },
  {
    title: "Labs & Assessment",
    description: "Biomarker analysis and diagnostic screening to inform your personalized protocol.",
    icon: FlaskConical,
    color: "blue"
  },
  {
    title: "Personalized Protocol",
    description: "A tailored treatment plan designed specifically for your biology and objectives.",
    icon: ClipboardList,
    color: "indigo"
  },
  {
    title: "Monitoring & Tracking",
    description: "Ongoing clinical oversight and optimization to ensure safety and performance.",
    icon: LineChart,
    color: "emerald"
  }
];

export default function ProcessSection() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-4">
          <h2 className="text-teal-400 font-bold uppercase tracking-widest text-sm">Our Process</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Simple steps to recovery</h3>
          <p className="text-slate-400 text-lg">
            We follow a rigorous medical framework to ensure your treatments are safe, effective, and evidence-informed.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-6"
              >
                <div className="relative mx-auto">
                  <div className="w-10 h-10 absolute -top-4 -right-4 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-xs font-bold text-teal-400">
                    0{index + 1}
                  </div>
                  <div className="w-24 h-24 mx-auto rounded-[2rem] bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 transform rotate-45 group hover:rotate-[60deg] transition-transform duration-500">
                    <step.icon className="w-10 h-10 transform -rotate-45" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">{step.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[200px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
