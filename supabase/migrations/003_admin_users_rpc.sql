-- RPC for admins to fetch all users (bypasses RLS, includes auth.users)
-- Use this when profiles may be empty or RLS blocks the query

-- Ensure email column exists (in case 002 wasn't run)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  phone text,
  postcode text,
  city text,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean := false;
BEGIN
  -- Check if current user is admin (profile role or email)
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ) INTO is_admin;

  IF NOT is_admin AND (auth.jwt()->>'email') IS NOT NULL THEN
    is_admin := (auth.jwt()->>'email') = 'mwaseeemsajad@gmail.com'
      OR (auth.jwt()->>'email') LIKE '%@admin.shinespan.co.uk';
  END IF;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Unauthorized: admin access required';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    COALESCE(p.email, u.email::text),
    p.first_name,
    p.last_name,
    p.phone,
    p.postcode,
    COALESCE(p.city, 'London'),
    COALESCE(p.role, 'client'),
    COALESCE(p.created_at, u.created_at)
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  ORDER BY COALESCE(p.created_at, u.created_at) DESC NULLS LAST;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users() TO service_role;

-- Backfill profiles for existing auth.users (run once)
INSERT INTO public.profiles (id, email, first_name, last_name, phone, postcode, city, role, created_at, updated_at)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'first_name', ''),
  COALESCE(u.raw_user_meta_data->>'last_name', ''),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  COALESCE(u.raw_user_meta_data->>'postcode', ''),
  COALESCE(u.raw_user_meta_data->>'city', 'London'),
  COALESCE(u.raw_user_meta_data->>'role', 'client'),
  u.created_at,
  NOW()
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO UPDATE SET
  email = COALESCE(EXCLUDED.email, profiles.email),
  first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), profiles.first_name),
  last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), profiles.last_name),
  phone = COALESCE(NULLIF(EXCLUDED.phone, ''), profiles.phone),
  postcode = COALESCE(NULLIF(EXCLUDED.postcode, ''), profiles.postcode),
  city = COALESCE(NULLIF(EXCLUDED.city, ''), profiles.city),
  updated_at = NOW();
