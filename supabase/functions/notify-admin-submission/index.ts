const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function escapeHtml(v: unknown): string {
  const s = typeof v === 'string' ? v : String(v ?? '')
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitizeText(v: unknown, max = 500): string {
  const s = typeof v === 'string' ? v : String(v ?? '')
  return s.slice(0, max)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const title = sanitizeText(body.title, 300)
    const authorName = sanitizeText(body.authorName, 200)
    const authorEmail = sanitizeText(body.authorEmail, 200)
    const discipline = sanitizeText(body.discipline, 200)
    const paperType = sanitizeText(body.paperType, 50)

    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    console.log(`📄 New ${paperType} submission received`)

    if (resendApiKey) {
      const emailBody = `
        <h2>New Manuscript Submission</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Title</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(title)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Author</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(authorName)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Email</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(authorEmail)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Discipline</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(discipline)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border:1px solid #ddd">Type</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(paperType)}</td></tr>
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
          subject: `New ${escapeHtml(paperType)} Submission`,
          html: emailBody,
        }),
      })

      const emailResult = await res.json()
      console.log('Email sent:', emailResult?.id ?? 'ok')
    } else {
      console.log('⚠️ RESEND_API_KEY not configured — email notification skipped.')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Notification error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
