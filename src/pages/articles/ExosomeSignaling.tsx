import { motion } from "motion/react";
import { ArrowLeft, Clock, User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function ExosomeSignaling() {
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
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 4 min read</span>
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> By Summit Clinical Team</span>
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Cellular Communication</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Exosome Signaling: The Future of Regenerative Medicine</h1>
          <p className="text-xl text-slate-600 leading-relaxed italic">
            "Exosomes are the 'purest' form of regenerative signaling, providing the precise instructions your cells need to stop inflammation and start repair."
          </p>
        </div>

        <div className="prose prose-slate prose-lg max-w-none">
          <img 
            src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200&h=600" 
            alt="Microscopic view of cellular vesicles and signaling" 
            className="w-full rounded-3xl mb-12 shadow-lg"
            referrerPolicy="no-referrer"
          />

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">What are Exosomes?</h2>
          <p>
            Exosomes are tiny, membrane-bound vesicles that are released by cells. They are not cells themselves, but rather the "cellular messengers" that carry vital information between cells. In regenerative medicine, exosomes are used to deliver a concentrated dose of signaling molecules—like proteins, lipids, and RNA—to the site of an injury.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">How Exosomes Communicate</h2>
          <p>
            Think of exosomes as the "instruction manual" for healing. When your body is injured, the local environment becomes highly inflammatory, which can actually prevent repair. Exosomes work by:
          </p>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Reprogramming Local Cells:</strong> Exosomes deliver signals that tell local cells to switch from a "pro-inflammatory" state to a "pro-repair" state.</li>
            <li><strong>Accelerating the Healing Response:</strong> By providing a high concentration of growth factors and cytokines, exosomes can significantly speed up the natural repair process.</li>
            <li><strong>Modulating the Immune System:</strong> Exosomes help to "calm down" an overactive immune response that can lead to chronic pain and tissue damage.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Why Exosomes are Unique</h2>
          <p>
            Unlike stem cells, which can be unpredictable, exosomes are a "cell-free" therapy. This means they are:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li><strong>Highly Concentrated:</strong> A single injection can contain billions of exosomes, providing a massive dose of signaling power.</li>
            <li><strong>Extremely Safe:</strong> Because they are not cells, there is no risk of the exosomes developing into unwanted tissue types.</li>
            <li><strong>Small and Efficient:</strong> Their tiny size allows them to easily penetrate deep into damaged tissue where larger cells might not be able to reach.</li>
          </ol>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-8 my-12 rounded-r-2xl">
            <h3 className="text-teal-900 font-bold mb-2">The Summit Approach</h3>
            <p className="text-teal-800 text-sm">
              At Summit, we often use exosomes in combination with other regenerative therapies like Wharton's Jelly. While the jelly provides the structural support, the exosomes provide the "high-speed" signaling needed to kickstart the healing process.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">The Future of Healing</h2>
          <p>
            Exosome therapy represents the cutting edge of regenerative medicine. By focusing on the "signals" rather than the "cells," we can provide a more precise, powerful, and predictable treatment for patients with chronic orthopedic conditions.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
