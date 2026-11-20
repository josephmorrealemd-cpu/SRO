import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, X, Activity, ChevronRight, Sparkles } from "lucide-react";
import { BookingDialog } from "../ui/BookingDialog";

interface BodyPart {
  id: string;
  name: string;
  x: string;
  y: string;
  conditions: string[];
  treatments: string[];
  description: string;
}

const BODY_PARTS: BodyPart[] = [
  {
    id: "shoulder",
    name: "Shoulder",
    x: "35.9%",
    y: "24.2%",
    conditions: ["Rotator Cuff Tears", "Shoulder Impingement", "Labral Tears", "Arthritis"],
    treatments: ["PRP Therapy", "Exosome Therapy", "Musculoskeletal Laser"],
    description: "The shoulder is a complex ball-and-socket joint. We specialize in non-surgical repair of tendon and labral injuries."
  },
  {
    id: "elbow",
    name: "Elbow",
    x: "30.0%",
    y: "37.7%",
    conditions: ["Tennis Elbow", "Golfer's Elbow", "UCL Injuries"],
    treatments: ["PRP Injections", "Laser Therapy", "Regenerative Medicine"],
    description: "Repetitive strain often leads to chronic elbow pain. Our regenerative approach targets the root cause of tendonitis."
  },
  {
    id: "spine",
    name: "Spine",
    x: "49.5%",
    y: "33.4%",
    conditions: ["Herniated Discs", "Degenerative Disc Disease", "Facet Joint Pain"],
    treatments: ["Epidural PRP", "Exosome Therapy", "Non-Surgical Decompression"],
    description: "Back pain can be debilitating. We offer targeted regenerative injections to reduce inflammation and promote disc health."
  },
  {
    id: "hip",
    name: "Hip",
    x: "42.2%",
    y: "48.4%",
    conditions: ["Hip Arthritis", "Labral Tears", "Bursitis"],
    treatments: ["Wharton's Jelly", "Exosomes", "PRP Therapy"],
    description: "Hip pain often limits mobility. Our advanced cellular therapies can help delay or avoid total hip replacement."
  },
  {
    id: "knee",
    name: "Knee",
    x: "38.8%",
    y: "66.1%",
    conditions: ["Meniscus Tears", "ACL/MCL Strains", "Osteoarthritis"],
    treatments: ["Wharton's Jelly", "PRP Therapy", "Laser Therapy"],
    description: "The knee is our most treated joint. We provide comprehensive alternatives to knee replacement surgery."
  },
  {
    id: "ankle",
    name: "Ankle & Foot",
    x: "41.6%",
    y: "85.4%",
    conditions: ["Plantar Fasciitis", "Achilles Tendonitis", "Ankle Sprains"],
    treatments: ["PRP Therapy", "Laser Therapy", "Regenerative Injections"],
    description: "Foot and ankle injuries can keep you off your feet. We accelerate healing for chronic ligament and tendon issues."
  },
  {
    id: "wrist",
    name: "Wrist & Hand",
    x: "22.5%",
    y: "47.8%",
    conditions: ["Carpal Tunnel", "Thumb Arthritis", "Trigger Finger"],
    treatments: ["PRP Therapy", "Laser Therapy"],
    description: "Hand function is vital. We treat degenerative changes and nerve entrapment with minimally invasive regenerative options."
  }
];

