import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { patientName, deviceNumber } = await req.json();

    if (!patientName) {
      return new Response(JSON.stringify({ error: "Patient name is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmedName = patientName.trim();
    console.log("Looking for patient:", trimmedName);

    // Find the patient by name (case-insensitive, not yet discharged)
    const { data: patient, error: patientError } = await supabaseAdmin
      .from("patients")
      .select("id, user_id, doctor_id, name, email, room")
      .ilike("name", trimmedName)
      .eq("is_discharged", false)
      .limit(1)
      .maybeSingle();

    console.log("Query result:", JSON.stringify({ patient, patientError }));

    if (patientError || !patient) {
      return new Response(JSON.stringify({ error: "Patient not found or already discharged" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Disconnect any connected device for this patient
    await supabaseAdmin
      .from("device_activity")
      .update({
        patient_id: null,
        status: "not_connected",
        heart_rate: null,
        oxygen_level: null,
        body_temperature: null,
        steps: null,
      })
      .eq("patient_id", patient.id);

    // Also disconnect from devices table
    await supabaseAdmin
      .from("devices")
      .update({ patient_id: null, status: "available", doctor_id: null })
      .eq("patient_id", patient.id);

    // 2. Mark patient as discharged and unassign from doctor
    await supabaseAdmin
      .from("patients")
      .update({
        is_discharged: true,
        discharged_at: new Date().toISOString(),
        doctor_id: null,
        status: "normal",
      })
      .eq("id", patient.id);

    // 3. Ban the user so they can't login anymore
    if (patient.user_id) {
      await supabaseAdmin.auth.admin.updateUserById(patient.user_id, {
        ban_duration: "876600h", // ~100 years
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        patient: {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          room: patient.room,
          discharged_at: new Date().toISOString(),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
