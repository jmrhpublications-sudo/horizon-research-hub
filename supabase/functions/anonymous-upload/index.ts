import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALLOWED_EXT = ['pdf', 'doc', 'docx']
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream',
])
const MAX_BYTES = 25 * 1024 * 1024

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, fileName, fileData, contentType, submissionId } = await req.json()

    if (action !== 'upload') {
      return new Response(JSON.stringify({ success: false, error: 'Unknown action' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!fileName || !fileData || !submissionId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: fileName, fileData, submissionId',
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Validate file type
    const ext = String(fileName).split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXT.includes(ext)) {
      return new Response(JSON.stringify({ success: false, error: 'File type not allowed' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (contentType && !ALLOWED_MIME.has(String(contentType))) {
      return new Response(JSON.stringify({ success: false, error: 'Content type not allowed' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validate size (base64 approx)
    const approxBytes = Math.floor((String(fileData).length * 3) / 4)
    if (approxBytes > MAX_BYTES) {
      return new Response(JSON.stringify({ success: false, error: 'File exceeds 25MB limit' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify the submission exists and is pending
    const { data: paper } = await supabase
      .from('papers')
      .select('id, status')
      .eq('id', submissionId)
      .maybeSingle()
    if (!paper) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid submission' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Sanitize filename
    const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200)
    const folderPath = `anonymous/${submissionId}`
    const storageFileName = `${folderPath}/${Date.now()}_${safeName}`

    const binaryData = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0))
    const blob = new Blob([binaryData], { type: contentType || 'application/octet-stream' })

    const { error } = await supabase.storage
      .from('papers')
      .upload(storageFileName, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: contentType || 'application/octet-stream',
      })

    if (error) {
      console.error('Storage upload error:', error)
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, filePath: storageFileName }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
