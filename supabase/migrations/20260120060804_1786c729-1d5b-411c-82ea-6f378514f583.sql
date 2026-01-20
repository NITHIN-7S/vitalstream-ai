-- Allow all authenticated users to view doctor profiles (for receptionist dropdown and patient dashboard)
DROP POLICY IF EXISTS "Doctors can view own profile" ON public.doctor_profiles;

CREATE POLICY "Authenticated users can view doctor profiles" 
ON public.doctor_profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);