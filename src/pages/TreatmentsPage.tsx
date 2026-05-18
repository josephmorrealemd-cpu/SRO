import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TreatmentExplainer from "../components/sections/TreatmentExplainer";
import ConditionSelector from "../components/sections/ConditionSelector";
import RecoveryTimeline from "../components/sections/RecoveryTimeline";
import PeptidesContent from "../components/sections/PeptidesContent";
import MetabolicSection from "../components/sections/MetabolicSection";
import AnabolicSection from "../components/sections/AnabolicSection";
import Contact from "../components/sections/Contact";
import { motion } from "motion/react";
import { TREATMENTS } from "@/types";

export default function TreatmentsPage() {
  const [searchParams] = useSearchParams();
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(TREATMENTS[0].id);

  useEffect(() => {
    const goal = searchParams.get('goal');
    if (goal) {
      setTimeout(() => {
        const targetId = goal === 'joint' ? 'treatments' 
                       : goal === 'metabolism' ? 'metabolic' 
                       : goal === 'hormones' ? 'anabolic' 
                       : goal === 'performance' ? 'peptides-detail' : null;
        
        if (targetId) {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [searchParams]);

  const handleSelectTreatment = (id: string, scroll = true) => {
    setSelectedTreatmentId(id);
    if (scroll) {
      setTimeout(() => {
        // IDs for dedicated sections
        if (id === "peptides") {
          document.getElementById('peptides-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        if (id === "glp1") {
          document.getElementById('metabolic')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        if (id === "trt") {
          document.getElementById('anabolic')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        const el = document.getElementById('treatments');
        if (el) {
          // Check if we are on mobile (less than 1024px for lg breakpoint)
          const isMobile = window.innerWidth < 1024;
          if (isMobile) {
            // On mobile, scroll to the detail content
            const detailEl = document.getElementById('treatment-detail');
            if (detailEl) {
              detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
              return;
            }
          }
          // On desktop/fallback, just scroll to section top
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  return (
    <div className="pt-12 min-h-screen">
      <title>Regenerative Orthopedic Treatments | PRP, Exosomes & Peptides | Westminster CO</title>
      <meta name="description" content="Explore advanced non-surgical treatments including PRP therapy, Wharton's Jelly, Exosomes, and Peptide therapy at Summit Regenerative Orthopedics in Westminster." />
      
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Our Programs</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          We specialize in physician-guided protocols designed to help you move better, recover faster, and optimize your biology.
        </p>
      </div>
      <TreatmentExplainer 
        selectedId={selectedTreatmentId} 
        onSelect={(id) => handleSelectTreatment(id, window.innerWidth < 1024)} 
      />
      <MetabolicSection />
      <AnabolicSection />
      <PeptidesContent />
      <RecoveryTimeline />
      <div className="bg-slate-50 py-24">
        <ConditionSelector onSelectTreatment={handleSelectTreatment} />
      </div>
      <Contact />
    </div>
  );
}
