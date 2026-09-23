import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, FileText, Phone, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-4">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            Patient Privacy & Data Protection
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Privacy Policy & HIPAA Notice
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl">
            How Summit Regenerative Orthopedics collects, protects, uses, and safeguards your personal and medical information.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <span><strong>Effective Date:</strong> September 2026</span>
            <span><strong>Location:</strong> Westminster, Colorado</span>
            <span><strong>Practice:</strong> Summit Regenerative Orthopedics</span>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xs space-y-10">
          {/* Section 1: Overview & HIPAA */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-teal-600" />
              1. Commitment to Patient Privacy & HIPAA
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Summit Regenerative Orthopedics (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to safeguarding your privacy and ensuring the confidentiality of your health data. When you submit information through our website, pain evaluation quizzes, educational guide downloads, or appointment request forms, your data is handled in accordance with applicable state and federal health privacy regulations, including the Health Insurance Portability and Accountability Act of 1996 (HIPAA).
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-teal-600" />
              2. Information We Collect
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We may collect personal and inquiry-related information when you interact with our website:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Direct Contact Information</h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Full Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Preferred appointment dates and times</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Clinical Inquiry Details</h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Joint of concern (knee, shoulder, hip, spine, etc.)</li>
                  <li>Pain severity, duration, and prior surgical history</li>
                  <li>Diagnostic imaging availability (MRI, X-Ray)</li>
                  <li>Questions regarding PRP, Wharton&apos;s Jelly, or Exosome therapies</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              <em>Note:</em> We also automatically log standard website telemetry (such as browser type, general geographical region, and page interactions) to ensure optimal performance and security.
            </p>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              3. How We Use Your Information
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We use information collected strictly for clinical practice and patient service operations:
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></span>
                <span><strong>Consultation & Scheduling:</strong> To schedule initial consultations, follow-up calls, and review preliminary candidacy with our orthopedic physicians.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></span>
                <span><strong>Educational Materials:</strong> To deliver requested digital guides (e.g., Regenerative Orthopedics 101, PRP protocols, recovery timelines).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></span>
                <span><strong>Care Coordination:</strong> To send appointment confirmations, clinic directions, and preparation instructions before your visit.</span>
              </li>
            </ul>
          </section>

          {/* Section 4: Non-Disclosure & Data Sharing */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              4. We Do Not Sell Your Information
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Summit Regenerative Orthopedics does <strong>not sell, rent, license, or monetize your personal information or contact details</strong> to third-party marketing firms or data brokers.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We may only share information with trusted, HIPAA-compliant service providers (such as encrypted medical communications, cloud database hosting, or clinical SMS notification systems) bound by Business Associate Agreements (BAAs) to support our patient operations.
            </p>
          </section>

          {/* Section 5: Text Messages & Communications */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              5. SMS / Text Messaging Policy
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you provide your mobile telephone number and opt in to receiving appointment reminders or clinical messages, message and data rates may apply. You may reply <strong>STOP</strong> at any time to opt out of SMS communications, or reply <strong>HELP</strong> for additional support.
            </p>
          </section>

          {/* Section 6: Security Safeguards */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              6. Security Safeguards
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We employ administrative, technical, and physical safeguards designed to protect personal and medical data against unauthorized access, loss, or alteration. All web communications utilize TLS/SSL encryption in transit.
            </p>
          </section>

          {/* Section 7: Contact Us */}
          <section className="pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              7. Privacy Questions & Requests
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              If you have questions regarding this Privacy Policy, wish to update your contact preferences, or request deletion of inquiry records, please contact our administrative team:
            </p>
            <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              <div>
                <p className="font-bold text-slate-900 text-sm">Summit Regenerative Orthopedics</p>
                <p className="text-xs text-slate-600">8753 Yates Drive, Suite 110, Westminster, CO 80031</p>
                <p className="text-xs text-slate-600 mt-1">Phone: 720-776-9165 | Fax: 720-915-2817</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a
                  href="tel:7207769165"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Office
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  Contact Form
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
