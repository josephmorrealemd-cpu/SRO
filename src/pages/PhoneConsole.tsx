import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "@/lib/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Calendar, 
  Trash2, 
  Search as SearchIcon,
  ExternalLink,
  Send,
  Printer,
  Download,
  FileText,
  BarChart3,
  Activity,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw,
  Phone,
  Home
} from "lucide-react";
import { toast } from "sonner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { format, subDays, isSameDay } from "date-fns";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  type: string;
  status: "pending" | "confirmed" | "cancelled";
  reportName?: string;
  reportUrl?: string;
  createdAt: any;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
  direction?: string;
  smsSid?: string;
  createdAt: any;
}

interface QuizLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  joint: string;
  recommendations?: any;
  createdAt: any;
}

interface GuideLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  jointConcern: string;
  createdAt: any;
}

interface CallLogItem {
  id: string;
  callSid: string;
  callerPhone: string;
  callerName: string;
  status: string;
  voicemailUrl?: string;
  voicemailDuration?: number;
  transcript?: any[];
  aiSummary?: string;
  createdAt: any;
}

interface AnalyticsEvent {
  id: string;
  type: string;
  page: string;
  sessionId: string;
  createdAt: any;
}

interface ActiveSession {
  id: string;
  sessionId: string;
  lastActive: any;
  page: string;
}

