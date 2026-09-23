import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, FileText, CheckCircle2, ShieldAlert, Phone, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-4">
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            Legal Agreement & Medical Disclaimers
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl">
            Please read these terms and clinical disclaimers carefully before using the Summit Regenerative Orthopedics website and interactive tools.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <span><strong>Last Updated:</strong> September 2026</span>
            <span><strong>Jurisdiction:</strong> State of Colorado, USA</span>
            <span><strong>Clinic:</strong> Westminster, CO</span>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xs space-y-10">
          
          {/* Critical Medical Disclaimer Callout */}
          <div className="p-6 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              IMPORTANT MEDICAL NOTICE & NO PHYSICIAN-PATIENT RELATIONSHIP
            </div>
            <p className="text-xs md:text-sm text-amber-950 leading-relaxed">
              The content published on this website—including interactive 3D anatomical models, pain candidacy quizzes, articles on Platelet-Rich Plasma (PRP), Wharton&apos;s Jelly, and Exosomes, cost comparisons, and downloadable guides—is provided strictly for general educational and informational purposes. 
            </p>
            <p className="text-xs md:text-sm text-amber-950 leading-relaxed font-semibold">
              Nothing on this website constitutes individual medical advice, clinical diagnosis, or a treatment recommendation. Use of this website does NOT establish a physician-patient relationship between you and Summit Regenerative Orthopedics or any of its physicians. A physician-patient relationship is established only upon formal in-person clinical consultation and evaluation.
            </p>
          </div>

          {/* Emergency Conditions */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              1. Medical Emergencies
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you are experiencing a medical emergency, acute trauma, severe unmanageable pain, sudden loss of limb function, chest pain, or life-threatening symptoms, <strong>do not rely on this website or wait for an online reply</strong>. Immediately call <strong>911</strong> or proceed to the nearest hospital emergency room.
            </p>
          </section>

          {/* Candidacy Quiz & Interactive Tools */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              2. Interactive Pain Quizzes & Biologics Assessment
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our website includes an interactive &quot;Avoid Surgery&quot; pain assessment tool designed to help patients understand common indications for non-surgical regenerative biologics. 
            </p>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside pl-2">
              <li>Quiz outcomes represent non-binding preliminary information only.</li>
              <li>A high suitability score does not guarantee eligibility or a specific therapeutic result.</li>
              <li>Actual clinical candidacy is determined exclusively after comprehensive physical examination, medical history review, and review of diagnostic imaging (MRI/X-Ray) with our physicians.</li>
            </ul>
          </section>

          {/* Appointments & Cancellations */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              3. Appointment Requests & Cancellations
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Online scheduling requests are tentative until confirmed directly by our clinic coordinator. If you need to reschedule or cancel an appointment, we kindly ask for at least 24 to 48 hours notice so we can offer that consultation time to another patient in need.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              4. Intellectual Property
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              All branding, text, educational articles, graphics, proprietary interactive anatomical tools, and downloadable materials are the intellectual property of Summit Regenerative Orthopedics or its licensors. You may download guides for personal, non-commercial use only.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              5. Limitation of Liability & Warranty Disclaimer
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              This website is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Summit Regenerative Orthopedics disclaims all warranties, express or implied, including fitness for a particular purpose and non-infringement. In no event shall Summit Regenerative Orthopedics be liable for damages resulting from reliance on website informational materials.
            </p>
          </section>

          {/* Governing Law */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              6. Governing Law & Jurisdiction
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              These Terms of Service are governed by and construed in accordance with the laws of the State of Colorado, without giving effect to any principles of conflicts of law. Any legal proceeding arising from these terms shall be brought exclusively in the courts of Adams County or Jefferson County, Colorado.
            </p>
          </section>

          {/* Clinic Contact */}
          <section className="pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              7. Contact Information
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              For questions regarding our terms of service, clinic policies, or treatment consultations, please reach out to our team:
            </p>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              <div>
                <p className="font-bold text-slate-900 text-sm">Summit Regenerative Orthopedics</p>
                <p className="text-xs text-slate-600">8753 Yates Drive, Suite 110, Westminster, CO 80031</p>
                <p className="text-xs text-slate-600 mt-1">Telephone: 720-776-9165 | Fax: 720-915-2817</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a
                  href="tel:7207769165"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call 720-776-9165
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Contact Page
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
