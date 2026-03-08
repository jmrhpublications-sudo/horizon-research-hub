import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, authorName, authorEmail, discipline, paperType } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    // Log the submission for admin visibility
    console.log(`📄 New ${paperType} submission: "${title}" by ${authorName} (${authorEmail}) — ${discipline}`)

    // If Resend API key is configured, send email notification
    if (resendApiKey) {
      const emailBody = `
        <h2>New Manuscript Submission</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Title</td><td style="padding:8px;border:1px solid #ddd">${title}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Author</td><td style="padding:8px;border:1px solid #ddd">${authorName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Email</td><td style="padding:8px;border:1px solid #ddd">${authorEmail}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Discipline</td><td style="padding:8px;border:1px solid #ddd">${discipline}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Type</td><td style="padding:8px;border:1px solid #ddd">${paperType}</td></tr>
        </table>
        <p style="margin-top:16px">Please review this submission in the <a href="https://jmrh.lovable.app/secure/admin/dashboard">Admin Dashboard</a>.</p>
      `

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'JMRH Publications <onboarding@resend.dev>',
          to: ['submit.jmrh@gmail.com'],
          subject: `New ${paperType} Submission: ${title} — by ${authorName}`,
          html: emailBody,
        }),
      })

      const emailResult = await res.json()
      console.log('Email sent:', emailResult)
    } else {
      console.log('⚠️ RESEND_API_KEY not configured — email notification skipped. Submission saved to database.')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Notification error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
