import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Calendar, 
  ArrowRight, 
  Phone, 
  Activity, 
  Stethoscope, 
  Layers, 
  Zap,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookingDialog } from "@/components/ui/BookingDialog";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { trackEvent, getSessionId } from "@/lib/analytics";
import { triggerNurtureSequence } from "@/lib/emailClient";
import { toast } from "sonner";

interface QuizState {
  joint: string;
  duration: string;
  painLevel: string;
  limitations: string[];
  priorTreatments: string[];
  surgeryStatus: string;
  goals: string;
  name: string;
  email: string;
  phone: string;
}

const INITIAL_STATE: QuizState = {
  joint: "",
  duration: "",
  painLevel: "",
  limitations: [],
  priorTreatments: [],
  surgeryStatus: "",
  goals: "",
  name: "",
  email: "",
  phone: "",
};

export default function PainQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    treatment: string;
    badge: string;
    rationale: string;
    keyPoints: string[];
    evidenceNote: string;
  } | null>(null);

  const totalQuestions = 7;

  const toggleArrayItem = (field: "limitations" | "priorTreatments", item: string) => {
    setAnswers((prev) => {
      const current = prev[field];
      const updated = current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item];
      return { ...prev, [field]: updated };
    });
  };

  const calculateRecommendation = () => {
    const isChronic = answers.duration === "6 to 12 months" || answers.duration === "Over 1 year (Chronic / Degenerative)";
    const isSevere = answers.painLevel.includes("Bone-on-bone") || answers.painLevel.includes("Severe");
    const failedPrior = answers.priorTreatments.some(t => t.includes("Cortisone") || t.includes("Hyaluronic") || t.includes("Surgery"));
    const surgeryCandidate = answers.surgeryStatus.includes("replacement") || answers.surgeryStatus.includes("only option");
    const isAthlete = answers.goals.includes("athletic") || answers.limitations.includes("Unable to run, lift weights, or play sports");
    const isAcute = answers.duration === "Under 3 months (Acute)";

    // Biologics-first prioritization:
    // 1. Dual Wharton's Jelly + Exosomes: Advanced OA, bone-on-bone, told surgery is only option, or chronic degenerative joint
    if (surgeryCandidate || (isSevere && (isChronic || failedPrior))) {
      return {
        title: "Advanced Joint Restoration Candidate",
        treatment: "Wharton's Jelly + Exosomes Dual Biologics Protocol",
        badge: "Tier 1: Maximum Regeneration & Cushioning",
        rationale: "Given your long-standing symptoms, structural cartilage wear, and prior failed treatments, your joint requires both structural scaffolding and high-potency cellular signaling. Wharton's Jelly provides the vital hyaluronic acid and extracellular matrix cushion, while Exosomes supply nanoscale signals to calm inflammatory degradation and awaken native repair cells.",
        keyPoints: [
          "Delivers 3D structural extracellular matrix cushion for bone-on-bone friction",
          "Rich in high-molecular-weight hyaluronic acid, cytokines, and native growth factors",
          "Nanoscale exosome signaling stops progressive catabolic cartilage loss",
          "Designed specifically for patients seeking to delay or avoid total joint replacement"
        ],
        evidenceNote: "Our board-certified orthopedic team uses precise dynamic musculoskeletal ultrasound to deposit the biologic matrix directly into the damaged articular compartment."
      };
    }

    // 2. Wharton's Jelly Primary: Moderate-to-severe OA with structural joint space narrowing
    if (isChronic && (isSevere || failedPrior || answers.joint === "Knee" || answers.joint === "Hip")) {
      return {
        title: "Structural Cartilage Restoration Candidate",
        treatment: "Wharton's Jelly Umbilical Allograft Protocol",
        badge: "Structural Biologic Cushioning",
        rationale: "Platelet injections alone often fail in degenerative joints because they lack physical extracellular matrix scaffolding. Wharton's Jelly delivers natural high-molecular-weight hyaluronic acid, structural collagens, and cellular cytokines to physically cushion your joint space and protect native chondrocytes.",
        keyPoints: [
          "Restores joint lubrication and shock-absorbing biological scaffold",
          "Replaces degraded synovial fluid with concentrated natural matrix",
          "Avoids the cartilage-degrading side effects of repetitive cortisone steroids",
          "One-session in-office procedure under dynamic ultrasound guidance"
        ],
        evidenceNote: "Ethically sourced from full-term, pre-screened c-section births under rigorous FDA Section 361 cGMP safety standards."
      };
    }

    // 3. Exosomes + MSK Laser: Active, athletes, soft tissue/tendon/ligament, wanting fast recovery
    if (isAthlete || answers.joint === "Shoulder" || answers.joint === "Ankle / Foot" || answers.joint === "Elbow / Wrist") {
      return {
        title: "Cellular Remodeling & Athletic Recovery Candidate",
        treatment: "Exosome Cellular Signaling + High-Intensity MSK Laser",
        badge: "Rapid Remodeling Without Surgical Downtime",
        rationale: "Your presentation indicates active tissue stress, tendon/ligament pathology, or athletic overuse. Surgery creates restrictive fibrous scar tissue. Exosome signaling delivers targeted microRNA and regulatory peptides that direct tenocytes and fibroblasts to synthesize organized collagen fibers rapidly.",
        keyPoints: [
          "Zero surgical downtime: resume training and functional loading within 48–72 hours",
          "Nanovesicles penetrate dense tendon and connective tissues directly",
          "Synergized with class-IV high-intensity musculoskeletal photobiomodulation",
          "Preserves natural joint biomechanics without surgical cutting"
        ],
        evidenceNote: "Preferred by competitive athletes, CrossFit competitors, and active adults who cannot afford months on crutches."
      };
    }

    // 4. Autologous PRP + MSK Laser: Mild or acute subacute sprains
    if (isAcute && !isSevere && !failedPrior) {
      return {
        title: "Autologous Biologic Candidate",
        treatment: "High-Concentration PRP + Musculoskeletal Laser Protocol",
        badge: "Targeted Autologous Growth Factor Therapy",
        rationale: "Because your injury is relatively recent (< 3 months) and you have not yet experienced progressive structural cartilage loss, your own concentrated platelets can effectively kickstart tissue repair. We concentrate your autologous growth factors 5-7x over baseline.",
        keyPoints: [
          "100% autologous biological treatment prepared from your own blood in-office",
          "High concentrations of PDGF, TGF-beta, and VEGF for targeted healing",
          "Guided with precision high-resolution musculoskeletal ultrasound",
          "Combined with MSK Laser therapy to maximize mitochondrial ATP production"
        ],
        evidenceNote: "If symptoms persist beyond 12 weeks or imaging reveals cartilage thinning, escalation to Wharton's Jelly or Exosomes is indicated."
      };
    }

    // Default: Wharton's Jelly + Exosomes
    return {
      title: "Comprehensive Biologics Protocol Candidate",
      treatment: "Wharton's Jelly + Exosomes Targeted Therapy",
      badge: "Non-Surgical Orthopedic Restoration",
      rationale: "Based on your clinical profile, a biologics-first approach using Wharton's Jelly structural matrix and Exosome cellular signaling provides the highest likelihood of restoring joint function and avoiding invasive orthopedic surgery.",
      keyPoints: [
        "Addresses both physical joint space loss and chronic cellular inflammation",
        "Administered under direct ultrasound visualization by Dr. Morreale",
        "Comprehensive rehabilitation plan tailored to your functional goals",
        "Avoids steroid degradation and surgery risks"
      ],
      evidenceNote: "Comprehensive clinical consultation with Dr. Joseph Morreale includes diagnostic ultrasound review."
    };
  };

  const handleFinishQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const rec = calculateRecommendation();
    setResult(rec);

    try {
      const payload = {
        joint: answers.joint,
        duration: answers.duration,
        painLevel: answers.painLevel,
        limitations: answers.limitations,
        priorTreatments: answers.priorTreatments,
        surgeryStatus: answers.surgeryStatus,
        goals: answers.goals,
        recommendation: rec.title,
        treatment: rec.treatment,
        rationale: rec.rationale,
        name: answers.name || "Anonymous Patient",
        sessionId: getSessionId(),
        createdAt: serverTimestamp(),
      };

      if (answers.email) {
        (payload as any).email = answers.email;
      }
      if (answers.phone) {
        (payload as any).phone = answers.phone;
      }

      await addDoc(collection(db, "pain_quiz_results"), payload);

      // Track analytics
      trackEvent(
        "pain_quiz_completed",
        "/pain-quiz",
        rec.treatment,
        JSON.stringify({ joint: answers.joint, duration: answers.duration })
      );

      // Trigger email nurture sequence if email was provided
      if (answers.email) {
        await triggerNurtureSequence({
          email: answers.email,
          name: answers.name || "Patient",
          source: "quiz",
          jointConcern: answers.joint,
          templateId: "welcome_expectations",
        });
      }

      toast.success("Assessment Complete!", {
        description: "Your personalized biologics protocol has been generated.",
      });

      setStep(8); // Results view
    } catch (error) {
      console.error("Error saving quiz result:", error);
      handleFirestoreError(error, OperationType.WRITE, "pain_quiz_results");
      setStep(8);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <title>Pain Self-Assessment Quiz | Summit Regenerative Orthopedics</title>
      <meta 
        name="description" 
        content="Take our 2-minute clinical pain self-assessment. Discover whether Wharton's Jelly, Exosomes, or PRP is the right non-surgical biological treatment for your joint pain." 
      />

      <div className="max-w-3xl mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            Surgeon-Designed Clinical Assessment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Joint Pain & Biologics Assessment
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Evaluate your joint wear, prior treatments, and discover personalized regenerative protocols to avoid surgery.
          </p>

          {/* Progress bar */}
          {step <= 7 && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Question {step} of {totalQuestions}</span>
                <span>{Math.round((step / totalQuestions) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(step / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quiz Steps */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 transition-all">
          <AnimatePresence mode="wait">
            {/* Step 1: Joint */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Step 1</span>
                  <h2 className="text-2xl font-bold text-slate-900">Which joint is causing you the most discomfort?</h2>
                  <p className="text-sm text-slate-500">Select your primary anatomical area of concern.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { id: "Knee", label: "Knee", sub: "Meniscus, OA, ACL" },
                    { id: "Shoulder", label: "Shoulder", sub: "Rotator Cuff, Labrum" },
                    { id: "Hip", label: "Hip", sub: "Labral, Arthritis" },
                    { id: "Spine / Back", label: "Spine / Back", sub: "Facet, Disc, Sciatica" },
                    { id: "Ankle / Foot", label: "Ankle / Foot", sub: "Achilles, Plantar, Talus" },
                    { id: "Elbow / Wrist", label: "Elbow / Wrist", sub: "Tennis elbow, TFCC" },
                  ].map((joint) => (
                    <button
                      key={joint.id}
                      type="button"
                      onClick={() => setAnswers({ ...answers, joint: joint.id })}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        answers.joint === joint.id
                          ? "border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-600"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div className="font-bold text-base">{joint.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{joint.sub}</div>
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    disabled={!answers.joint}
                    onClick={() => setStep(2)}
                    className="rounded-xl px-6 h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  >
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Duration */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Step 2</span>
                  <h2 className="text-2xl font-bold text-slate-900">How long have you been dealing with this pain?</h2>
                  <p className="text-sm text-slate-500">Injury duration guides biological regeneration selection.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { id: "Under 3 months (Acute)", title: "Under 3 months (Acute / Recent)", desc: "Sudden strain, sprain, or recent athletic impact" },
                    { id: "3 to 6 months", title: "3 to 6 months (Subacute)", desc: "Lingering pain that hasn't fully resolved with rest" },
                    { id: "6 to 12 months", title: "6 to 12 months (Chronic)", desc: "Persistent joint achiness, flare-ups, and reduced tolerance" },
                    { id: "Over 1 year (Chronic / Degenerative)", title: "Over 1 year (Long-Standing / Degenerative)", desc: "Gradual cartilage wear, chronic arthritis, progressive stiffness" },
                  ].map((dur) => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => setAnswers({ ...answers, duration: dur.id })}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                        answers.duration === dur.id
                          ? "border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-600"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-base">{dur.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{dur.desc}</div>
                      </div>
                      {answers.duration === dur.id && (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="rounded-xl px-5 h-12"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    disabled={!answers.duration}
                    onClick={() => setStep(3)}
                    className="rounded-xl px-6 h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  >
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Pain Level & Character */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Step 3</span>
                  <h2 className="text-2xl font-bold text-slate-900">How would you describe your pain intensity and sensation?</h2>
                  <p className="text-sm text-slate-500">Helps evaluate whether structural friction or cellular inflammation dominates.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { id: "Mild ache with activity", title: "Mild Ache / Stiffness", desc: "Noticeable during or after heavy exercise, but settles quickly" },
                    { id: "Constant dull throbbing & swelling", title: "Constant Dull Ache & Swelling", desc: "Persistent joint warmth, puffiness, or tightness throughout the day" },
                    { id: "Sharp catch, locking, or instability", title: "Sharp Catching, Clicking, or Instability", desc: "Feels like the joint could give out or gets mechanically pinched" },
                    { id: "Bone-on-bone friction / severe resting pain", title: "Severe Bone-on-Bone Friction / Resting Pain", desc: "Grinding sensation, deep joint friction, and aching even while lying in bed" },
                  ].map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setAnswers({ ...answers, painLevel: level.id })}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                        answers.painLevel === level.id
                          ? "border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-600"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-base">{level.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{level.desc}</div>
                      </div>
                      {answers.painLevel === level.id && (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="rounded-xl px-5 h-12"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    disabled={!answers.painLevel}
                    onClick={() => setStep(4)}
                    className="rounded-xl px-6 h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  >
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Functional Limitations */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Step 4</span>
                  <h2 className="text-2xl font-bold text-slate-900">What everyday activities are limited?</h2>
                  <p className="text-sm text-slate-500">Select all that apply to measure biomechanical restriction.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {[
                    "Difficulty walking or taking stairs",
                    "Unable to run, lift weights, or play sports",
                    "Difficulty reaching overhead or carrying loads",
                    "Sleep disrupted by joint throbbing",
                    "Morning stiffness lasting over 30 minutes",
                    "Unable to stand for longer than 15 minutes",
                  ].map((limitation) => {
                    const isSelected = answers.limitations.includes(limitation);
                    return (
                      <button
                        key={limitation}
                        type="button"
                        onClick={() => toggleArrayItem("limitations", limitation)}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? "border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-600"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? "bg-teal-600 border-teal-600 text-white" : "border-slate-300"
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-semibold leading-snug">{limitation}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="rounded-xl px-5 h-12"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    onClick={() => setStep(5)}
                    className="rounded-xl px-6 h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  >
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Prior Treatments */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Step 5</span>
                  <h2 className="text-2xl font-bold text-slate-900">What prior treatments have you attempted?</h2>
                  <p className="text-sm text-slate-500">Select all treatments you have tried in the past.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {[
                    "Cortisone / Steroid Injections",
                    "Hyaluronic Acid / Gel Injections (Synvisc/Euflexxa)",
                    "Physical Therapy or Chiropractic",
                    "Daily NSAIDs / Ibuprofen / Meloxicam",
                    "Arthroscopic Surgery / Meniscus Trimming",
                    "Platelet-Rich Plasma (PRP) elsewhere",
                    "None of the above yet",
                  ].map((treatment) => {
                    const isSelected = answers.priorTreatments.includes(treatment);
                    return (
                      <button
                        key={treatment}
                        type="button"
                        onClick={() => toggleArrayItem("priorTreatments", treatment)}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? "border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-600"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? "bg-teal-600 border-teal-600 text-white" : "border-slate-300"
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-semibold leading-snug">{treatment}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(4)}
                    className="rounded-xl px-5 h-12"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    onClick={() => setStep(6)}
                    className="rounded-xl px-6 h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  >
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Surgery Status */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Step 6</span>
                  <h2 className="text-2xl font-bold text-slate-900">What is your current surgical status?</h2>
                  <p className="text-sm text-slate-500">Have surgeons recommended joint replacement or arthroscopy?</p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { id: "Recommended for joint replacement", title: "Told I Need Total Joint Replacement", desc: "Surgeon advised knee, hip, or shoulder arthroplasty" },
                    { id: "Told surgery is only option left", title: "Told Surgery is the Only Option Left", desc: "No other non-surgical pathways were offered" },
                    { id: "Seeking second opinion to avoid surgery", title: "Actively Seeking Second Opinion to Avoid Surgery", desc: "Want an expert non-surgical orthopedic evaluation first" },
                    { id: "Want non-surgical first-line treatment", title: "Prefer Non-Surgical Regenerative Care", desc: "Surgery has not been formally scheduled or discussed yet" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAnswers({ ...answers, surgeryStatus: s.id })}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                        answers.surgeryStatus === s.id
                          ? "border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-600"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-base">{s.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                      </div>
                      {answers.surgeryStatus === s.id && (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(5)}
                    className="rounded-xl px-5 h-12"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    disabled={!answers.surgeryStatus}
                    onClick={() => setStep(7)}
                    className="rounded-xl px-6 h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  >
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 7: Goals & Contact Form */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Final Step</span>
                  <h2 className="text-2xl font-bold text-slate-900">Your Recovery Goal & Contact Details</h2>
                  <p className="text-sm text-slate-500">We will calculate your clinical protocol match and generate your report.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-semibold">What is your primary goal?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Return to athletic sports / training",
                      "Walk, hike, and enjoy daily life pain-free",
                      "Avoid surgery downtime & joint replacement",
                      "Prolong natural cartilage health long-term",
                    ].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setAnswers({ ...answers, goals: g })}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                          answers.goals === g
                            ? "border-teal-600 bg-teal-50 text-teal-900 font-semibold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleFinishQuiz} className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={answers.name}
                        onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                        className="rounded-xl h-11"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={answers.email}
                        onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                        className="rounded-xl h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number (Optional - for faster consult review)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="720-000-0000"
                      value={answers.phone}
                      onChange={(e) => setAnswers({ ...answers, phone: e.target.value })}
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(6)}
                      className="rounded-xl px-5 h-12"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !answers.goals || !answers.name || !answers.email}
                      className="rounded-xl px-8 h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-600/20"
                    >
                      {isSubmitting ? "Generating Clinical Match..." : (
                        <>
                          View My Biologics Recommendation <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    HIPAA Compliant & Confidential. Your clinical data is never shared.
                  </p>
                </form>
              </motion.div>
            )}

            {/* Step 8: Results Recommendation */}
            {step === 8 && result && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Recommendation Banner */}
                <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Sparkles className="w-40 h-40 text-teal-400" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      {result.badge}
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-teal-400 font-semibold">Matched Biologic Recommendation</span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        {result.treatment}
                      </h2>
                    </div>
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                      {result.rationale}
                    </p>
                  </div>
                </div>

                {/* Key Clinical Points */}
                <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                    <Activity className="w-5 h-5 text-teal-600" />
                    Why This Protocol Fits Your Presentation:
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.keyPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-teal-100/60 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 text-xs text-slate-500 italic border-t border-teal-100/80">
                    {result.evidenceNote}
                  </div>
                </div>

                {/* Patient Next Steps & CTAs */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-center font-bold text-slate-800 text-sm uppercase tracking-wider">
                    Recommended Clinical Next Steps
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Primary Booking CTA */}
                    <div className="bg-white border-2 border-teal-600 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                      <div>
                        <div className="flex items-center gap-2 text-teal-700 font-bold text-base mb-1">
                          <Calendar className="w-5 h-5" />
                          1. Schedule Orthopedic Evaluation
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Meet with Dr. Morreale in Westminster for a hands-on joint exam, imaging review, and personalized biologic protocol.
                        </p>
                      </div>
                      <div className="mt-4">
                        <BookingDialog
                          title={`Consultation: ${result.treatment}`}
                          description={`Dr. Morreale will review your quiz results (${answers.joint} pain, ${answers.duration}) and provide a comprehensive biologic treatment plan.`}
                          trigger={
                            <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-teal-600/20 active:scale-98">
                              Book Your Consultation
                            </button>
                          }
                        />
                      </div>
                    </div>

                    {/* Secondary Guide Download CTA */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-1">
                          <Download className="w-5 h-5 text-teal-600" />
                          2. Free Biologics 101 Guide
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Download our comprehensive free guide: "Wharton's Jelly, Exosomes, and PRP — A Board-Certified Orthopedic Surgeon's Guide".
                        </p>
                      </div>
                      <div className="mt-4">
                        <Link
                          to="/guide/regenerative-medicine-101"
                          className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all"
                        >
                          Download Free Guide <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Decision tool and retake link */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100">
                    <Link 
                      to="/biologics-decision" 
                      className="text-teal-700 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <Layers className="w-3.5 h-3.5" /> Compare Biologics in our Interactive Decision Tree
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setAnswers(INITIAL_STATE);
                        setStep(1);
                        setResult(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retake Self-Assessment
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Surgeon Bio Footer */}
        <div className="mt-8 bg-white/70 backdrop-blur-xs rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">
              JM
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Joseph Morreale, MD</span>
              <span>Board-Certified Orthopedic Surgeon | Westminster, CO</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="tel:7207769165"
              className="inline-flex items-center gap-1.5 font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> (720) 776-9165
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
