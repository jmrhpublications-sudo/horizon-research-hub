# Google Drive Storage Integration - Setup Guide

## What Was Implemented
The following changes have been made for Google Drive integration:

### Backend Files Created
1. **Edge Function**: `supabase/functions/google-drive-upload/index.ts`
   - Handles folder creation by email
   - Handles file uploads to user folders
   - Handles download link generation
   - Handles file deletion

2. **Database Migration**: `supabase/migrations/20260411000000_google_drive_storage.sql`
   - Adds `app_config` table for settings
   - Adds `drive_file_ids` and `drive_folder_id` columns to papers table
   - Adds `storage_type` column

### Frontend Files Created/Modified
1. **File Validation**: `src/lib/file-validation.ts`
   - Validates PDF/DOC files only
   - Size limits: 100KB - 20MB

2. **Google Drive Service**: `src/lib/google-drive.ts`
   - Client service to communicate with edge function
   - Helper functions for upload/download

3. **SubmitPaperPage** (modified)
   - Updated file validation
   - Restricts to PDF/DOC only
   - Updated UI to show new limits

4. **AdminPapers** (modified)
   - Shows Google Drive download buttons
   - Supports both Supabase and Drive attachments
   - ZIP download works with both storage types

## Required Setup (Before Use)

### 1. Set Up Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google Drive API
4. Go to Credentials > Create Credentials > OAuth Client ID
5. Application type: Desktop App
6. Download the credentials JSON

### 2. Configure Supabase Edge Function
In Supabase Dashboard > Edge Functions > google-drive-upload > Settings, add these secrets:
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_ROOT_FOLDER_ID=your_root_folder_id
```

### 3. Get Refresh Token
You need to authorize the application once to get a refresh token:
```bash
# Using the OAuth flow - one-time setup
# The refresh token will be used for API calls
```

### 4. Create Root Folder in Google Drive
1. Create a new folder in Google Drive named "JMRH-Submissions"
2. Get the folder ID from the URL
3. Add it to the edge function secrets as GOOGLE_DRIVE_ROOT_FOLDER_ID

### 5. Enable the Feature
In your database, update the config:
```sql
UPDATE app_config SET value = 'true' WHERE key = 'google_drive_enabled';
UPDATE app_config SET value = 'your_folder_id' WHERE key = 'google_drive_root_folder_id';
```

## How It Works

### File Upload Flow
1. User submits manuscript with files
2. Frontend validates files (PDF/DOC, 100KB-20MB)
3. Files uploaded to Google Drive via edge function
   - Creates folder: `{user_email}/{submission_id}/`
4. Attachments stored as JSON:
   ```json
   {"id": "file_id", "name": "filename.pdf", "viewLink": "...", "downloadLink": "..."}
   ```

### Admin Download
1. Admin views submissions in dashboard
2. Clicks download button for each file
3. Download link opens directly from Google Drive

## Backward Compatibility
- Old submissions (Supabase Storage) continue to work
- System detects attachment format automatically
- No migration needed for existing data

## Troubleshooting

### Edge Function Errors
Check Supabase Dashboard > Edge Functions > Logs for error messages

### Google Drive Not Working
- Verify credentials are set in Edge Function secrets
- Check that Drive API is enabled in Google Cloud Console
- Verify refresh token is valid

### File Upload Fails
- Check file size is within 100KB-20MB range
- Verify file type is PDF or DOC
- Check network connection