import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Jessica T.",
    role: "Marketing Director",
    content: "I underwent PRP treatment here, and it changed my life. I’m back to my active lifestyle, and I couldn't be happier.",
    rating: 5
  },
  {
    name: "Robert M.",
    role: "Professional Athlete",
    content: "The expert team at Summit provided personalized care that helped me avoid surgery and return to the field faster than expected.",
    rating: 5
  },
  {
    name: "Sarah L.",
    role: "Teacher",
    content: "Their patient-centric care is unmatched. They listened, understood, and provided support at every step of my treatment journey.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-teal-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-800/50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest">Patient Success Stories</h2>
          <h3 className="text-4xl font-bold tracking-tight">See What Our Satisfied Patients Have to Say</h3>
          <p className="text-teal-100/80">
            Our goal is to empower patients through innovative orthopedic solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-teal-800/40 backdrop-blur-sm p-8 rounded-3xl border border-teal-700/50 relative group hover:bg-teal-800/60 transition-colors"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-teal-700/30 group-hover:text-teal-700/50 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-teal-50 leading-relaxed mb-8 italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center font-bold text-teal-100">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-xs text-teal-300">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
