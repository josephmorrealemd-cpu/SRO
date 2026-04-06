import { collection, addDoc, serverTimestamp, setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const SESSION_ID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const trackEvent = async (type: 'page_view' | 'click' | 'ai_interaction', page: string, element?: string) => {
  try {
    const eventData: any = {
      type,
      page,
      sessionId: SESSION_ID,
      createdAt: serverTimestamp()
    };
    
    if (element) {
      eventData.element = element;
    }

    await addDoc(collection(db, "analytics_events"), eventData);
  } catch (error) {
    console.error("Error tracking event:", error);
  }
};

export const updateHeartbeat = async (page: string) => {
  try {
    await setDoc(doc(db, "active_sessions", SESSION_ID), {
      sessionId: SESSION_ID,
      lastActive: serverTimestamp(),
      page
    });
  } catch (error) {
    console.error("Error updating heartbeat:", error);
  }
};

export const getSessionId = () => SESSION_ID;
