/**
 * Google Drive Setup - Simplified
 * 
 * This script helps set up Google Drive for the JMRH Publications storage.
 * 
 * Prerequisites:
 * 1. Google Cloud Console project with Drive API enabled
 * 2. OAuth credentials (Client ID + Client Secret)
 * 
 * Run: node scripts/setup-google-drive.js
 */

const { google } = require('googleapis');
const readline = require('readline');

// Configuration - UPDATE THESE
const CONFIG = {
  clientId: '731274876529-lmvis1vgnh09lf0rcup2igr9gb9pfg55.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_SECRET_HERE',
  redirectUri: 'urn:ietf:wg:oauth:2.0:oob'
};

async function main() {
  console.log('\n========================================');
  console.log('Google Drive Setup for JMRH Publications');
  console.log('========================================\n');

  if (!CONFIG.clientSecret || CONFIG.clientSecret === 'YOUR_SECRET_HERE') {
    console.log('ERROR: Client secret required!\n');
    console.log('To get your client secret:');
    console.log('1. Go to https://console.cloud.google.com/apis/credentials');
    console.log('2. Find your OAuth 2.0 Client ID');
    console.log('3. Click to view details - client secret is shown');
    console.log('\nThen run: GOOGLE_CLIENT_SECRET=your_secret node scripts/setup-google-drive.js');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    CONFIG.clientId,
    CONFIG.clientSecret,
    CONFIG.redirectUri
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file']
  });

  console.log('Step 1: Open this URL and authorize:\n');
  console.log(authUrl);
  console.log('\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the code from browser: ', async (code) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      
      console.log('\n========================================');
      console.log('SETUP COMPLETE!');
      console.log('========================================\n');
      
      console.log('Add these to Supabase Edge Function secrets:\n');
      console.log(`GOOGLE_CLIENT_ID=${CONFIG.clientId}`);
      console.log(`GOOGLE_CLIENT_SECRET=${CONFIG.clientSecret}`);
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
      console.log(`GOOGLE_DRIVE_ROOT_FOLDER_ID=create_folder_and_paste_id_here`);
      
      console.log('\n\nStep 2: Create root folder in Google Drive:');
      console.log('1. Go to drive.google.com');
      console.log('2. Create new folder named "JMRH-Submissions"');
      console.log('3. Open the folder - copy ID from URL');
      console.log('   (URL ends with /folders/FOLDER_ID)');
      console.log('\n4. Add FOLDER_ID to Supabase secrets\n');
      
      console.log('Step 3: Deploy edge function:');
      console.log('   supabase functions deploy google-drive-upload');
      
    } catch (err) {
      console.error('Error:', err.message);
    }
    rl.close();
  });
}

main();