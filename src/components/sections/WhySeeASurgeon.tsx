import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope, MessageSquareText, Compass } from "lucide-react";

const CARDS = [
  {
    title: "Surgical training, non-surgical practice",
    description: "Your evaluation draws on years of orthopedic surgical experience.",
    icon: Stethoscope,
  },
  {
    title: "A straight answer",
    description:
      "If non-operative options may fit your situation, we'll walk through them with you. If surgery looks like the better path, we'll say so.",
    icon: MessageSquareText,
  },
  {
    title: "The right next step",
    description:
      "When surgery is needed, Dr. Morreale can refer you to a trusted orthopedic surgeon for your specific condition.",
    icon: Compass,
  },
];

interface WhySeeASurgeonProps {
  embedded?: boolean;
}

export default function WhySeeASurgeon({ embedded = false }: WhySeeASurgeonProps) {
  const innerContent = (
    <div className="space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="text-teal-600 font-bold uppercase tracking-widest text-sm">
          Surgeon-Led Evaluation
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
          Why see a surgeon for non-surgical care?
        </h2>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
          Dr. Joseph Morreale is a board-certified orthopedic surgeon. Today his practice focuses entirely on non-operative and regenerative orthopedic care. That background shapes every consultation. He's trained to recognize when surgery really is the right answer, and when it may not be. You get an honest, unhurried opinion with no pressure either way.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {CARDS.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-teal-500/20 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6">
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {card.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-full font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 group text-sm sm:text-base"
        >
          Schedule a Second Opinion
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <section className="mt-16 p-8 md:p-16 rounded-[40px] bg-white border border-slate-100 shadow-sm">
        {innerContent}
      </section>
    );
  }

  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">{innerContent}</div>
    </section>
  );
}
