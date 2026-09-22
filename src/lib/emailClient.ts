import { trackEvent } from "./analytics";

export interface TriggerNurtureParams {
  email: string;
  name: string;
  source: "contact" | "booking" | "guide" | "quiz";
  jointConcern?: string;
  templateId?: "welcome_expectations" | "whartons_jelly_vs_prp" | "athletes_exosomes";
}

export async function triggerNurtureSequence(params: TriggerNurtureParams) {
  try {
    const endpoint = params.templateId ? "/api/email/nurture" : "/api/email/trigger-sequence";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    
    // Track analytics event
    trackEvent(
      "nurture_email_triggered",
      window.location.pathname,
      params.source,
      JSON.stringify({ email: params.email, templateId: params.templateId || "sequence_start" })
    );

    return data;
  } catch (error) {
    console.warn("Failed to trigger email nurture sequence:", error);
    return { success: false, error };
  }
}
