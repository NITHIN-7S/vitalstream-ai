-- Create user roles enum and table for strict role-based access
CREATE TYPE public.app_role AS ENUM ('doctor', 'receptionist', 'patient');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Add stored_password column to patients for receptionist access
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS stored_password TEXT;

-- Create RLS policy for receptionists to view all patients they registered
CREATE POLICY "Receptionists can view all patients"
ON public.patients
FOR SELECT
USING (public.has_role(auth.uid(), 'receptionist'));