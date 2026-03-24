-- ============================================================
-- Add whatsapp and company columns to profiles
-- Execute in Supabase SQL Editor
-- ============================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS company TEXT DEFAULT '';

-- Update the handle_new_user trigger to capture these fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, whatsapp, company)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'student',
    COALESCE(new.raw_user_meta_data->>'whatsapp', ''),
    COALESCE(new.raw_user_meta_data->>'company', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    whatsapp = COALESCE(NULLIF(EXCLUDED.whatsapp, ''), profiles.whatsapp),
    company = COALESCE(NULLIF(EXCLUDED.company, ''), profiles.company);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
