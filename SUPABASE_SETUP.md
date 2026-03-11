# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Note your **Project URL** and **anon/public key** from Settings → API

## 2. Environment Variables

Copy `.env.example` to `.env` and add your credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run the Database Migrations

In your Supabase project, go to **SQL Editor** and run in order:

1. `supabase/migrations/001_profiles.sql`
2. `supabase/migrations/002_admin_email_policy.sql`
3. `supabase/migrations/003_admin_users_rpc.sql`
4. `supabase/migrations/004_super_admin_and_make_admin.sql`
5. `supabase/migrations/006_fix_admin_see_all_users.sql` (if admins can't see other admins)
6. `supabase/migrations/007_bookings_cleaner_apps_locations.sql`

This creates:
- `profiles` table for user metadata (name, phone, role)
- Row Level Security (RLS) policies
- Trigger to auto-create profile on signup

## 4. Auth URL Configuration

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:5173` (or your production URL)
- **Redirect URLs**: Add `http://localhost:5173/reset-password` and your production reset URL

## 5. Roles: Super Admin & Admin

- **Super Admin** – Can make others admin, remove admin. `mwaseeemsajad@gmail.com` and `*@admin.shinespan.co.uk` are super admins.
- **Admin** – Can view users but cannot change roles.

To make someone admin, a super admin uses the "Make Admin" button in the Users page. Or run in SQL:

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = 'user-uuid';
-- For super admin: SET role = 'super_admin'
```

## 6. Email Sending Options

### Option A: Nodemailer backend (recommended)

Use the included `server/` with Nodemailer:

1. `cd server && npm install`
2. Copy `server/.env.example` to `server/.env` and add your SMTP + `SUPABASE_URL`
3. Run `npm run dev`
4. Supabase → **Authentication** → **Hooks** → **Send Email Hook** → set URL (e.g. `https://your-server.com/auth/send-email`)

See `server/README.md` for details.

### Option B: Custom SMTP in Supabase

**"Error sending recovery email"** usually means:

1. **Using built-in SMTP** – Supabase only sends to emails in your [project team](https://supabase.com/dashboard/org/_/team). Add test emails there, or use custom SMTP.

2. **Custom SMTP misconfiguration** – In **Authentication** → **SMTP Settings**:
   - Use the correct **Host**, **Port** (587 for TLS, 465 for SSL)
   - Use a verified **Sender email** (e.g. `no-reply@yourdomain.com`) – it must be verified with your provider
   - Use the correct **Username** and **Password**
   - Providers like Gmail need an [App Password](https://support.google.com/accounts/answer/185833), not your normal password

3. **Check Auth logs** – Go to **Logs** → **Auth Logs** in the Supabase dashboard for the exact error.

4. **Redirect URLs** – Add your reset URL to **Authentication** → **URL Configuration** → **Redirect URLs**:
   - `http://localhost:5173/reset-password` (dev)
   - `https://yourdomain.com/reset-password` (prod)

## 7. Email Templates (Optional)

For password reset to work, ensure **Auth** → **Email Templates** → **Reset Password** uses:

`{{ .SiteURL }}/reset-password#access_token={{ .Token }}&type=recovery&refresh_token={{ .RefreshToken }}`

Or the default `{{ .ConfirmationURL }}` if you prefer Supabase’s default redirect.
