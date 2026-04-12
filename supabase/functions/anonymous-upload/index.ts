import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { action, fileName, fileData, contentType, submissionId } = await req.json()

    if (action === 'upload') {
      if (!fileName || !fileData || !submissionId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: fileName, fileData, submissionId' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const folderPath = `anonymous/${submissionId}`
      const storageFileName = `${folderPath}/${Date.now()}_${fileName}`
      
      const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0))
      const blob = new Blob([binaryData], { type: contentType || 'application/octet-stream' })

      const { data, error } = await supabase.storage
        .from('papers')
        .upload(storageFileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: contentType || 'application/octet-stream'
        })

      if (error) {
        console.error('Storage upload error:', error)
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ 
        success: true, 
        filePath: storageFileName
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Unknown action' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ 
      success: false, 
      error: message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})