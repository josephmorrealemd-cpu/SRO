import InteractiveBody from "../components/sections/InteractiveBody";
import { motion } from "motion/react";

export default function AnatomyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="pt-12 pb-24"
    >
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Interactive Anatomy</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Explore the human body and see how our regenerative treatments can help heal specific areas of concern.
        </p>
      </div>
      <InteractiveBody />
    </motion.div>
  );
}
