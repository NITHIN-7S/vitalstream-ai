
-- Add stored_password column to doctor_profiles for receptionist credential management
ALTER TABLE public.doctor_profiles ADD COLUMN IF NOT EXISTS stored_password text;
