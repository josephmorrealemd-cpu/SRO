import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Download, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Stethoscope, 
  ArrowRight, 
  Phone, 
  Lock,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { trackEvent, getSessionId } from "@/lib/analytics";
import { triggerNurtureSequence } from "@/lib/emailClient";
import { toast } from "sonner";

export default function GuideDownload() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jointConcern, setJointConcern] = useState("Knee");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const guidePdfPath = "/downloads/regenerative-medicine-101.pdf";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        email,
        phone: phone || "Not provided",
        guideName: "Biologic Regeneration 101: Wharton's Jelly, Exosomes, and PRP",
        jointConcern,
        sessionId: getSessionId(),
        createdAt: serverTimestamp(),
      };

      // 1. Save lead to Firestore
      await addDoc(collection(db, "guide_downloads"), payload);

      // 2. Track analytics
      trackEvent(
        "guide_downloaded",
        "/guide/regenerative-medicine-101",
        payload.guideName,
        JSON.stringify({ email, jointConcern })
      );

      // 3. Trigger 3-Email Nurture Sequence
      await triggerNurtureSequence({
        email,
        name,
        source: "guide",
        jointConcern,
        templateId: "welcome_expectations",
      });

      trackEvent(
        "email_nurture_triggered",
        "/guide/regenerative-medicine-101",
        "welcome_expectations",
        JSON.stringify({ email, source: "guide" })
      );

      // 4. Trigger browser PDF download
      const link = document.createElement("a");
      link.href = guidePdfPath;
      link.download = "Biologic-Regeneration-101-Summit-Orthopedics.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloaded(true);
      toast.success("Guide Downloaded!", {
        description: "Your PDF has downloaded and a welcome email has been dispatched.",
      });
    } catch (error) {
      console.error("Error processing guide download:", error);
      handleFirestoreError(error, OperationType.WRITE, "guide_downloads");
      // Still allow download even if Firestore encounters network issue
      const link = document.createElement("a");
      link.href = guidePdfPath;
      link.download = "Biologic-Regeneration-101-Summit-Orthopedics.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloaded(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <title>Free Guide: Biologic Regeneration 101 | Summit Regenerative Orthopedics</title>
      <meta 
        name="description" 
        content="Download your free clinical guide: 'Biologic Regeneration 101: Wharton’s Jelly, Exosomes, and PRP' by Board-Certified Orthopedic Surgeon Dr. Joseph Morreale." 
      />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            Complimentary Clinical Publication
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Biologic Regeneration 101
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            A Board-Certified Orthopedic Surgeon's Guide to Wharton's Jelly, Exosomes, and PRP: How to Avoid Surgery and Restore Joint Cartilage.
          </p>
        </div>

        {/* Main Gated Content Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Guide Overview & Table of Contents */}
          <div className="lg:col-span-7 space-y-8">
            {/* Mockup Presentation Box */}
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-800/30">
              <div className="relative z-10 space-y-4">
                <span className="text-[11px] uppercase tracking-widest text-teal-400 font-bold bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30 inline-block">
                  Authored by Joseph Morreale, MD
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Why Surgery Isn't Your Only Option for Joint Wear
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Traditional orthopedics offers a binary choice: temporary cortisone shots that break down cartilage, or total joint replacement. This comprehensive guide reveals how next-generation biologics provide a proven third path.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs text-center">
                    <span className="text-xl font-bold text-teal-300 block">5</span>
                    <span className="text-[11px] text-slate-300">Clinical Chapters</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs text-center">
                    <span className="text-xl font-bold text-teal-300 block">100%</span>
                    <span className="text-[11px] text-slate-300">Evidence-Based</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs text-center col-span-2 sm:col-span-1">
                    <span className="text-xl font-bold text-teal-300 block">Free</span>
                    <span className="text-[11px] text-slate-300">Instant PDF Access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                What You'll Learn Inside This Free Guide:
              </h3>

              <div className="space-y-4">
                {[
                  {
                    num: "1",
                    title: "The Cortisone Dilemma",
                    desc: "Why repetitive steroid injections accelerate joint cartilage loss and chondrocyte apoptosis according to recent peer-reviewed studies."
                  },
                  {
                    num: "2",
                    title: "Wharton's Jelly: The Extracellular Cushion",
                    desc: "How umbilical cord allografts deliver high-molecular-weight hyaluronic acid and physical 3D matrix scaffolding for bone-on-bone joints."
                  },
                  {
                    num: "3",
                    title: "Exosomes & Athletic Cellular Signaling",
                    desc: "The science of nanovesicles delivering microRNA instructions directly to tenocytes for rapid tendon/ligament remodeling without scar tissue."
                  },
                  {
                    num: "4",
                    title: "Autologous PRP: Capabilities & Limitations",
                    desc: "When platelet-rich plasma works best (acute sprains) and why platelets alone fall short in advanced degenerative osteoarthritis."
                  },
                  {
                    num: "5",
                    title: "The Surgery-Avoidance Pathway",
                    desc: "Clinical criteria, patient outcomes, and how ultrasound-guided precision makes non-surgical recovery predictable."
                  }
                ].map((chap) => (
                  <div key={chap.num} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center shrink-0 text-sm mt-0.5">
                      {chap.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{chap.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{chap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Gated Download Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-600 shadow-xl space-y-6 sticky top-24">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {isDownloaded ? "Download Successful!" : "Get Instant Access"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isDownloaded 
                    ? "Your PDF is downloading. You can also re-download below or take our quick quiz."
                    : "Fill out the quick form below to download your copy immediately."}
                </p>
              </div>

              {!isDownloaded ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl h-11"
                    />
                    <span className="text-[10px] text-slate-400">We'll also email a backup copy directly to this address.</span>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="720-000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="joint" className="text-xs font-semibold text-slate-700">Primary Joint of Concern</Label>
                    <select
                      id="joint"
                      value={jointConcern}
                      onChange={(e) => setJointConcern(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Knee">Knee (Osteoarthritis, Meniscus)</option>
                      <option value="Shoulder">Shoulder (Rotator Cuff, Labrum)</option>
                      <option value="Hip">Hip (Joint Space Narrowing)</option>
                      <option value="Spine / Back">Spine / Lower Back</option>
                      <option value="Ankle / Foot">Ankle / Achilles / Foot</option>
                      <option value="Multiple Joints">Multiple Joints</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !name || !email}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-12 rounded-xl text-sm transition-all shadow-lg shadow-teal-600/20 active:scale-98"
                  >
                    {isSubmitting ? "Generating Download..." : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Free Guide (PDF)
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Your privacy is protected. No spam ever.</span>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 pt-2 text-center">
                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-teal-900 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                    <p className="text-sm font-bold">Your PDF Guide is on its way!</p>
                    <p className="text-xs text-teal-700">
                      If your download did not start automatically, please click below to view or save:
                    </p>
                    <a
                      href={guidePdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-xs bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Direct PDF Download Link
                    </a>
                  </div>

                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-semibold text-slate-700">
                      Ready to find out which biologic is right for your joint?
                    </p>
                    <Link
                      to="/pain-quiz"
                      className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all"
                    >
                      Take 2-Minute Pain Quiz <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Accompanying Downloads Box */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Companion Guides Also Available:
                </span>
                <div className="space-y-2 text-xs">
                  <a
                    href="/downloads/whartons-jelly-vs-prp.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-slate-700 group transition-colors"
                  >
                    <span className="font-medium">Wharton’s Jelly vs PRP Comparison</span>
                    <Download className="w-3.5 h-3.5 text-teal-600 opacity-70 group-hover:opacity-100" />
                  </a>
                  <a
                    href="/downloads/athletes-exosomes-guide.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-slate-700 group transition-colors"
                  >
                    <span className="font-medium">Why Athletes Choose Exosomes</span>
                    <Download className="w-3.5 h-3.5 text-teal-600 opacity-70 group-hover:opacity-100" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Surgeon Endorsement Footer */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center text-xl shrink-0">
              JM
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Joseph Morreale, MD</h4>
              <p className="text-xs text-slate-600">
                Board-Certified Orthopedic Surgeon specializing in non-surgical biological joint restoration.
              </p>
              <p className="text-xs text-teal-700 font-semibold mt-0.5">
                Summit Regenerative Orthopedics | Westminster, CO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/biologics-decision"
              className="text-xs font-bold text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
            >
              Compare Biologics
            </Link>
            <a
              href="tel:7207769165"
              className="text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" /> 720-776-9165
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
