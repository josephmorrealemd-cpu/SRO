import { motion } from "motion/react";
import { ArrowLeft, Clock, User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnderstandingPRP() {
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
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 5 min read</span>
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> By Summit Clinical Team</span>
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Regenerative Basics</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Understanding PRP: Healing from Within</h1>
          <p className="text-xl text-slate-600 leading-relaxed italic">
            "Platelet-Rich Plasma (PRP) is not just a treatment; it's a way to harness your body's own biological pharmacy to accelerate repair."
          </p>
        </div>

        <div className="prose prose-slate prose-lg max-w-none">
          <img 
            src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200&h=600" 
            alt="Laboratory setting representing PRP preparation with amber liquid" 
            className="w-full rounded-3xl mb-12 shadow-lg"
            referrerPolicy="no-referrer"
          />

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">What is Platelet-Rich Plasma?</h2>
          <p>
            Platelet-Rich Plasma, commonly known as PRP, is a concentrated form of your own blood that contains a high volume of platelets. While platelets are best known for their role in blood clotting, they are also incredibly rich in growth factors—the "signaling molecules" that tell your body to repair damaged tissue.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">How the Process Works</h2>
          <p>
            The beauty of PRP lies in its simplicity and safety. Because it is derived from your own blood, there is virtually no risk of rejection or allergic reaction. The process typically follows three steps:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li><strong>The Draw:</strong> A small amount of blood is taken from your arm, similar to a standard blood test.</li>
            <li><strong>The Concentration:</strong> The blood is placed in a specialized centrifuge. This machine spins the blood at high speeds to separate the platelets from the red blood cells, creating a highly concentrated "plasma."</li>
            <li><strong>The Injection:</strong> Using advanced ultrasound guidance, we precisely inject the PRP into the site of your injury (such as a tendon, ligament, or joint).</li>
          </ol>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">The Science of Growth Factors</h2>
          <p>
            Once injected, the platelets release a cocktail of growth factors, including TGF-beta, PDGF, and VEGF. These molecules act like a "distress signal" to your body's local repair cells. They help to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reduce chronic inflammation that prevents healing.</li>
            <li>Stimulate the production of new collagen.</li>
            <li>Improve blood flow to areas with poor circulation (like tendons).</li>
            <li>Recruit specialized cells to the site of injury.</li>
          </ul>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-8 my-12 rounded-r-2xl">
            <h3 className="text-teal-900 font-bold mb-2">Is PRP right for you?</h3>
            <p className="text-teal-800 text-sm">
              PRP is most effective for chronic tendon issues (like tennis elbow or Achilles tendonitis) and mild-to-moderate joint arthritis. It is often the first line of defense in regenerative medicine.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">What to Expect After Treatment</h2>
          <p>
            Unlike a steroid shot, which masks pain immediately, PRP works by actually repairing the tissue. This means you might feel a temporary increase in soreness for a few days as the inflammatory healing response kicks in. Most patients begin to see significant functional improvement within 4 to 6 weeks.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
