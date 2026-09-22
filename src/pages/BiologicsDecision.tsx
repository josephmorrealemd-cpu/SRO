import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  GitFork, 
  Layers, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Activity, 
  Flame, 
  HeartHandshake, 
  FileText, 
  Phone, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/ui/BookingDialog";
import { trackEvent } from "@/lib/analytics";

type ScenarioId = "oa_medicare" | "athletes" | "post_surgical" | "acute_subacute";

interface ScenarioData {
  id: ScenarioId;
  title: string;
  badge: string;
  patientProfile: string;
  primaryProblem: string;
  recommendedBiologic: string;
  secondaryOption: string;
  rationale: string;
  clinicalBreakdown: {
    scaffolding: string;
    signaling: string;
    downtime: string;
    surgeryAvoidance: string;
  };
  whyItWorks: string[];
}

const SCENARIOS: Record<ScenarioId, ScenarioData> = {
  oa_medicare: {
    id: "oa_medicare",
    title: "Osteoarthritis & Medicare / Older Active Adults",
    badge: "Most Common: Cartilage Wear & Joint Space Narrowing",
    patientProfile: "Ages 50+, experiencing progressive joint stiffness, bone-on-bone friction, difficulty with stairs or walking, and exploring non-surgical alternatives to total knee or hip replacement.",
    primaryProblem: "Cartilage chondrocyte death, loss of lubricating synovial hyaluronic acid, and loss of physical joint space scaffolding.",
    recommendedBiologic: "Wharton's Jelly + Exosomes Dual Therapy (Tier 1 Priority)",
    secondaryOption: "Wharton's Jelly Umbilical Allograft Alone",
    rationale: "PRP alone often fails in moderate-to-severe OA because platelets do not provide 3D extracellular matrix scaffolding. Wharton's Jelly delivers high-molecular-weight hyaluronic acid and structural matrix to physically cushion the joint, while Exosomes supply nanoscale anti-inflammatory signals to halt cartilage breakdown.",
    clinicalBreakdown: {
      scaffolding: "High (3D extracellular matrix + structural collagen)",
      signaling: "Ultra-High (exosome microRNA + cytokines)",
      downtime: "None (walk out immediately, resumption of daily life)",
      surgeryAvoidance: "Primary clinical objective: delay or completely avoid arthroplasty",
    },
    whyItWorks: [
      "Natural high-molecular-weight hyaluronic acid restores synovial joint cushioning",
      "Supplies structural scaffolding that autologous PRP cannot provide",
      "Exosomes block catabolic enzymes (MMP-13, IL-1beta) that destroy cartilage",
      "Administered via precise high-resolution musculoskeletal ultrasound"
    ]
  },
  athletes: {
    id: "athletes",
    title: "Athletes, CrossFitters & High Performers",
    badge: "High-Demand: Rapid Recovery & Zero Surgical Downtime",
    patientProfile: "Competitive athletes, runners, weightlifters, and active Colorado outdoor enthusiasts suffering from rotator cuff strains, meniscus tears, patellar tendinopathy, or Achilles pain.",
    primaryProblem: "Soft tissue micro-tears and repetitive mechanical stress. Surgery causes irreversible joint biomechanics changes and extensive scar tissue.",
    recommendedBiologic: "Exosome Cellular Signaling + High-Intensity MSK Laser",
    secondaryOption: "High-Concentration PRP + MSK Laser (for minor acute strains)",
    rationale: "Surgery cuts through healthy tissue and requires 6-12 months of rehab. Exosomes deliver targeted microRNA directly to tenocytes and chondrocytes, accelerating cellular repair without fibrous scarring. Combined with high-power MSK Laser, ATP synthesis is increased for rapid return to sport.",
    clinicalBreakdown: {
      scaffolding: "Targeted to soft tissue remodeling",
      signaling: "Maximum cellular reprogramming & tenocyte activation",
      downtime: "24–48 hours light rest; resume modified training immediately",
      surgeryAvoidance: "Preserves native joint anatomy and prevents postoperative stiffness",
    },
    whyItWorks: [
      "No general anesthesia, crutches, or lengthy surgical recovery time",
      "Direct cellular instruction: directs native cells to deposit organized Type I collagen",
      "Deep-tissue class IV MSK laser accelerates tissue microcirculation and lymphatic drainage",
      "Safe for active competitors seeking to maintain their competitive edge"
    ]
  },
  post_surgical: {
    id: "post_surgical",
    title: "Post-Surgical & Failed Surgery Cases",
    badge: "Complex: Lingering Pain After Previous Procedures",
    patientProfile: "Patients who underwent arthroscopic meniscus trimming, partial rotator cuff repair, or ACL reconstruction, but continue to experience persistent pain, stiffness, or early onset arthritis.",
    primaryProblem: "Surgical resection of meniscus tissue creates localized stress concentrations; post-surgical joint inflammation accelerates secondary osteoarthritis.",
    recommendedBiologic: "Wharton's Jelly Allograft + Exosome Signaling",
    secondaryOption: "Exosome Regenerative Infusion with MSK Laser",
    rationale: "When meniscus or labrum is shaved or trimmed, the joint loses shock absorption. Wharton's Jelly replenishes structural extracellular matrix cushioning in the depleted compartment, while Exosomes resolve the chronic post-operative inflammatory state.",
    clinicalBreakdown: {
      scaffolding: "High (cushions surgically thinned joint compartments)",
      signaling: "Suppresses chronic postoperative neuro-inflammation",
      downtime: "None (zero surgical trauma)",
      surgeryAvoidance: "Prevents revision surgery or early progression to joint replacement",
    },
    whyItWorks: [
      "Compensates for lost meniscus or labral cushion with dense extracellular matrix",
      "Quenches chronic synovitis and surgical scar hypersensitivity",
      "Restores natural joint kinematics without opening the joint capsule",
      "Evaluated by a board-certified surgeon who understands previous operative reports"
    ]
  },
  acute_subacute: {
    id: "acute_subacute",
    title: "Acute Strains & Early-Stage Injuries (<3 Months)",
    badge: "Early Intervention: Preserving Tissue Before Chronic Wear",
    patientProfile: "Recent ankle sprain, acute mild rotator cuff strain, or initial knee hyperextension that has not responded to 3-6 weeks of rest, ice, and physical therapy.",
    primaryProblem: "Early tendon or ligament fiber disruption without long-standing cartilage degeneration or bone-on-bone friction.",
    recommendedBiologic: "High-Concentration PRP + MSK Laser Protocol",
    secondaryOption: "Exosome Infusion (if high athletic demand or slow recovery)",
    rationale: "Because the joint space is anatomically intact and the injury is acute, your body's own platelets can provide adequate growth factors. We concentrate your autologous blood 5-7x to trigger natural vascularization and tissue knitting.",
    clinicalBreakdown: {
      scaffolding: "Fibrin matrix from concentrated autologous plasma",
      signaling: "High autologous PDGF, TGF-beta, and VEGF",
      downtime: "24–48 hours mild soreness, rapid return to activity",
      surgeryAvoidance: "Heals micro-tears before they progress to full-thickness surgical tears",
    },
    whyItWorks: [
      "100% autologous biological treatment prepared bedside in our Westminster clinic",
      "Stimulates neovascularization (new blood supply) to slow-healing tendons",
      "Cost-effective first-line biologic for acute soft-tissue injuries",
      "Can be stepped up to Wharton's Jelly or Exosomes if structural wear is detected"
    ]
  }
};

