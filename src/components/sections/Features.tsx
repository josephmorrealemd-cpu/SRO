import { Zap, Shield, Heart, Users, ClipboardCheck, Sparkles } from "lucide-react";

const FEATURES = [
  {
    title: "Faster Recovery",
    description: "Experience shorter recovery times with our advanced techniques. Our approach helps you return to your normal activities sooner without the extended healing time associated with traditional surgery.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    title: "Non-Invasive Options",
    description: "Our treatments prioritize your comfort through non-invasive methods. Avoiding major surgeries means less pain and quicker return to everyday life, aligning with our commitment to your well-being.",
    icon: Shield,
    color: "text-teal-500",
    bg: "bg-teal-50"
  },
  {
    title: "Patient-Centric Care",
    description: "Our practice is built around the needs and goals of our patients. We listen, understand, and provide support at every step of your treatment journey. It's not just about healing; it’s about restoring your strength and confidence.",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
  {
    title: "Expert Team",
    description: "Our skilled professionals bring years of expertise in orthopedic medicine. We are committed to ongoing education and training, ensuring we provide the best and most effective treatment options for our patients.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "Comprehensive Consultations",
    description: "We believe that informed patients make better decisions. That’s why our consultations are thorough, ensuring you fully understand your condition, treatment options, and the expected outcomes.",
    icon: ClipboardCheck,
    color: "text-indigo-500",
    bg: "bg-indigo-50"
  },
  {
    title: "Innovative Therapies",
    description: "We use state-of-the-art, minimally invasive techniques to enhance recovery and improve long-term outcomes. Our focus on regenerative medicine ensures effective treatment with minimal discomfort.",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-50"
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest">Why Choose Summit</h2>
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight">The Advantages of Regenerative Care</h3>
          <p className="text-slate-600">
            Our goal is to empower patients through innovative orthopedic solutions. We focus on cutting-edge regenerative treatments that improve mobility and quality of life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
