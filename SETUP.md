# CP Tracker AI — Complete Setup Guide

## Quick Start (5 minutes)

```
Step 1 → Create Supabase project
Step 2 → Run schema.sql in SQL Editor  
Step 3 → Enable Google OAuth
Step 4 → Deploy 3 Edge Functions
Step 5 → Add Gemini API key
Step 6 → Update .env and run
```

---

## STEP 1 — Create Supabase Project

1. Go to **supabase.com** → Sign up → **New Project**
2. Name: `cp-tracker-ai`, choose a region near you
3. Generate a DB password and save it
4. Wait ~2 minutes for project to spin up
5. Go to **Settings → API**, copy:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon/public key** → `eyJhbGci...`

---

## STEP 2 — Run Database Schema

1. Supabase dashboard → **SQL Editor** → **New Query**
2. Open `supabase/schema.sql` from this project
3. Select all text → paste into SQL Editor → click **Run**
4. You should see: `Success. No rows returned`

This creates 6 tables: `profiles`, `cf_data`, `lc_data`, `notes`, `goals`, `ai_sessions`
All with Row-Level Security — each user only sees their own data.

---

## STEP 3 — Enable Google OAuth

### Part A — Google Cloud Console
1. Go to **console.cloud.google.com**
2. Create a new project: `cp-tracker-ai`
3. Search "OAuth consent screen" → External → Create
4. Fill App name: `CP Tracker AI`, your email → Save
5. Go to **APIs & Services → Credentials → + Create Credentials → OAuth 2.0 Client ID**
6. Application type: **Web application**
7. Authorized redirect URIs — add:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   http://localhost:5173
   ```
8. Click Create → Copy **Client ID** and **Client Secret**

### Part B — Supabase
1. Supabase → **Authentication → Providers → Google**
2. Toggle **Enable Google provider** ON
3. Paste your **Client ID** and **Client Secret**
4. Click **Save**

---

## STEP 4 — Deploy Edge Functions (Backend)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project (find project-ref in Supabase → Settings → General)
supabase link --project-ref YOUR-PROJECT-REF

# Deploy all 3 functions
cd cp-tracker-ai
supabase functions deploy cf-proxy
supabase functions deploy lc-proxy
supabase functions deploy ai-coach
```

Verify in Supabase → **Edge Functions** — you should see all 3 with status Active.

---

## STEP 5 — Add Gemini API Key

1. Go to **aistudio.google.com** → Sign in with Google
2. Click **Get API Key → Create API Key**
3. Copy the key (starts with `AIzaSy...`)

```bash
supabase secrets set GEMINI_API_KEY=AIzaSy...your_key...
```

OR via Supabase dashboard: **Settings → Edge Functions → Secrets → Add `GEMINI_API_KEY`**

---

## STEP 6 — Configure .env and Run

Open `.env` in the project and replace the placeholder values:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your_anon_key...
```

Then run:

```bash
npm install
npm run dev
```

Open **http://localhost:5173** 🎉

---

## How It All Works

### Authentication Flow
1. User clicks "Continue with Google" on /auth
2. Supabase OAuth redirects to Google
3. Google redirects back to Supabase callback URL
4. Supabase creates user + fires DB trigger
5. Trigger auto-creates row in `profiles` table
6. User lands on /dashboard with real session

### Codeforces Data Flow
1. User enters CF handle on Dashboard
2. Frontend calls Supabase Edge Function `cf-proxy`
3. Edge Function calls 3 CF public APIs in parallel (no key needed):
   - `user.info` → rating, rank, country
   - `user.rating` → all contest history
   - `user.status` → all submissions → tag analysis, streak
4. Data saved to `cf_data` table in Supabase
5. Subsequent loads come from Supabase cache (fast)

### LeetCode Data Flow
1. User enters LC handle on Dashboard
2. Frontend calls `lc-proxy` Edge Function
3. Edge Function calls LeetCode public GraphQL endpoint
4. Parses: solved counts, tag distribution, contest history
5. Saved to `lc_data` table

### AI Coach Flow
1. User clicks "Generate New Plan"
2. Frontend calls `ai-coach` Edge Function with user's real stats
3. Edge Function builds a detailed prompt from CF + LC data
4. Calls Gemini 1.5 Flash API
5. Gemini returns: 7 problems + weak analysis + 7-day roadmap
6. Saved to `ai_sessions` table
7. Displayed to user

---

## Deploy to Production

### Frontend → Vercel
```bash
npm install -g vercel
vercel

# Add env vars in Vercel dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

After deploying, add your Vercel URL to Google OAuth redirect URIs:
```
https://your-app.vercel.app
```

### Backend → Already deployed (Supabase Edge Functions)
No extra steps needed — Edge Functions are globally distributed.

---

## View Your Data in Supabase

Supabase Dashboard → **Table Editor**:

- **profiles** — all users, their CF/LC handles
- **cf_data** — cached Codeforces data per user  
- **lc_data** — cached LeetCode data per user
- **notes** — all notes written by users
- **goals** — all goals set by users
- **ai_sessions** — all AI plans generated

Useful SQL queries:
```sql
-- See all users
SELECT email, display_name, cf_handle, lc_handle FROM profiles;

-- See CF data for all users
SELECT handle, rating, total_solved, cached_at FROM cf_data ORDER BY rating DESC;

-- See all notes
SELECT title, platform, bookmarked, created_at FROM notes ORDER BY created_at DESC;
```

Authentication → Users tab shows all signed-up users with their login method.

---

## Troubleshooting

**"User not found" on Codeforces**
→ CF handles are case-sensitive. `Tourist` ≠ `tourist`

**LeetCode returns 0 data**
→ LeetCode has rate limiting. Wait 30 seconds and retry.

**Google OAuth "redirect_uri_mismatch"**
→ Add exact Supabase URL to Google Console:
`https://YOUR-REF.supabase.co/auth/v1/callback`

**AI Coach fails with "GEMINI_API_KEY not set"**
→ Run: `supabase secrets set GEMINI_API_KEY=your_key`

**Profile not created after Google login**
→ Re-run `supabase/schema.sql` — the trigger may not have been created