export const formatSafeDate = (val: any): string => {
  if (!val) return "Recent";
  try {
    if (val && typeof val.toDate === "function") {
      return val.toDate().toLocaleString();
    }
    if (val && val.seconds) {
      return new Date(val.seconds * 1000).toLocaleString();
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString();
    }
  } catch (e) {}
  return "Recent";
};

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [quizLeads, setQuizLeads] = useState<QuizLead[]>([]);
  const [guideLeads, setGuideLeads] = useState<GuideLead[]>([]);
  const [callLogs, setCallLogs] = useState<CallLogItem[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [bookingSearch, setBookingSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [guideSearch, setGuideSearch] = useState("");
  const [quizSearch, setQuizSearch] = useState("");
  const [activeTab, setActiveTab] = useState("guides");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null);
  
  // Hologram State
  const [currentHologram, setCurrentHologram] = useState<{ url: string, lastUpdated: any, lastAttempt: any } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = (data: Booking | ContactMessage, type: 'booking' | 'message') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const title = type === 'booking' ? 'Appointment Request' : 'Contact Message';
    const content = type === 'booking' 
      ? `
        <div style="font-family: sans-serif; padding: 40px; color: #0f172a;">
          <h1 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">${title}</h1>
          <div style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p><strong>Patient Name:</strong> ${(data as Booking).name}</p>
              <p><strong>Email:</strong> ${(data as Booking).email}</p>
              <p><strong>Phone:</strong> ${(data as Booking).phone}</p>
            </div>
            <div>
              <p><strong>Preferred Date:</strong> ${(data as Booking).date}</p>
              <p><strong>Treatment Type:</strong> ${(data as Booking).type}</p>
              <p><strong>Status:</strong> ${(data as Booking).status}</p>
            </div>
          </div>
          <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <p><strong>Submitted On:</strong> ${formatSafeDate((data as Booking).createdAt)}</p>
            <p><strong>File Attached:</strong> ${(data as Booking).reportName || 'None'}</p>
          </div>
          <div style="margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px;">
            Summit Regenerative Orthopedics - Clinical Record
          </div>
        </div>
      `
      : `
        <div style="font-family: sans-serif; padding: 40px; color: #0f172a;">
          <h1 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">${title}</h1>
          <div style="margin-top: 30px;">
            <p><strong>Sender:</strong> ${(data as ContactMessage).name}</p>
            <p><strong>Email:</strong> ${(data as ContactMessage).email}</p>
            <p><strong>Phone:</strong> ${(data as ContactMessage).phone || 'N/A'}</p>
            <p><strong>Channel:</strong> ${(data as ContactMessage).source || 'Web Form'}</p>
            <p><strong>Sent On:</strong> ${formatSafeDate((data as ContactMessage).createdAt)}</p>
          </div>
          <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 10px; min-height: 200px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${(data as ContactMessage).message}</p>
          </div>
          <div style="margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px;">
            Summit Regenerative Orthopedics - Contact Record
          </div>
        </div>
      `;

    printWindow.document.write(`
      <html>
        <head><title>Print ${title}</title></head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    console.log("AdminDashboard auth state tracker mounted. Registering onAuthStateChanged...");
    
    // Safety timer to prevent permanent "Loading dashboard..." hang
    const timer = setTimeout(() => {
      setLoading((currLoading) => {
        if (currLoading) {
          console.warn("Firebase onAuthStateChanged did not trigger within 4 seconds. Forcing loading to false as safety fallback.");
          return false;
        }
        return currLoading;
      });
    }, 4000);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log("onAuthStateChanged callback triggered. User details:", u ? { email: u.email, uid: u.uid } : "No active session");
      setUser(u);
      if (u) {
        const adminCheck = u.email === "team@watch1do1.com" || u.email === "josephmorrealemd@gmail.com";
        console.log(`Checking admin privileges for ${u.email}: ${adminCheck ? "ADMIN" : "NOT ADMIN"}`);
        setIsAdmin(adminCheck);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
      clearTimeout(timer);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const fetchAllData = async () => {
    // 1. Fetch from server-side unified inbox endpoint if available
    try {
      const res = await fetch("/api/admin/inbox");
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data.messages)) setMessages(data.messages);
        if (Array.isArray(data.bookings)) setBookings(data.bookings);
        if (Array.isArray(data.quizResults)) setQuizLeads(data.quizResults);
        if (Array.isArray(data.guideDownloads)) setGuideLeads(data.guideDownloads);
        if (Array.isArray(data.calls)) setCallLogs(data.calls);
      }
    } catch {
      // Backend not running on static host (e.g. Netlify) - fallback to Firestore directly
    }

    // 2. Client-side Firestore collection fetching with independent safety blocks
    try {
      const { getDocs, collection, doc, getDoc } = await import("firebase/firestore");
      
      try {
        const mSnapshot = await getDocs(collection(db, "contact_messages"));
        const mList = mSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
        mList.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setMessages(mList);
      } catch (e) {
        console.error("Messages fetch error:", e);
      }

      try {
        const bSnapshot = await getDocs(collection(db, "bookings"));
        const bList = bSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
        bList.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setBookings(bList);
      } catch (e) {
        console.error("Bookings fetch error:", e);
      }

      try {
        const qSnapshot = await getDocs(collection(db, "pain_quiz_results"));
        const qList = qSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as QuizLead));
        qList.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setQuizLeads(qList);
      } catch (e) {}

      try {
        const gSnapshot = await getDocs(collection(db, "guide_downloads"));
        const gList = gSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as GuideLead));
        gList.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setGuideLeads(gList);
      } catch (e) {}

      try {
        const cSnapshot = await getDocs(collection(db, "calls"));
        const cList = cSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as CallLogItem));
        cList.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setCallLogs(cList);
      } catch (e) {}

      try {
        const eSnapshot = await getDocs(collection(db, "analytics_events"));
        setEvents(eSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as AnalyticsEvent)));
      } catch (e) {}

      try {
        const sSnapshot = await getDocs(collection(db, "active_sessions"));
        setActiveSessions(sSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActiveSession)));
      } catch (e) {}

      try {
        const hSnapshot = await getDoc(doc(db, "app_state", "hologram"));
        if (hSnapshot.exists()) {
          const data = hSnapshot.data();
          setCurrentHologram({
            url: data.hologramUrl,
            lastUpdated: data.lastHologramUpdate,
            lastAttempt: data.lastAttemptAt
          });
        }
      } catch (e) {}
    } catch (error) {
      console.error("Admin data fetch error:", error);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    fetchAllData();
    // Auto-refresh every 20 seconds
    const interval = setInterval(fetchAllData, 20000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleSyncCommunications = async () => {
    setIsSyncing(true);
    let twilioSynced = false;
    try {
      // 1. Attempt Twilio sync if a backend server is active
      try {
        const res = await fetch("/api/twilio/sync", { method: "POST" });
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success) {
            twilioSynced = true;
          }
        }
      } catch {
        // Backend not available on static hosting (Netlify) - continue with direct database sync
      }

      // 2. Fetch directly from Firestore database
      await fetchAllData();

      if (twilioSynced) {
        toast.success("Synchronized Communications", {
          description: "Synced latest SMS & voicemails from Twilio, plus website inquiries."
        });
      } else {
        toast.success("Database Refreshed", {
          description: "Loaded latest website messages, consultation bookings, and quiz leads."
        });
      }
    } catch (err: any) {
      console.error("Sync error:", err);
      toast.error("Failed to refresh", {
        description: err.message
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      window.location.href = "/";
    } catch (e) {
      window.location.href = "/";
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    const { type, id } = deleteConfirm;
    try {
      await deleteDoc(doc(db, type, id));
      if (type === "bookings") {
        setBookings(prev => prev.filter(b => b.id !== id));
      } else if (type === "contact_messages") {
        setMessages(prev => prev.filter(m => m.id !== id));
      } else if (type === "pain_quiz_results") {
        setQuizLeads(prev => prev.filter(q => q.id !== id));
      } else if (type === "guide_downloads") {
        setGuideLeads(prev => prev.filter(g => g.id !== id));
      } else if (type === "calls") {
        setCallLogs(prev => prev.filter(c => c.id !== id));
      }
      toast.success("Record deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, type);
      toast.error("Failed to delete record");
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "bookings");
      toast.error("Failed to update status");
    }
  };

  const generateHologram = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-hologram", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate hologram");
      }

      const { imageUrl } = await response.json();

      if (imageUrl) {
        try {
          const { setDoc } = await import("firebase/firestore");
          await setDoc(doc(db, "app_state", "hologram"), {
            hologramUrl: imageUrl,
            lastHologramUpdate: serverTimestamp()
          }, { merge: true });
          
          setCurrentHologram(prev => ({
            ...prev!,
            url: imageUrl,
            lastUpdated: Timestamp.now()
          }));
          
          toast.success("Daily hologram updated successfully");
        } catch (dbError) {
          console.error("Error saving to Firestore:", dbError);
          toast.error("Hologram generated but failed to save to database.");
        }
      } else {
        toast.error("AI failed to return an image.");
      }
    } catch (error: any) {
      console.error("Failed to generate hologram:", error);
      if (error?.message?.includes("429") || error?.message?.includes("quota")) {
        toast.error("AI Quota exceeded.");
      } else {
        toast.error("AI Generation failed.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.email.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.phone.includes(bookingSearch)
  );

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
    (m.phone && m.phone.includes(messageSearch))
  );

  const filteredGuideLeads = guideLeads.filter(g => 
    (g.name || "").toLowerCase().includes(guideSearch.toLowerCase()) ||
    (g.email || "").toLowerCase().includes(guideSearch.toLowerCase()) ||
    (g.phone || "").includes(guideSearch) ||
    (g.jointConcern || "").toLowerCase().includes(guideSearch.toLowerCase())
  );

  const filteredQuizLeads = quizLeads.filter(q => 
    (q.name || "").toLowerCase().includes(quizSearch.toLowerCase()) ||
    (q.email || "").toLowerCase().includes(quizSearch.toLowerCase()) ||
    (q.phone || "").includes(quizSearch) ||
    (q.joint || "").toLowerCase().includes(quizSearch.toLowerCase())
  );

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "guides": return "Search guide downloads (name, email, joint)...";
      case "quiz": return "Search quiz assessments...";
      case "bookings": return "Search bookings...";
      case "messages": return "Search messages...";
      case "calls": return "Search calls...";
      default: return `Search ${activeTab}...`;
    }
  };

  const getSearchValue = () => {
    switch (activeTab) {
      case "guides": return guideSearch;
      case "quiz": return quizSearch;
      case "bookings": return bookingSearch;
      case "messages": return messageSearch;
      case "leads": return guideSearch || quizSearch;
      default: return "";
    }
  };

  const handleSearchChange = (val: string) => {
    switch (activeTab) {
      case "guides": setGuideSearch(val); break;
      case "quiz": setQuizSearch(val); break;
      case "bookings": setBookingSearch(val); break;
      case "messages": setMessageSearch(val); break;
      case "leads": setGuideSearch(val); setQuizSearch(val); break;
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full rounded-3xl shadow-xl border-slate-200">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <p className="text-slate-500 text-sm">Please sign in to access the dashboard.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleLogin} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold">
              <LogIn className="w-4 h-4 mr-2" />
              Sign in with Google
            </Button>
            <Button variant="ghost" className="w-full text-slate-500" onClick={() => window.location.href = "/"}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Back to Website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full rounded-3xl shadow-xl border-slate-200">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
            <p className="text-slate-500 text-sm">You do not have administrative privileges.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-center text-slate-400">Logged in as: {user.email}</p>
            <Button onClick={handleLogout} variant="outline" className="w-full rounded-xl h-12 font-bold">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <Button variant="ghost" className="w-full text-slate-500" onClick={() => window.location.href = "/"}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Back to Website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            <span className="font-bold text-slate-900">Admin Dashboard</span>
            {activeSessions.filter(s => {
              const lastActive = s.lastActive?.toDate ? s.lastActive.toDate() : (s.lastActive?.seconds ? new Date(s.lastActive.seconds * 1000) : null);
              return lastActive && (new Date().getTime() - lastActive.getTime()) < 120000;
            }).length > 0 && (
              <Badge className="ml-2 bg-teal-500 text-white animate-pulse border-none h-5 px-1.5 text-[10px]">
                LIVE
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="default" 
              size="sm" 
              disabled={isSyncing}
              className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1.5 text-xs"
              onClick={handleSyncCommunications}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync Messages"}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-lg text-slate-700 hover:text-slate-900 border-slate-200 flex items-center gap-1.5 text-xs" 
              onClick={() => window.location.href = "/"}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-lg border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 hidden md:flex font-semibold text-xs" 
              onClick={() => window.location.href = "/admin/phone"}
            >
              <Phone className="w-3.5 h-3.5 mr-1" />
              Phone
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              size="sm" 
              className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1.5 text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card 
            className={`rounded-2xl border transition-all cursor-pointer hover:shadow-md ${activeTab === "guides" ? "border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/20" : "border-slate-200 hover:border-sky-300"}`}
            onClick={() => setActiveTab("guides")}
          >
            <CardContent className="p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider truncate">Guide Downloads</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-slate-900">{guideLeads.length}</p>
                  <span className="text-[11px] text-sky-600 font-medium">101 Guide</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`rounded-2xl border transition-all cursor-pointer hover:shadow-md ${activeTab === "quiz" ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20" : "border-slate-200 hover:border-teal-300"}`}
            onClick={() => setActiveTab("quiz")}
          >
            <CardContent className="p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider truncate">Pain Quiz Leads</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-slate-900">{quizLeads.length}</p>
                  <span className="text-[11px] text-teal-600 font-medium">Assessed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`rounded-2xl border transition-all cursor-pointer hover:shadow-md ${activeTab === "messages" ? "border-slate-900 ring-2 ring-slate-900/10 bg-slate-50/50" : "border-slate-200 hover:border-slate-300"}`}
            onClick={() => setActiveTab("messages")}
          >
            <CardContent className="p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider truncate">Messages & SMS</p>
                <p className="text-2xl font-bold text-slate-900">{messages.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`rounded-2xl border transition-all cursor-pointer hover:shadow-md ${activeTab === "bookings" ? "border-slate-900 ring-2 ring-slate-900/10 bg-slate-50/50" : "border-slate-200 hover:border-slate-300"}`}
            onClick={() => setActiveTab("bookings")}
          >
            <CardContent className="p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider truncate">Bookings</p>
                <p className="text-2xl font-bold text-slate-900">{bookings.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider truncate">Total Unique Leads</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set([
                    ...bookings.map(b => b.email), 
                    ...messages.map(m => m.email),
                    ...quizLeads.map(q => q.email),
                    ...guideLeads.map(g => g.email)
                  ].filter(Boolean)).size}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1.5 shadow-xs">
              <TabsTrigger 
                value="guides" 
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sky-600 data-[state=active]:text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Guide Downloads ({guideLeads.length})
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Messages ({messages.length})
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger 
                value="quiz" 
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-teal-700 data-[state=active]:text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Pain Quiz ({quizLeads.length})
              </TabsTrigger>
              <TabsTrigger 
                value="calls" 
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                Calls ({callLogs.length})
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Activity className="w-3.5 h-3.5" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="hologram" 
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Hologram
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder={getSearchPlaceholder()} 
                className="pl-10 rounded-xl border-slate-200 bg-white"
                value={getSearchValue()}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="bookings">
            <Card className="rounded-2xl border-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Preferred Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-20 text-slate-400">No bookings found</TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="text-xs text-slate-500">
                          {formatSafeDate(b.createdAt)}
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">{b.name}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span>{b.email}</span>
                            <span className="text-slate-500 text-xs">{b.phone}</span>
                            {b.reportName && b.reportName !== "No file uploaded" && (
                              <span className="text-teal-600 text-[10px] font-bold mt-1 flex items-center">
                                <Send className="w-2 h-2 mr-1" />
                                File: {b.reportName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-full border-teal-200 bg-teal-50 text-teal-700">
                            {b.date}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">{b.type}</TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={b.status || "pending"} 
                            onValueChange={(val) => handleStatusChange(b.id, val)}
                          >
                            <SelectTrigger className={`h-8 w-32 rounded-lg text-xs font-medium ${
                              b.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              b.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                              "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {b.reportUrl && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg"
                                onClick={() => window.open(b.reportUrl, '_blank')}
                                title="View/Download File"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                              onClick={() => handlePrint(b, 'booking')}
                              title="Print to PDF"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              onClick={() => setDeleteConfirm({ type: "bookings", id: b.id })}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="rounded-2xl border-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Date Sent</TableHead>
                    <TableHead>Sender & Channel</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message Preview</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                          <MessageSquare className="w-8 h-8 text-slate-300" />
                          <p className="text-sm font-medium">No messages found</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleSyncCommunications}
                            disabled={isSyncing}
                            className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                            Sync Messages from Twilio
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                          {formatSafeDate(m.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-slate-900">{m.name}</span>
                            <div className="flex items-center gap-1.5">
                              {m.source === "sms" ? (
                                <Badge variant="outline" className="rounded-md border-blue-200 bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0 font-bold uppercase">
                                  SMS
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="rounded-md border-teal-200 bg-teal-50 text-teal-700 text-[10px] px-1.5 py-0 font-bold uppercase">
                                  Web Form
                                </Badge>
                              )}
                              {m.direction && (
                                <span className="text-[10px] text-slate-400 lowercase">{m.direction}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span>{m.email}</span>
                            {m.phone && <span className="text-slate-500 text-xs font-mono">{m.phone}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm text-slate-600 line-clamp-2">{m.message}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                              onClick={() => handlePrint(m, 'message')}
                              title="Print to PDF"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                              onClick={() => setSelectedMessage(m)}
                              title="View full message"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              onClick={() => setDeleteConfirm({ type: "contact_messages", id: m.id })}
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Dedicated Guide Downloads Tab */}
          <TabsContent value="guides">
            <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-xs">
              <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-4 px-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shadow-xs">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                      Free Guide Downloads ({filteredGuideLeads.length})
                    </CardTitle>
                    <p className="text-xs text-slate-500">Patients who requested regenerative medicine PDF guides</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700 font-semibold px-2.5 py-0.5">
                  Regenerative 101 & Guides
                </Badge>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-44">Date & Time</TableHead>
                      <TableHead className="w-48">Patient Name</TableHead>
                      <TableHead className="w-60">Email & Phone</TableHead>
                      <TableHead className="w-44">Joint of Concern</TableHead>
                      <TableHead className="text-right w-32 pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuideLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-16 text-slate-400">
                          <div className="max-w-xs mx-auto space-y-2 text-center">
                            <Download className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                            <p className="font-medium text-slate-600">No guide downloads found</p>
                            <p className="text-xs text-slate-400">
                              {guideSearch ? "No downloads matched your search criteria." : "When patients download the free guide on your website, their contact details and a delete button will appear here."}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredGuideLeads.map((g) => (
                        <TableRow key={g.id} className="hover:bg-slate-50/80 transition-colors">
                          <TableCell className="text-xs text-slate-600 whitespace-nowrap font-medium">
                            {formatSafeDate(g.createdAt)}
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">{g.name}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-800">{g.email}</span>
                              <span className="text-slate-500 text-xs font-mono">{g.phone || "No phone provided"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 font-medium">
                              {g.jointConcern || "General Orthopedic"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-200 bg-red-50/80 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300 rounded-xl h-8 px-3 font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                              onClick={() => setDeleteConfirm({ type: "guide_downloads", id: g.id })}
                              title="Delete this guide download"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              <span>Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Dedicated Pain Quiz Tab */}
          <TabsContent value="quiz">
            <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-xs">
              <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-4 px-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                      Pain Quiz Assessments ({filteredQuizLeads.length})
                    </CardTitle>
                    <p className="text-xs text-slate-500">Patients who completed the interactive candidacy evaluation</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700 font-semibold px-2.5 py-0.5">
                  High Intent Candidates
                </Badge>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-44">Date</TableHead>
                      <TableHead className="w-48">Patient</TableHead>
                      <TableHead className="w-60">Contact</TableHead>
                      <TableHead className="w-40">Joint / Injury</TableHead>
                      <TableHead>Recommendations</TableHead>
                      <TableHead className="text-right w-32 pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuizLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                          <div className="max-w-xs mx-auto space-y-2 text-center">
                            <Sparkles className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                            <p className="font-medium text-slate-600">No quiz submissions found</p>
                            <p className="text-xs text-slate-400">
                              {quizSearch ? "No submissions matched your search criteria." : "When patients complete the quiz, their results and delete button will appear here."}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuizLeads.map((q) => (
                        <TableRow key={q.id} className="hover:bg-slate-50/80 transition-colors">
                          <TableCell className="text-xs text-slate-600 whitespace-nowrap font-medium">
                            {formatSafeDate(q.createdAt)}
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">{q.name}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-800">{q.email}</span>
                              <span className="text-slate-500 text-xs font-mono">{q.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-teal-50 text-teal-800 border-teal-200 font-medium">
                              {q.joint}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {Array.isArray(q.recommendations) 
                              ? q.recommendations.map((r: any) => r.title || r).join(", ")
                              : "Wharton's Jelly, Exosomes, PRP"}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-200 bg-red-50/80 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300 rounded-xl h-8 px-3 font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                              onClick={() => setDeleteConfirm({ type: "pain_quiz_results", id: q.id })}
                              title="Delete quiz submission"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              <span>Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Leads Tab: Pain Quiz and Guide Downloads */}
          <TabsContent value="leads">
            <div className="space-y-6">
              {/* Pain Quiz Submissions */}
              <Card className="rounded-2xl border-slate-200 overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      Pain Quiz Assessments ({quizLeads.length})
                    </CardTitle>
                    <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700">
                      High Intent
                    </Badge>
                  </div>
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Joint / Injury</TableHead>
                      <TableHead>Biologic Recommendations</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                          No quiz submissions recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      quizLeads.map((q) => (
                        <TableRow key={q.id}>
                          <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                            {formatSafeDate(q.createdAt)}
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">{q.name}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex flex-col">
                              <span>{q.email}</span>
                              <span className="text-slate-500 text-xs font-mono">{q.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-teal-50 text-teal-800 border-teal-200">
                              {q.joint}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {Array.isArray(q.recommendations) 
                              ? q.recommendations.map((r: any) => r.title || r).join(", ")
                              : "Wharton's Jelly, Exosomes, PRP"}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300 rounded-xl h-8 px-3 font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                              onClick={() => setDeleteConfirm({ type: "pain_quiz_results", id: q.id })}
                              title="Delete quiz submission"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              <span>Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>

              {/* Free Guide Downloads */}
              <Card className="rounded-2xl border-slate-200 overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Download className="w-4 h-4 text-sky-600" />
                      Free Guide Downloads ({guideLeads.length})
                    </CardTitle>
                    <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                      Regenerative 101
                    </Badge>
                  </div>
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email & Phone</TableHead>
                      <TableHead>Joint of Concern</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guideLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                          No guide downloads recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      guideLeads.map((g) => (
                        <TableRow key={g.id}>
                          <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                            {formatSafeDate(g.createdAt)}
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">{g.name}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex flex-col">
                              <span>{g.email}</span>
                              <span className="text-slate-500 text-xs font-mono">{g.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-200 text-slate-700">
                              {g.jointConcern || "General Orthopedic"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300 rounded-xl h-8 px-3 font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                              onClick={() => setDeleteConfirm({ type: "guide_downloads", id: g.id })}
                              title="Delete guide download"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              <span>Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          {/* Calls & Voicemails Tab */}
          <TabsContent value="calls">
            <Card className="rounded-2xl border-slate-200 overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" />
                    Phone Inquiries & Voicemails ({callLogs.length})
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs rounded-xl"
                    onClick={() => window.location.href = "/admin/phone"}
                  >
                    Open Live Phone Console
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Caller</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Summary / Transcript</TableHead>
                    <TableHead className="text-right">Recording</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-slate-400">
                        No phone call or voicemail records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    callLogs.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                          {formatSafeDate(c.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{c.callerName}</span>
                            <span className="text-xs text-slate-500 font-mono">{c.callerPhone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={c.status === "completed" ? "bg-slate-100 text-slate-700" : "bg-emerald-50 text-emerald-700"}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {c.aiSummary || (c.transcript && c.transcript.length > 0 ? c.transcript[c.transcript.length - 1].text : "Call logged")}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          {c.voicemailUrl ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-lg text-xs"
                              onClick={() => window.open(c.voicemailUrl, '_blank')}
                            >
                              Play Audio
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400">No Audio</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="rounded-2xl border-slate-200 lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-teal-600" />
                      Live Traffic
                    </CardTitle>
                    <Badge className="bg-teal-500 text-white animate-pulse border-none">
                      {activeSessions.filter(s => {
                        const lastActive = s.lastActive?.toDate ? s.lastActive.toDate() : (s.lastActive?.seconds ? new Date(s.lastActive.seconds * 1000) : null);
                        return lastActive && (new Date().getTime() - lastActive.getTime()) < 120000;
                      }).length} Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeSessions
                      .filter(s => {
                        const lastActive = s.lastActive?.toDate ? s.lastActive.toDate() : (s.lastActive?.seconds ? new Date(s.lastActive.seconds * 1000) : null);
                        return lastActive && (new Date().getTime() - lastActive.getTime()) < 120000;
                      })
                      .slice(0, 5)
                      .map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                              {s.page === "/" ? "Home" : s.page.replace("/", "").charAt(0).toUpperCase() + s.page.slice(2)}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Session: {s.sessionId.slice(0, 8)}...
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-teal-600 font-medium">
                            <Clock className="w-3 h-3" />
                            Just now
                          </div>
                        </div>
                      ))}
                    {activeSessions.filter(s => {
                      const lastActive = s.lastActive?.toDate ? s.lastActive.toDate() : (s.lastActive?.seconds ? new Date(s.lastActive.seconds * 1000) : null);
                      return lastActive && (new Date().getTime() - lastActive.getTime()) < 120000;
                    }).length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-sm">
                        No active users right now
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-6 rounded-xl border-slate-200 text-slate-600"
                    onClick={() => window.open('https://analytics.google.com', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Google Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    Traffic Trend (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.from({ length: 7 }).map((_, i) => {
                      const d = subDays(new Date(), 6 - i);
                      const count = events.filter(e => {
                        const eventDate = e.createdAt?.toDate ? e.createdAt.toDate() : (e.createdAt?.seconds ? new Date(e.createdAt.seconds * 1000) : null);
                        return e.type === "page_view" && eventDate && isSameDay(eventDate, d);
                      }).length;
                      return {
                        name: format(d, "MMM dd"),
                        views: count
                      };
                    })}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontSize: '12px'
                        }} 
                      />
                      <Area type="monotone" dataKey="views" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600" />
                    Popular Pages
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical"
                      data={Object.entries(
                        events
                          .filter(e => e.type === "page_view")
                          .reduce((acc: any, e) => {
                            acc[e.page] = (acc[e.page] || 0) + 1;
                            return acc;
                          }, {})
                      ).map(([page, count]) => ({
                        name: page === "/" ? "Home" : page.replace("/", "").split("/").pop()?.replace("-", " ").toUpperCase() || page,
                        views: count
                      })).sort((a: any, b: any) => b.views - a.views).slice(0, 5)}
                      margin={{ left: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                        width={100}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }} 
                      />
                      <Bar dataKey="views" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    Conversion Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">Booking Conversion Rate</p>
                        <p className="text-xs text-slate-500">Bookings vs. Unique Sessions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-teal-600">
                          {events.length > 0 ? ((bookings.length / Math.max(1, new Set(events.map(e => e.sessionId)).size)) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-500 h-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.min(100, (bookings.length / Math.max(1, new Set(events.map(e => e.sessionId)).size)) * 100)}%` 
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                        <p className="text-[10px] uppercase font-bold text-teal-600 mb-1">Total Sessions</p>
                        <p className="text-xl font-bold text-teal-900">
                          {new Set(events.map(e => e.sessionId)).size}
                        </p>
                      </div>
                      <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                        <p className="text-[10px] uppercase font-bold text-sky-600 mb-1">Total Page Views</p>
                        <p className="text-xl font-bold text-sky-900">
                          {events.filter(e => e.type === "page_view").length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hologram">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-2xl border-slate-200 overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    Current Daily Hologram
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="aspect-[9/16] max-w-[300px] mx-auto bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-2xl">
                    {currentHologram?.url ? (
                      <img 
                        src={currentHologram.url} 
                        alt="Current Daily Hologram" 
                        className="w-full h-full object-contain opacity-90"
                        style={{
                          filter: "hue-rotate(160deg) brightness(1.2) contrast(1.1) drop-shadow(0 0 15px rgba(20, 184, 166, 0.4))"
                        }}
                      />
                    ) : (
                      <div className="text-slate-500 text-center p-8">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-sm">No hologram generated yet.</p>
                      </div>
                    )}
                    <motion.div 
                      animate={{ top: ["-10%", "110%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-teal-400/60 shadow-[0_0_20px_rgba(45,212,191,0.8)] z-10 pointer-events-none"
                    />
                  </div>

                  <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Last Successful Update:</span>
                      <span className="font-bold text-slate-900">
                        {currentHologram?.lastUpdated?.toDate ? currentHologram.lastUpdated.toDate().toLocaleString() : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Last AI Attempt:</span>
                      <span className="font-bold text-slate-900">
                        {currentHologram?.lastAttempt?.toDate ? currentHologram.lastAttempt.toDate().toLocaleString() : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Status:</span>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 h-5 text-[10px]">
                        ACTIVE
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-teal-600" />
                    Hologram Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100 space-y-4">
                    <h4 className="font-bold text-teal-900">Manual Regeneration</h4>
                    <p className="text-sm text-teal-700 leading-relaxed">
                      If the current AI-generated image is incorrect or low quality, you can manually trigger a new generation. This will update the image for all patients immediately.
                    </p>
                    <Button 
                      onClick={generateHologram}
                      disabled={isGenerating}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-teal-600/20"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating New Hologram...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Regenerate Daily Hologram
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-900">Automation Settings</h4>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">Daily Refresh</p>
                        <p className="text-xs text-slate-500">Automatically refresh at midnight</p>
                      </div>
                      <Badge className="bg-teal-500 text-white">ENABLED</Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      Note: Daily refresh is handled by the first visitor of the day to optimize API costs.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Prompt Context</h5>
                    <div className="p-4 bg-slate-900 rounded-xl text-[11px] font-mono text-teal-400/80 leading-relaxed">
                      "A high-tech, medical-grade holographic render of a FULL HUMAN BODY anatomy... futuristic, glowing teal and cyan neon lines on a dark background..."
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-slate-500">
                Are you sure you want to delete this record? This action cannot be undone and the data will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="rounded-xl px-6">
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="destructive" className="rounded-xl px-6">
                Delete Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Message Detail Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-lg rounded-3xl">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-sky-600" />
                <DialogTitle className="text-xl font-bold">Message from {selectedMessage?.name}</DialogTitle>
              </div>
              <DialogDescription className="text-slate-500">
                Sent on {formatSafeDate(selectedMessage?.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Email</p>
                  <p className="text-sm font-medium text-slate-900">{selectedMessage?.email}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Phone</p>
                  <p className="text-sm font-medium text-slate-900">{selectedMessage?.phone || "N/A"}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Message</p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedMessage?.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => selectedMessage && handlePrint(selectedMessage, 'message')} className="rounded-xl px-6">
                <Printer className="w-4 h-4 mr-2" />
                Print to PDF
              </Button>
              <Button onClick={() => setSelectedMessage(null)} className="rounded-xl px-8">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
