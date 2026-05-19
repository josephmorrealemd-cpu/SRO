import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Activity, Scale, Zap, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const pathways = [
  {
    title: "Regenerative Orthopedics",
    description: "Advanced injections and non-surgical repair protocols led by board-certified orthopedic surgeons.",
    icon: Activity,
    color: "teal",
    link: "/treatments?goal=joint",
    features: ["PRP & Exosome Injections", "Non-Surgical Repair", "Consultative Expertise"]
  },
  {
    title: "Medical Weight Loss",
    description: "Physician-guided GLP-1 programs with muscle preservation and metabolic optimization.",
    icon: Scale,
    color: "blue",
    link: "/treatments?goal=metabolism",
    features: ["GLP-1 Programs", "Muscle Preservation", "Metabolic Optimization"]
  },
  {
    title: "Hormonal Optimization",
    description: "Testosterone optimization for energy, strength, libido, and recovery.",
    icon: Zap,
    color: "amber",
    link: "/treatments?goal=hormones",
    features: ["Testosterone Support", "Strength & Libido", "Lean Mass Retention"]
  },
  {
    title: "Longevity & Performance",
    description: "Optimized sleep, recovery, vitality, and body composition.",
    icon: Heart,
    color: "rose",
    link: "/treatments?goal=performance",
    features: ["Vitality Boosters", "Sleep & Recovery", "Anti-Aging Protocols"]
  }
];

export default function OutcomePathways() {
  return (
    <section id="programs" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-teal-600 font-bold uppercase tracking-widest text-sm">Specialized Programs</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Your Outcome-Driven Path to Health</h3>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Instead of searching for ingredients, find the solution tailored to your specific goals and medical needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathways.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col h-full bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-teal-500/20 hover:bg-white hover:shadow-2xl transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-${path.color}-500/10 text-${path.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                <path.icon className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-2">{path.title}</h4>
              <p className="text-slate-500 text-sm mb-6 flex-grow">{path.description}</p>

              <ul className="space-y-3 mb-8">
                {path.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Shield className="w-3 h-3 text-teal-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                to={path.link}
                className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:gap-3 transition-all"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
