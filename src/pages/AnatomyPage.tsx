import InteractiveBody from "../components/sections/InteractiveBody";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, FileText } from "lucide-react";
import { BookingDialog } from "@/components/ui/BookingDialog";

export default function AnatomyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="pt-12 pb-24"
    >
      <title>Interactive Joint Anatomy Guide | Regenerative Solutions | Westminster CO</title>
      <meta name="description" content="Use our interactive anatomy tool to learn how regenerative medicine can treat joint pain in the knees, hips, shoulders, and spine without surgery." />
      
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Interactive Anatomy</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Explore the human body and see how our regenerative treatments can help heal specific areas of concern.
        </p>
      </div>

      <InteractiveBody />

      {/* Guided Funnel Bar */}
      <div className="container mx-auto px-4 mt-16">
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Next Clinical Step</span>
            <h3 className="text-xl sm:text-2xl font-bold">Have Pain in One of These Joints?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Take our 2-minute pain quiz to see which biologic treatment protocol (Wharton's Jelly, Exosomes, or PRP) best matches your anatomical condition.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/pain-quiz"
              className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1.5"
            >
              Take Pain Quiz <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <BookingDialog
              title="Schedule Orthopedic Evaluation"
              description="Review your imaging and physical exam with Dr. Morreale in Westminster, CO."
              trigger={
                <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-xl text-xs transition-all border border-white/20">
                  Book Consult
                </button>
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
