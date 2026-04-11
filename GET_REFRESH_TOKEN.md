# How to Get Google Drive Refresh Token

## Option 1: OAuth Playground (Easiest)

1. **Open:** https://oauthplayground.google.com/

2. **Click the gear icon** (⚙️) in the bottom right

3. **Check** "Use your own OAuth credentials"

4. **Enter your credentials** from Google Cloud Console

5. **Click** "Authorize APIs"

6. **Select all scopes** (check all Drive scopes)

7. **Click** "Exchange authorization code for tokens"

8. **Copy** the `refresh_token` from the result

---

## Option 2: Command Line

```bash
cd E:\projects\horizon-research-hub
node scripts/quick-token.cjs
```

Then paste the code shown in browser.

---

## After Getting Refresh Token

Reply with: `refresh_token: YOUR_TOKEN_HERE`

I'll configure Supabase for you!