import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// This function is automatically called when the request comes in
Deno.serve(async (req) => {
  // 1. Initialize Supabase Admin Client
  // This uses secrets stored securely in your Supabase project
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 2. Get the user's data from the submitted form
  const { fullName, email, mobile, password } = await req.json();

  // 3. Save the data to your 'registration_requests' table
  const { error: dbError } = await supabase
    .from('registration_requests')
    .insert({
      full_name: fullName,
      email: email,
      mobile_no: mobile,
      password: password
    });

  if (dbError) {
    console.error('Database Error:', dbError);
    return new Response(JSON.stringify({ error: 'Could not save request.' }), { status: 500 });
  }

  // 4. Send the email notification using your Resend API key
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev', // Resend's required "from" address for testing
      to: 'emammehedi17@gmail.com', // Your email address
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

  if (!emailResponse.ok) {
    console.error('Resend Error:', await emailResponse.text());
    // We still return a success to the user, as their request was saved.
  }

  // 5. Send a success response back to the website
  return new Response(JSON.stringify({ message: 'Request submitted successfully' }), { status: 200 });
});
