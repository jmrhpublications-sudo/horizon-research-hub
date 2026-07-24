import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Escape single quotes for Drive query string
function escapeDriveQuery(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function unauthorized(msg = 'Unauthorized') {
  return new Response(JSON.stringify({ success: false, error: msg }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Require authenticated caller
    const authHeader = req.headers.get('Authorization') || ''
    if (!authHeader.startsWith('Bearer ')) return unauthorized()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData?.user) return unauthorized()
    const user = userData.user
    const userEmail = user.email || ''

    const admin = createClient(supabaseUrl, serviceRoleKey)
    const { data: roleRows } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
    const roles = (roleRows || []).map((r: any) => r.role)
    const isAdmin = roles.includes('admin')
    const isProfessor = roles.includes('professor')

    const body = await req.json()
    const { action, fileName, mimeType, fileData, submissionId, fileId } = body

    // Validate submission ownership for non-admins on upload
    async function assertOwnsSubmission(id: string) {
      if (isAdmin) return true
      const { data } = await admin
        .from('papers')
        .select('author_id')
        .eq('id', id)
        .maybeSingle()
      if (data && data.author_id === user.id) return true
      // Also allow professor submissions
      const { data: ps } = await admin
        .from('professor_submissions')
        .select('professor_id')
        .eq('id', id)
        .maybeSingle()
      return !!(ps && ps.professor_id === user.id)
    }

    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
    const googleRefreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN')
    const googleDriveRootFolderId = Deno.env.get('GOOGLE_DRIVE_ROOT_FOLDER_ID')

    if (!googleClientId || !googleClientSecret || !googleRefreshToken) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Google Drive credentials not configured',
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { google } = await import('https://esm.sh/googleapis@118')
    const auth = new google.auth.OAuth2(googleClientId, googleClientSecret)
    auth.setCredentials({ refresh_token: googleRefreshToken })
    const drive = google.drive({ version: 'v3', auth })

    // Always scope drive ops to caller's own email folder (ignore client-supplied userEmail)
    const scopedEmail = userEmail
    const safeEmail = escapeDriveQuery(scopedEmail)

    if (action === 'createFolder') {
      const query = `name = '${safeEmail}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      const listResponse = await drive.files.list({ q: query, fields: 'files(id, name)' })
      if (listResponse.data.files && listResponse.data.files.length > 0) {
        return new Response(JSON.stringify({ success: true, folderId: listResponse.data.files[0].id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      const folderResponse: any = await drive.files.create({
        requestBody: {
          name: scopedEmail,
          mimeType: 'application/vnd.google-apps.folder',
          parents: googleDriveRootFolderId ? [googleDriveRootFolderId] : [],
        },
        fields: 'id',
      })
      return new Response(JSON.stringify({ success: true, folderId: folderResponse.data.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'upload') {
      if (!submissionId || !fileName || !fileData) {
        return new Response(JSON.stringify({ success: false, error: 'Missing fields' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      const owns = await assertOwnsSubmission(String(submissionId))
      if (!owns) return unauthorized('Not authorized for this submission')

      // Validate file type & size
      const allowedExt = ['pdf', 'doc', 'docx']
      const ext = String(fileName).split('.').pop()?.toLowerCase() || ''
      if (!allowedExt.includes(ext)) {
        return new Response(JSON.stringify({ success: false, error: 'File type not allowed' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      // base64 size estimate: len * 0.75
      const approxBytes = Math.floor((String(fileData).length * 3) / 4)
      const MAX = 25 * 1024 * 1024
      if (approxBytes > MAX) {
        return new Response(JSON.stringify({ success: false, error: 'File too large' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      let userFolderId: string | null = null
      const query = `name = '${safeEmail}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      const listResponse = await drive.files.list({ q: query, fields: 'files(id, name)' })
      if (listResponse.data.files && listResponse.data.files.length > 0) {
        userFolderId = listResponse.data.files[0].id as string
      } else {
        const folderResponse: any = await drive.files.create({
          requestBody: {
            name: scopedEmail,
            mimeType: 'application/vnd.google-apps.folder',
            parents: googleDriveRootFolderId ? [googleDriveRootFolderId] : [],
          },
          fields: 'id',
        })
        userFolderId = folderResponse.data.id
      }

      const submissionFolderName = String(submissionId)
      const safeSub = escapeDriveQuery(submissionFolderName)
      let submissionFolderId: string | null = null
      const subQuery = `name = '${safeSub}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false and '${userFolderId}' in parents`
      const subListResponse = await drive.files.list({ q: subQuery, fields: 'files(id, name)' })
      if (subListResponse.data.files && subListResponse.data.files.length > 0) {
        submissionFolderId = subListResponse.data.files[0].id as string
      } else {
        const subFolderResponse: any = await drive.files.create({
          requestBody: {
            name: submissionFolderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [userFolderId!],
          },
          fields: 'id',
        })
        submissionFolderId = subFolderResponse.data.id
      }

      const binaryData = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0))
      const media = { mimeType, body: new Blob([binaryData], { type: mimeType }) }

      const fileResponse: any = await drive.files.create({
        requestBody: { name: fileName, parents: [submissionFolderId!] },
        media,
        fields: 'id,webViewLink,webContentLink',
      })

      await drive.permissions.create({
        fileId: fileResponse.data.id,
        requestBody: { type: 'anyone', role: 'reader' },
      })

      return new Response(JSON.stringify({
        success: true,
        fileId: fileResponse.data.id,
        webViewLink: fileResponse.data.webViewLink,
        downloadLink: fileResponse.data.webContentLink,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Ownership check for fileId based actions
    async function assertOwnsFileId(fid: string) {
      if (isAdmin || isProfessor) return true
      const { data } = await admin
        .from('papers')
        .select('id')
        .eq('author_id', user.id)
        .contains('attachments', [fid] as any)
      // fallback: check papers listing for a JSON attachment containing the file id
      if (data && data.length > 0) return true
      return false
    }

    if (action === 'getDownloadLink') {
      if (!fileId) return unauthorized('Missing fileId')
      const owns = await assertOwnsFileId(String(fileId))
      if (!owns && !isAdmin && !isProfessor) return unauthorized('Not authorized for this file')
      const fileResponse: any = await drive.files.get({ fileId, fields: 'webContentLink,webViewLink' })
      return new Response(JSON.stringify({
        success: true,
        downloadLink: fileResponse.data.webContentLink,
        webViewLink: fileResponse.data.webViewLink,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'delete') {
      if (!fileId) return unauthorized('Missing fileId')
      if (!isAdmin) {
        const owns = await assertOwnsFileId(String(fileId))
        if (!owns) return unauthorized('Not authorized to delete this file')
      }
      await drive.files.delete({ fileId })
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: false, error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Google Drive error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
