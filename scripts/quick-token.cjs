const { google } = require('googleapis');

// Configure with your credentials from Google Cloud Console
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive.file']
});

console.log('\n========================================');
console.log('STEP 1: Open this URL in your browser:');
console.log('========================================\n');
console.log(authUrl);
console.log('\n========================================');
console.log('STEP 2: After signing in, copy the code shown');
console.log('========================================\n');

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('\nPaste the code here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n========================================');
    console.log('SUCCESS! Your refresh token:');
    console.log('========================================\n');
    console.log(tokens.refresh_token);
    console.log('\nAdd these to Supabase secrets:');
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
  rl.close();
});