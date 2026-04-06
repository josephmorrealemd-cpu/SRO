import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Testimonials from "../components/sections/Testimonials";
import FAQ from "../components/sections/FAQ";
import TreatmentQuiz from "../components/sections/TreatmentQuiz";
import { motion } from "motion/react";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Features />
      <TreatmentQuiz />
      <div className="bg-slate-50">
        <Testimonials />
      </div>
      <FAQ />
    </motion.div>
  );
}
