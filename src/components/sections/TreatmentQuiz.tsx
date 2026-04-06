import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, CheckCircle2, Activity, Sparkles, ClipboardCheck } from "lucide-react";
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
    const isSurgery = answers[4] === "yes_surgery";
    const isChronic = answers[2] === "chronic";
    const isKnee = answers[1] === "knee";

    if (isSurgery) {
      return {
        title: "Surgical Second Opinion",
        description: "Since you've been recommended for surgery, your best first step is a formal Second Opinion. We often find that Wharton's Jelly or Exosome therapy can provide the structural support needed to avoid the operating room.",
        treatment: "Wharton's Jelly + Exosomes",
        nextStep: "Book Second Opinion"
      };
    }
    if (isChronic && isKnee) {
      return {
        title: "Knee Regeneration Protocol",
        description: "For chronic knee issues, we typically recommend a combination of Wharton's Jelly for structural support and PRP to accelerate the natural healing environment.",
        treatment: "Wharton's Jelly & PRP",
        nextStep: "Book Knee Consultation"
      };
    }
    return {
      title: "Regenerative Foundations",
      description: "Based on your goals, you are likely a strong candidate for PRP (Platelet-Rich Plasma) therapy. This uses your own growth factors to repair damaged tissue and reduce inflammation.",
      treatment: "PRP Therapy",
      nextStep: "Book Consultation"
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

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                      <BookingDialog 
                        title={recommendation.nextStep}
                        trigger={
                          <button className="w-full sm:w-auto bg-teal-600 text-white px-10 py-4 rounded-full font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95">
                            {recommendation.nextStep}
                          </button>
                        }
                      />
                      <button 
                        onClick={resetQuiz}
                        className="text-slate-400 hover:text-white font-bold text-sm transition-colors"
                      >
                        Start Over
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
