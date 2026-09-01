# Getting the Google OAuth Client ID

This replaces the old Firebase auth. It is free, no billing, no quota worth worrying about.

## Steps (console.cloud.google.com)

1. Sign in with the Google account that will *own* this (NOT the blocked
   `national-selection` one — use a fresh/clean account you control).
2. Top bar → **project selector** → **New Project**.
   Name: `echo-of-nomads` → **Create**. Select it.
3. Left menu → **APIs & Services** → **OAuth consent screen**.
   - User type: **External** → **Create**.
   - App name: `Echo of Nomads`. User support email: your email.
   - Authorized domains: add `echoofthenomads.com`.
   - Developer contact email: your email. **Save and continue**.
   - Scopes: skip (default is fine). **Save and continue**.
   - Test users: skip. **Save and continue** → **Back to dashboard**.
   - Click **Publish app** → confirm. (Otherwise only test users can sign in.)
     Basic sign-in needs no Google verification review.
4. **APIs & Services** → **Credentials** → **+ Create credentials** →
   **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `echo-web`.
   - **Authorized JavaScript origins** — add ALL of:
     - `https://echoofthenomads.com`
     - `https://www.echoofthenomads.com`
     - `http://localhost:5500`  (or whatever you use for local testing)
   - Authorized redirect URIs: leave empty (we use Google Identity Services,
     not the redirect flow).
   - **Create**.
5. A dialog shows **Client ID** like `838...-abc123.apps.googleusercontent.com`.

## Send me

- The **Client ID** string.

That value goes into:
- `GOOGLE_CLIENT_ID` in `/etc/echo-vote/env` on the VPS (server verifies tokens),
- the `<div id="g_id_onload" data-client_id="...">` in the site's voting markup.

It is not a secret (it ships in the page), but keep the project tidy — don't add
extra origins you don't need.
