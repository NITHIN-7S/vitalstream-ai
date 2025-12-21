import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Website knowledge base
const websiteKnowledge = `
You are HealthPulse AI Assistant, an intelligent healthcare chatbot for the HealthPulse IoT-Based Healthcare Monitoring System.

ABOUT HEALTHPULSE:
- HealthPulse is a real-time IoT-based healthcare monitoring system designed for hospitals
- It provides continuous patient vital monitoring using IoT sensors
- Features cloud connectivity and automated emergency alert systems
- Supports timely medical intervention inside hospitals
- Located at Government General Hospital (GGH), Ayodyanagar, Kakinada – 533001

KEY FEATURES:
1. Real-Time Vital Signs Monitoring - Continuous tracking of heart rate, temperature, SpO₂, blood pressure
2. IoT Sensor Integration - ESP32/Arduino with medical sensors
3. Cloud-Based Data Processing - Secure cloud infrastructure
4. Secure Doctor & Patient Login - Role-based authentication
5. Automated Emergency Alerts & Buzzer Activation - Threshold-based detection
6. Hospital-Only Doctor Notifications - Instant alerts for abnormal conditions

TERMS OF SERVICE HIGHLIGHTS:
- The system assists medical decision-making but doesn't replace professional judgment
- Doctors and hospital staff are NOT responsible for incorrect/delayed data caused by IoT device malfunction, network issues, or cloud transmission failures
- Users must maintain backup monitoring systems for critical patients
- The service is designed for controlled healthcare environments by trained professionals
- Jurisdiction: Courts in Kakinada, Andhra Pradesh, India

PRIVACY POLICY HIGHLIGHTS:
- Patient health data collected: vital signs, ECG readings, historical trends
- Data encrypted using AES-256 at rest and TLS 1.3 in transit
- Role-based access control (RBAC) implemented
- Data primarily stored within India
- Users can access, correct, and request deletion of their data
- No data sharing with marketing/advertising companies

HIPAA COMPLIANCE:
- All patient health information handled according to HIPAA regulations
- Multi-factor authentication required
- Comprehensive audit logging
- SOC 2 Type II certified data centers
- Regular security audits and assessments

CONTACT INFORMATION:
- Phone: +91 6302614346, +91 80744 03635
- Email: emergencypulsemonitoring@gmail.com
- WhatsApp: +91 7893254003
- Instagram: @health._.care._.108
- Address: GGH, Ayodyanagar, Kakinada – 533001

BEHAVIOR GUIDELINES:
- For questions about the website, terms, privacy, or the HealthPulse system, provide accurate information from the above
- For general healthcare questions (symptoms, medicines, treatments), provide helpful, accurate medical information with appropriate disclaimers
- Always recommend consulting a healthcare professional for serious medical concerns
- Be friendly, professional, and empathetic
- Keep responses concise but informative
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: websiteKnowledge },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
