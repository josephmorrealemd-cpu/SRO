import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";
import twilio from "twilio";

dotenv.config();

// Initialize Firebase server-side ref for call history/logs persistence
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp, (firebaseConfig as any).firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Route for Hologram Generation
  app.post("/api/generate-hologram", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY is missing from environment");
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      console.log("Generating hologram with Gemini API...");
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Try primary image model first
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: "A high-tech, medical-grade holographic render of a FULL HUMAN BODY anatomy in a standing pose, showing the entire skeletal structure and all major joints from head to toe. Futuristic glowing teal and cyan neon lines on a deep slate background, semi-transparent, cinematic lighting, professional medical visualization, 8k resolution, aspect ratio 9:16.",
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: "9:16",
            },
          },
        });

        console.log("Gemini response parts:", response.candidates?.[0]?.content?.parts?.length || 0);

        let imageUrl = "";
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            console.log("Image data extracted successfully (mimeType:", part.inlineData.mimeType, ")");
            break;
          }
        }

        if (imageUrl) {
          return res.json({ imageUrl });
        }
      } catch (innerError: any) {
        console.warn("Primary image model failed, trying fallback:", innerError.message);
      }

      // Fallback to a general multimodal model if the specific image model failed
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: {
          parts: [
            {
              text: "A high-tech, medical-grade holographic render of a FULL HUMAN BODY anatomy in a standing pose, showing the entire skeletal structure and all major joints from head to toe. Futuristic glowing teal and cyan neon lines on a deep slate background, semi-transparent, cinematic lighting, professional medical visualization, 8k resolution. GENERATE AN IMAGE.",
            },
          ],
        },
      });

      let fallbackImageUrl = "";
      for (const part of fallbackResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          fallbackImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          console.log("Fallback image data extracted successfully");
          break;
        }
      }

      if (fallbackImageUrl) {
        return res.json({ imageUrl: fallbackImageUrl });
      }

      // Final fallback to a high-quality static asset
      console.log("All AI generation failed, using static fallback.");
      res.json({ imageUrl: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800" });
    } catch (error: any) {
      console.error("Hologram generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate hologram" });
    }
  });

  // ===============================================================
  // Twilio and Console Intercept Presence & Engine (Server-Side)
  // ===============================================================

  interface CallTranscriptItem {
    speaker: "caller" | "admin" | "system";
    text: string;
    timestamp: number;
  }

  interface ActiveCall {
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
    silenceCount: number;
    createdAt: string;
    updatedAt: string;
    isSimulated?: boolean;
  }

  const activeCalls = new Map<string, ActiveCall>();
  const sseClients: express.Response[] = [];
  const adminHeartbeats = new Map<string, number>();

  // Helper: check if there are connected, active administrators
  function getActiveAdminCount(): number {
    // 1. Clean stale heartbeats (older than 30 seconds)
    const now = Date.now();
    for (const [adminId, lastSeen] of adminHeartbeats.entries()) {
      if (now - lastSeen > 35000) {
        adminHeartbeats.delete(adminId);
      }
    }
    
    // Combining connected Web SSE Clients and Heartbeats
    return Math.max(sseClients.length, adminHeartbeats.size);
  }

  // Helper: Broadcast SSE events of call events in real-time
  function broadcastCallEvent(event: string, data: any) {
    console.log(`SSE Broadcast: ${event}`, JSON.stringify(data));
    sseClients.forEach((client) => {
      client.write(`event: ${event}\n`);
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }

  // Helper: Save Call history to Firestore persistently
  async function saveCallToFirestore(call: ActiveCall) {
    try {
      const docRef = doc(db, "calls", call.callSid);
      await setDoc(docRef, {
        callSid: call.callSid,
        callerPhone: call.callerPhone,
        callerName: call.callerName,
        status: call.status,
        voicemailUrl: call.voicemailUrl || "",
        voicemailDuration: call.voicemailDuration || 0,
        transcript: call.transcript,
        aiSummary: call.aiSummary || "",
        aiUrgency: call.aiUrgency || "",
        aiIntent: call.aiIntent || "",
        createdAt: call.createdAt,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Failed to save call ${call.callSid} to Firestore:`, error);
    }
  }

  // Helper: Generate AI Summary with gemini-3.5-flash
  async function generateCallSummary(call: ActiveCall) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing, skipping Gemini analysis.");
      return {
        summary: "No API key configured for Gemini analysis.",
        urgency: "Medium" as const,
        intent: "General Consultation"
      };
    }

    try {
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const transcriptString = call.transcript
        .map(t => `${t.speaker.toUpperCase()}: ${t.text}`)
        .join("\n");

      const prompt = `You are an expert clinical receptionist AI at Summit Orthopedics.
Analyze this call session transcript between a caller (patient) and our clinic line.
Extract a neat call summary, patient concern, clinical urgency level ('Low', 'Medium', 'High', or 'Critical'), and predicted patient intent (e.g. "Booking Inquiry", "Severe Post-Op Pain", "Exosome Science Questions", "PRP Cost Review", "Voicemail Left", etc.).

Conversation history:
${transcriptString}

Return your analysis strictly as a raw JSON format output block with exactly these headings:
{
  "summary": "...",
  "urgency": "Low|Medium|High|Critical",
  "intent": "..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text?.trim() || "{}";
      const data = JSON.parse(text);
      return {
        summary: data.summary || "Summary completed based on logs.",
        urgency: (data.urgency || "Medium") as "Low" | "Medium" | "High" | "Critical",
        intent: data.intent || "Patient Inquiry"
      };
    } catch (err) {
      console.error("Gemini summary error:", err);
      return {
        summary: "Could not generate AI summary due to parser/token issues.",
        urgency: "Medium" as const,
        intent: "Patient Inquiry"
      };
    }
  }

  // Helper: Gemini patient conversation flow simulator
  async function getSimulatedCallerReply(call: ActiveCall, adminMessage: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const standardReplies = [
        "That sounds perfect. How soon can we book that regenerative therapy appointment?",
        "Okay, understood. Is there a long recovery time after platelet-rich plasma treatments?",
        "I would definitely prefer that over a total knee replacement surgery. What is the success rate?",
        "Yes, let's schedule a clinical review. Thursday works fine for me.",
        "Thank you so much! Looking forward to working with your clinical specialists."
      ];
      const index = Math.min(call.silenceCount, standardReplies.length - 1);
      call.silenceCount++;
      return standardReplies[index];
    }

    try {
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const dialogLogs = call.transcript
        .map(t => `${t.speaker.toUpperCase()}: ${t.text}`)
        .join("\n");

      const prompt = `You are simulating a lively human patient called John Doe calling Summit Orthopedics.
You have severe osteoarthritis in your knee causing persistent joint line tenderness. You are highly anxious to avoid undergoing total joint replacement surgery. You want to ask questions about platelets, amniotic Whartons Jelly, and exosome biological signaling.

Here is the dialog log:
${dialogLogs}

The clinic surgeon/specialist just responded:
"${adminMessage}"

Kindly reply as John Doe, behaving like a genuine patient. Keep it short (max 2 sentences), natural, conversational, and direct. Do not add any markdown, brackets, or speaker tags.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      return response.text?.trim() || "Thank you. Let's schedule that.";
    } catch (e) {
      return "That sounds very reasonable. Can we get that organized for next week?";
    }
  }

  // 1. SSE Stream Client Endpoint
  app.get("/api/twilio/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    sseClients.push(res);
    console.log(`Admin linked to Call Intercept Console. Active SSE links: ${sseClients.length}`);

    // Ping loop to prevent socket timeout
    const interval = setInterval(() => {
      res.write(`comment: keep-alive\n\n`);
    }, 15000);

    req.on("close", () => {
      clearInterval(interval);
      const index = sseClients.indexOf(res);
      if (index !== -1) {
        sseClients.splice(index, 1);
      }
      console.log(`Admin detached from Console. Active SSE links: ${sseClients.length}`);
    });
  });

  // Keep track of admin's call answering preference: "voice" or "text"
  let activeAnsweringPref = "voice";

  // Get current preference mode
  app.get("/api/twilio/preference", (req, res) => {
    res.json({ mode: activeAnsweringPref });
  });

  // Set current preference mode
  app.post("/api/twilio/preference", (req, res) => {
    const { mode } = req.body;
    if (mode === "voice" || mode === "text") {
      activeAnsweringPref = mode;
      console.log(`Clinical Answering preference mode switched to: ${activeAnsweringPref}`);
      res.json({ success: true, mode: activeAnsweringPref });
    } else {
      res.status(400).json({ error: "Invalid clinical preference mode specified." });
    }
  });

  // 1b. Generates access tokens allowing AdminPhoneConsole to act as browser WebRTC softphone device
  app.get("/api/twilio/token", (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
      return res.json({ 
        token: null, 
        warning: "Twilio credentials omitted. WebRTC client will work in visual-audio simulations." 
      });
    }

    try {
      const AccessToken = twilio.jwt.AccessToken;
      const VoiceGrant = AccessToken.VoiceGrant;

      const identity = "admin_identity";
      const token = new AccessToken(accountSid, apiKey, apiSecret, { 
        identity,
        ttl: 3600
      });

      const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: twimlAppSid,
        incomingAllow: true
      });
      token.addGrant(voiceGrant);

      res.json({ token: token.toJwt(), identity });
    } catch (e: any) {
      console.error("Failed to generate Twilio capability token:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // 2. Admin heartbeats to verify presence
  app.post("/api/twilio/heartbeat", (req, res) => {
    const { adminId } = req.body;
    const key = adminId || "default_admin";
    adminHeartbeats.set(key, Date.now());
    
    res.json({
      success: true,
      activeAdmins: getActiveAdminCount(),
      online: true
    });
  });

  // 3. Primary Incoming Call Twilio Webhook
  app.post("/api/twilio/voice", async (req, res) => {
    const callSid = req.body.CallSid || "CALL_" + Math.random().toString(36).substring(7);
    const callerPhone = req.body.From || "Anonymous";
    const callerName = req.body.FromCity ? `${req.body.FromCity} Caller` : "Patient Caller";
    
    const activeAdmins = getActiveAdminCount();
    console.log(`Incoming call webhook! CallSid: ${callSid} | Caller: ${callerPhone} | Active Admins: ${activeAdmins} | Preference Answering: ${activeAnsweringPref}`);

    res.header("Content-Type", "text/xml");

    if (activeAdmins > 0) {
      // 1. Intercept Call Mode
      const callObj: ActiveCall = {
        id: callSid,
        callSid,
        callerPhone,
        callerName,
        status: "ringing",
        transcript: [
          { speaker: "system", text: `Incoming call detected. Answering preference: ${activeAnsweringPref.toUpperCase()}`, timestamp: Date.now() }
        ],
        queue: [],
        silenceCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      activeCalls.set(callSid, callObj);
      await saveCallToFirestore(callObj);

      // Broadcast ringing event
      broadcastCallEvent("call_started", callObj);

      if (activeAnsweringPref === "voice") {
        // Voice Calling Softphone WebRTC Answering Mode
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for calling Summit Orthopedics. Connecting you with our medical coordinator. Please hold.</Say>
  <Dial action="/api/twilio/dial-callback?callSid=${callSid}" timeout="15">
    <Client>admin_identity</Client>
  </Dial>
</Response>`;
        return res.send(twiml);
      } else {
        // Return TwiML with custom greeting and Gather
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for calling Summit Orthopedics. A board certified specialist is studying your call live on screen right now. Please state your name and the clinical symptoms you are experiencing today, and we will translate your request.</Say>
  <Gather action="/api/twilio/gather?callSid=${callSid}" method="POST" input="speech" timeout="5" speechTimeout="auto" />
</Response>`;
        return res.send(twiml);
      }
    } else {
      // 2. No Admin Online - Fallback directly to Voicemail recording
      const callObj: ActiveCall = {
        id: callSid,
        callSid,
        callerPhone,
        callerName,
        status: "voicemail",
        transcript: [
          { speaker: "system", text: "Offline fallback triggered. Directing caller to voicemail.", timestamp: Date.now() }
        ],
        queue: [],
        silenceCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      activeCalls.set(callSid, callObj);
      await saveCallToFirestore(callObj);

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for calling Summit Orthopedics. Our specialists are currently offline or assisting other patients. Please leave your name, callback number, and a secure clinical summary after the tone, and we will get back to you immediately.</Say>
  <Record action="/api/twilio/voicemail?callSid=${callSid}" maxLength="120" playBeep="true" />
</Response>`;
      return res.send(twiml);
    }
  });

  // 3b. Twilio dial callback for when dial-to-client device fails (no-answer, busy, offline)
  app.post("/api/twilio/dial-callback", async (req, res) => {
    const callSid = req.query.callSid as string;
    const dialStatus = req.body.DialCallStatus; // "completed", "busy", "no-answer", "failed", "canceled"

    console.log(`Twilio Dial callback reached! CallSid: ${callSid} | Status: ${dialStatus}`);
    res.header("Content-Type", "text/xml");

    // If dial successfully connected and call completed, just hang up safely
    if (dialStatus === "completed" || dialStatus === "answered") {
      return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
    }

    // Otherwise, redirect caller to voicemail so no call is ever missed!
    const call = activeCalls.get(callSid);
    if (call) {
      call.status = "voicemail";
      call.transcript.push({
        speaker: "system",
        text: `Browser call skipped or unanswered (${dialStatus}). Swapping caller to clinic voicemail.`,
        timestamp: Date.now()
      });
      call.updatedAt = new Date().toISOString();
      await saveCallToFirestore(call);
      broadcastCallEvent("call_updated", call);
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Our coordinator is unable to take your call at this instant. Please leave your name, callback number, and a secure clinical summary after the tone, and we will contact you immediately.</Say>
  <Record action="/api/twilio/voicemail?callSid=${callSid}" maxLength="120" playBeep="true" />
</Response>`;
    return res.send(twiml);
  });

  // 4. Gather Caller Speech processor webhook
  app.post("/api/twilio/gather", async (req, res) => {
    const callSid = req.query.callSid as string;
    const speechResult = req.body.SpeechResult;

    console.log(`Twilio Speech webhook! CallSid: ${callSid} | Speech: "${speechResult}"`);
    res.header("Content-Type", "text/xml");

    const call = activeCalls.get(callSid);
    if (!call) {
      return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
    }

    // Mark the call as fully active now that user responded
    call.status = "active";

    if (speechResult) {
      call.transcript.push({
        speaker: "caller",
        text: speechResult,
        timestamp: Date.now()
      });
      call.silenceCount = 0; // reset silence count
    } else {
      call.silenceCount++;
    }

    call.updatedAt = new Date().toISOString();
    await saveCallToFirestore(call);

    // Broadcast the updated transcript chunk
    broadcastCallEvent("call_updated", call);

    // Dynamic response tree
    let replyTwiml = "";

    // 1. If admin queued words to say, dequeue them
    if (call.queue.length > 0) {
      const phrase = call.queue.shift()!;
      call.transcript.push({
        speaker: "admin",
        text: phrase,
        timestamp: Date.now()
      });
      await saveCallToFirestore(call);
      broadcastCallEvent("call_updated", call);

      replyTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Assistant says: ${phrase}</Say>
  <Gather action="/api/twilio/gather?callSid=${callSid}" method="POST" input="speech" timeout="6" speechTimeout="auto" />
</Response>`;
    } else {
      // If we've had too much silence, politely wrap up
      if (call.silenceCount >= 3) {
        call.status = "completed";
        call.transcript.push({ speaker: "system", text: "Call completed due to inactivity.", timestamp: Date.now() });
        await saveCallToFirestore(call);

        // Summarize
        const analysis = await generateCallSummary(call);
        call.aiSummary = analysis.summary;
        call.aiUrgency = analysis.urgency;
        call.aiIntent = analysis.intent;
        await saveCallToFirestore(call);

        broadcastCallEvent("call_ended", call);

        replyTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for calling. Since we haven't heard from you, we will hang up now. Have a nice day.</Say>
  <Hangup/>
</Response>`;
      } else {
        // Keep checking and collecting
        replyTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather action="/api/twilio/gather?callSid=${callSid}" method="POST" input="speech" timeout="5" speechTimeout="auto">
    <Say voice="alice">Please go ahead, I am listening.</Say>
  </Gather>
</Response>`;
      }
    }

    return res.send(replyTwiml);
  });

  // 5. Voicemail endpoint
  app.post("/api/twilio/voicemail", async (req, res) => {
    const callSid = req.query.callSid as string;
    const voicemailUrl = req.body.RecordingUrl;
    const voicemailDuration = parseInt(req.body.RecordingDuration || "0");

    console.log(`Twilio Voicemail Recorded! CallSid: ${callSid} | File: ${voicemailUrl}`);

    const call = activeCalls.get(callSid);
    if (call) {
      call.status = "completed";
      call.voicemailUrl = voicemailUrl;
      call.voicemailDuration = voicemailDuration;
      call.transcript.push({
        speaker: "system",
        text: `Caller left a ${voicemailDuration}-second voicemail audio file.`,
        timestamp: Date.now()
      });
      
      call.updatedAt = new Date().toISOString();
      await saveCallToFirestore(call);

      // AI summarizes voicemail info
      const analysis = await generateCallSummary(call);
      call.aiSummary = `Caller left a voicemail message recording. ${analysis.summary}`;
      call.aiUrgency = analysis.urgency;
      call.aiIntent = "Voicemail";
      await saveCallToFirestore(call);

      broadcastCallEvent("call_ended", call);
    }

    res.header("Content-Type", "text/xml");
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you, your voicemail message was securely logged. Dr. Morreale will review it shortly. Goodbye.</Say>
  <Hangup/>
</Response>`);
  });

  // 6. Fetch call log records (Historical call lists)
  app.get("/api/calls", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "calls"));
      const records: any[] = [];
      querySnapshot.forEach((doc) => {
        records.push(doc.data());
      });

      // Sort by creation date descending
      records.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(records);
    } catch (err: any) {
      console.error("Failed to load calls list:", err);
      // Fallback to activeCalls values if firestore has permission or initialization lag
      res.json(Array.from(activeCalls.values()).reverse());
    }
  });

  // 7. Interactive action panel (Type-to-TTS and interactive simulator triggers)
  app.post("/api/calls/action", async (req, res) => {
    const { callSid, action, text, callerPhone, callerName } = req.body;

    console.log(`Admin dashboard requested action! Action: ${action} | CallSid: ${callSid}`);

    if (action === "speak") {
      const call = activeCalls.get(callSid);
      if (!call) {
        return res.status(404).json({ error: "Call not active or found." });
      }

      // Add to TTS queue
      call.queue.push(text);
      call.updatedAt = new Date().toISOString();
      await saveCallToFirestore(call);
      
      // If it is simulated - trigger interactive conversational simulator!
      if (call.isSimulated) {
        // Log admin message instantly
        call.transcript.push({
          speaker: "admin",
          text,
          timestamp: Date.now()
        });
        await saveCallToFirestore(call);
        broadcastCallEvent("call_updated", call);

        // Generate simulated patient response using Gemini
        setTimeout(async () => {
          const patientResponseText = await getSimulatedCallerReply(call, text);
          call.transcript.push({
            speaker: "caller",
            text: patientResponseText,
            timestamp: Date.now()
          });
          call.updatedAt = new Date().toISOString();
          await saveCallToFirestore(call);
          broadcastCallEvent("call_updated", call);
        }, 2000);
      }

      return res.json({ success: true, message: "Spoken phrase queued successfully" });
    }

    if (action === "simulate_start") {
      const mockCallSid = "MOCK_" + Math.random().toString(36).substring(5).toUpperCase();
      const num = callerPhone || "+1 (415) 388-9102";
      const name = callerName || "Arthur Pendleton";

      const mockCall: ActiveCall = {
        id: mockCallSid,
        callSid: mockCallSid,
        callerPhone: num,
        callerName: name,
        status: "ringing",
        transcript: [
          { speaker: "system", text: `Simulated patient line opened from ${num}.`, timestamp: Date.now() }
        ],
        queue: [],
        silenceCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSimulated: true
      };

      activeCalls.set(mockCallSid, mockCall);
      await saveCallToFirestore(mockCall);
      broadcastCallEvent("call_started", mockCall);

      // Ringing delay transition to human greeting conversation
      setTimeout(async () => {
        mockCall.status = "active";
        mockCall.transcript.push({
          speaker: "caller",
          text: "Hello! Is Dr. Morreale online? I was looking at your Whartons Jelly and PRP therapies. I have moderate clinical knee pain and am extremely worried about having surgery.",
          timestamp: Date.now()
        });
        mockCall.updatedAt = new Date().toISOString();
        await saveCallToFirestore(mockCall);
        broadcastCallEvent("call_updated", mockCall);
      }, 1500);

      return res.json({ success: true, callSid: mockCallSid });
    }

    if (action === "simulate_hangup") {
      const call = activeCalls.get(callSid);
      if (!call) {
        return res.status(404).json({ error: "Call not active or found." });
      }

      call.status = "completed";
      call.transcript.push({
        speaker: "system",
        text: "Simulated patient disconnected the clinical line.",
        timestamp: Date.now()
      });
      call.updatedAt = new Date().toISOString();
      await saveCallToFirestore(call);

      // Summarize via Gemini
      const analysis = await generateCallSummary(call);
      call.aiSummary = analysis.summary;
      call.aiUrgency = analysis.urgency;
      call.aiIntent = analysis.intent;
      await saveCallToFirestore(call);

      broadcastCallEvent("call_ended", call);
      return res.json({ success: true, message: "Call successfully disconnected." });
    }

    return res.status(400).json({ error: "Invalid console control action specified." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
