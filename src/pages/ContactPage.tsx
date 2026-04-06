import Contact from "../components/sections/Contact";
import { motion } from "motion/react";

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="pt-12 pb-24"
    >
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Contact Our Team</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Have questions or ready to book your consultation? We're here to help you on your journey to recovery.
        </p>
      </div>
      <Contact />
    </motion.div>
  );
}
