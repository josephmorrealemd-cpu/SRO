import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from "react-router-dom";
import { 
  Scale, 
  Ruler, 
  Info, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  RefreshCcw,
  Calculator
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BookingDialog } from "./ui/BookingDialog";

enum UnitSystem {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

type BMICategory = {
  label: string;
  min: number;
  max: number;
  color: string;
  description: string;
};

const BMI_CATEGORIES: BMICategory[] = [
  { label: 'Underweight', min: 0, max: 18.5, color: 'text-blue-400', description: 'Possible malnutrition or underlying health issues.' },
  { label: 'Normal', min: 18.5, max: 25, color: 'text-emerald-400', description: 'Healthy weight range for most adults.' },
  { label: 'Overweight', min: 25, max: 30, color: 'text-amber-400', description: 'Increased risk of health problems.' },
  { label: 'Obese', min: 30, max: 100, color: 'text-rose-400', description: 'Significant risk of chronic health conditions.' },
];

export default function BMICalculator() {
  const navigate = useNavigate();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(UnitSystem.IMPERIAL);
  
  const [weight, setWeight] = useState<string>('150');
  const [heightCm, setHeightCm] = useState<string>('175');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('9');

  const bmiInput = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;

    if (unitSystem === UnitSystem.METRIC) {
      const h = parseFloat(heightCm) / 100;
      if (!h || h <= 0) return null;
      return w / (h * h);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const hTotalInches = (ft * 12) + inch;
      if (hTotalInches <= 0) return null;
      return (w / (hTotalInches * hTotalInches)) * 703;
    }
  }, [unitSystem, weight, heightCm, heightFt, heightIn]);

  const currentCategory = useMemo(() => {
    if (bmiInput === null) return null;
    return BMI_CATEGORIES.find(c => bmiInput >= c.min && bmiInput < c.max) || BMI_CATEGORIES[3];
  }, [bmiInput]);

  const reset = () => {
    setWeight(unitSystem === UnitSystem.METRIC ? '70' : '150');
    setHeightCm('175');
    setHeightFt('5');
    setHeightIn('9');
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Calculator size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">BMI Analysis</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Precision Tool</p>
          </div>
        </div>
        
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={(e) => { e.preventDefault(); setUnitSystem(UnitSystem.METRIC); setWeight('70'); }}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${unitSystem === UnitSystem.METRIC ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Metric
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setUnitSystem(UnitSystem.IMPERIAL); setWeight('150'); }}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${unitSystem === UnitSystem.IMPERIAL ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Imperial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Inputs */}
        <div className="p-5 lg:p-6 space-y-5 lg:space-y-6 bg-slate-950/30">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Ruler size={14} className="text-teal-500" /> Height
            </label>
            
            {unitSystem === UnitSystem.METRIC ? (
              <div className="relative group">
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xl font-bold focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-white placeholder:text-slate-700"
                  placeholder="175"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-600">cm</span>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="relative flex-1 group">
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xl font-bold focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-white placeholder:text-slate-700"
                    placeholder="5"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-600">ft</span>
                </div>
                <div className="relative flex-1 group">
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xl font-bold focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-white placeholder:text-slate-700"
                    placeholder="9"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-600">in</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Scale size={14} className="text-teal-500" /> Weight
            </label>
            <div className="relative group">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xl font-bold focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all text-white placeholder:text-slate-700"
                placeholder={unitSystem === UnitSystem.METRIC ? "70" : "150"}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-600">
                {unitSystem === UnitSystem.METRIC ? 'kg' : 'lbs'}
              </span>
            </div>
          </div>

          <button 
            onClick={(e) => { e.preventDefault(); reset(); }}
            className="w-full py-4 rounded-2xl border border-dashed border-slate-800 text-slate-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:border-teal-500 hover:text-teal-500 transition-all active:scale-95"
          >
            <RefreshCcw size={16} /> Reset
          </button>
        </div>

        {/* Results */}
        <div className="p-6 lg:p-8 flex flex-col justify-center items-center relative overflow-hidden bg-slate-900 leading-tight">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <div className="h-full w-full bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>

          <AnimatePresence mode="wait">
            {bmiInput !== null ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center z-10 space-y-4 w-full"
              >
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 md:w-36 md:h-36 -rotate-90 overflow-visible" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="276"
                      animate={{ 
                        strokeDashoffset: 276 * (1 - Math.min(Math.max(bmiInput, 0), 40) / 40),
                        color: currentCategory ? (
                            currentCategory.label === 'Normal' ? '#10b981' : 
                            currentCategory.label === 'Underweight' ? '#3b82f6' : 
                            currentCategory.label === 'Overweight' ? '#f59e0b' : '#f43f5e'
                          ) : '#10b981'
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black tracking-tighter text-white">
                      {bmiInput.toFixed(1)}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">BMI</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-lg font-bold ${currentCategory?.color}`}
                  >
                    {currentCategory?.label}
                  </motion.div>
                  <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-tight px-4">
                    {currentCategory?.description}
                  </p>
                </div>

                <div className="pt-2 space-y-1.5">
                  {BMI_CATEGORIES.map((cat) => (
                    <div key={cat.label} className="flex items-center gap-2 group">
                      <div className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                        currentCategory?.label === cat.label ? 'bg-teal-500 ring-2 ring-teal-500/10' : 'bg-slate-700'
                      }`} />
                      <div className="flex-1 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider">
                        <span className={currentCategory?.label === cat.label ? 'text-white' : 'text-slate-500'}>{cat.label}</span>
                        <span className="text-slate-600">{cat.min}-{cat.max === 100 ? '40+' : cat.max}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conditional Call to Action for Obese range */}
                {bmiInput >= 30 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-2"
                  >
                    <BookingDialog 
                      title="Medical Weight Loss Consultation"
                      description="Our clinical team specializes in GLP-1 and metabolic support to reduce joint loading. Fill out the form below to get started."
                      trigger={
                        <Button 
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl h-10 text-xs shadow-lg shadow-rose-600/20 group"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-2 group-hover:animate-bounce" />
                          Get Help Now
                        </Button>
                      }
                    />
                    <p className="text-[9px] text-rose-300 mt-1 font-medium italic">BMI &gt; 30 increases joint damage risk.</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-slate-700 border border-slate-700 shadow-inner">
                  <AlertCircle size={32} strokeWidth={1} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm uppercase tracking-widest">Awaiting Data</h3>
                  <p className="text-[10px] text-slate-500 max-w-[160px] mx-auto uppercase tracking-wide">Enter stats to calculate profile</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info Bar */}
      <div className="p-6 bg-teal-500/5 border-t border-slate-700 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500 flex items-center justify-center md:justify-start gap-2">
            <Info size={14} /> Clinical Relevance
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Reducing BMI by just 10% can significantly improve joint comfort and potentially delay the need for orthopedic surgery.
          </p>
        </div>
      </div>
    </div>
  );
}
