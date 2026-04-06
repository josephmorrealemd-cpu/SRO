import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Activity, ShieldCheck, RefreshCw, User, Bot } from "lucide-react";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

const SYSTEM_INSTRUCTION = `You are the Summit Clinical Assistant, a specialized AI for Summit Regenerative Orthopedics in Westminster, CO. 
Your goal is to help patients understand regenerative medicine (PRP, Wharton's Jelly, Exosomes, Musculoskeletal Laser) and how it can help them avoid surgery.

Key Guidelines:
1. Be professional, clinical, and empathetic.
2. Focus on non-surgical alternatives to orthopedic surgery.
3. If a patient mentions a specific joint (knee, shoulder, spine, hip), explain how regenerative medicine targets that area.
4. Mention that we offer "Surgical Second Opinions" to help patients avoid unnecessary operations.
5. Do NOT give definitive medical diagnoses. Use phrases like "Based on our protocols," or "Typically, patients with this condition..."
6. Encourage booking a consultation for a personalized evaluation.
7. Keep responses concise and easy to read (use bullet points if needed).
8. The practice phone number is 720-776-9165.

Tone: High-end, medical, authoritative yet approachable.`;

export default function ClinicalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hello! I'm the Summit Clinical Assistant. How can I help you explore regenerative options for your orthopedic health today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map((m) => ({
            role: m.role === "bot" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
          { role: "user", parts: [{ text: input }] },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const botMessage: Message = {
        role: "bot",
        text: response.text || "I'm sorry, I couldn't process that. Please try again or call our office directly.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Assistant Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I'm having trouble connecting right now. Please feel free to call us at 720-776-9165 for immediate assistance.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-16 h-16 bg-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all hover:scale-110 hover:bg-teal-700 active:scale-95 group",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold animate-pulse">
          1
        </div>
        <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-[400px] max-w-[calc(100vw-40px)] h-[600px] max-h-[calc(100vh-100px)] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col z-50 border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-teal-500/10 blur-3xl -z-10" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-600/20">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg leading-none">Clinical Assistant</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Summit Regenerative</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    m.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    m.role === "bot" ? "bg-teal-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                  )}>
                    {m.role === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    m.role === "bot" 
                      ? "bg-white text-slate-700 border border-slate-100 rounded-tl-none" 
                      : "bg-teal-600 text-white rounded-tr-none"
                  )}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center text-white shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about a treatment or injury..."
                  className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-50 disabled:hover:bg-teal-600"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-teal-500" />
                Powered by Summit Clinical AI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
