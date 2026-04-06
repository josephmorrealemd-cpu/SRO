import * as React from "react";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, Send } from "lucide-react";
import { db, storage, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface BookingDialogProps {
  trigger: React.ReactElement;
  title?: string;
  description?: string;
}

export function BookingDialog({ 
  trigger, 
  title = "Book an Appointment", 
  description = "Fill out the form below and our team will contact you to confirm your consultation." 
}: BookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const date = formData.get("date") as string;
      
      let reportUrl = "";
      let reportName = "No file uploaded";

      if (selectedFile) {
        const storageRef = ref(storage, `reports/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        reportUrl = await getDownloadURL(snapshot.ref);
        reportName = selectedFile.name;
      }

      const bookingData = {
        name,
        email,
        phone,
        date,
        reportName,
        reportUrl,
        type: title,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "bookings"), bookingData);
      
      toast.success("Request Sent!", {
        description: "We'll be in touch within 24 hours to schedule your visit.",
      });
      
      setOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Booking submission error:", error);
      handleFirestoreError(error, OperationType.WRITE, "bookings");
      toast.error("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">{title}</DialogTitle>
          <DialogDescription className="text-slate-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="Phone Number" required className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Preferred Date</Label>
              <div className="relative">
                <Input id="date" name="date" type="date" required className="rounded-xl pl-10" />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="report">Upload Imaging/Reports (Optional)</Label>
              <div className="relative">
                <Input 
                  id="report" 
                  name="report" 
                  type="file" 
                  onChange={handleFileChange}
                  className="rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>
              {selectedFile && (
                <p className="text-xs text-teal-600 font-medium">Selected: {selectedFile.name}</p>
              )}
              <p className="text-[10px] text-slate-400">Supported formats: PDF, JPG, PNG, DOCX (Max 5MB)</p>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 font-bold transition-all"
            disabled={loading}
          >
            {loading ? "Sending..." : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Request Appointment
              </>
            )}
          </Button>
          <p className="text-[10px] text-center text-slate-400">
            By submitting, you agree to our HIPAA-compliant privacy standards.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
