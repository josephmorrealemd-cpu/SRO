import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, UserCog, Beaker, Medal, HeartHandshake, Microscope } from "lucide-react";

const reasons = [
  {
    title: "Physician-Guided Care",
    description: "Every protocol is overseen by experienced medical doctors, not just computer algorithms or sales teams.",
    icon: UserCog
  },
  {
    title: "Board-Certified Expertise",
    description: "Our foundation is in orthopedic surgery. We provide an elite level of diagnostic and procedural precision for non-operative cases.",
    icon: Medal
  },
  {
    title: "Evidence-Informed",
    description: "We utilize the latest peer-reviewed clinical data to inform our peptide and regenerative protocols.",
    icon: Microscope
  },
  {
    title: "Personalized Dosing",
    description: "No 'one-size-fits-all' treatments. Labs and clinical assessment drive every dosage decision.",
    icon: Beaker
  },
  {
    title: "Ongoing Monitoring",
    description: "Regular check-ins and lab follow-ups ensure your plan remains safe and effective as you progress.",
    icon: ShieldCheck
  },
  {
    title: "Telehealth Convenience",
    description: "Access world-class medical expertise from the comfort of your home with our integrated virtual clinic.",
    icon: HeartHandshake
  }
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-teal-600 font-bold uppercase tracking-widest text-sm">The Summit Difference</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Why Patients Choose Us Over National Clinics</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                In an era of internet peptide sellers and automated clinics, we maintain a commitment to legitimate medical credibility and individual patient outcomes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-600 font-bold text-xl">
                  "
                </div>
                <h4 className="text-xl font-bold text-slate-900 leading-tight">
                  I avoided a double knee replacement through their integrated approach.
                </h4>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                "They didn't just give me an injection and send me home. They optimized my metabolic health, balanced my hormones, and gave me a specific recovery protocol. The difference is night and day."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" alt="Patient" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Mark S.</div>
                  <div className="text-xs text-slate-500 font-medium">Verified Patient | Westminster, CO</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-200/60 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-teal-600 shadow-sm border border-slate-100">
                  <reason.icon className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 mb-2">{reason.title}</h5>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
