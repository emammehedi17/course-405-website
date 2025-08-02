import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// You must also add RESEND_API_KEY as a secret in your Supabase project settings
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

Deno.serve(async (req) => {
  const { fullName, email, mobile, password } = await req.json();

  // 1. Insert the request into your database
  const { error: dbError } = await supabase
    .from('registration_requests')
    .insert({ full_name: fullName, email, mobile_no: mobile, password });

  if (dbError) {
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }

  // 2. Send the email notification using Resend
  const emailPayload = {
    from: 'registration-bot@your-domain.com', // You'll need to verify a domain with Resend
    to: 'emammehedi17@gmail.com',
    subject: 'New Registration Request for Class Notes',
    html: `
      <h3>New Access Request:</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Password:</strong> ${password}</p>
    `
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify(emailPayload)
  });

  if (!res.ok) {
    // Even if email fails, the request is in the DB. Don't show error to user.
    console.error('Failed to send email');
  }

  return new Response(JSON.stringify({ message: 'Request received' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});