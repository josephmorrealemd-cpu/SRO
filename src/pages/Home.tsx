import Hero from "../components/sections/Hero";
import WhySeeASurgeon from "../components/sections/WhySeeASurgeon";
import OutcomePathways from "../components/sections/OutcomePathways";
import ProcessSection from "../components/sections/ProcessSection";
import TrustSection from "../components/sections/TrustSection";
import Testimonials from "../components/sections/Testimonials";
import FAQ from "../components/sections/FAQ";
import TreatmentQuiz from "../components/sections/TreatmentQuiz";
import Contact from "../components/sections/Contact";
import { motion } from "motion/react";
const SHOW_TESTIMONIALS = true;

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <title>Non-Surgical Orthopedic Care | PRP & Orthobiologics | Westminster CO</title>
      <meta name="description" content="Non-surgical, physician-led orthopedic care in Westminster, CO. Explore options like PRP and orthobiologics for joint and tendon conditions at Summit Regenerative Orthopedics." />
      
      <Hero />
      <WhySeeASurgeon />
      <OutcomePathways />
      <ProcessSection />
      <TrustSection />
      <TreatmentQuiz />
      {SHOW_TESTIMONIALS && (
        <div className="bg-slate-50">
          <Testimonials />
        </div>
      )}
      <FAQ />
      <Contact />
    </motion.div>
  );
}
