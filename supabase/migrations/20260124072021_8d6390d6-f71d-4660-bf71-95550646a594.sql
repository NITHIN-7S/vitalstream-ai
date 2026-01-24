-- Create storage bucket for medical reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-reports', 'medical-reports', false);

-- Policy: Patients can upload their own reports
CREATE POLICY "Patients can upload own reports"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'medical-reports' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Patients can view their own reports
CREATE POLICY "Patients can view own reports"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical-reports' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Patients can delete their own reports
CREATE POLICY "Patients can delete own reports"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'medical-reports' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Doctors can view reports of their assigned patients
CREATE POLICY "Doctors can view patient reports"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical-reports' 
  AND EXISTS (
    SELECT 1 FROM public.patients 
    WHERE patients.doctor_id = auth.uid() 
    AND patients.user_id::text = (storage.foldername(name))[1]
  )
);

-- Policy: Doctors can download reports of their assigned patients
CREATE POLICY "Doctors can download patient reports"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical-reports'
  AND has_role(auth.uid(), 'doctor')
);