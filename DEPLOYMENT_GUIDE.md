# Khmer Wedding Invitation - Production Deployment Guide

---

## 1. Supabase Production Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Choose a region close to your guests (e.g., **Singapore `ap-southeast-1`** for Cambodia/Southeast Asia).
3. Set a strong database password and save it.

### Step 2: Run Full Database Schema
1. Open your Supabase Dashboard: **SQL Editor** -> **New Query**.
2. Copy and paste the contents of [`supabase/full_production_schema.sql`](file:///Users/mac/MyFolder/Personal%20/WeddingProject/wedding-invitation2/supabase/full_production_schema.sql).
3. Click **Run** (`Ctrl+Enter` / `Cmd+Enter`).
4. This one script automatically creates:
   - All core tables (`wedding_settings`, `guests`, `invitations`, `rsvps`, `wedding_programmes`, `wedding_photos`, `wedding_appearance`).
   - All performance indexes.
   - Row-Level Security (RLS) policies.
   - Public storage bucket `wedding-photos` with upload permissions.
   - Default seed data for Khmer Royal Burgundy & Gold theme.

### Step 3: Create the Admin User
1. In your Supabase Dashboard, go to **Authentication** -> **Users** -> **Add User** -> **Create User**.
2. Enter your Admin Email (e.g., `admin@wedding.com`) and a secure password.
3. Toggle **Auto Confirm User** to `ON` (so no confirmation email is required).
4. Save the credentials. You will use these to log into `/admin/login`.

### Step 4: Retrieve API Keys
Go to **Project Settings** -> **API**:
- **Project URL**: `https://<project-ref>.supabase.co`
- **Anon Public Key**: `eyJ...` (Project API Keys -> `anon` `public`)
- **Service Role Secret Key**: `eyJ...` (Project API Keys -> `service_role` `secret`)

---

## 2. Environment Variables Checklist

Set these environment variables in your hosting provider (Vercel, Cloudflare, Railway, Docker, etc.):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase project URL | `https://xyzcompany.supabase.co` |
| `SUPABASE_KEY` | Supabase Anon Public key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role key (server only) | `eyJhbGciOi...` |
| `NUXT_PUBLIC_SITE_URL` | Live production website URL (no trailing slash) | `https://seyha-nary-wedding.com` |

---

## 3. Hosting Options

### Option A: Vercel (Recommended - Free & Instant)
1. Push your repository to GitHub / GitLab.
2. Go to [vercel.com](https://vercel.com) -> **Add New Project** -> Import your repository.
3. Framework Preset: **Nuxt.js** (detected automatically).
4. Add the 4 environment variables from Section 2.
5. Click **Deploy**.
6. Under **Settings** -> **Domains**, attach your custom domain (e.g. `seyha-nary.com`).

---

### Option B: Docker / VPS / Railway / Render
A production-ready multi-stage [`Dockerfile`](file:///Users/mac/MyFolder/Personal%20/WeddingProject/wedding-invitation2/Dockerfile) is included:

```bash
# Build the Docker image
docker build -t khmer-wedding-invitation .

# Run container with environment variables
docker run -d -p 3000:3000 \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_KEY="your-anon-key" \
  -e SUPABASE_SERVICE_ROLE_KEY="your-service-key" \
  -e NUXT_PUBLIC_SITE_URL="https://your-domain.com" \
  --name wedding-invitation \
  khmer-wedding-invitation
```

---

## 4. Post-Deployment Verification Checklist
- [ ] Visit `/admin/login` and log in with the admin account created in Supabase.
- [ ] Go to **Settings** and verify wedding date, couple names, venue address, and ABA gift info.
- [ ] Go to **Appearance** and verify live preview, dynamic background, and opening animation.
- [ ] Go to **Guests** and test importing your Excel spreadsheet or adding a test guest.
- [ ] Open the test guest's invitation link (`/invite/<token>`) on mobile and desktop to verify responsive design, animation, and RSVP submission.
