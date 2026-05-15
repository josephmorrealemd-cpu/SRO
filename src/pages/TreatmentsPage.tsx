import { useState } from "react";
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
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(TREATMENTS[0].id);

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
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Our Treatments</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          We specialize in non-operative regenerative procedures designed to help you avoid surgery and return to your active lifestyle.
        </p>
      </div>
      <TreatmentExplainer 
        selectedId={selectedTreatmentId} 
        onSelect={(id) => handleSelectTreatment(id, window.innerWidth < 1024)} 
      />
      <PeptidesContent />
      <MetabolicSection />
      <AnabolicSection />
      <RecoveryTimeline />
      <div className="bg-slate-50 py-24">
        <ConditionSelector onSelectTreatment={handleSelectTreatment} />
      </div>
      <Contact />
    </div>
  );
}
