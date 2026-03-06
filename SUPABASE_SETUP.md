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

This creates:
- `profiles` table for user metadata (name, phone, role)
- Row Level Security (RLS) policies
- Trigger to auto-create profile on signup

## 4. Auth URL Configuration

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:5173` (or your production URL)
- **Redirect URLs**: Add `http://localhost:5173/reset-password` and your production reset URL

## 5. Create an Admin User

After signing up a user, run this in SQL Editor to make them admin:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'your-user-uuid-here';
```

Or use an email ending in `@admin.shinespan.co.uk` (handled in code as admin).

## 6. Email Templates (Optional)

For password reset to work, ensure **Auth** → **Email Templates** → **Reset Password** uses:

`{{ .SiteURL }}?token_hash={{ .TokenHash }}&type=recovery`
