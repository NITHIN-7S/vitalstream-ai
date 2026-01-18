-- Create receptionist_profiles table
CREATE TABLE public.receptionist_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  hospital_name TEXT,
  department TEXT DEFAULT 'Reception',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.receptionist_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for receptionist_profiles
CREATE POLICY "Receptionists can view own profile"
ON public.receptionist_profiles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Receptionists can insert own profile"
ON public.receptionist_profiles
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Receptionists can update own profile"
ON public.receptionist_profiles
FOR UPDATE
USING (user_id = auth.uid());

-- Add user_id and email to patients table for login
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS registered_by UUID;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS password_given BOOLEAN DEFAULT false;

-- Update patients RLS to allow patients to view their own data
CREATE POLICY "Patients can view own data"
ON public.patients
FOR SELECT
USING (user_id = auth.uid());

-- Allow receptionists to insert patients
CREATE POLICY "Receptionists can insert patients"
ON public.patients
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow receptionists to update patients they registered
CREATE POLICY "Receptionists can update registered patients"
ON public.patients
FOR UPDATE
USING (registered_by = auth.uid() OR doctor_id = auth.uid() OR user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_receptionist_profiles_updated_at
BEFORE UPDATE ON public.receptionist_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();