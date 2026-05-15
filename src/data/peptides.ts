export interface Peptide {
    name: string;
    category: string;
    description: string;
    supports: string[];
    howItWorks: string;
    importantNote?: string;
  }
  
  export interface PeptideCombination {
    name: string;
    category: string;
    whyCombine: string;
    supports?: string[];
    components: string[];
  }
  
  export const PEPTIDES: Peptide[] = [
    {
      name: "Tesamorelin",
      category: "Growth Hormone Support",
      description: "Tesamorelin is a peptide that signals your body to release more of its own natural growth hormone.",
      supports: ["Reduction of deep abdominal fat", "Lean muscle support", "Metabolic health", "Energy and recovery"],
      howItWorks: "It acts on the pituitary gland (a small gland at the base of the brain) to increase growth hormone in a more natural, pulsatile way."
    },
    {
      name: "Ipamorelin",
      category: "Growth Hormone Support",
      description: "Ipamorelin is a growth hormone–releasing peptide.",
      supports: ["Muscle recovery", "Sleep quality", "Fat metabolism", "General wellness and recovery"],
      howItWorks: "It stimulates growth hormone release through a different pathway than Tesamorelin. It is often described as “gentler” because it does not significantly raise stress hormones like cortisol."
    },
    {
      name: "BPC-157",
      category: "Tissue Repair & Recovery",
      description: "BPC-157 is a synthetic peptide derived from a protein found in the stomach.",
      supports: ["Tendon and ligament recovery", "Muscle healing", "Joint comfort", "Gut health support"],
      howItWorks: "It may help promote blood flow and tissue repair in injured areas."
    },
    {
      name: "TB-500",
      category: "Tissue Repair & Recovery",
      description: "TB-500 is a synthetic version of a naturally occurring protein involved in cell repair and movement.",
      supports: ["Soft tissue recovery", "Flexibility and mobility", "Reduced inflammation", "Athletic recovery"],
      howItWorks: "It helps cells move to areas of injury and may assist with tissue regeneration."
    },
    {
      name: "GHK-Cu",
      category: "Anti-Inflammatory & Skin / Longevity",
      description: "GHK-Cu is a naturally occurring copper-binding peptide found in human plasma.",
      supports: ["Skin health and collagen production", "Hair quality", "Tissue repair", "Anti-inflammatory support"],
      howItWorks: "It helps activate genes involved in repair and regeneration and supports collagen formation."
    },
    {
      name: "Epithalon",
      category: "Anti-Inflammatory & Skin / Longevity",
      description: "Epithalon is a synthetic peptide studied for potential effects on cellular aging.",
      supports: ["Cellular health", "Sleep regulation", "Longevity pathways"],
      howItWorks: "Most research is experimental and outside the United States."
    }
  ];
  
  export const PEPTIDE_COMBINATIONS: PeptideCombination[] = [
    {
      name: "Tesamorelin + Ipamorelin",
      category: "Growth Hormone Support",
      whyCombine: "They stimulate growth hormone in two complementary ways. The goal is to encourage your body’s natural growth hormone production rather than replacing it.",
      supports: ["Body composition support", "Muscle preservation", "Recovery optimization", "Metabolic support"],
      components: ["Tesamorelin", "Ipamorelin"]
    },
    {
      name: "BPC-157 + TB-500",
      category: "Tissue Repair & Recovery",
      whyCombine: "These two peptides are often paired to support tissue repair from multiple angles: BPC-157 for tissue protection and blood flow, and TB-500 for cellular migration and repair.",
      components: ["BPC-157", "TB-500"]
    },
    {
      name: "GHK-Cu + Epithalon",
      category: "Anti-Inflammatory & Skin / Longevity",
      whyCombine: "This combination blends tissue repair support (GHK-Cu) with cellular aging research (Epithalon).",
      supports: ["Skin rejuvenation", "Cellular repair", "Anti-aging support"],
      components: ["GHK-Cu", "Epithalon"]
    },
    {
      name: "BPC-157 + KPV + TB-500",
      category: "Advanced Combination Formulas",
      whyCombine: "A powerful blend where BPC-157 handles tissue repair, TB-500 supports cellular migration, and KPV adds potent anti-inflammatory effects.",
      supports: ["Injury recovery", "Reduced inflammation", "Joint and soft tissue healing"],
      components: ["BPC-157", "KPV", "TB-500"]
    },
    {
      name: "BPC-157 + GHK-Cu + KPV + TB-500",
      category: "Advanced Combination Formulas",
      whyCombine: "This is a broad “regenerative support” blend where each peptide plays a slightly different role in the repair process.",
      supports: ["Tendon/ligament healing", "Muscle repair", "Inflammation reduction", "Skin and connective tissue health"],
      components: ["BPC-157", "GHK-Cu", "KPV", "TB-500"]
    }
  ];
  