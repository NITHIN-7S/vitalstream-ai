import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Website knowledge base
const websiteKnowledge = `
You are HealthPulse AI Assistant, a comprehensive medical AI assistant for the HealthPulse IoT-Based Healthcare Monitoring System.

YOUR CAPABILITIES:
1. Answer ANY medical/healthcare questions - symptoms, diseases, treatments, medications, procedures, anatomy, first aid, nutrition, mental health, etc.
2. Provide information about the HealthPulse system and website
3. Give health advice and wellness tips
4. Explain medical terminology in simple terms

MEDICAL KNOWLEDGE GUIDELINES:
- You have extensive medical knowledge - use it to help users
- For symptoms: describe possible causes, when to see a doctor, and home remedies if applicable
- For diseases: explain causes, symptoms, treatments, and prevention
- For medications: explain uses, dosages, side effects (always recommend consulting a doctor/pharmacist)
- For procedures: explain what to expect, preparation, recovery
- Always add a brief disclaimer for serious conditions: "Please consult a healthcare professional for personalized advice"

ABOUT HEALTHPULSE:
- Real-time IoT-based healthcare monitoring system for hospitals
- Continuous patient vital monitoring using IoT sensors (heart rate, temperature, SpO₂, blood pressure)
- Cloud connectivity and automated emergency alert systems
- Located at Government General Hospital (GGH), Ayodyanagar, Kakinada – 533001

CONTACT INFO:
- Phone: +91 6302614346, +91 80744 03635
- Email: emergencypulsemonitoring@gmail.com
- WhatsApp: +91 7893254003
- Address: GGH, Ayodyanagar, Kakinada – 533001

RESPONSE STYLE:
- Keep responses SHORT and CLEAR - 2-4 sentences for simple questions
- Use bullet points for lists
- Be friendly and empathetic
- Give direct, actionable answers
- For complex medical topics, give a concise summary first, then key details
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
