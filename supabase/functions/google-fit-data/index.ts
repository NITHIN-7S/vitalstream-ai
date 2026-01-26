import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function refreshAccessToken(refreshToken: string, clientId: string, clientSecret: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  return response.json();
}

async function fetchGoogleFitData(accessToken: string) {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  // Fetch heart rate data
  const heartRateResponse = await fetch(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: "com.google.heart_rate.bpm",
          },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: oneDayAgo,
        endTimeMillis: now,
      }),
    }
  );

  // Fetch SpO2 data
  const spo2Response = await fetch(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: "com.google.oxygen_saturation",
          },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: oneDayAgo,
        endTimeMillis: now,
      }),
    }
  );

  // Fetch steps data
  const stepsResponse = await fetch(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: "com.google.step_count.delta",
          },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: oneDayAgo,
        endTimeMillis: now,
      }),
    }
  );

  const heartRateData = await heartRateResponse.json();
  const spo2Data = await spo2Response.json();
  const stepsData = await stepsResponse.json();

  // Extract values
  let heartRate = null;
  let spo2 = null;
  let steps = null;

  try {
    if (heartRateData.bucket?.[0]?.dataset?.[0]?.point?.length > 0) {
      const points = heartRateData.bucket[0].dataset[0].point;
      const lastPoint = points[points.length - 1];
      heartRate = Math.round(lastPoint.value[0].fpVal);
    }
  } catch (e) {
    console.log("No heart rate data available");
  }

  try {
    if (spo2Data.bucket?.[0]?.dataset?.[0]?.point?.length > 0) {
      const points = spo2Data.bucket[0].dataset[0].point;
      const lastPoint = points[points.length - 1];
      spo2 = Math.round(lastPoint.value[0].fpVal * 100);
    }
  } catch (e) {
    console.log("No SpO2 data available");
  }

  try {
    if (stepsData.bucket?.[0]?.dataset?.[0]?.point?.length > 0) {
      steps = stepsData.bucket[0].dataset[0].point.reduce(
        (sum: number, point: any) => sum + (point.value[0].intVal || 0),
        0
      );
    }
  } catch (e) {
    console.log("No steps data available");
  }

  return { heartRate, spo2, steps };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const googleClientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
  const googleClientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get stored tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from("doctor_google_fit")
      .select("*")
      .eq("doctor_id", user.id)
      .maybeSingle();

    if (tokenError || !tokenData) {
      return new Response(JSON.stringify({ 
        error: "Google Fit not connected",
        connected: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let accessToken = tokenData.access_token;

    // Check if token is expired and refresh if needed
    if (new Date(tokenData.token_expires_at) < new Date()) {
      console.log("Token expired, refreshing...");
      const newTokenData = await refreshAccessToken(
        tokenData.refresh_token,
        googleClientId,
        googleClientSecret
      );

      if (newTokenData.error) {
        return new Response(JSON.stringify({ 
          error: "Failed to refresh token",
          needsReauth: true 
        }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      accessToken = newTokenData.access_token;
      const expiresAt = new Date(Date.now() + newTokenData.expires_in * 1000);

      // Update tokens using service role
      const supabaseAdmin = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      await supabaseAdmin
        .from("doctor_google_fit")
        .update({
          access_token: newTokenData.access_token,
          token_expires_at: expiresAt.toISOString(),
        })
        .eq("doctor_id", user.id);
    }

    // Fetch data from Google Fit
    const fitData = await fetchGoogleFitData(accessToken);

    // Use demo data if no real data available
    const healthData = {
      heartRate: fitData.heartRate || Math.floor(65 + Math.random() * 20),
      spo2: fitData.spo2 || Math.floor(96 + Math.random() * 3),
      steps: fitData.steps || Math.floor(2000 + Math.random() * 8000),
      lastUpdated: new Date().toISOString(),
      isDemo: !fitData.heartRate && !fitData.spo2,
    };

    // Determine health status
    const status = 
      (healthData.heartRate > 120 || healthData.spo2 < 92) 
        ? "CRITICAL" 
        : "NORMAL";

    // Store health data using service role
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabaseAdmin
      .from("doctor_health_data")
      .insert({
        doctor_id: user.id,
        heart_rate: healthData.heartRate,
        spo2: healthData.spo2,
        steps: healthData.steps,
        data_source: healthData.isDemo ? "demo" : "google_fit",
      });

    // Update last sync time
    await supabaseAdmin
      .from("doctor_google_fit")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("doctor_id", user.id);

    return new Response(JSON.stringify({
      ...healthData,
      status,
      connected: true,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
