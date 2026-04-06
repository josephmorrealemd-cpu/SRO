import TreatmentExplainer from "../components/sections/TreatmentExplainer";
import ConditionSelector from "../components/sections/ConditionSelector";
import RecoveryTimeline from "../components/sections/RecoveryTimeline";
import { motion } from "motion/react";

export default function TreatmentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-12"
    >
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Our Treatments</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          We specialize in non-operative regenerative procedures designed to help you avoid surgery and return to your active lifestyle.
        </p>
      </div>
      <TreatmentExplainer />
      <RecoveryTimeline />
      <div className="bg-slate-50 py-24">
        <ConditionSelector />
      </div>
    </motion.div>
  );
}
