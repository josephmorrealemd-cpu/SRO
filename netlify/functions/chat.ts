import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the Summit Clinical Assistant, a specialized AI for Summit Regenerative Orthopedics in Westminster, CO. 
Your goal is to help patients understand non-surgical orthopedic options (PRP, Wharton's Jelly, Exosomes, Musculoskeletal Laser) and how consultations evaluate whether these options may fit their situation.

Key Guidelines:
1. Be professional, clinical, and empathetic.
2. Focus on non-surgical alternatives to orthopedic surgery.
3. If a patient mentions a specific joint (knee, shoulder, spine, hip), explain how regenerative medicine targets that area.
4. Mention that we offer "Surgical Second Opinions" to review imaging and discuss non-operative options before proceeding with surgery.
5. Do NOT give definitive medical diagnoses. Use phrases like "Based on our protocols," or "Typically, patients with this condition..."
6. Encourage booking a consultation for a personalized evaluation.
7. Keep responses concise and easy to read (use bullet points if needed).
8. The practice phone number is 720-776-9165.

Tone: High-end, medical, authoritative yet approachable.`;

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
}

interface IncomingMessage {
  role?: string;
  text?: string;
}

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: JSON_HEADERS,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: "Chat service unavailable" }),
    };
  }

  let parsedBody: { messages?: unknown };
  try {
    parsedBody = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: "Invalid request payload" }),
    };
  }

  if (!Array.isArray(parsedBody.messages) || parsedBody.messages.length === 0) {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: "Messages array is required" }),
    };
  }

  const contents = (parsedBody.messages as IncomingMessage[])
    .slice(-30)
    .filter(
      (m): m is { role: string; text: string } =>
        Boolean(m) &&
        typeof m.text === "string" &&
        m.text.trim().length > 0 &&
        m.text.length <= 4000
    )
    .map((m) => ({
      role: m.role === "bot" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.text.trim() }],
    }));

  if (contents.length === 0) {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: "At least one valid message is required" }),
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const reply =
      response.text ||
      "I'm sorry, I couldn't process that. Please try again or call our office directly.";

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ reply }),
    };
  } catch {
    return {
      statusCode: 502,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Unable to generate response right now.",
      }),
    };
  }
};
