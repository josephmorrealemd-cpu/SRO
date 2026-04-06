import CostComparison from "../components/sections/CostComparison";
import { motion } from "motion/react";

export default function InvestmentPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-12 pb-24"
    >
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Your Investment in Health</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Compare the long-term value of regenerative therapy against traditional surgery and its hidden costs.
        </p>
      </div>
      <CostComparison />
    </motion.div>
  );
}
