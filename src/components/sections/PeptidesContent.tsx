import { motion } from "motion/react";
import { PEPTIDES, PEPTIDE_COMBINATIONS } from "@/data/peptides";
import { CheckCircle2, FlaskConical, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PeptidesContent() {
  const categories = Array.from(new Set([
    ...PEPTIDES.map(p => p.category),
    ...PEPTIDE_COMBINATIONS.map(c => c.category)
  ]));

  return (
    <section id="peptides-detail" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest">In-Depth Guide</h2>
            <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Understanding Peptide Therapy</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              We use specific peptides to signal your body's natural healing and recovery processes. 
              Below is a guide to the specific formulas we offer.
            </p>
          </div>

          <div className="space-y-24">
            {categories.map((category) => (
              <div key={category} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px bg-slate-200 grow" />
                  <h4 className="text-xl font-bold text-slate-900 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm uppercase tracking-wide text-sm">
                    {category}
                  </h4>
                  <div className="h-px bg-slate-200 grow" />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {PEPTIDES.filter(p => p.category === category).map((peptide) => (
                    <motion.div
                      key={peptide.name}
                      whileHover={{ y: -5 }}
                      className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <h5 className="text-2xl font-bold text-slate-900">{peptide.name}</h5>
                          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                            <Zap className="w-5 h-5 text-teal-600" />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">What it is</p>
                            <p className="text-slate-600 leading-relaxed">{peptide.description}</p>
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">What it may support</p>
                            <ul className="grid gap-2">
                              {peptide.supports.map((s) => (
                                <li key={s} className="flex items-center gap-3 text-slate-600 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">How it works</p>
                            <p className="text-slate-600 text-sm leading-relaxed">{peptide.howItWorks}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Combinations */}
                  {PEPTIDE_COMBINATIONS.filter(c => c.category === category).map((combo) => (
                    <motion.div
                      key={combo.name}
                      whileHover={{ y: -5 }}
                      className="bg-teal-900 p-8 rounded-[2rem] text-white shadow-xl hover:shadow-2xl transition-all duration-500 md:col-span-2"
                    >
                      <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                          <div className="flex items-start justify-between">
                            <h5 className="text-2xl font-bold">{combo.name} Combination</h5>
                            <div className="w-10 h-10 bg-teal-800 rounded-xl flex items-center justify-center">
                              <FlaskConical className="w-5 h-5 text-teal-400" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-2">Why combine them?</p>
                              <p className="text-teal-50/80 leading-relaxed">{combo.whyCombine}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {combo.components.map(comp => (
                                <span key={comp} className="px-3 py-1 bg-teal-800 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {combo.supports && (
                            <div className="space-y-4">
                              <p className="text-sm font-bold text-teal-400 uppercase tracking-wider">Potential Clinical Support</p>
                              <ul className="grid gap-3">
                                {combo.supports.map((s) => (
                                  <li key={s} className="flex items-center gap-3 text-teal-50 text-sm">
                                    <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl text-center space-y-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <h4 className="text-3xl font-bold text-slate-900">Is Peptide Therapy Right for You?</h4>
              <p className="text-slate-600">
                Peptide therapy is a medical treatment that requires a personalized consultation. 
                Message us to set up a tele-health visit to discuss your goals and medical history.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg" 
                className="bg-teal-600 hover:bg-teal-700 text-white px-12 h-14 rounded-2xl font-bold shadow-xl shadow-teal-600/20 text-lg group"
              >
                <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Message Us for a Tele-visit
              </Button>
            </div>
          </div>

          {/* Disclosure */}
          <div className="p-8 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center leading-relaxed max-w-2xl mx-auto">
              <span className="font-bold text-slate-600 block mb-2 uppercase tracking-widest">Disclosure Statement</span>
              These peptides are compounded medications. Most are not FDA-approved for anti-aging, performance, or general wellness use. 
              Research in humans is still evolving. Benefits vary by individual.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