export default function InteractiveBody() {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);

  return (
    <section id="interactive-body" className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Interactive Anatomy
          </h2>
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Where Does It Hurt?</h3>
          <p className="text-slate-600">
            Click on a joint to explore common conditions we treat and the innovative regenerative solutions available to help you recover without surgery.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          {/* Body Visualization */}
          <div className="relative w-full max-w-[450px] aspect-[1/2] bg-[#021433] rounded-[40px] shadow-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden group/body">
            {/* Holographic body (1:2 crop; joints mapped to hotspot percentages) */}
            <img
              src="/images/hologram-anatomy.webp"
              alt="Holographic illustration of the human body and skeleton"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-[1]"
            />

            {/* Soft edge blend into the navy card */}
            <div className="absolute inset-0 z-[2] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(2,20,51,0.55)_100%)]" />

            {/* Holographic Grid Overlay */}
            <div className="absolute inset-0 z-[3] bg-[linear-gradient(rgba(56,189,248,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.07)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
            
            {/* Scanning Line Animation */}
            <motion.div 
              animate={{ top: ["-10%", "110%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.7)] z-10 pointer-events-none"
            />

            {/* Pulsing Glow Background */}
            <motion.div 
              className="absolute w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] -z-10"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Hotspots */}
            {BODY_PARTS.map((part) => (
              <button
                key={part.id}
                onClick={() => setSelectedPart(part)}
                className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 flex items-center justify-center group z-20 ${
                  selectedPart?.id === part.id 
                    ? "scale-125" 
                    : "hover:scale-110"
                }`}
                style={{ left: part.x, top: part.y }}
              >
                {/* Outer Pulse */}
                <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                  selectedPart?.id === part.id ? "bg-teal-400" : "bg-teal-200 group-hover:bg-teal-400"
                }`} />
                
                {/* Main Circle */}
                <div className={`relative w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  selectedPart?.id === part.id 
                    ? "bg-teal-500 border-white shadow-lg shadow-teal-500/50" 
                    : "bg-white/80 backdrop-blur-sm border-teal-500 shadow-sm"
                }`}>
                  <div className={`w-2 h-2 rounded-full transition-colors ${
                    selectedPart?.id === part.id ? "bg-white" : "bg-teal-500 group-hover:bg-teal-600"
                  }`} />
                </div>
                
                {/* Label (Desktop) */}
                <span className={`absolute left-full ml-3 px-3 py-1.5 bg-white/90 backdrop-blur-md border border-slate-200 text-[11px] font-bold text-slate-700 rounded-xl shadow-xl transition-all duration-300 pointer-events-none whitespace-nowrap ${
                  selectedPart?.id === part.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                }`}>
                  {part.name}
                </span>
              </button>
            ))}
          </div>

          {/* Details Panel */}
          <div className="w-full lg:w-[500px] min-h-[450px]">
            <AnimatePresence mode="wait">
              {selectedPart ? (
                <motion.div
                  key={selectedPart.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/80 backdrop-blur-xl rounded-[32px] p-10 shadow-2xl border border-white/50 space-y-8 relative overflow-hidden"
                >
                  {/* Decorative Background Element */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl" />
                  
                  <button 
                    onClick={() => setSelectedPart(null)}
                    className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-all z-20"
                    title="Close Details"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="space-y-8 max-h-[70vh] lg:max-h-none overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <Activity className="w-3 h-3" />
                        Joint Focus
                      </div>
                      <h4 className="text-3xl font-bold text-slate-900">{selectedPart.name}</h4>
                      <p className="text-slate-600 leading-relaxed">
                        {selectedPart.description}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Info className="w-3 h-3" />
                          Common Conditions
                        </h5>
                        <ul className="space-y-2">
                          {selectedPart.conditions.map((c, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                              <div className="w-1 h-1 bg-teal-500 rounded-full" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Activity className="w-3 h-3" />
                          Treatments
                        </h5>
                        <ul className="space-y-2">
                          {selectedPart.treatments.map((t, i) => (
                            <li key={i} className="text-sm font-semibold text-teal-600 flex items-center gap-2">
                              <ChevronRight className="w-3 h-3" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <BookingDialog 
                        title={`Book ${selectedPart.name} Consultation`}
                        description={`Request a specialized consultation for your ${selectedPart.name.toLowerCase()} condition. Our experts will review your case and recommend the best regenerative treatment.`}
                        trigger={
                          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                            Book {selectedPart.name} Consultation
                          </button>
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-slate-300">
                    <Info className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-400 mb-2">Select a Joint</h4>
                  <p className="text-slate-400 text-sm max-w-[240px]">
                    Click on any of the hotspots on the body diagram to see specific treatment details.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
