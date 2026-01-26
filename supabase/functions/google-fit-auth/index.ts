import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const googleClientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
  const googleClientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Generate OAuth URL for Google Fit
    if (action === "get-auth-url") {
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

      const redirectUri = `${supabaseUrl}/functions/v1/google-fit-auth?action=callback`;
      
      const scopes = [
        "https://www.googleapis.com/auth/fitness.heart_rate.read",
        "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
        "https://www.googleapis.com/auth/fitness.activity.read",
        "https://www.googleapis.com/auth/fitness.body.read",
      ].join(" ");

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${user.id}`;

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle OAuth callback
    if (action === "callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state"); // This is the doctor's user ID
      const error = url.searchParams.get("error");

      if (error) {
        // Redirect to dashboard with error
        return new Response(null, {
          status: 302,
          headers: {
            ...corsHeaders,
            "Location": `${supabaseUrl.replace('.supabase.co', '')}/dashboard/doctor?google_fit_error=${error}`,
          },
        });
      }

      if (!code || !state) {
        return new Response(JSON.stringify({ error: "Missing code or state" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const redirectUri = `${supabaseUrl}/functions/v1/google-fit-auth?action=callback`;

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        console.error("Token exchange error:", tokenData);
        return new Response(null, {
          status: 302,
          headers: {
            Location: `${url.origin.replace('functions/v1/google-fit-auth', '')}/dashboard/doctor?google_fit_error=token_exchange_failed`,
          },
        });
      }

      // Store tokens using service role (bypass RLS)
      const supabaseAdmin = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

      const { error: upsertError } = await supabaseAdmin
        .from("doctor_google_fit")
        .upsert({
          doctor_id: state,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: expiresAt.toISOString(),
        }, { onConflict: "doctor_id" });

      if (upsertError) {
        console.error("Error storing tokens:", upsertError);
        return new Response(null, {
          status: 302,
          headers: {
            Location: `/dashboard/doctor?google_fit_error=storage_failed`,
          },
        });
      }

      // Get the origin from the referer or use a default
      const origin = req.headers.get("origin") || req.headers.get("referer")?.split("/").slice(0, 3).join("/") || "";
      
      // Redirect to dashboard with success
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${origin}/dashboard/doctor?google_fit_connected=true`,
        },
      });
    }

    // Check connection status
    if (action === "check-status") {
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
        return new Response(JSON.stringify({ connected: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: fitData } = await supabase
        .from("doctor_google_fit")
        .select("id, token_expires_at, last_sync_at")
        .eq("doctor_id", user.id)
        .maybeSingle();

      return new Response(JSON.stringify({ 
        connected: !!fitData,
        lastSync: fitData?.last_sync_at,
        tokenExpired: fitData ? new Date(fitData.token_expires_at) < new Date() : false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
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
