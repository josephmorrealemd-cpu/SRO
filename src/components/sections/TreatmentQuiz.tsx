import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, CheckCircle2, Activity, Sparkles, ClipboardCheck, ArrowRight, Download, Layers } from "lucide-react";
import { BookingDialog } from "../ui/BookingDialog";

interface Question {
  id: number;
  text: string;
  options: { text: string; value: string; icon?: React.ReactNode }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Where is your primary area of concern?",
    options: [
      { text: "Knee", value: "knee" },
      { text: "Shoulder", value: "shoulder" },
      { text: "Spine / Back", value: "spine" },
      { text: "Hip", value: "hip" },
      { text: "Other Joint", value: "other" },
    ],
  },
  {
    id: 2,
    text: "How long have you been experiencing this pain?",
    options: [
      { text: "Less than 3 months", value: "acute" },
      { text: "3 - 12 months", value: "subacute" },
      { text: "Over a year", value: "chronic" },
      { text: "It's a recurring old injury", value: "recurring" },
    ],
  },
  {
    id: 3,
    text: "What is your primary goal for treatment?",
    options: [
      { text: "Avoid surgery at all costs", value: "avoid_surgery" },
      { text: "Return to high-impact sports", value: "sports" },
      { text: "Daily pain management", value: "pain" },
      { text: "Improve overall mobility", value: "mobility" },
    ],
  },
  {
    id: 4,
    text: "Have you been told you need surgery?",
    options: [
      { text: "Yes, I have a recommendation", value: "yes_surgery" },
      { text: "It's been mentioned as an option", value: "maybe_surgery" },
      { text: "No, not yet", value: "no_surgery" },
    ],
  },
];

