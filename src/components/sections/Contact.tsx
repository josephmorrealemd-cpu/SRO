import { MapPin, Phone, Printer, Mail, Clock, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import * as React from "react";
import { useState } from "react";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const messageData = {
      name: `${formData.get("first-name")} ${formData.get("last-name")}`,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "contact_messages"), messageData);
      
      toast.success("Message Sent!", {
        description: "Our team will get back to you shortly.",
      });
      
      e.currentTarget.reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "contact_messages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-teal-900 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-12 lg:p-20 space-y-12 text-white">
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest">Get In Touch</h2>
                <h3 className="text-4xl font-bold tracking-tight">Visit Our Westminster Office</h3>
                <p className="text-teal-100/70 leading-relaxed">
                  We are conveniently located in Westminster, serving the greater Denver metro area. Reach out today to start your journey back to health.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-teal-800 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Our Address</div>
                    <p className="text-teal-100/70">8753 Yates Drive, Suite 110<br />Westminster, CO 80031</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-teal-800 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Phone & Fax</div>
                    <p className="text-teal-100/70">Phone: 720-776-9165</p>
                    <p className="text-teal-100/70">Fax: 720-915-2817</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-teal-800 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Office Hours</div>
                    <p className="text-teal-100/70">Mon - Thu: 8:00 AM - 5:00 PM</p>
                    <p className="text-teal-100/70">Friday: 8:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 lg:p-20">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" name="first-name" placeholder="John" required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" name="last-name" placeholder="Doe" required className="h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="720-000-0000" required className="h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">How can we help?</Label>
                  <textarea 
                    id="message" 
                    name="message"
                    required
                    className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="Tell us about your condition..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-600/20 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {loading ? "Sending..." : "Send Message"}
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  By submitting this form, you agree to our privacy policy and HIPAA compliance standards.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
