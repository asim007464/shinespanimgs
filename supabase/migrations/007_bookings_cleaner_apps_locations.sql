-- Ensure is_admin_or_super_admin exists (from 006)
CREATE OR REPLACE FUNCTION public.is_admin_or_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
  OR (auth.jwt()->>'email') = 'mwaseeemsajad@gmail.com'
  OR (auth.jwt()->>'email') LIKE '%@admin.shinespan.co.uk';
END;
$$;

-- Cleaner applications
CREATE TABLE IF NOT EXISTS public.cleaner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  middle_name TEXT,
  surname TEXT NOT NULL,
  gender TEXT,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  postcode TEXT NOT NULL,
  experience_level TEXT,
  experience_types TEXT[] DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  eligibility JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings (from Register/Book Now flow)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  postcode TEXT NOT NULL,
  service_types TEXT[] NOT NULL DEFAULT '{}',
  property_type TEXT,
  bedrooms INT DEFAULT 1,
  bathrooms INT DEFAULT 1,
  extras TEXT[] DEFAULT '{}',
  duration_hours INT,
  products TEXT,
  frequency TEXT,
  first_clean_date DATE,
  arrival_time TEXT,
  access_method TEXT,
  first_name TEXT,
  surname TEXT,
  phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  address_postcode TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service areas (UK cities/postcodes - editable by admin)
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city, postcode)
);

-- RLS
ALTER TABLE public.cleaner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert cleaner applications (public form)
CREATE POLICY "Anyone can insert cleaner applications"
  ON public.cleaner_applications FOR INSERT
  WITH CHECK (true);

-- Anyone can insert bookings (public form)
CREATE POLICY "Anyone can insert bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Anyone can read locations (public display)
CREATE POLICY "Anyone can read locations"
  ON public.locations FOR SELECT
  USING (true);

-- Admins can read cleaner applications
CREATE POLICY "Admins can read cleaner applications"
  ON public.cleaner_applications FOR SELECT
  USING (public.is_admin_or_super_admin());

-- Admins can read bookings
CREATE POLICY "Admins can read bookings"
  ON public.bookings FOR SELECT
  USING (public.is_admin_or_super_admin());

-- Admins can manage locations (insert, update, delete)
CREATE POLICY "Admins can insert locations"
  ON public.locations FOR INSERT
  WITH CHECK (public.is_admin_or_super_admin());

CREATE POLICY "Admins can update locations"
  ON public.locations FOR UPDATE
  USING (public.is_admin_or_super_admin());

CREATE POLICY "Admins can delete locations"
  ON public.locations FOR DELETE
  USING (public.is_admin_or_super_admin());

-- Seed default London location (postcode prefix for area)
INSERT INTO public.locations (city, postcode, display_order)
VALUES ('London', 'SW1A', 0), ('London', 'E1', 1), ('London', 'W1', 2)
ON CONFLICT (city, postcode) DO NOTHING;
