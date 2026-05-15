import { motion, AnimatePresence } from "motion/react";
import { TREATMENTS, Treatment } from "@/types";
import { CheckCircle2, ArrowRight, PlayCircle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TreatmentDetailDialog } from "@/components/ui/TreatmentDetailDialog";

export default function TreatmentExplainer({ 
  selectedId, 
  onSelect 
}: { 
  selectedId: string; 
  onSelect: (id: string) => void; 
}) {
  const activeTreatment = TREATMENTS.find(t => t.id === selectedId) || TREATMENTS[0];

  return (
    <section id="treatments" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest">Treatment Options</h2>
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Innovative Therapies</h3>
          <p className="text-slate-600">
            Explore our range of treatments that focus on healing and recovery. From PRP therapy to advanced laser therapy, we utilize the latest techniques to facilitate your journey back to optimal health.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start relative">
          {/* Treatment List */}
          <div className="lg:col-span-4 space-y-4 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto pr-6 custom-scrollbar lg:sticky lg:top-32">
            {TREATMENTS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(t.id);
                }}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group ${
                  selectedId === t.id 
                    ? "border-teal-600 bg-teal-50/50 shadow-lg shadow-teal-600/5" 
                    : "border-slate-100 hover:border-teal-200 hover:bg-slate-50"
                }`}
              >
                <div className="space-y-1">
                  <div className={`font-bold transition-colors ${selectedId === t.id ? "text-teal-700" : "text-slate-900"}`}>
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500">Learn about the procedure</div>
                </div>
                <ArrowRight className={`w-5 h-5 transition-transform ${selectedId === t.id ? "text-teal-600 translate-x-1" : "text-slate-300 group-hover:translate-x-1"}`} />
              </button>
            ))}
          </div>

          {/* Detailed View */}
          <div id="treatment-detail" className="lg:col-span-8 lg:sticky lg:top-32 min-h-[600px] scroll-mt-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100"
              >
                <div className={activeTreatment.id === 'glp1' || activeTreatment.id === 'trt' ? "space-y-12" : "grid md:grid-cols-2 gap-12"}>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50">Treatment Overview</Badge>
                      <h4 className="text-3xl font-bold text-slate-900">{activeTreatment.name}</h4>
                      <p className="text-slate-600 leading-relaxed">
                        {activeTreatment.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm font-bold text-slate-900 uppercase tracking-wider">Key Benefits</div>
                      <div className="grid gap-3">
                        {activeTreatment.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-3 text-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                            <span className="text-sm font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <TreatmentDetailDialog 
                      treatment={activeTreatment}
                      trigger={
                        <button className="flex items-center gap-2 text-teal-600 font-bold hover:gap-3 transition-all">
                          View full clinical details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      }
                    />

                    {activeTreatment.id === 'peptides' && (
                      <div className="pt-4">
                        <Button 
                          variant="outline"
                          className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white rounded-xl font-bold"
                          onClick={() => document.getElementById('peptides-detail')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          Explore Specific Formulas
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    {activeTreatment.id === 'glp1' || activeTreatment.id === 'trt' ? (
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                          <h5 className="font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-teal-600" />
                            {activeTreatment.id === 'glp1' ? 'Joint Load Assessment' : 'Hormonal Foundation'}
                          </h5>
                          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            {activeTreatment.id === 'glp1' 
                              ? 'Reducing body mass is one of the most effective ways to decompress joints and improve regenerative outcomes.' 
                              : 'Optimizing testosterone levels is critical for muscle preservation and effective post-injury rehabilitation.'}
                          </p>
                          <Button 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl"
                            onClick={() => {
                              const targetId = activeTreatment.id === 'glp1' ? 'metabolic' : 'anabolic';
                              document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Explore {activeTreatment.id === 'glp1' ? 'Metabolic' : 'Anabolic'} Section
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                        {activeTreatment.id === 'glp1' && (
                          <div className="bg-teal-600 p-6 rounded-2xl text-white shadow-lg shadow-teal-600/20">
                            <h6 className="font-bold text-sm uppercase tracking-wider mb-2">Did you know?</h6>
                            <p className="text-xs text-teal-50 opacity-90 leading-relaxed">
                              Losing just 10% of your body weight can reduce joint pain by up to 50% in many osteoarthritis patients.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl cursor-pointer">
                          <img 
                            src={`https://picsum.photos/seed/${activeTreatment.id}/600/800`} 
                            alt={activeTreatment.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                              <PlayCircle className="w-8 h-8 text-teal-600" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute -bottom-4 -left-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-slate-100 text-center">
                          <div className="text-xs font-bold text-slate-900">Watch Explainer Animation</div>
                          <div className="text-[10px] text-slate-500">See how {activeTreatment.name} works in the body</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
