import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generatePassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is a receptionist
    const { data: roleData } = await supabaseAdmin.rpc('get_user_role', { _user_id: user.id });
    if (roleData !== 'receptionist') {
      return new Response(
        JSON.stringify({ error: 'Only receptionists can register doctors' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { email, full_name, specialization, phone, department } = body;

    if (!email || !full_name || !specialization || !phone) {
      return new Response(
        JSON.stringify({ error: 'Email, full name, specialization, and phone are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const password = generatePassword(10);

    let userId: string;

    // Try to create auth user, handle existing user case
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role: 'doctor' }
    });

    if (authError) {
      // If user already exists, find them and update their password
      if (authError.message.includes('already been registered')) {
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users?.find(u => u.email === email);
        
        if (!existingUser || listError) {
          return new Response(
            JSON.stringify({ error: 'User exists but could not be found' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        userId = existingUser.id;

        // Update password and metadata
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password,
          user_metadata: { full_name, role: 'doctor' }
        });

        // Clean up old data for this user
        await supabaseAdmin.from('doctor_profiles').delete().eq('user_id', userId);
        await supabaseAdmin.from('user_roles').delete().eq('user_id', userId);
      } else {
        return new Response(
          JSON.stringify({ error: authError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      userId = authData.user!.id;
    }

    // Create user role
    await supabaseAdmin.from('user_roles').insert({
      user_id: userId,
      role: 'doctor'
    });

    // Create doctor profile with stored password
    const { data: doctorData, error: doctorError } = await supabaseAdmin
      .from('doctor_profiles')
      .insert({
        user_id: userId,
        full_name,
        specialization,
        phone,
        department: department || null,
        stored_password: password
      })
      .select()
      .single();

    if (doctorError) {
      return new Response(
        JSON.stringify({ error: doctorError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        doctor: doctorData,
        credentials: { email, password },
        message: 'Doctor registered successfully.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
