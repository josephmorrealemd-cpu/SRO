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
  RefreshCw
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
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { format, subDays, isSameDay, startOfDay } from "date-fns";
import { GoogleGenAI } from "@google/genai";

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
  createdAt: Timestamp;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Timestamp;
}

interface AnalyticsEvent {
  id: string;
  type: string;
  page: string;
  sessionId: string;
  createdAt: Timestamp;
}

interface ActiveSession {
  id: string;
  sessionId: string;
  lastActive: Timestamp;
  page: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSearch, setBookingSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [activeTab, setActiveTab] = useState("bookings");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null);
  
  // Hologram State
  const [currentHologram, setCurrentHologram] = useState<{ url: string, lastUpdated: any } | null>(null);
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
            <p><strong>Submitted On:</strong> ${(data as Booking).createdAt?.toDate().toLocaleString()}</p>
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
            <p><strong>Sent On:</strong> ${(data as ContactMessage).createdAt?.toDate().toLocaleString()}</p>
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
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Check if user is admin (based on email or role)
        // For now, we'll check the email from the context
        setIsAdmin(u.email === "team@watch1do1.com" || u.email === "josephmorrealemd@gmail.com");
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const bQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const mQuery = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const eQuery = query(collection(db, "analytics_events"), orderBy("createdAt", "desc"));
    const sQuery = query(collection(db, "active_sessions"), orderBy("lastActive", "desc"));

    const unsubB = onSnapshot(bQuery, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "bookings"));

    const unsubM = onSnapshot(mQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "contact_messages"));

    const unsubE = onSnapshot(eQuery, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalyticsEvent)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "analytics_events"));

    const unsubS = onSnapshot(sQuery, (snapshot) => {
      setActiveSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActiveSession)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "active_sessions"));

    const unsubH = onSnapshot(doc(db, "app_state", "hologram"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCurrentHologram({
          url: data.hologramUrl,
          lastUpdated: data.lastHologramUpdate
        });
      }
    });

    return () => {
      unsubB();
      unsubM();
      unsubE();
      unsubS();
      unsubH();
    };
  }, [isAdmin]);

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
    await signOut(auth);
    toast.success("Logged out");
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    const { type, id } = deleteConfirm;
    try {
      await deleteDoc(doc(db, type, id));
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
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              text: "A high-tech, medical-grade holographic render of a FULL HUMAN BODY anatomy in a standing pose, showing the entire skeletal structure and all major joints from head to toe. CRITICAL: The visualization MUST show the full length of the body (head, torso, arms, and legs), NOT just a specific organ like a heart or a brain. The style is futuristic, glowing teal and cyan neon lines on a dark background, semi-transparent, cinematic lighting, professional medical visualization, 8k resolution.",
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
          },
        },
      });

      let newUrl = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          newUrl = `data:image/png;base64,${base64Data}`;
          break;
        }
      }

      if (newUrl) {
        // Use a try-catch for the setDoc to ensure we handle errors
        try {
          // We use setDoc with merge: true to create or update the document
          const { setDoc } = await import("firebase/firestore");
          await setDoc(doc(db, "app_state", "hologram"), {
            hologramUrl: newUrl,
            lastHologramUpdate: serverTimestamp()
          }, { merge: true });
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
        toast.error("AI Quota exceeded for today.");
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
              const lastActive = s.lastActive?.toDate();
              return lastActive && (new Date().getTime() - lastActive.getTime()) < 120000;
            }).length > 0 && (
              <Badge className="ml-2 bg-teal-500 text-white animate-pulse border-none h-5 px-1.5 text-[10px]">
                LIVE
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="rounded-lg text-slate-600 hidden md:flex" onClick={() => window.location.href = "/"}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Website
            </Button>
            <span className="text-xs text-slate-500 hidden sm:block">{user.email}</span>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="rounded-lg text-slate-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900">{bookings.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Messages</p>
                <p className="text-2xl font-bold text-slate-900">{messages.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Unique Leads</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set([...bookings.map(b => b.email), ...messages.map(m => m.email)]).size}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12">
              <TabsTrigger value="bookings" className="rounded-lg px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="messages" className="rounded-lg px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Messages
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="hologram" className="rounded-lg px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Hologram
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder={`Search ${activeTab}...`} 
                className="pl-10 rounded-xl border-slate-200 bg-white"
                value={activeTab === "bookings" ? bookingSearch : messageSearch}
                onChange={(e) => {
                  if (activeTab === "bookings") setBookingSearch(e.target.value);
                  else setMessageSearch(e.target.value);
                }}
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
                          {b.createdAt?.toDate().toLocaleDateString()}
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
                    <TableHead>Sender</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-slate-400">No messages found</TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="text-xs text-slate-500">
                          {m.createdAt?.toDate().toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">{m.name}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span>{m.email}</span>
                            {m.phone && <span className="text-slate-500 text-xs">{m.phone}</span>}
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
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              onClick={() => setDeleteConfirm({ type: "contact_messages", id: m.id })}
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Traffic Card */}
              <Card className="rounded-2xl border-slate-200 lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-teal-600" />
                      Live Traffic
                    </CardTitle>
                    <Badge className="bg-teal-500 text-white animate-pulse border-none">
                      {activeSessions.filter(s => {
                        const lastActive = s.lastActive?.toDate();
                        return lastActive && (new Date().getTime() - lastActive.getTime()) < 120000;
                      }).length} Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeSessions
                      .filter(s => {
                        const lastActive = s.lastActive?.toDate();
                        return lastActive && (new Date().getTime() - lastActive.getTime()) < 120000;
                      })
                      .slice(0, 5)
                      .map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                              {session.page === "/" ? "Home" : session.page.replace("/", "").charAt(0).toUpperCase() + session.page.slice(2)}
                            </span>
                            <span className="text-[10px] text-slate-500">Session: {session.sessionId.slice(0, 8)}...</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-teal-600 font-medium">
                            <Clock className="w-3 h-3" />
                            Just now
                          </div>
                        </div>
                      ))}
                    {activeSessions.filter(s => {
                      const lastActive = s.lastActive?.toDate();
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

              {/* Traffic Trend Chart */}
              <Card className="rounded-2xl border-slate-200 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    Traffic Trend (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={Array.from({ length: 7 }).map((_, i) => {
                        const date = subDays(new Date(), 6 - i);
                        const count = events.filter(e => 
                          e.type === 'page_view' && 
                          e.createdAt && 
                          isSameDay(e.createdAt.toDate(), date)
                        ).length;
                        return {
                          name: format(date, "MMM dd"),
                          views: count
                        };
                      })}
                    >
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontSize: '12px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        stroke="#0d9488" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorViews)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Popular Pages */}
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
                          .filter(e => e.type === 'page_view')
                          .reduce((acc, e) => {
                            acc[e.page] = (acc[e.page] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                      )
                        .map(([page, count]) => ({
                          name: page === "/" ? "Home" : page.replace("/", "").split("/").pop()?.replace("-", " ").toUpperCase() || page,
                          views: count
                        }))
                        .sort((a, b) => b.views - a.views)
                        .slice(0, 5)}
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
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="views" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Conversion Summary */}
              <Card className="rounded-2xl border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-600" />
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
                          {events.length > 0 
                            ? ((bookings.length / Math.max(1, new Set(events.map(e => e.sessionId)).size)) * 100).toFixed(1)
                            : 0}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-500 h-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (bookings.length / Math.max(1, new Set(events.map(e => e.sessionId)).size)) * 100)}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                        <p className="text-[10px] uppercase font-bold text-teal-600 mb-1">Total Sessions</p>
                        <p className="text-xl font-bold text-teal-900">{new Set(events.map(e => e.sessionId)).size}</p>
                      </div>
                      <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                        <p className="text-[10px] uppercase font-bold text-sky-600 mb-1">Total Page Views</p>
                        <p className="text-xl font-bold text-sky-900">{events.filter(e => e.type === 'page_view').length}</p>
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
                          filter: 'hue-rotate(160deg) brightness(1.2) contrast(1.1) drop-shadow(0 0 15px rgba(20, 184, 166, 0.4))',
                        }}
                      />
                    ) : (
                      <div className="text-slate-500 text-center p-8">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-sm">No hologram generated yet.</p>
                      </div>
                    )}
                    
                    {/* Scanning Line Animation */}
                    <motion.div 
                      animate={{ top: ["-10%", "110%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-teal-400/60 shadow-[0_0_20px_rgba(45,212,191,0.8)] z-10 pointer-events-none"
                    />
                  </div>
                  
                  <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Last Updated:</span>
                      <span className="font-bold text-slate-900">
                        {currentHologram?.lastUpdated 
                          ? currentHologram.lastUpdated.toDate().toLocaleString() 
                          : "Never"}
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

        {/* Message View Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-lg rounded-3xl">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-sky-600" />
                <DialogTitle className="text-xl font-bold">Message from {selectedMessage?.name}</DialogTitle>
              </div>
              <DialogDescription className="text-slate-500">
                Sent on {selectedMessage?.createdAt?.toDate().toLocaleString()}
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
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage?.message}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => handlePrint(selectedMessage!, 'message')} 
                className="rounded-xl px-6"
              >
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
