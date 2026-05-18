export interface Treatment {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  category: "joint" | "weight" | "hormones" | "performance" | "aging";
  bestFor: string;
  commonGoals: string[];
  animationUrl?: string;
  clinicalDetails?: string;
  pricingInfo?: string;
}

export interface Condition {
  id: string;
  name: string;
  recommendedTreatments: string[];
}

export const TREATMENTS: Treatment[] = [
  {
    id: "prp",
    name: "PRP (Platelet-Rich Plasma)",
    description: "Accelerate healing using your body's own natural growth factors. Ideal for tendonitis and early arthritis.",
    category: "joint",
    bestFor: "Tendon injuries, ligament sprains, and early-stage osteoarthritis.",
    commonGoals: ["Heal without surgery", "Reduce chronic inflammation", "Return to sport faster"],
    benefits: ["Minimally invasive", "Uses patient's own blood", "Reduces inflammation", "Accelerates tissue repair"],
    clinicalDetails: "Platelet-Rich Plasma (PRP) therapy involves concentrating platelets from your own blood to release growth factors that stimulate tissue repair. Our protocol uses a high-concentration system to ensure maximum therapeutic benefit for tendonitis, ligament sprains, and early-stage osteoarthritis.",
    pricingInfo: "Typically administered as a 3-treatment series. Pricing varies based on the number of joints treated."
  },
  {
    id: "whartons-jelly",
    name: "Wharton's Jelly",
    description: "Advanced structural support for severe joint wear. Provides the cushioning needed for advanced healing.",
    category: "joint",
    bestFor: "Severe joint pain, cartilage wear, and structural joint issues.",
    commonGoals: ["Cushion damaged joints", "Provide structural scaffold", "Avoid joint replacement"],
    benefits: ["Rich in hyaluronic acid", "High concentration of cytokines", "Supports structural repair", "Advanced tissue support"],
    clinicalDetails: "Wharton's Jelly is a structural tissue product derived from the umbilical cord, containing a high density of growth factors, hyaluronic acid, and cytokines. It provides a biological scaffold that supports the body's natural ability to repair damaged cartilage.",
    pricingInfo: "Often used as a premium single-site treatment or as part of a comprehensive 3-treatment regenerative series."
  },
  {
    id: "glp1",
    name: "Medical Weight Loss (GLP-1)",
    description: "Reduce joint load and systemic inflammation with physician-guided GLP-1 therapy.",
    category: "weight",
    bestFor: "Patient with joint pain and elevated BMI, or those seeking metabolic optimization.",
    commonGoals: ["Decompress painful joints", "Reduce systemic inflammation", "Sustainable weight management"],
    benefits: ["Significant fat loss", "Reduced joint loading", "Improved metabolic health", "Anti-inflammatory effects"],
    clinicalDetails: "GLP-1 receptor agonists (like semaglutide and tirzepatide) achieve substantial weight loss, significantly reducing the mechanical stress on your joints. We integrate muscle preservation protocols to ensure orthopedic health.",
    pricingInfo: "Monthly subscription includes medication, monitoring, and nutritional guidance."
  },
  {
    id: "trt",
    name: "Hormone Optimization (TRT)",
    description: "Restore strength, energy, and surgical recovery through optimized testosterone levels.",
    category: "hormones",
    bestFor: "Men with low energy, muscle loss (sarcopenia), or slow recovery from injury/surgery.",
    commonGoals: ["Increase strength & lean mass", "Boost energy & recovery", "Improve bone density"],
    benefits: ["Increased lean mass", "Stronger bone density", "Enhanced surgical recovery", "Improved energy & mood"],
    clinicalDetails: "Testosterone optimization addresses muscle loss and frailty. By improving lean body mass and bone mineral density, TRT provides the anabolic foundation necessary for successful joint rehabilitation.",
    pricingInfo: "Customized protocols following comprehensive labs. Monthly monitoring and treatment plans."
  },
  {
    id: "peptides",
    name: "Performance Peptides",
    description: "Specific signaling molecules to target tissue repair, gut health, and sleep quality.",
    category: "performance",
    bestFor: "Anyone looking to accelerate recovery, optimize body composition, or improve sleep.",
    commonGoals: ["Faster injury recovery", "Better sleep quality", "Optimized body composition"],
    benefits: ["Targeted tissue signaling", "Enhanced recovery speed", "Optimizes cellular function", "Customized protocols"],
    clinicalDetails: "Peptide therapy utilizes specific sequences of amino acids (like BPC-157 or TB-500) to signal the body to accelerate healing or enhance muscle recovery.",
    pricingInfo: "Monthly protocols available based on specific goals."
  },
  {
    id: "laser",
    name: "Musculoskeletal Laser",
    description: "High-intensity light therapy for rapid pain relief and reduced tissue swelling.",
    category: "joint",
    bestFor: "Acute injuries, chronic pain flares, and post-procedural swelling.",
    commonGoals: ["Immediate pain relief", "Reduce swelling", "Non-invasive healing boost"],
    benefits: ["Non-invasive & painless", "Rapid pain reduction", "Accelerates tissue healing", "Reduces swelling"],
    clinicalDetails: "High-Intensity Laser Therapy (HILT) uses specific wavelengths of light to stimulate mitochondrial activity, increasing ATP production and reducing pain signaling.",
    pricingInfo: "Available as individual sessions or discounted multi-session packages."
  }
];

export const CONDITIONS: Condition[] = [
  {
    id: "knee-pain",
    name: "Knee Pain (Osteoarthritis, Meniscus)",
    recommendedTreatments: ["prp", "whartons-jelly", "exosomes", "laser"]
  },
  {
    id: "shoulder-pain",
    name: "Shoulder Pain (Rotator Cuff, Labrum)",
    recommendedTreatments: ["prp", "peptides", "non-op", "laser"]
  },
  {
    id: "back-pain",
    name: "Back Pain (Disc Issues, SI Joint)",
    recommendedTreatments: ["exosomes", "peptides", "non-op"]
  },
  {
    id: "sports-injury",
    name: "Acute Sports Injury (Tears, Strains)",
    recommendedTreatments: ["prp", "peptides", "laser"]
  }
];
