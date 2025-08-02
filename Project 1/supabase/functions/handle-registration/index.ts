import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- NEW: Define CORS headers ---
// These headers give your website permission to call the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // --- NEW: Handle preflight OPTIONS request ---
  // This is a security check the browser sends before the real request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { fullName, email, mobile, password } = await req.json();

    const { error: dbError } = await supabase
      .from('registration_requests')
      .insert({ full_name: fullName, email, mobile_no: mobile, password });

    if (dbError) {
      throw dbError; // Throw error to be caught below
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'emammehedi17@gmail.com',
        subject: 'New Access Request for Class Caddy',
        html: `
          <h3>A new user has requested access:</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><em>You can now add this user in your Supabase Auth dashboard.</em></p>
        `
      }),
    });

    // Return success response with CORS headers
    return new Response(JSON.stringify({ message: 'Request submitted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Return error response with CORS headers
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
