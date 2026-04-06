import * as React from "react";
import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  deleteDoc,
  doc,
  updateDoc
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
  FileText
} from "lucide-react";
import { toast } from "sonner";

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

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSearch, setBookingSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [activeTab, setActiveTab] = useState("bookings");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null);

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

    const unsubB = onSnapshot(bQuery, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "bookings"));

    const unsubM = onSnapshot(mQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "contact_messages"));

    return () => {
      unsubB();
      unsubM();
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
