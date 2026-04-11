/**
 * Google Drive Refresh Token Generator
 * 
 * Run this script to generate a refresh token for Google Drive API.
 * You'll need to complete the OAuth flow once.
 * 
 * Prerequisites:
 * 1. GOOGLE_CLIENT_ID from Google Cloud Console
 * 2. GOOGLE_CLIENT_SECRET from Google Cloud Console
 * 
 * Usage:
 *   node scripts/generate-drive-token.js
 * 
 * After running, copy the refresh_token to your Supabase Edge Function secrets.
 */

const readline = require('readline');
const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '731274876529-lmvis1vgnh09lf0rcup2igr9gb9pfg55.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive.file']
});

console.log('\n========================================');
console.log('Google Drive OAuth Setup');
console.log('========================================\n');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Complete the OAuth flow');
console.log('3. Copy the authorization code\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the authorization code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n========================================');
    console.log('SUCCESS! Copy these to Supabase:');
    console.log('========================================\n');
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('\nToken generated successfully!');
    console.log('Add these as Edge Function secrets in Supabase dashboard.\n');
    
  } catch (error) {
    console.error('Error getting token:', error.message);
  }
  rl.close();
});