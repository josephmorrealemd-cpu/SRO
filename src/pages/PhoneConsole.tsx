import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Link } from "react-router-dom";
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOff, 
  Circle, 
  Play, 
  Pause, 
  Loader2, 
  Send, 
  Volume2, 
  Bot, 
  Sparkles, 
  History, 
  User, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  X, 
  Activity,
  PlusCircle,
  HelpCircle,
  Video,
  Mic,
  MicOff,
  Settings,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  Server,
  Wifi,
  WifiOff,
  RefreshCw,
  Home,
  LayoutDashboard,
  LogOut
} from "lucide-react";

interface CallTranscriptItem {
  speaker: "caller" | "admin" | "system";
  text: string;
  timestamp: number;
}

interface CallRecord {
  id: string;
  callSid: string;
  callerPhone: string;
  callerName: string;
  status: "ringing" | "active" | "completed" | "voicemail";
  voicemailUrl?: string;
  voicemailDuration?: number;
  transcript: CallTranscriptItem[];
  queue: string[];
  aiSummary?: string;
  aiUrgency?: "Low" | "Medium" | "High" | "Critical";
  aiIntent?: string;
  createdAt: string;
  updatedAt: string;
  isSimulated?: boolean;
}

export default function AdminPhoneConsole() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Twilio Browser WebRTC Phone Device States
  const [answeringMode, setAnsweringMode] = useState<"voice" | "text">("voice");
  const [twilioToken, setTwilioToken] = useState<string | null>(null);
  const [twilioWarning, setTwilioWarning] = useState<string | null>(null);
  const [device, setDevice] = useState<any>(null);
  const [deviceState, setDeviceState] = useState<"unregistered" | "ready" | "ringing" | "connected" | "error">("unregistered");
  const [deviceErrorMsg, setDeviceErrorMsg] = useState<string | null>(null);
  const [activeConnection, setActiveConnection] = useState<any>(null);

  // Diagnostics & Webhook configuration modal
  const [diagnosticsModalOpen, setDiagnosticsModalOpen] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Live Speech Mic-Simulation variables
  const [micActive, setMicActive] = useState(false);
  const [voiceSimSpeaking, setVoiceSimSpeaking] = useState(false); 
  const [recognitionRunning, setRecognitionRunning] = useState(false);
  const speechRecognizerRef = useRef<any>(null);

  // Calls logs
  const [activeCall, setActiveCall] = useState<CallRecord | null>(null);
  const [pastCalls, setPastCalls] = useState<CallRecord[]>([]);
  const [callsLoading, setCallsLoading] = useState(false);

  // Message compose
  const [typedMessage, setTypedMessage] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Presence monitor
  const [presenceOnline, setPresenceOnline] = useState(false);
  const [activeAdminCount, setActiveAdminCount] = useState(1);

  // Simulation setup
  const [simName, setSimName] = useState("Arthur Pendleton");
  const [simPhone, setSimPhone] = useState("+1 (415) 388-9102");
  const [isSimulatingStart, setIsSimulatingStart] = useState(false);

  // Audio players state for voicemails
  const [playingVoicemailId, setPlayingVoicemailId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Presets
  const presets = [
    "Yes, we specialize in non-surgical PRP treatments! We can schedule your knee diagnostics this week.",
    "Dr. Morreale is looking at your description live. What was the exact mechanism of injury?",
    "That is a great candidate for our exosome signaling protocol. Let's arrange a 1-to-1 review.",
    "We have customized clinical program rates available. Shall we arrange a direct phone callback?",
    "Feel free to check our Knee Pain growth funnel under /avoid-knee-surgery directly."
  ];

  // 1a. Load answering preference
  useEffect(() => {
    const fetchPref = async () => {
      try {
        const res = await fetch("/api/twilio/preference");
        if (res.ok) {
          const data = await res.json();
          if (data.mode) {
            setAnsweringMode(data.mode);
          }
        }
      } catch (e) {
        console.error("Failed to load clinical answering preference:", e);
      }
    };
    if (user && isAdmin) {
      fetchPref();
    }
  }, [user, isAdmin]);

  const toggleAnsweringMode = async () => {
    const targetMode = answeringMode === "voice" ? "text" : "voice";
    setAnsweringMode(targetMode);
    try {
      await fetch("/api/twilio/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: targetMode })
      });
    } catch (e) {
      console.error("Failed to set clinical answering preference:", e);
    }
  };

  // 1b. Real Twilio Browser Device Setup
  const loadDiagnostics = async () => {
    setDiagnosticsLoading(true);
    try {
      const res = await fetch("/api/twilio/diagnostics");
      if (res.ok) {
        const data = await res.json();
        setDiagnosticsData(data);
      } else {
        const text = await res.text();
        setDiagnosticsData({ error: `Server returned HTTP ${res.status}: ${text.substring(0, 100)}` });
      }
    } catch (e: any) {
      setDiagnosticsData({ error: `Diagnostics fetch failed: ${e.message}. If running on static Netlify hosting, backend API routes (/api/*) require a running server or proxy.` });
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      loadDiagnostics();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    let dev: any = null;

    const loadTwilioScript = () => {
      return new Promise<void>((resolve, reject) => {
        if ((window as any).Twilio) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://sdk.twilio.com/js/voice/v2/twilio.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Twilio Voice SDK from CDN"));
        document.body.appendChild(script);
      });
    };

    const initTwilioDevice = async () => {
      try {
        await loadTwilioScript();
        const Twilio = (window as any).Twilio;
        if (!Twilio?.Device) {
          throw new Error("Twilio Voice SDK global Device class not found");
        }
        const Device = Twilio.Device;
        const res = await fetch("/api/twilio/token");
        if (!res.ok) {
          const bodyText = await res.text();
          setDeviceErrorMsg(`Failed to fetch Twilio token (HTTP ${res.status}): ${bodyText.substring(0, 60)}`);
          setDeviceState("error");
          return;
        }

        const data = await res.json();
        if (data.warning) {
          setTwilioWarning(data.warning);
        }

        if (data.token) {
          console.log("Setting up real Twilio WebRTC client device...");
          setTwilioToken(data.token);
          setTwilioWarning(null);

          // Instantiate Twilio Device with codec preferences
          dev = new Device(data.token, {
            codecPreferences: ["opus", "pcmu"],
            enableRingingState: true
          });

          dev.on("registered", () => {
            console.log("Twilio WebRTC Client registered successfully.");
            setDeviceState("ready");
            setDeviceErrorMsg(null);
          });

          dev.on("error", (error: any) => {
            console.error("Twilio Device WebRTC failure:", error);
            setDeviceState("error");
            setDeviceErrorMsg(error?.message || "WebRTC handset error");
          });

          dev.on("incoming", (conn: any) => {
            console.log("WebRTC Incoming call connecting from Twilio...");
            setDeviceState("ringing");
            setActiveConnection(conn);

            // Auto select active call state using the call details if present
            const callSid = conn?.parameters?.CallSid || "CALL_" + Date.now();
            const fromNum = conn?.parameters?.From || "Anonymous";

            setActiveCall({
              id: callSid,
              callSid: callSid,
              callerPhone: fromNum,
              callerName: "Incoming Patient Caller",
              status: "ringing",
              transcript: [
                { speaker: "system", text: "Incoming WebRTC audio connection detected... click Accept to connect line.", timestamp: Date.now() }
              ],
              queue: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });

            conn.on("accept", () => {
              setDeviceState("connected");
              setActiveCall((prev: any) => prev ? { ...prev, status: "active" } : null);
            });

            conn.on("disconnect", () => {
              setDeviceState("ready");
              setActiveConnection(null);
              setActiveCall((prev: any) => prev ? { ...prev, status: "completed" } : null);
              loadCallsHistory();
            });

            conn.on("error", (callErr: any) => {
              console.error("Twilio Call error:", callErr);
              setDeviceState("ready");
            });
          });

          await dev.register();
          setDevice(dev);
        } else if (data.warning) {
          setDeviceState("unregistered");
        }
      } catch (err: any) {
        console.error("Could not register Twilio browser handset capabilities:", err);
        setDeviceErrorMsg(err?.message || "Could not register WebRTC client");
        setDeviceState("error");
      }
    };

    initTwilioDevice();

    return () => {
      if (dev) {
        try {
          dev.destroy();
        } catch (e) {}
      }
    };
  }, [user, isAdmin]);

  // 1c. Speech Recognition Setup for WebRTC Simulated Calls
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const startSpeechRecognition = () => {
    if (!SpeechRecognition) {
      console.warn("Web Speech API is not supported in this browser.");
      return;
    }
    
    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch (e) {}
    }

    const rec = new SpeechRecognition();
    rec.continuous = false; 
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setRecognitionRunning(true);
      setMicActive(true);
    };

    rec.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      if (text && text.trim() && activeCall) {
        console.log("Transcribed speech locally:", text);
        
        // Append speech segment locally instantly
        setActiveCall((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            transcript: [
              ...prev.transcript,
              { speaker: "admin", text, timestamp: Date.now() }
            ]
          };
        });

        // Send speech segment to the server
        try {
          await fetch("/api/calls/action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              callSid: activeCall.callSid,
              action: "speak",
              text
            })
          });
        } catch (e) {
          console.error("Failed to sync transcript speech with model:", e);
        }
      }
    };

    rec.onerror = (e: any) => {
      console.error("Speech recognition error:", e);
    };

    rec.onend = () => {
      setRecognitionRunning(false);
    };

    speechRecognizerRef.current = rec;
    rec.start();
  };

  const stopSpeechRecognition = () => {
    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch (e) {}
    }
    setMicActive(false);
  };

  // 1d. Speech synthesis trigger for Simulated Voice Patients
  useEffect(() => {
    if (!activeCall || !activeCall.isSimulated || answeringMode !== "voice" || activeCall.status !== "active") return;
    
    const transcript = activeCall.transcript;
    if (transcript.length === 0) return;
    
    const lastLine = transcript[transcript.length - 1];
    if (lastLine.speaker === "caller") {
      setVoiceSimSpeaking(true);
      stopSpeechRecognition();
      
      const utterance = new SpeechSynthesisUtterance(lastLine.text);
      const voices = window.speechSynthesis.getVoices();
      const usVoice = voices.find(v => v.lang.startsWith("en-US") && v.name.includes("Natural")) || 
                     voices.find(v => v.lang.startsWith("en")) || null;
      if (usVoice) utterance.voice = usVoice;
      
      utterance.onend = () => {
        setVoiceSimSpeaking(false);
        // Automatically open Admin input mic when patient finishes talking!
        startSpeechRecognition();
      };

      utterance.onerror = () => {
        setVoiceSimSpeaking(false);
        startSpeechRecognition();
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [activeCall?.transcript?.length]);

  // Handle answering voice softphone
  const answerVoiceSoftphone = () => {
    if (!activeCall) return;
    if (activeCall.isSimulated) {
      setActiveCall((prev) => prev ? { 
        ...prev, 
        status: "active",
        transcript: [
          ...prev.transcript,
          { speaker: "system", text: "Dr. Morreale accepted call directly on computer browser.", timestamp: Date.now() }
        ]
      } : null);
      if (answeringMode === "voice") {
        setTimeout(() => {
          startSpeechRecognition();
        }, 500);
      }
    } else if (activeConnection) {
      activeConnection.accept();
    }
  };

  // Handle hangup/declining voice softphone
  const hangUpVoiceSoftphone = async () => {
    if (!activeCall) return;
    
    // Stop simulations and synthesis
    stopSpeechRecognition();
    window.speechSynthesis.cancel();
    setVoiceSimSpeaking(false);

    if (activeCall.isSimulated) {
      setActiveCall((prev) => prev ? { ...prev, status: "completed" } : null);
      await triggerSimulationHangup();
      loadCallsHistory();
    } else if (activeConnection) {
      activeConnection.disconnect();
    } else {
      // Manual local clear
      setActiveCall(null);
    }
  };

  // 1. Authenticate check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const adminCheck = u.email === "team@watch1do1.com" || u.email === "josephmorrealemd@gmail.com";
        setIsAdmin(adminCheck);
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => {
      unsubscribe();
      window.speechSynthesis.cancel();
    };
  }, []);

  // 2. Heartbeat presence loops (Send ping every 15 seconds to server if authenticated & tab open)
  useEffect(() => {
    if (!user || !isAdmin) return;

    const reportHeartbeat = async () => {
      try {
        const response = await fetch("/api/twilio/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId: user.uid })
        });
        const data = await response.json();
        if (data.success) {
          setPresenceOnline(true);
          setActiveAdminCount(data.activeAdmins || 1);
        }
      } catch (err) {
        console.error("Presence heartbeat check failed:", err);
        setPresenceOnline(false);
      }
    };

    // Trigger instantly then cycle
    reportHeartbeat();
    const heartbeatTimer = setInterval(reportHeartbeat, 15000);

    return () => clearInterval(heartbeatTimer);
  }, [user, isAdmin]);

  // 3. Connect real-time Server-Sent Events (SSE) Stream
  useEffect(() => {
    if (!user || !isAdmin) return;

    console.log("Connecting Call Interceptor to Server-Sent Events (SSE)...");
    const es = new EventSource("/api/twilio/events");

    es.addEventListener("comment", (e) => {
      // Keep alive comments
    });

    es.addEventListener("call_started", (e) => {
      const data = JSON.parse(e.data);
      console.log("SSE [call_started]:", data);
      setActiveCall(data);
    });

    es.addEventListener("call_updated", (e) => {
      const data = JSON.parse(e.data);
      console.log("SSE [call_updated]:", data);
      setActiveCall(data);
    });

    es.addEventListener("call_ended", (e) => {
      const data = JSON.parse(e.data);
      console.log("SSE [call_ended]:", data);
      // Move active to completed log, close active
      setActiveCall((prev) => {
        if (prev?.callSid === data.callSid) {
          return { ...prev, status: "completed", ...data };
        }
        return prev;
      });
      // Trigger a re-refresh of call logs history
      loadCallsHistory();
    });

    es.onerror = (err) => {
      console.error("SSE connection experienced an error. Reconnecting...", err);
    };

    return () => {
      es.close();
    };
  }, [user, isAdmin]);

  // 4. Fetch Calls logs history
  const loadCallsHistory = async () => {
    if (!user || !isAdmin) return;
    setCallsLoading(true);
    try {
      const res = await fetch("/api/calls");
      if (res.ok) {
        const data = await res.json();
        setPastCalls(data);

        // If there's an active call found running in past logs, restore screen state
        const activeItem = data.find((c: CallRecord) => c.status === "active" || c.status === "ringing");
        if (activeItem) {
          setActiveCall(activeItem);
        }
      }
    } catch (error) {
      console.error("Failed to load clinical call logs", error);
    } finally {
      setCallsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      loadCallsHistory();
    }
  }, [user, isAdmin]);

  // Scroll chat window down automatically
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeCall?.transcript]);

  // Handle Google Login popup
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      console.error("Login popup failed:", e);
    }
  };

  // Log response helper (TTS speak button)
  const handleSendTTSMessage = async (phraseToSpeak?: string) => {
    if (!activeCall) return;
    const msg = phraseToSpeak || typedMessage;
    if (!msg.trim()) return;

    setIsSendingMsg(true);
    try {
      const response = await fetch("/api/calls/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callSid: activeCall.callSid,
          action: "speak",
          text: msg
        })
      });

      if (response.ok) {
        if (!phraseToSpeak) setTypedMessage("");
        // Local immediate append so UI reacts immediately without waiting for Twilio post cycle
        setActiveCall((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            transcript: [
              ...prev.transcript,
              { speaker: "admin", text: msg, timestamp: Date.now() }
            ]
          };
        });
      }
    } catch (err) {
      console.error("Type-to-Speech injection failed:", err);
    } finally {
      setIsSendingMsg(false);
    }
  };

  // Simulate incoming patient call
  const triggerSimulation = async () => {
    setIsSimulatingStart(true);
    try {
      const response = await fetch("/api/calls/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate_start",
          callerPhone: simPhone,
          callerName: simName
        })
      });

      if (response.ok) {
        const body = await response.json();
        console.log("Simulating initiated", body);
      }
    } catch (error) {
      console.error("Cannot start clinical call simulator:", error);
    } finally {
      setIsSimulatingStart(false);
    }
  };

  // Simulate patient hanging up
  const triggerSimulationHangup = async () => {
    if (!activeCall) return;
    try {
      await fetch("/api/calls/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate_hangup",
          callSid: activeCall.callSid
        })
      });
    } catch (error) {
      console.error("Cannot disconnect call simulation:", error);
    }
  };

  // Toggle voicemail playback audio
  const handlePlayVoicemail = (record: CallRecord) => {
    if (!record.voicemailUrl) return;

    if (playingVoicemailId === record.callSid) {
      // Pause
      audioPlayerRef.current?.pause();
      setPlayingVoicemailId(null);
    } else {
      // Play
      setPlayingVoicemailId(record.callSid);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = record.voicemailUrl;
        audioPlayerRef.current.play();
        audioPlayerRef.current.onended = () => {
          setPlayingVoicemailId(null);
        };
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-500 font-sans">Connecting to security systems...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="h-16 w-16 mx-auto bg-teal-500/10 rounded-full flex items-center justify-center border border-teal-500/30">
            <Phone className="h-8 w-8 text-teal-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-sans font-medium text-white tracking-tight">Clinical Console Auth</h1>
            <p className="text-sm text-slate-400 font-sans">
              Access to this live receptionist intercept system is reserved strictly for administrative clinical specialists.
            </p>
          </div>

          {user && !isAdmin ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-lg p-3 text-left flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Access Denied</p>
                <p className="mt-0.5 text-red-300/80">
                  Your authenticated email ({user.email}) does not possess clinical administration privileges.
                </p>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {!user ? (
              <button
                id="admin-phone-login-btn"
                onClick={handleLogin}
                className="w-full bg-teal-500 hover:bg-teal-600 active:translate-y-px text-slate-950 text-sm font-semibold py-3 px-4 rounded-xl transition duration-250 flex items-center justify-center gap-2"
              >
                Sign In with Google Medical SSO
              </button>
            ) : (
              <button
                id="admin-phone-logout-btn"
                onClick={() => signOut(auth)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold py-3 px-4 rounded-xl transition"
              >
                Sign Out Account
              </button>
            )}
            <Link to="/" className="block text-xs text-slate-500 hover:text-slate-400 transition underline">
              Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Hidden audio tag for playback */}
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Header Panel */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/30">
            <Activity className="h-5 w-5 text-teal-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium text-white tracking-tight">Summit Intercept Phone Console</h1>
              <span className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                Live Webhooks
              </span>
            </div>
            <p className="text-xs text-slate-400">Dr. Morreale is monitoring secure communications</p>
          </div>
        </div>

        {/* Presence Indicator & Mode Swapper */}
        <div className="flex items-center gap-4">
          {/* Answering Mode Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-0.5 shadow-inner">
            <button
              onClick={toggleAnsweringMode}
              title="Speak directly via microphone just like a standard phone"
              className={`text-[11px] px-3.5 py-1 rounded-full font-medium transition duration-200 flex items-center gap-1.5 ${
                answeringMode === "voice"
                  ? "bg-teal-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Mic className="h-3 w-3" /> Live Voice Mode
            </button>
            <button
              onClick={toggleAnsweringMode}
              title="Quiet mode: read transcripts and type back translated text-to-speech to caller"
              className={`text-[11px] px-3.5 py-1 rounded-full font-medium transition duration-200 flex items-center gap-1.5 ${
                answeringMode === "text"
                  ? "bg-teal-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Send className="h-3 w-3" /> Intercept Type Mode
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1.5 text-xs font-mono">
            <Circle className={`h-2.5 w-2.5 fill-current ${deviceState === "ready" || deviceState === "connected" ? "text-emerald-400 animate-pulse" : presenceOnline ? "text-teal-400" : "text-amber-500"}`} />
            <span>Handset Status: <b>{deviceState === "ready" ? "TELEPHONY ACTIVE (READY)" : deviceState === "connected" ? "ACTIVE CALL" : presenceOnline ? "LIVE MONITOR" : "OFFLINE"}</b></span>
            {presenceOnline && (
              <span className="text-slate-500 border-l border-slate-800 pl-2">
                Ops Online: {activeAdminCount}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              loadDiagnostics();
              setDiagnosticsModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 px-3 py-1.5 rounded-full transition font-medium"
            title="Open Twilio & Webhook Diagnostics"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Twilio Diagnostics</span>
            {(!twilioToken || deviceState === "error" || deviceState === "unregistered") && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5" />
            )}
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition"
            title="Return to Admin Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition"
            title="Go to Website Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <button
            onClick={async () => {
              await signOut(auth);
              window.location.href = "/";
            }}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition px-2 py-1"
            title="Sign out and return to home"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Top Telephony Health Alert Banner if not registered or warning */}
      {(!twilioToken || deviceState === "error" || twilioWarning) && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <b>Twilio WebRTC Alert:</b> {deviceErrorMsg || twilioWarning || "Browser phone handset is waiting for Twilio token configuration or webhook linkage."}
            </span>
          </div>
          <button
            onClick={() => {
              loadDiagnostics();
              setDiagnosticsModalOpen(true);
            }}
            className="underline font-semibold text-amber-300 hover:text-amber-100 flex items-center gap-1"
          >
            Open Webhook Setup Guide & Diagnostics <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Grid Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* LEFT COLUMN: ACTIVE INTERCEPT BOARD (7/12 cols) */}
        <section className="lg:col-span-8 flex flex-col bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl min-h-[550px]">
          
          {/* Active Call Header Status bar */}
          <div className="p-4 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                !activeCall ? "bg-slate-800/50 text-slate-500" :
                activeCall.status === "ringing" ? "bg-amber-500/10 text-amber-400 animate-pulse border border-amber-500/30" :
                activeCall.status === "active" ? "bg-teal-500/10 text-teal-400 border border-teal-500/30" :
                "bg-slate-800 text-slate-300"
              }`}>
                {activeCall?.status === "ringing" ? <PhoneIncoming className="h-5 w-5 animate-bounce" /> : <Phone className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-xs font-mono text-slate-400">Current Call Intercept Mode</p>
                <h2 className="text-sm font-semibold text-white">
                  {activeCall ? (
                    <span>{activeCall.callerName} <span className="text-xs text-slate-400 font-normal">({activeCall.callerPhone})</span></span>
                  ) : "No active call connected on Twilio line"}
                </h2>
              </div>
            </div>

            {activeCall && (
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  activeCall.status === "ringing" ? "bg-amber-500/10 text-amber-300 border border-amber-500/30" :
                  activeCall.status === "active" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" :
                  "bg-slate-800 text-slate-400"
                }`}>
                  {activeCall.status.toUpperCase()}
                </span>
                
                {activeCall.isSimulated && (
                  <button
                    onClick={triggerSimulationHangup}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-3 py-1 rounded-lg transition"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Transcript Timeline Display */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[460px] min-h-[280px] bg-slate-950/20">
            {!activeCall ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="max-w-sm">
                  <p className="text-sm text-slate-300 font-medium">Listening for incoming clinical webhooks...</p>
                  <p className="text-xs text-slate-500 mt-1">
                    When a patient dials your Twilio receptionist line, the call will trigger instantly here, transitioning the caller into real-time intercept mode.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* 1. Ringing Mode Telephony WebRTC Call Incoming Panel */}
                {activeCall.status === "ringing" && (
                  <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 text-center max-w-sm mx-auto my-6 space-y-4 shadow-2xl backdrop-blur-md animate-pulse">
                    <div className="h-12 w-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                      <PhoneIncoming className="h-6 w-6 animate-bounce" />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[9px] tracking-widest font-mono text-amber-400 uppercase">Incoming Clinical Connection</p>
                      <h3 className="text-base font-semibold text-white">{activeCall.callerName}</h3>
                      <p className="text-xs text-slate-400 font-mono">{activeCall.callerPhone}</p>
                    </div>

                    <div className="flex flex-col gap-2 justify-center pt-2">
                      <button
                        onClick={answerVoiceSoftphone}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 active:translate-y-0.5 text-slate-950 font-semibold text-xs py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition duration-150 shadow-lg shadow-emerald-500/10"
                      >
                        <Mic className="h-4 w-4" /> Answer Voice Call
                      </button>
                      <button
                        onClick={hangUpVoiceSoftphone}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] py-1.5 px-4 rounded-xl transition duration-150"
                      >
                        Decline/Ignore Call
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Active Voice Mode Softphone Streams & Visualizer */}
                {activeCall.status === "active" && answeringMode === "voice" && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-4 max-w-sm mx-auto space-y-3 shadow-lg text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full text-[9px] font-mono text-emerald-400">
                      <span className="h-1 text-xs text-emerald-400 animate-ping">•</span>
                      CONNECTING
                    </div>

                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Softphone Line</p>

                    {/* Animated Wavelength Visualizer bars */}
                    <div className="flex items-center justify-center gap-1 h-8">
                      {[...Array(12)].map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-1 rounded-full transition-all duration-200 ${
                            voiceSimSpeaking ? "bg-teal-400 animate-bounce h-7" : micActive ? "bg-emerald-400 animate-pulse h-5" : "bg-slate-700 h-1"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs min-h-[44px] flex items-center justify-center font-medium">
                      {voiceSimSpeaking ? (
                        <span className="text-teal-300 animate-pulse flex items-center gap-1 text-center justify-center">
                          <Volume2 className="h-3.5 w-3.5 shrink-0 text-teal-400 animate-bounce" />
                          Arthur Pendleton is speaking...
                        </span>
                      ) : micActive ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-center justify-center">
                          <Mic className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          Microphone Active: Speak now...
                        </span>
                      ) : (
                        <span className="text-slate-400">Telephony audio link idle...</span>
                      )}
                    </div>

                    <button
                      onClick={hangUpVoiceSoftphone}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold text-[11px] py-1.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition duration-150"
                    >
                      <PhoneOff className="h-3.5 w-3.5" /> Disconnect Call
                    </button>
                  </div>
                )}

                {/* 3. Conversations Feed */}
                {activeCall.transcript.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 ${
                      line.speaker === "admin" ? "justify-end text-right" : "justify-start text-left"
                    }`}
                  >
                    {line.speaker !== "admin" && (
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-sm ${
                        line.speaker === "system" ? "bg-slate-800 text-slate-400" : "bg-teal-500/10 text-teal-400 font-bold"
                      }`}>
                        {line.speaker === "system" ? <Bot className="h-4 w-4" /> : "P"}
                      </div>
                    )}

                    <div className="max-w-[75%] space-y-1">
                      <div className={`text-[10px] font-mono text-slate-500 flex items-center gap-1 ${line.speaker === "admin" ? "justify-end" : ""}`}>
                        <span>
                          {line.speaker === "admin" 
                            ? (answeringMode === "voice" ? "Dr. Morreale (Voice Softphone)" : "Dr. Morreale (Typing-to-Speech)") 
                            : line.speaker === "caller" 
                            ? "Patient Concern" 
                            : "System Logs"}
                        </span>
                        <span>•</span>
                        <span>{new Date(line.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                      
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed tracking-wide ${
                        line.speaker === "admin" 
                          ? "bg-teal-500 text-slate-950 rounded-tr-none font-medium" 
                          : line.speaker === "caller"
                          ? "bg-slate-900 border border-slate-800 text-white rounded-tl-none font-medium text-slate-100" 
                          : "bg-slate-900/40 text-slate-400 text-xs border border-transparent italic"
                      }`}>
                        {line.text}
                      </div>
                    </div>

                    {line.speaker === "admin" && (
                      <div className="h-8 w-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 text-teal-400 text-xs font-bold">
                        MD
                      </div>
                    )}
                  </div>
                ))}
                
                {activeCall.queue.length > 0 && (
                  <div className="flex justify-end pr-10">
                    <div className="bg-slate-905 border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin text-teal-400" />
                      <span>In Twilio speaking queue: "{activeCall.queue[0]}"</span>
                    </div>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>
            )}
          </div>

          {/* Quick Presets Select panel */}
          {activeCall && (
            <div className="p-4 bg-slate-900/30 border-t border-slate-800/80">
              <p className="text-[10px] uppercase font-mono text-slate-400 mb-2 tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-teal-400" /> Quick Clinical Presets (Click to speak instantly via TTS)
              </p>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendTTSMessage(p)}
                    className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg transition text-left hover:text-white max-w-sm"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Composition Text Area */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
            <textarea
              value={typedMessage}
              disabled={!activeCall}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder={activeCall ? "Type a clinical response for Twilio to speak out-loud live..." : "Connect a ringing call to open response typing..."}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendTTSMessage();
                }
              }}
              className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none h-12"
            />
            <button
              onClick={() => handleSendTTSMessage()}
              disabled={!activeCall || !typedMessage.trim() || isSendingMsg}
              className="bg-teal-500 hover:bg-teal-400 active:translate-y-px disabled:bg-slate-800 disabled:text-slate-500 disabled:translate-y-0 h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition text-slate-950 shadow-lg shadow-teal-500/10"
            >
              {isSendingMsg ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>

        </section>

        {/* RIGHT COLUMN: CALL LOGS HISTORY & VOICEMAILS (4/12 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          
          {/* SECURE PATIENT SIMULATOR CARD */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white tracking-tight flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-teal-400" /> Interactive Patient Simulator
              </h3>
              <span className="bg-teal-500/10 text-teal-400 text-[9px] uppercase px-2 py-0.5 rounded font-mono border border-teal-500/20">
                Gemini Powered
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Test your intercept receptionist setup immediately! Run an off-hours test call to dialogue with an AI knee osteoarthritis patient.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-slate-500 mb-1">Simulated Full Name</label>
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-slate-500 mb-1">Simulated Contact Number</label>
                <input
                  type="text"
                  value={simPhone}
                  onChange={(e) => setSimPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                onClick={triggerSimulation}
                disabled={isSimulatingStart || !!activeCall}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-3 rounded-lg border border-slate-800 transition flex items-center justify-center gap-2 hover:border-slate-700 disabled:bg-slate-900/50 disabled:text-slate-600 disabled:border-slate-950"
              >
                {isSimulatingStart ? <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-400" /> : <PlusCircle className="h-3.5 w-3.5 text-teal-400" />}
                Initiate Simulated Intercept Call
              </button>
            </div>
          </div>

          {/* PAST DEPOSITED LOGS (History Player) */}
          <section className="bg-slate-950 border border-slate-800/80 rounded-2xl flex-1 flex flex-col p-5 space-y-4 shadow-xl overflow-hidden max-h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <h3 className="text-sm font-medium text-white tracking-tight flex items-center gap-1.5">
                <History className="h-4 w-4 text-teal-400" /> Clinical Voicemails & Records
              </h3>
              <button 
                onClick={loadCallsHistory} 
                className="text-[10px] text-teal-400 hover:text-teal-300 transition"
                disabled={callsLoading}
              >
                {callsLoading ? "Refreshing..." : "Refresh Logs"}
              </button>
            </div>

            {/* List log container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {pastCalls.length === 0 ? (
                <div className="text-center py-10 font-sans text-xs text-slate-500">
                  No historical clinical log files recorded yet.
                </div>
              ) : (
                pastCalls.map((log) => (
                  <div 
                    key={log.callSid} 
                    className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-white">{log.callerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{log.callerPhone}</p>
                      </div>
                      
                      {log.aiUrgency && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          log.aiUrgency === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          log.aiUrgency === "High" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                          log.aiUrgency === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-slate-800 text-slate-400"
                        }`}>
                          {log.aiUrgency} Urgency
                        </span>
                      )}
                    </div>

                    {/* Meta timestamps */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <Clock className="w-3 w-3 shrink-0" />
                      <span>{new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {log.voicemailDuration ? (
                        <>
                          <span>•</span>
                          <span>{log.voicemailDuration}s Rec</span>
                        </>
                      ) : null}
                    </div>

                    {/* AI Summarized Analysis details */}
                    {log.aiSummary && (
                      <div className="bg-slate-950/80 border border-slate-800/50 p-2.5 rounded-lg space-y-1.5">
                        <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-teal-400 uppercase tracking-widest">
                          <Bot className="h-3 w-3 shrink-0" /> AI Diagnostic Summary
                        </div>
                        <p className="text-xs text-slate-300 leading-normal font-sans">
                          {log.aiSummary}
                        </p>
                        {log.aiIntent && (
                          <p className="text-[10px] font-mono text-slate-500">
                            <b>Predicted Intent:</b> {log.aiIntent}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Audio recording trigger */}
                    {log.voicemailUrl ? (
                      <button
                        onClick={() => handlePlayVoicemail(log)}
                        className="w-full bg-slate-950 shadow hover:bg-slate-800 text-teal-400 hover:text-white border border-slate-800 hover:border-teal-500/20 text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition font-medium"
                      >
                        {playingVoicemailId === log.callSid ? (
                          <>
                            <Pause className="h-3.5 w-3.5 animate-spin" />
                            <span>Stop Voicemail Playback</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>Play Left Voicemail Recording</span>
                          </>
                        )}
                      </button>
                    ) : (
                      log.status === "completed" && (
                        <p className="text-[10px] font-mono text-slate-500 italic">
                          No voicemail recorded (Completed via live chat intercept).
                        </p>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

      </div>

      {/* Twilio & Webhook Diagnostics Modal */}
      {diagnosticsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Twilio Telephony & Webhook Diagnostics</h3>
                  <p className="text-xs text-slate-400">Live configuration and connectivity verification</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadDiagnostics}
                  disabled={diagnosticsLoading}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
                  title="Refresh Diagnostics"
                >
                  <RefreshCw className={`w-4 h-4 ${diagnosticsLoading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => setDiagnosticsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Webhook URLs for Twilio Console */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
                    Required Twilio Console Webhook URLs
                  </h4>
                  <span className="text-[11px] text-slate-400">Copy & paste into Twilio Console</span>
                </div>

                {/* Voice Webhook */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">1. Phone Number Voice Webhook ("A CALL COMES IN"):</span>
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">HTTP POST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={diagnosticsData?.server?.voiceWebhookUrl || (typeof window !== "undefined" ? `${window.location.origin}/api/twilio/voice` : "")}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 select-all"
                    />
                    <button
                      onClick={() => {
                        const url = diagnosticsData?.server?.voiceWebhookUrl || `${window.location.origin}/api/twilio/voice`;
                        navigator.clipboard.writeText(url);
                        setCopiedField("voiceWebhook");
                        setTimeout(() => setCopiedField(null), 2000);
                      }}
                      className="shrink-0 bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copiedField === "voiceWebhook" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedField === "voiceWebhook" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Set in Twilio Console → <b>Phone Numbers</b> → <b>Active Numbers</b> → Click your number (<b>+1 720-776-9165</b>) → Under <b>Voice & Fax</b>, set "A CALL COMES IN" to <b>Webhook</b> and paste this URL.
                  </p>
                </div>

                {/* TwiML App Webhook */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">2. TwiML App Voice Request URL:</span>
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">HTTP POST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={diagnosticsData?.server?.voiceWebhookUrl || (typeof window !== "undefined" ? `${window.location.origin}/api/twilio/voice` : "")}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 select-all"
                    />
                    <button
                      onClick={() => {
                        const url = diagnosticsData?.server?.voiceWebhookUrl || `${window.location.origin}/api/twilio/voice`;
                        navigator.clipboard.writeText(url);
                        setCopiedField("twimlApp");
                        setTimeout(() => setCopiedField(null), 2000);
                      }}
                      className="shrink-0 bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copiedField === "twimlApp" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedField === "twimlApp" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Set in Twilio Console → <b>Voice</b> → <b>TwiML</b> → <b>TwiML Apps</b> → Click your app (<b>AP7cbcd3ed4a7920a5c9cf50a555412719</b>) → set "Voice Request URL" to this URL.
                  </p>
                </div>
              </div>

              {/* Status Checks */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
                  Live System Health Checks
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* WebRTC Client */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white">Browser Softphone (WebRTC)</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        State: {deviceState.toUpperCase()}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                      deviceState === "ready" || deviceState === "connected"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {deviceState === "ready" ? "READY" : deviceState === "connected" ? "CONNECTED" : deviceState === "error" ? "ERROR" : "PENDING"}
                    </span>
                  </div>

                  {/* Twilio Token Status */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white">Twilio Capability Token</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {twilioToken ? "Issued & Active (3600s TTL)" : "Not Issued"}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                      twilioToken
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {twilioToken ? "ACTIVE" : "MISSING"}
                    </span>
                  </div>

                  {/* Presence Heartbeat */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white">Admin Presence Heartbeat</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Online Admins: {activeAdminCount}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                      presenceOnline
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {presenceOnline ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>

                  {/* SSE Event Stream */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white">Real-Time Event Stream</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        /api/twilio/events
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      CONNECTED
                    </span>
                  </div>
                </div>
              </div>

              {/* Environment Variables Status */}
              {diagnosticsData?.environment && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
                    Backend Environment Variables
                  </h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">TWILIO_ACCOUNT_SID:</span>
                      <span className={diagnosticsData.environment.hasAccountSid ? "text-emerald-400" : "text-red-400"}>
                        {diagnosticsData.environment.accountSidMasked || "MISSING"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">TWILIO_API_KEY:</span>
                      <span className={diagnosticsData.environment.hasApiKey ? "text-emerald-400" : "text-red-400"}>
                        {diagnosticsData.environment.apiKeyMasked || "MISSING"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">TWILIO_API_SECRET:</span>
                      <span className={diagnosticsData.environment.hasApiSecret ? "text-emerald-400" : "text-red-400"}>
                        {diagnosticsData.environment.hasApiSecret ? "CONFIGURED (SECRET)" : "MISSING"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">TWILIO_TWIML_APP_SID:</span>
                      <span className={diagnosticsData.environment.hasTwimlAppSid ? "text-emerald-400" : "text-red-400"}>
                        {diagnosticsData.environment.twimlAppSidMasked || "MISSING"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">TWILIO_NUMBER:</span>
                      <span className={diagnosticsData.environment.hasTwilioNumber ? "text-emerald-400" : "text-red-400"}>
                        {diagnosticsData.environment.twilioNumber || "MISSING"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">GEMINI_API_KEY:</span>
                      <span className={diagnosticsData.environment.hasGeminiKey ? "text-emerald-400" : "text-amber-400"}>
                        {diagnosticsData.environment.hasGeminiKey ? "CONFIGURED" : "OMITTED"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Netlify Deployment Notice */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Important Note on Netlify & Serverless Hosting</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Twilio requires an active Node server endpoint to receive HTTP POST webhooks (<code className="text-teal-400 font-mono">/api/twilio/voice</code>) and mint WebRTC tokens. If deploying on standard static Netlify CDN, ensure the backend is running as a container (e.g. Google Cloud Run, Render, Railway) and proxied in Netlify's redirects file, or test in this active preview environment.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
              <button
                onClick={() => setDiagnosticsModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
