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
