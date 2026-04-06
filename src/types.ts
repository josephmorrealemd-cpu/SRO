export interface Treatment {
  id: string;
  name: string;
  description: string;
  benefits: string[];
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
    name: "Platelet-Rich Plasma (PRP)",
    description: "PRP therapy uses a concentration of your own platelets to accelerate healing. Typically administered as a 3-treatment series for optimal regenerative results.",
    benefits: ["Minimally invasive", "Uses patient's own blood", "Reduces inflammation", "Accelerates tissue repair"],
    clinicalDetails: "Platelet-Rich Plasma (PRP) therapy involves concentrating platelets from your own blood to release growth factors that stimulate tissue repair. Our protocol uses a high-concentration system to ensure maximum therapeutic benefit for tendonitis, ligament sprains, and early-stage osteoarthritis.",
    pricingInfo: "Typically administered as a 3-treatment series. Pricing varies based on the number of joints treated. Financing options available."
  },
  {
    id: "whartons-jelly",
    name: "Wharton's Jelly",
    description: "Derived from umbilical cord tissue, this treatment is rich in structural proteins. Often combined with Exosomes in a 3-treatment series to support tissue repair.",
    benefits: ["Rich in hyaluronic acid", "High concentration of cytokines", "Supports structural repair", "Non-invasive harvesting"],
    clinicalDetails: "Wharton's Jelly is a structural tissue product derived from the umbilical cord, containing a high density of growth factors, hyaluronic acid, and cytokines. It provides a biological scaffold that supports the body's natural ability to repair damaged cartilage and connective tissue.",
    pricingInfo: "Often used as a premium single-site treatment or as part of a comprehensive 3-treatment regenerative series. Contact us for a personalized quote."
  },
  {
    id: "exosomes",
    name: "Exosomal Products",
    description: "Exosomes are extracellular vesicles that carry signaling molecules to facilitate cellular communication and stimulate natural healing processes.",
    benefits: ["Potent signaling molecules", "Targeted cellular repair", "Anti-inflammatory properties", "Advanced regenerative technology"],
    clinicalDetails: "Exosomes are extracellular vesicles that act as the 'messengers' of the regenerative process. Unlike stem cells, they are acellular and carry specific signaling proteins and mRNA to 'reprogram' damaged cells toward a healing state, effectively reducing chronic inflammation and promoting rapid tissue recovery.",
    pricingInfo: "Pricing is determined by the concentration and volume required for your specific condition. Can be added to PRP or Wharton's Jelly protocols."
  },
  {
    id: "peptides",
    name: "Peptide Therapy",
    description: "Peptides are short chains of amino acids that act as signaling molecules to optimize physiological functions and enhance tissue recovery.",
    benefits: ["Enhanced recovery speed", "Supports tissue integrity", "Optimizes cellular function", "Customized protocols"],
    clinicalDetails: "Peptide therapy utilizes specific sequences of amino acids (like BPC-157 or TB-500) to signal the body to accelerate healing, improve gut health, or enhance muscle recovery. These are administered via highly controlled protocols to optimize your body's natural repair mechanisms.",
    pricingInfo: "Monthly protocols available. Pricing depends on the specific peptide combination and duration of therapy."
  },
  {
    id: "non-op",
    name: "Non-Operative Orthopedics",
    description: "Comprehensive non-surgical management of musculoskeletal conditions using advanced diagnostics and conservative treatments.",
    benefits: ["Avoids surgical risks", "Faster return to activity", "Personalized care plans", "Evidence-based approach"],
    clinicalDetails: "Our non-operative approach combines advanced diagnostic imaging with conservative management strategies. This includes bracing, specialized physical therapy coordination, and image-guided injections to manage pain and restore function without the risks of surgery.",
    pricingInfo: "Consultation fees apply. Many diagnostic services may be covered by insurance. Procedural costs vary."
  },
  {
    id: "second-opinion",
    name: "Surgical Second Opinions",
    description: "Expert evaluation of your surgical recommendations to explore regenerative and non-operative alternatives.",
    benefits: ["Avoid unnecessary surgery", "Explore all options", "Expert clinical review", "Peace of mind"],
    clinicalDetails: "A surgical second opinion provides a comprehensive review of your MRI/CT scans and clinical history. We evaluate whether you are a candidate for regenerative alternatives, potentially saving you from the risks and lengthy recovery of invasive surgery.",
    pricingInfo: "Flat-fee consultation for a comprehensive review of your imaging and surgical recommendations."
  },
  {
    id: "laser",
    name: "Musculoskeletal Laser",
    description: "High-intensity laser therapy used to stimulate cellular repair, reduce inflammation, and provide rapid pain relief for musculoskeletal conditions.",
    benefits: ["Non-invasive & painless", "Rapid pain reduction", "Accelerates tissue healing", "Reduces swelling"],
    clinicalDetails: "High-Intensity Laser Therapy (HILT) uses specific wavelengths of light to penetrate deep into tissues. This stimulates mitochondrial activity (photobiomodulation), which increases ATP production, reduces pain signaling, and accelerates the resolution of inflammation in acute and chronic injuries.",
    pricingInfo: "Available as individual sessions or discounted multi-session packages. Often used in conjunction with other regenerative therapies."
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
