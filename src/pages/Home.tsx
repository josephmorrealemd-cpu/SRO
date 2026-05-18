import Hero from "../components/sections/Hero";
import OutcomePathways from "../components/sections/OutcomePathways";
import ProcessSection from "../components/sections/ProcessSection";
import TrustSection from "../components/sections/TrustSection";
import Testimonials from "../components/sections/Testimonials";
import FAQ from "../components/sections/FAQ";
import TreatmentQuiz from "../components/sections/TreatmentQuiz";
import Contact from "../components/sections/Contact";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Avoid Surgery for Joint Pain | PRP & Regenerative Orthopedics Westminster CO</title>
        <meta name="description" content="Considering PRP or regenerative therapy for joint pain? Get a personalized non-surgical treatment plan at Summit Regenerative Orthopedics in Westminster, CO. Avoid surgery and recover faster." />
      </Helmet>
      <Hero />
      <OutcomePathways />
      <ProcessSection />
      <TrustSection />
      <TreatmentQuiz />
      <div className="bg-slate-50">
        <Testimonials />
      </div>
      <FAQ />
      <Contact />
    </motion.div>
  );
}
