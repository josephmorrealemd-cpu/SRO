import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CONDITIONS, TREATMENTS, Condition } from "@/types";
import { Search, ChevronRight, Info, Calendar } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingDialog } from "../ui/BookingDialog";

export default function ConditionSelector() {
  const [selectedConditionId, setSelectedConditionId] = useState<string>("");
  
  const selectedCondition = CONDITIONS.find(c => c.id === selectedConditionId);
  const recommendedTreatments = TREATMENTS.filter(t => 
    selectedCondition?.recommendedTreatments.includes(t.id)
  );

  return (
    <section id="conditions" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest">Interactive Tool</h2>
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Find the Right Treatment for You</h3>
                <p className="text-slate-600 leading-relaxed">
                  Select your condition below to see which regenerative options might be best for your specific situation. This tool is for educational purposes and does not replace a clinical consultation.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-900">Where are you experiencing pain?</label>
                <Select onValueChange={setSelectedConditionId}>
                  <SelectTrigger className="w-full h-14 rounded-xl border-slate-200 bg-white shadow-sm text-lg">
                    <SelectValue placeholder="Select a condition..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-6 bg-sky-50 rounded-2xl border border-sky-100 flex gap-4">
                <Info className="w-6 h-6 text-sky-600 shrink-0" />
                <p className="text-sm text-sky-800 leading-relaxed">
                  <strong>Not sure?</strong> Our specialists can perform a comprehensive evaluation using diagnostic ultrasound to pinpoint the exact source of your pain.
                </p>
              </div>
            </div>

            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {!selectedConditionId ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-400">Select a condition to see results</h4>
                    <p className="text-sm text-slate-400 mt-2">Personalized recommendations will appear here</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-slate-900">Recommended Options</h4>
                      <Badge className="bg-teal-600">{recommendedTreatments.length} Options</Badge>
                    </div>

                    <div className="grid gap-4">
                      {recommendedTreatments.map((t, i) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="overflow-hidden border-slate-200 hover:border-teal-300 transition-colors group cursor-pointer">
                            <CardContent className="p-0 flex">
                              <div className="w-24 bg-slate-100 flex items-center justify-center">
                                <img 
                                  src={`https://picsum.photos/seed/${t.id}/200/200`} 
                                  alt={t.name}
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-1 p-5 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900">{t.name}</span>
                                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                  {t.description}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-6">
                      <BookingDialog 
                        title={`Schedule Consultation for ${selectedCondition?.name.split(' ')[0]}`}
                        trigger={
                          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Schedule Consultation for {selectedCondition?.name.split(' ')[0]}
                          </button>
                        }
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