export default function TreatmentQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [QUESTIONS[currentStep].id]: value });
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsFinished(false);
  };

  const getRecommendation = () => {
    const isSurgery = answers[4] === "yes_surgery" || answers[4] === "maybe_surgery";
    const isChronic = answers[2] === "chronic" || answers[2] === "recurring";
    const isAvoidSurgery = answers[3] === "avoid_surgery";
    const isSports = answers[3] === "sports";
    const isAcute = answers[2] === "acute";

    // Priority 1: Wharton's Jelly + Exosomes Dual Therapy for surgery candidates, OA, and chronic degenerative pain
    if (isSurgery || (isChronic && isAvoidSurgery) || (isChronic && !isAcute)) {
      return {
        title: "Advanced Biologics Restoration",
        description: "For chronic joint wear, cartilage loss, or when facing surgery, autologous platelets alone often lack the necessary structural extracellular matrix. We prioritize Wharton's Jelly for physical cushioning combined with Exosomes to stop inflammatory breakdown and stimulate native repair.",
        treatment: "Wharton's Jelly + Exosomes Dual Protocol",
        nextStep: "Book Biologics Consultation",
        badge: "Tier 1: Maximum Scaffolding & Signaling"
      };
    }

    // Priority 2: Exosomes + MSK Laser for athletes & rapid return to high impact
    if (isSports) {
      return {
        title: "Athletic Cellular Remodeling",
        description: "High-demand athletes need fast soft-tissue remodeling without surgical scar tissue or joint stiffness. Exosome cellular signaling directs tenocytes and chondrocytes to repair rapidly, synergized with high-intensity MSK laser.",
        treatment: "Exosome Signaling + MSK Laser",
        nextStep: "Schedule Athletic Evaluation",
        badge: "Rapid Remodeling Without Downtime"
      };
    }

    // Priority 3: Concentrated PRP for acute mild injuries (< 3 months)
    if (isAcute) {
      return {
        title: "Targeted Autologous Protocol",
        description: "Because your injury is acute (< 3 months) without long-term cartilage loss, your body's own concentrated platelets are an effective first-line biologic. We concentrate your autologous growth factors 5-7x under ultrasound guidance.",
        treatment: "High-Concentration PRP + MSK Laser",
        nextStep: "Book PRP Consultation",
        badge: "Autologous Growth Factors"
      };
    }

    // Fallback: Wharton's Jelly + Exosomes
    return {
      title: "Biologics-First Restoration",
      description: "Based on your clinical profile, a biologics-first approach using Wharton's Jelly structural cushioning and Exosome signaling provides the best outcome to avoid surgery and protect joint longevity.",
      treatment: "Wharton's Jelly + Exosomes Protocol",
      nextStep: "Book Consultation",
      badge: "Non-Surgical Cartilage Preservation"
    };
  };

  const recommendation = getRecommendation();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-slate-800 relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] -z-0" />
            
            <div className="relative z-10 p-8 md:p-16">
              <AnimatePresence mode="wait">
                {!isFinished ? (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-teal-400">
                        <ClipboardCheck className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Treatment Matcher</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Is Regenerative Medicine Right for You?
                      </h2>
                      <div className="flex gap-2">
                        {QUESTIONS.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                              i <= currentStep ? "bg-teal-500" : "bg-slate-800"
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h3 className="text-xl text-slate-300 font-medium">
                        {QUESTIONS[currentStep].text}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {QUESTIONS[currentStep].options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleAnswer(option.value)}
                            className="group relative flex items-center justify-between p-6 bg-slate-800/50 hover:bg-teal-600 border border-slate-700 hover:border-teal-400 rounded-2xl transition-all text-left active:scale-[0.98]"
                          >
                            <span className="text-white font-semibold group-hover:text-white transition-colors">
                              {option.text}
                            </span>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {currentStep > 0 && (
                      <button 
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous Question
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8"
                  >
                    <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Sparkles className="w-10 h-10 text-teal-400" />
                    </div>
                    
                    <div className="space-y-4">
                      <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest">Your Personalized Recommendation</h2>
                      <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{recommendation.title}</h3>
                      <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        {recommendation.description}
                      </p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl max-w-xl mx-auto">
                      <div className="flex items-center justify-center gap-3 text-teal-400 mb-2">
                        <Activity className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Recommended Therapy</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{recommendation.treatment}</div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                      <BookingDialog 
                        title={recommendation.nextStep}
                        trigger={
                          <button className="w-full sm:w-auto bg-teal-600 text-white px-10 py-4 rounded-full font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95">
                            {recommendation.nextStep}
                          </button>
                        }
                      />
                      <Link
                        to="/pain-quiz"
                        className="w-full sm:w-auto bg-slate-800 text-teal-300 border border-teal-500/30 px-6 py-4 rounded-full font-semibold hover:bg-slate-700 transition-all text-sm inline-flex items-center justify-center gap-1.5"
                      >
                        Detailed 7-Question Quiz <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                      <Link to="/biologics-decision" className="hover:text-teal-400 transition-colors inline-flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-teal-500" /> Biologics Decision Matrix
                      </Link>
                      <span>•</span>
                      <Link to="/guide/regenerative-medicine-101" className="hover:text-teal-400 transition-colors inline-flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-teal-500" /> Free Biologics 101 Guide
                      </Link>
                      <span>•</span>
                      <button 
                        onClick={resetQuiz}
                        className="hover:text-white transition-colors"
                      >
                        Start Over
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-teal-50/80 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-700">
              <strong className="text-slate-900">Want a deeper surgical assessment?</strong> Take our comprehensive 7-question clinical evaluation or download the free orthopedic guide.
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/pain-quiz"
                className="bg-teal-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-xs"
              >
                Start Full Assessment
              </Link>
              <Link
                to="/guide/regenerative-medicine-101"
                className="bg-white text-slate-800 border border-slate-200 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Free Guide
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-teal-600 font-bold text-2xl">100%</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Personalized</div>
            </div>
            <div className="space-y-2">
              <div className="text-teal-600 font-bold text-2xl">2 Mins</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Completion Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-teal-600 font-bold text-2xl">Free</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Clinical Insight</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}