export default function BiologicsDecision() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("oa_medicare");

  useEffect(() => {
    trackEvent("page_view", "/biologics-decision");
  }, []);

  const handleSelectScenario = (id: ScenarioId) => {
    setSelectedScenario(id);
    trackEvent("decision_tool_interaction", "/biologics-decision", id);
  };

  const scenario = SCENARIOS[selectedScenario];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <title>Biologics Decision Tool | Wharton’s Jelly vs Exosomes vs PRP</title>
      <meta 
        name="description" 
        content="Interactive clinical decision tool comparing Wharton's Jelly, Exosomes, and PRP. Designed by Board-Certified Orthopedic Surgeon Dr. Morreale to help you choose the right non-surgical joint treatment." 
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <GitFork className="w-3.5 h-3.5 text-teal-600" />
            Interactive Clinical Guidance
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Biologics Decision Tool
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Compare <strong>Wharton’s Jelly</strong>, <strong>Exosomes</strong>, and <strong>PRP</strong>. Understand why advanced biologics are prioritized for structural cartilage loss, athletic recovery, and avoiding surgery.
          </p>
        </div>

        {/* Clinical Scenario Selector Tabs */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Step 1: Select Your Clinical Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: "oa_medicare", title: "Osteoarthritis & Medicare", icon: ShieldCheck, tag: "Bone-on-Bone & OA" },
              { id: "athletes", title: "Athletes & High Performers", icon: Flame, tag: "Zero Downtime" },
              { id: "post_surgical", title: "Post-Surgical & Failed Care", icon: HeartHandshake, tag: "Lingering Pain" },
              { id: "acute_subacute", title: "Acute Injury (< 3 Months)", icon: Activity, tag: "Early Sprains" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedScenario === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectScenario(tab.id as ScenarioId)}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-teal-600 shadow-lg shadow-teal-900/5 ring-2 ring-teal-600"
                      : "bg-white/80 border-slate-200 hover:border-teal-300 hover:bg-white text-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-500"
                      }`}>
                        {tab.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {tab.title}
                    </h3>
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex items-center text-xs font-semibold text-teal-700">
                      Active Pathway <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Scenario Recommendation Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedScenario}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
          >
            {/* Top Priority Header */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  {scenario.badge}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {scenario.title}
                </h2>
                <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                  {scenario.patientProfile}
                </p>
              </div>

              <div className="shrink-0">
                <BookingDialog
                  title={`Orthopedic Evaluation: ${scenario.title}`}
                  description={`Consultation with Dr. Morreale focusing on: ${scenario.recommendedBiologic}`}
                  trigger={
                    <button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-teal-600/30 active:scale-98">
                      Book Consult for This Protocol
                    </button>
                  }
                />
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Primary Matched Protocol Box */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                      Default Clinical Priority
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {scenario.recommendedBiologic}
                    </h3>
                  </div>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {scenario.rationale}
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Key Clinical Mechanisms:</h4>
                    <div className="space-y-2">
                      {scenario.whyItWorks.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scorecard / Breakdown */}
                <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-teal-950 text-base border-b border-teal-200 pb-2">
                      Clinical Parameters
                    </h4>
                    
                    <div className="space-y-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Structural Scaffolding</span>
                        <span className="font-bold text-slate-900">{scenario.clinicalBreakdown.scaffolding}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Cellular Signaling Power</span>
                        <span className="font-bold text-slate-900">{scenario.clinicalBreakdown.signaling}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Post-Procedure Downtime</span>
                        <span className="font-bold text-slate-900">{scenario.clinicalBreakdown.downtime}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Surgical Goal</span>
                        <span className="font-bold text-teal-800">{scenario.clinicalBreakdown.surgeryAvoidance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-teal-200">
                    <div className="text-xs text-slate-600 mb-2">
                      <strong className="text-slate-900">Alternative Consideration:</strong> {scenario.secondaryOption}
                    </div>
                    <Link
                      to="/pain-quiz"
                      className="w-full inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs"
                    >
                      Verify Compatibility in Quiz <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Head-to-Head Comparison Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Head-to-Head Clinical Matrix</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Wharton’s Jelly vs. Exosomes vs. PRP
            </h2>
            <p className="text-sm text-slate-600">
              Scientific differences between biological therapies. Why we prioritize Wharton’s Jelly + Exosomes over standalone PRP for complex joints.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-3 px-4 font-bold text-slate-900 bg-slate-50 rounded-tl-xl">Feature</th>
                  <th className="py-3 px-4 font-bold text-teal-900 bg-teal-50/70 border-x border-teal-200">
                    Wharton’s Jelly Allograft
                    <span className="block text-[10px] text-teal-600 font-normal">Primary Structural Choice</span>
                  </th>
                  <th className="py-3 px-4 font-bold text-teal-950 bg-teal-50/40 border-r border-teal-200">
                    Exosome Signaling
                    <span className="block text-[10px] text-teal-600 font-normal">Cellular Instruction</span>
                  </th>
                  <th className="py-3 px-4 font-bold text-slate-700 bg-slate-50 rounded-tr-xl">
                    Autologous PRP
                    <span className="block text-[10px] text-slate-500 font-normal">Traditional Standard</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Biological Source</td>
                  <td className="py-3.5 px-4 text-teal-900 bg-teal-50/30 font-medium">Umbilical cord extracellular matrix</td>
                  <td className="py-3.5 px-4 text-slate-800 bg-teal-50/10">30–150nm cellular nanovesicles</td>
                  <td className="py-3.5 px-4 text-slate-600">Patient's own blood platelets</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Physical Joint Cushioning</td>
                  <td className="py-3.5 px-4 text-teal-900 bg-teal-50/30 font-bold">
                    <span className="inline-flex items-center text-teal-700"><Check className="w-4 h-4 mr-1" /> High (Hyaluronic Acid)</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 bg-teal-50/10">None (Pure signaling)</td>
                  <td className="py-3.5 px-4 text-slate-500">None (Liquid plasma)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">3D Extracellular Matrix Scaffold</td>
                  <td className="py-3.5 px-4 text-teal-900 bg-teal-50/30 font-bold">
                    <span className="inline-flex items-center text-teal-700"><Check className="w-4 h-4 mr-1" /> Yes (Collagens & Proteoglycans)</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 bg-teal-50/10">No (Instructional cargo)</td>
                  <td className="py-3.5 px-4 text-slate-500">Minimal fibrin mesh</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Cellular Messenger Payload</td>
                  <td className="py-3.5 px-4 text-teal-900 bg-teal-50/30">Growth factors & cytokines</td>
                  <td className="py-3.5 px-4 text-slate-800 bg-teal-50/10 font-bold">
                    <span className="inline-flex items-center text-teal-700"><Check className="w-4 h-4 mr-1" /> Billions of microRNAs & peptides</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">Limited by patient's age & health</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Severe Bone-on-Bone OA</td>
                  <td className="py-3.5 px-4 text-teal-900 bg-teal-50/30 font-bold text-teal-700">Excellent (Delay Surgery)</td>
                  <td className="py-3.5 px-4 text-slate-800 bg-teal-50/10 font-medium">Synergistic with WJ</td>
                  <td className="py-3.5 px-4 text-slate-500">Low success in Grade 3-4 OA</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Athletic Tendon & Ligament Tears</td>
                  <td className="py-3.5 px-4 text-teal-900 bg-teal-50/30">High (for chronic tears)</td>
                  <td className="py-3.5 px-4 text-slate-800 bg-teal-50/10 font-bold text-teal-700">Superior (Fast Remodeling)</td>
                  <td className="py-3.5 px-4 text-slate-600">Good for mild sprains</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Procedure Time & Guidance</td>
                  <td className="py-3.5 px-4 text-teal-900 bg-teal-50/30">30 min under Dynamic Ultrasound</td>
                  <td className="py-3.5 px-4 text-slate-800 bg-teal-50/10">30 min under Dynamic Ultrasound</td>
                  <td className="py-3.5 px-4 text-slate-600">60 min (blood draw + centrifuge)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pathways & Funnel CTAs */}
        <div className="grid md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Pain Quiz */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Pain Self-Assessment Quiz</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Answer 7 clinical questions regarding your injury duration, pain levels, and prior treatments to receive an instant biologics recommendation.
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/pain-quiz"
                className="w-full inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-teal-600/10"
              >
                Take Self-Assessment Quiz <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Free Guide */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Free Biologics 101 Guide</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download the free educational PDF guide authored by Dr. Morreale: “Biologic Regeneration 101: Wharton’s Jelly, Exosomes, and PRP.”
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/guide/regenerative-medicine-101"
                className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all"
              >
                Download Free Guide <FileText className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Direct Consultation */}
          <div className="bg-teal-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-800 text-teal-300 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Board-Certified Consult</h3>
              <p className="text-xs text-teal-100/80 leading-relaxed">
                Schedule an in-person evaluation with Dr. Joseph Morreale at our Westminster clinic. Includes imaging review and ultrasound exam.
              </p>
            </div>
            <div className="mt-6">
              <BookingDialog
                title="Book Biologics Consultation"
                description="Meet with Dr. Morreale to determine whether Wharton's Jelly, Exosomes, or PRP is the right choice for your joint."
                trigger={
                  <button className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all">
                    Schedule Consultation
                  </button>
                }
              />
            </div>
          </div>
        </div>

        {/* Office Contact Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-teal-600" />
            <span>Summit Regenerative Orthopedics | 8753 Yates Dr, Suite 110, Westminster, CO 80031</span>
          </div>
          <a
            href="tel:7207769165"
            className="font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors inline-flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" /> Questions? Call 720-776-9165
          </a>
        </div>
      </div>
    </div>
  );
}
