import { Resend } from "resend";

export type EmailTemplateId = 
  | "welcome_expectations" 
  | "whartons_jelly_vs_prp" 
  | "athletes_exosomes";

export interface EmailRecipient {
  email: string;
  name: string;
  jointConcern?: string;
  source?: "contact" | "booking" | "guide" | "quiz";
}

export interface EmailTemplate {
  id: EmailTemplateId;
  subject: string;
  title: string;
  preheader: string;
  generateHtml: (data: EmailRecipient) => string;
}

export const EMAIL_TEMPLATES: Record<EmailTemplateId, EmailTemplate> = {
  welcome_expectations: {
    id: "welcome_expectations",
    subject: "Welcome to Summit Regenerative Orthopedics: What to Expect",
    title: "Welcome + What to Expect",
    preheader: "Your personalized roadmap to avoiding joint surgery and restoring natural mobility.",
    generateHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #0f172a; padding: 32px 24px; text-align: center; }
    .logo { color: #14b8a6; font-weight: 800; font-size: 20px; letter-spacing: 0.1em; text-transform: uppercase; }
    .header h1 { color: #ffffff; font-size: 22px; margin: 12px 0 0 0; font-weight: 700; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 15px; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #0f172a; }
    .badge { display: inline-block; background: #ccfbf1; color: #0f766e; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; margin-bottom: 16px; }
    .callout { background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 16px; border-radius: 8px; margin: 20px 0; }
    .steps { margin: 24px 0; padding: 0; list-style: none; }
    .step-item { display: flex; margin-bottom: 16px; }
    .step-num { background: #0f766e; color: #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; margin-right: 12px; shrink-0; }
    .step-text strong { display: block; color: #0f172a; }
    .btn { display: inline-block; background: #0d9488; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: 700; margin: 20px 0 10px 0; text-align: center; }
    .footer { background: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Summit Regenerative Orthopedics</div>
      <h1>Your Non-Surgical Recovery Pathway</h1>
    </div>
    <div class="content">
      <div class="badge">Board-Certified Orthopedic Care</div>
      <div class="greeting">Hello ${data.name || "there"},</div>
      <p>Thank you for reaching out to <strong>Summit Regenerative Orthopedics</strong>. Whether you're dealing with chronic osteoarthritis, an athletic tendon injury, or have been told that joint replacement is your only option, our mission is to restore your joint biomechanics without surgery.</p>
      
      <div class="callout">
        <strong>Our Clinical Philosophy:</strong> Unlike traditional pain clinics that rely on cortisone injections—which scientific literature shows can accelerate cartilage degeneration—we focus on <em>biologic restoration</em> using Wharton's Jelly, Exosomes, targeted PRP, and high-intensity MSK laser.
      </div>

      <p><strong>What to Expect from Your Clinical Evaluation:</strong></p>
      <div class="steps">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text"><strong>Surgeon-Led Diagnostic Review:</strong> High-resolution review of existing MRIs, X-rays, and dynamic in-office musculoskeletal ultrasound to evaluate tissue integrity in real time.</div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text"><strong>Customized Biologic Protocol:</strong> We match your exact pathology to the right biological tool—structural Wharton's Jelly scaffolding, exosome cellular signaling, or concentrated PRP.</div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text"><strong>Precision Image-Guided Delivery:</strong> Every treatment is performed with pinpoint ultrasound guidance for millimeter accuracy.</div>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="https://summitregenerativeortho.com/pain-quiz" class="btn">Take the 2-Minute Pain Quiz</a>
        <br>
        <span style="font-size: 13px; color: #64748b;">Or call our Westminster clinic directly at <a href="tel:7207769165" style="color: #0d9488; font-weight: 600;">(720) 776-9165</a></span>
      </div>
    </div>
    <div class="footer">
      <p><strong>Summit Regenerative Orthopedics</strong><br>8753 Yates Drive, Suite 110, Westminster, CO 80031<br>Direct Phone: 720-776-9165 | Office Hours: Mon-Thu 8am-5pm, Fri 8am-1pm</p>
      <p style="margin-top: 10px; font-size: 11px;">You received this email because you interacted with Summit Regenerative Orthopedics online.</p>
    </div>
  </div>
</body>
</html>
`
  },

  whartons_jelly_vs_prp: {
    id: "whartons_jelly_vs_prp",
    subject: "Wharton's Jelly vs PRP: The Truth About Cartilage Restoration",
    title: "Wharton’s Jelly vs PRP",
    preheader: "Why platelets alone aren't enough for severe joint wear, and where Wharton's Jelly excels.",
    generateHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #0f172a; padding: 32px 24px; text-align: center; }
    .logo { color: #14b8a6; font-weight: 800; font-size: 20px; letter-spacing: 0.1em; text-transform: uppercase; }
    .header h1 { color: #ffffff; font-size: 22px; margin: 12px 0 0 0; font-weight: 700; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 15px; }
    .table-box { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    .table-box th { background: #0f766e; color: #ffffff; padding: 10px; text-align: left; }
    .table-box td { border-bottom: 1px solid #e2e8f0; padding: 10px; }
    .table-box tr:nth-child(even) { background: #f8fafc; }
    .highlight { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .btn { display: inline-block; background: #0d9488; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: 700; margin: 20px 0 10px 0; }
    .footer { background: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Summit Regenerative Orthopedics</div>
      <h1>Wharton's Jelly vs PRP: Clinical Comparison</h1>
    </div>
    <div class="content">
      <p>Dear ${data.name || "Patient"},</p>
      <p>One of the most common questions patients ask Dr. Morreale is: <em>"I've heard about PRP for joint pain, but how does it compare to Wharton's Jelly?"</em></p>
      <p>While Platelet-Rich Plasma (PRP) has transformed sports medicine for mild tendon sprains, <strong>osteoarthritis and cartilage degradation represent an entirely different clinical challenge.</strong></p>

      <table class="table-box">
        <thead>
          <tr>
            <th>Clinical Factor</th>
            <th>PRP (Platelet-Rich Plasma)</th>
            <th>Wharton's Jelly Allograft</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Biological Source</strong></td>
            <td>Patient's own blood platelets</td>
            <td>Umbilical cord extracellular matrix</td>
          </tr>
          <tr>
            <td><strong>Structural Cushioning</strong></td>
            <td>None (liquid growth factors)</td>
            <td>High (rich in Hyaluronic Acid & Collagens)</td>
          </tr>
          <tr>
            <td><strong>Cartilage Scaffolding</strong></td>
            <td>Low</td>
            <td>High (provides 3D biological scaffold)</td>
          </tr>
          <tr>
            <td><strong>Ideal Candidate</strong></td>
            <td>Mild-to-moderate tendon/ligament strains</td>
            <td>Moderate-to-severe OA, cartilage thinning</td>
          </tr>
          <tr>
            <td><strong>Need to Avoid Surgery</strong></td>
            <td>Moderate success in severe OA</td>
            <td>High potential to delay/avoid arthroplasty</td>
          </tr>
        </tbody>
      </table>

      <div class="highlight">
        <h4 style="margin: 0 0 8px 0; color: #0f766e;">The Dual Biologics Protocol</h4>
        <p style="margin: 0; font-size: 14px;">At Summit, our premier regenerative protocol combines <strong>Wharton's Jelly</strong> (which provides the structural matrix cushion) with <strong>Exosomes</strong> (which deliver the nanoscale cellular instructions to calm inflammation and trigger cartilage chondrocytes).</p>
      </div>

      <div style="text-align: center;">
        <a href="https://summitregenerativeortho.com/biologics-decision" class="btn">Explore the Biologics Decision Tool</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>Summit Regenerative Orthopedics</strong> | 8753 Yates Drive, Suite 110, Westminster, CO 80031<br>Call 720-776-9165 for clinical appointments</p>
    </div>
  </div>
</body>
</html>
`
  },

  athletes_exosomes: {
    id: "athletes_exosomes",
    subject: "Why Athletes Choose Exosomes for Rapid Non-Surgical Recovery",
    title: "Why Athletes Choose Exosomes",
    preheader: "Nanoscale cellular signaling for accelerated tendon and ligament remodeling without surgical scar tissue.",
    generateHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #0f172a; padding: 32px 24px; text-align: center; }
    .logo { color: #14b8a6; font-weight: 800; font-size: 20px; letter-spacing: 0.1em; text-transform: uppercase; }
    .header h1 { color: #ffffff; font-size: 22px; margin: 12px 0 0 0; font-weight: 700; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 15px; }
    .feature-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 14px 0; }
    .feature-card h4 { margin: 0 0 6px 0; color: #0f766e; }
    .btn { display: inline-block; background: #0d9488; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: 700; margin: 20px 0 10px 0; }
    .footer { background: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Summit Regenerative Orthopedics</div>
      <h1>Why Athletes Choose Exosomes</h1>
    </div>
    <div class="content">
      <p>Dear ${data.name || "Athlete"},</p>
      <p>When you're an athlete, CrossFit competitor, runner, or weekend warrior, time away from training is devastating. Surgery carries substantial risks: permanent biomechanical alteration, formation of restrictive scar tissue, and months of grueling rehabilitation.</p>

      <p><strong>Enter Exosome Signaling Therapy:</strong> The next generation of orthopedic regenerative medicine.</p>

      <div class="feature-card">
        <h4>1. Nanoscale Biological Couriers</h4>
        <p style="margin: 0; font-size: 14px;">Exosomes are microscopic extracellular vesicles (30–150 nm) naturally produced by cells to communicate with one another. They carry targeted regulatory microRNAs, mRNAs, and active signaling peptides directly into damaged tissues.</p>
      </div>

      <div class="feature-card">
        <h4>2. Up-Regulating Cellular Repair Without Scarring</h4>
        <p style="margin: 0; font-size: 14px;">Upon injection under direct ultrasound guidance, exosomes bind to recipient tenocytes and chondrocytes, signaling them to synthesize organized collagen and switch off the inflammatory cascade.</p>
      </div>

      <div class="feature-card">
        <h4>3. Zero Surgical Downtime</h4>
        <p style="margin: 0; font-size: 14px;">No hospital admission, no general anesthesia, and no crutches. Most athletic patients resume light activity within 48 to 72 hours, protecting their hard-earned conditioning.</p>
      </div>

      <div style="text-align: center;">
        <a href="https://summitregenerativeortho.com/pain-quiz" class="btn">Check Your Treatment Compatibility</a>
        <br>
        <span style="font-size: 13px; color: #64748b;">Or schedule an athletic orthopedic consult at <a href="tel:7207769165" style="color: #0d9488; font-weight: 600;">(720) 776-9165</a></span>
      </div>
    </div>
    <div class="footer">
      <p><strong>Summit Regenerative Orthopedics</strong> | Westminster, CO<br>Board-Certified Orthopedic Surgeon Joseph Morreale, MD</p>
    </div>
  </div>
</body>
</html>
`
  }
};

export async function sendNurtureEmail(
  templateId: EmailTemplateId,
  recipient: EmailRecipient
): Promise<{ success: boolean; simulated?: boolean; id?: string; error?: string }> {
  const template = EMAIL_TEMPLATES[templateId];
  if (!template) {
    return { success: false, error: `Invalid template ID: ${templateId}` };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || "consult@summitregenerativeortho.com";

  if (!resendApiKey) {
    console.log(`[Email Nurture Sequence] SIMULATED DISPATCH (${templateId}) to ${recipient.email} (${recipient.name}): "${template.subject}"`);
    return {
      success: true,
      simulated: true,
      id: `sim_${Date.now()}_${templateId}`,
    };
  }

  try {
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: `Summit Regenerative Orthopedics <${senderEmail}>`,
      to: [recipient.email],
      subject: template.subject,
      html: template.generateHtml(recipient),
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return { success: false, error: error.message };
    }

    console.log(`[Resend Success] Sent email ${data?.id} (${templateId}) to ${recipient.email}`);
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("[Email Dispatch Exception]:", err);
    return { success: false, error: err.message };
  }
}

export async function sendAdminNotificationEmail(data: {
  type: "contact" | "booking" | "sms" | "quiz" | "guide";
  name: string;
  email: string;
  phone?: string;
  details: string;
}): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmails = ["team@watch1do1.com", "josephmorrealemd@gmail.com"];
  const senderEmail = process.env.SENDER_EMAIL || "consult@summitregenerativeortho.com";

  if (!resendApiKey) {
    console.log(`[Admin Notification Alert] SIMULATED to ${adminEmails.join(", ")}: New ${data.type.toUpperCase()} from ${data.name} (${data.email || data.phone})`);
    return { success: true, simulated: true };
  }

  try {
    const resend = new Resend(resendApiKey);
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #0f172a; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="background: #0f172a; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #14b8a6; margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.05em;">New Patient Inquiry: ${data.type.toUpperCase()}</h2>
        </div>
        <p style="margin: 8px 0;"><strong>Sender Name:</strong> ${data.name}</p>
        <p style="margin: 8px 0;"><strong>Email Address:</strong> ${data.email || "N/A"}</p>
        <p style="margin: 8px 0;"><strong>Phone Number:</strong> ${data.phone || "N/A"}</p>
        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-left: 4px solid #0d9488; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #334155; margin-bottom: 6px;">Message / Inquiry Details:</p>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${data.details}</p>
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">
          Summit Regenerative Orthopedics Practice Management & Clinical Portal
        </p>
      </div>
    `;
    await resend.emails.send({
      from: `Summit Clinic Inquiries <${senderEmail}>`,
      to: adminEmails,
      subject: `[Practice Alert] New ${data.type.toUpperCase()} Inquiry from ${data.name}`,
      html
    });
    console.log(`[Admin Notification Alert] Sent email to ${adminEmails.join(", ")} for ${data.type}`);
    return { success: true };
  } catch (err: any) {
    console.error("[Admin Notification Error]:", err);
    return { success: false, error: err.message };
  }
}
