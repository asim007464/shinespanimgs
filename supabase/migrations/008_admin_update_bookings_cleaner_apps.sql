-- Admins can update booking status
CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

-- Admins can update cleaner application status
CREATE POLICY "Admins can update cleaner applications"
  ON public.cleaner_applications FOR UPDATE
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());
