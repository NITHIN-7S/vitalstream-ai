
-- Add a discharged status to track discharged patients
-- Add discharged_at column to patients table
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS discharged_at timestamp with time zone DEFAULT NULL;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS is_discharged boolean DEFAULT false;
