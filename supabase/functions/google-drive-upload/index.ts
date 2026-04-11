import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { google } from 'https://esm.sh/googleapis@118'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SCOPES = ['https://www.googleapis.com/auth/drive.file']

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, userEmail, fileName, mimeType, fileData, submissionId, fileId } = await req.json()

    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
    const googleRefreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN')
    const googleDriveRootFolderId = Deno.env.get('GOOGLE_DRIVE_ROOT_FOLDER_ID')

    if (!googleClientId || !googleClientSecret || !googleRefreshToken) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Google Drive credentials not configured' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const auth = new google.auth.OAuth2(googleClientId, googleClientSecret)
    auth.setCredentials({ refresh_token: googleRefreshToken })

    const drive = google.drive({ version: 'v3', auth })

    if (action === 'createFolder') {
      const query = `name = '${userEmail}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      const listResponse = await drive.files.list({ q: query, fields: 'files(id, name)' })

      if (listResponse.data.files && listResponse.data.files.length > 0) {
        return new Response(JSON.stringify({ 
          success: true, 
          folderId: listResponse.data.files[0].id 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const folderMetadata = {
        name: userEmail,
        mimeType: 'application/vnd.google-apps.folder',
        parents: googleDriveRootFolderId ? [googleDriveRootFolderId] : []
      }

      const folderResponse = await drive.files.create({
        resource: folderMetadata,
        fields: 'id'
      })

      return new Response(JSON.stringify({ 
        success: true, 
        folderId: folderResponse.data.id 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'upload') {
      let userFolderId: string | null = null

      const query = `name = '${userEmail}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      const listResponse = await drive.files.list({ q: query, fields: 'files(id, name)' })

      if (listResponse.data.files && listResponse.data.files.length > 0) {
        userFolderId = listResponse.data.files[0].id
      } else {
        const folderMetadata = {
          name: userEmail,
          mimeType: 'application/vnd.google-apps.folder',
          parents: googleDriveRootFolderId ? [googleDriveRootFolderId] : []
        }
        const folderResponse = await drive.files.create({
          resource: folderMetadata,
          fields: 'id'
        })
        userFolderId = folderResponse.data.id
      }

      const submissionFolderName = `${submissionId || 'submission'}`
      let submissionFolderId: string | null = null

      const subQuery = `name = '${submissionFolderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false and '${userFolderId}' in parents`
      const subListResponse = await drive.files.list({ q: subQuery, fields: 'files(id, name)' })

      if (subListResponse.data.files && subListResponse.data.files.length > 0) {
        submissionFolderId = subListResponse.data.files[0].id
      } else {
        const subFolderMetadata = {
          name: submissionFolderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [userFolderId]
        }
        const subFolderResponse = await drive.files.create({
          resource: subFolderMetadata,
          fields: 'id'
        })
        submissionFolderId = subFolderResponse.data.id
      }

      const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0))

      const fileMetadata = {
        name: fileName,
        parents: [submissionFolderId]
      }

      const media = {
        mimeType: mimeType,
        body: new Blob([binaryData], { type: mimeType })
      }

      const fileResponse = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,webViewLink,webContentLink'
      })

      await drive.permissions.create({
        fileId: fileResponse.data.id,
        requestBody: {
          type: 'anyone',
          role: 'reader'
        }
      })

      return new Response(JSON.stringify({ 
        success: true, 
        fileId: fileResponse.data.id,
        webViewLink: fileResponse.data.webViewLink,
        downloadLink: fileResponse.data.webContentLink
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'getDownloadLink') {
      const fileResponse = await drive.files.get({
        fileId: fileId,
        fields: 'webContentLink,webViewLink'
      })

      return new Response(JSON.stringify({ 
        success: true,
        downloadLink: fileResponse.data.webContentLink,
        webViewLink: fileResponse.data.webViewLink
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      await drive.files.delete({ fileId })

      return new Response(JSON.stringify({ success: true }), {
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

  } catch (error) {
    console.error('Google Drive error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})