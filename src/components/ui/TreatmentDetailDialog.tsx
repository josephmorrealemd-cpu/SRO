import * as React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Treatment } from "@/types";
import { CheckCircle2, Info, Activity, DollarSign, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TreatmentDetailDialogProps {
  treatment: Treatment;
  trigger: React.ReactElement;
}

export function TreatmentDetailDialog({ treatment, trigger }: TreatmentDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50">Clinical Details</Badge>
          </div>
          <DialogTitle className="text-3xl font-bold text-slate-900">{treatment.name}</DialogTitle>
          <DialogDescription className="text-slate-500 text-base">
            Comprehensive clinical overview and pricing information for {treatment.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Science Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              The Science
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {treatment.clinicalDetails || "Our clinical protocols for " + treatment.name + " are designed to maximize regenerative potential using evidence-based approaches. This treatment targets specific cellular pathways to facilitate tissue repair and reduce chronic inflammation."}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Key Benefits
              </h4>
              <ul className="space-y-2">
                {treatment.benefits.map((benefit, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-600" />
                Recovery Timeline
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Initial Phase</p>
                  <p className="text-xs text-slate-700">1-3 days: Reduced activity</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Healing Phase</p>
                  <p className="text-xs text-slate-700">2-6 weeks: Tissue regeneration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section - Placeholder */}
          <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100 space-y-4">
            <h4 className="text-sm font-bold text-teal-900 uppercase tracking-widest flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pricing & Investment
            </h4>
            <div className="space-y-2">
              {treatment.pricingInfo ? (
                <p className="text-sm text-teal-800 leading-relaxed">{treatment.pricingInfo}</p>
              ) : (
                <>
                  <p className="text-sm text-teal-800 font-medium">Pricing for {treatment.name} varies based on the specific protocol and area being treated.</p>
                  <p className="text-xs text-teal-700">Please share your pricing details, and I will update this section with the exact figures for each treatment.</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <FileText className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] text-slate-500">
              Clinical data is based on current regenerative medicine standards. Individual results may vary.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
