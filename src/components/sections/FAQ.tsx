import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FAQS = [
  {
    question: "What is regenerative medicine?",
    answer: "Regenerative medicine is a field of medicine that focuses on repairing, replacing, or regenerating human cells, tissues, or organs to restore or establish normal function. We use advanced therapies like PRP and Wharton's Jelly to facilitate your journey back to optimal health."
  },
  {
    question: "Is this treatment safe?",
    answer: "Yes, our treatments prioritize your comfort through non-invasive methods. We use state-of-the-art, minimally invasive techniques to enhance recovery and improve long-term outcomes with minimal discomfort."
  },
  {
    question: "How long is recovery?",
    answer: "Experience shorter recovery times with our advanced techniques. Our approach helps you return to your normal activities sooner without the extended healing time associated with traditional surgery."
  },
  {
    question: "What conditions can it treat?",
    answer: "We offer a comprehensive range of orthopedic services designed to effectively treat various conditions, from joint pain and sports injuries to degenerative disc disease and musculoskeletal issues."
  },
  {
    question: "Can I combine it with other treatments?",
    answer: "Our treatments can often be combined with other orthopedic services to support your healing process. During your thorough consultation, we will discuss the best personalized care tailored to your needs."
  },
  {
    question: "How do I get started?",
    answer: "The first step is to schedule a comprehensive consultation. We believe that informed patients make better decisions, so we ensure you fully understand your condition and treatment options."
  },
  {
    question: "How effective is this treatment?",
    answer: "Our commitment to excellence drives us to stay ahead in the orthopedic field. Our advanced regenerative techniques promote faster healing, allowing you to return to normal activities sooner without surgery."
  },
  {
    question: "Will insurance cover this?",
    answer: "Insurance coverage varies by provider and specific treatment. We will discuss all financial aspects and help you understand your options during your consultation."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest">Common Questions</h2>
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h3>
          <p className="text-slate-600">
            Here are some frequently asked questions regarding our treatments and procedures.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index}
              className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
            >
              <button 
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-teal-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
