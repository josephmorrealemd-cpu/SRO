import { motion } from "motion/react";
import { ArrowLeft, Clock, User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function WhartonsJellyScience() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-12 pb-24"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/education" className="inline-flex items-center gap-2 text-teal-600 font-bold mb-8 hover:gap-3 transition-all">
          <ArrowLeft className="w-4 h-4" />
          Back to Education
        </Link>

        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 6 min read</span>
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> By Summit Clinical Team</span>
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Structural Support</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Wharton's Jelly: The Science of Structural Repair</h1>
          <p className="text-xl text-slate-600 leading-relaxed italic">
            "Wharton's Jelly is the body's most advanced structural tissue, providing the cushioning and support needed for damaged joints to heal."
          </p>
        </div>

        <div className="prose prose-slate prose-lg max-w-none">
          <img 
            src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200&h=600" 
            alt="Microscopic view representing cellular structures" 
            className="w-full rounded-3xl mb-12 shadow-lg"
            referrerPolicy="no-referrer"
          />

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">What is Wharton's Jelly?</h2>
          <p>
            Wharton's Jelly is a gelatinous substance found within the umbilical cord. It is uniquely rich in structural proteins, hyaluronic acid, and cytokines. In regenerative medicine, it is used as a powerful structural tissue supplement to provide cushioning and support to damaged joints, tendons, and ligaments.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">The Power of Structural Proteins</h2>
          <p>
            Unlike PRP, which primarily provides "signaling" molecules, Wharton's Jelly provides a physical "scaffold" for repair. It contains high concentrations of:
          </p>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Collagen (Types I, III, IV):</strong> The primary building blocks of connective tissue.</li>
            <li><strong>Hyaluronic Acid:</strong> A natural lubricant that provides shock absorption and reduces friction in joints.</li>
            <li><strong>Proteoglycans:</strong> Molecules that help tissue retain water and maintain its structural integrity.</li>
            <li><strong>Cytokines:</strong> Specialized proteins that help to modulate the inflammatory environment.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Why It's Used in Joint Repair</h2>
          <p>
            When a joint like the knee or hip suffers from arthritis, the natural cushioning (cartilage) has worn down. Wharton's Jelly can be injected into these areas to:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li><strong>Provide Immediate Cushioning:</strong> The gelatinous nature of the tissue offers physical support to the joint space.</li>
            <li><strong>Create a Healing Environment:</strong> The cytokines and growth factors within the jelly help to "calm down" the chronic inflammation associated with arthritis.</li>
            <li><strong>Support Tissue Repair:</strong> The structural proteins provide a foundation upon which the body's own cells can begin to rebuild.</li>
          </ol>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-8 my-12 rounded-r-2xl">
            <h3 className="text-teal-900 font-bold mb-2">Ethical and Safe</h3>
            <p className="text-teal-800 text-sm">
              The Wharton's Jelly used at Summit is ethically sourced from healthy, full-term births and is rigorously screened and processed in FDA-compliant laboratories. It is a non-embryonic, safe, and highly effective regenerative option.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Wharton's Jelly vs. Traditional Injections</h2>
          <p>
            While traditional "gel shots" (hyaluronic acid) only provide lubrication, Wharton's Jelly provides both lubrication AND the structural proteins needed for repair. This makes it a far more robust option for patients with moderate-to-severe joint degeneration who are looking to avoid surgery.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
