# Google Drive OAuth Setup - Complete Guide

## Your Credentials
```
CLIENT_ID: (get from Google Cloud Console)
CLIENT_SECRET: (get from Google Cloud Console)  
FOLDER_ID: (get from Google Drive folder URL)
```

---

## To Get Refresh Token (One-Time Setup)

### Step 1: Open OAuth Playground
Navigate to: **https://oauthplayground.google.com/**  

### Step 2: Configure Credentials
1. Click the **gear icon (⚙️)** in the bottom right
2. Check **"Use your own OAuth credentials"**
3. Fill in your Client ID and Client Secret
4. Click **Save**

### Step 3: Authorize
1. In "Step 1" section, find **Google Drive API v3**
2. Click and add scope: `https://www.googleapis.com/auth/drive.file`
3. Click **Authorize APIs**

### Step 4: Exchange Token
1. After signing in, click **Exchange authorization code for tokens**
2. Copy the **refresh_token** from the JSON output

---

## Reply with your refresh_token

Once you have it, I'll set up Supabase with all the secrets!