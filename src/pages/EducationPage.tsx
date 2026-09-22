import { BookingDialog } from "../components/ui/BookingDialog";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
export default function EducationPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="pt-12 pb-24"
    >
      <title>Orthopedic Education & Surgery Alternatives | Westminster CO</title>
      <meta name="description" content="Learn about regenerative medicine, get a second opinion on surgery, and explore how PRP and Wharton's Jelly can heal your joint pain in Westminster, CO." />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Patient Education</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Empowering you with knowledge to make the best decisions for your orthopedic health.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-slate-50 p-8 md:p-16 rounded-[40px] border border-slate-100">
          <div className="max-w-xl space-y-6">
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest">Surgical Second Opinions</h2>
            <h3 className="text-4xl font-bold tracking-tight">Avoid Unnecessary Surgery</h3>
            <p className="text-slate-600 leading-relaxed">
              Before you commit to a major orthopedic surgery, get an expert second opinion. We specialize in identifying patients who can achieve superior results through non-operative regenerative procedures like Wharton's Jelly and Exosome therapy.
            </p>
            <div className="flex gap-4">
              <BookingDialog 
                title="Request a Second Opinion"
                description="Upload your imaging reports or describe your surgical recommendation, and our experts will review your case."
                trigger={
                  <button className="bg-teal-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                    Request Second Opinion
                  </button>
                }
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-lg border border-slate-200 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Mountain landscape representing health and recovery" 
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Patient Funnel Tools Section */}
        <div className="mt-16 p-8 md:p-12 rounded-[40px] bg-teal-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-300">Free Patient Resources</span>
              <h3 className="text-3xl sm:text-4xl font-extrabold">Download The Comprehensive Biologics Guide</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Download “Biologic Regeneration 101: Wharton’s Jelly, Exosomes, and PRP” by Dr. Joseph Morreale. Understand why cortisone breaks down cartilage, how structural allografts work, and how to avoid joint replacement.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <Link
                to="/guide/regenerative-medicine-101"
                className="p-5 rounded-2xl bg-white text-slate-900 hover:bg-teal-50 transition-all font-bold text-sm flex flex-col justify-between shadow-md group"
              >
                <div>
                  <span className="text-xs text-teal-600 block mb-1">Instant PDF</span>
                  <span className="group-hover:text-teal-700">Biologics 101 Guide</span>
                </div>
                <span className="text-xs text-slate-500 mt-4 flex items-center">Download Free Copy →</span>
              </Link>

              <Link
                to="/biologics-decision"
                className="p-5 rounded-2xl bg-teal-800/80 text-white hover:bg-teal-800 transition-all font-bold text-sm flex flex-col justify-between border border-teal-700 group"
              >
                <div>
                  <span className="text-xs text-teal-300 block mb-1">Clinical Tool</span>
                  <span>Decision Matrix</span>
                </div>
                <span className="text-xs text-teal-200 mt-4 flex items-center">Compare Wharton's, Exosomes & PRP →</span>
              </Link>

              <Link
                to="/pain-quiz"
                className="p-5 rounded-2xl bg-teal-800/80 text-white hover:bg-teal-800 transition-all font-bold text-sm flex flex-col justify-between border border-teal-700 group"
              >
                <div>
                  <span className="text-xs text-teal-300 block mb-1">Self-Assessment</span>
                  <span>Pain Quiz</span>
                </div>
                <span className="text-xs text-teal-200 mt-4 flex items-center">Check Your Compatibility →</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xl font-bold mb-4">Understanding PRP</h4>
            <p className="text-slate-600 text-sm mb-4">Learn how your own platelets can accelerate healing in tendons and ligaments.</p>
            <Link to="/education/understanding-prp" className="text-teal-600 font-bold text-sm hover:underline">Read Article →</Link>
          </div>
          <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xl font-bold mb-4">Wharton's Jelly Science</h4>
            <p className="text-slate-600 text-sm mb-4">The role of structural proteins in supporting damaged cartilage repair.</p>
            <Link to="/education/whartons-jelly-science" className="text-teal-600 font-bold text-sm hover:underline">Read Article →</Link>
          </div>
          <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xl font-bold mb-4">Exosome Signaling</h4>
            <p className="text-slate-600 text-sm mb-4">How cellular messengers reprogram your body's natural healing response.</p>
            <Link to="/education/exosome-signaling" className="text-teal-600 font-bold text-sm hover:underline">Read Article →</Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
