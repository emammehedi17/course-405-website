import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// IMPORTANT: Edge Functions have their own environment variables.
// You must set these in your project's dashboard:
// Go to Project Settings > Edge Functions > Add New Secret
// Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response('Email and password are required', { status: 400 });
  }

  try {
    // Step 1: Check if the user's email is pre-approved
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      throw new Error('Invalid credentials');
    }

    const userId = userData.id;

    // Step 2: Check if the password is valid and UNUSED
    const { data: passwordData, error: passwordError } = await supabase
      .from('passwords')
      .select('id, claimed_by_user_id')
      .eq('password_value', password)
      .single();

    if (passwordError || !passwordData) {
      throw new Error('Invalid credentials');
    }

    // Step 3: If password is valid, check if it's already claimed
    if (passwordData.claimed_by_user_id) {
      // If it's claimed, check if it's claimed by the CURRENT user
      if (passwordData.claimed_by_user_id === userId) {
        // This is a valid, returning user. Allow login.
        return new Response(JSON.stringify({ message: 'Login successful' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Password is valid but claimed by SOMEONE ELSE. Deny.
        throw new Error('Invalid credentials');
      }
    } else {
      // Step 4: Password is valid and unclaimed. Claim it now.
      const { error: updateError } = await supabase
        .from('passwords')
        .update({ is_used: true, claimed_by_user_id: userId })
        .eq('id', passwordData.id);

      if (updateError) {
        throw new Error('Could not claim password');
      }

      // New user login successful
      return new Response(JSON.stringify({ message: 'Login and registration successful' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});