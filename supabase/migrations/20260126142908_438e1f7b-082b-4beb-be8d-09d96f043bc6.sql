-- Create table to store Google Fit OAuth tokens for doctors
CREATE TABLE public.doctor_google_fit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to store doctor health data from Google Fit
CREATE TABLE public.doctor_health_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  heart_rate INTEGER,
  spo2 INTEGER,
  steps INTEGER,
  calories_burned INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_source TEXT DEFAULT 'google_fit',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctor_google_fit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_health_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for doctor_google_fit - only the doctor can access their own tokens
CREATE POLICY "Doctors can view own tokens"
  ON public.doctor_google_fit FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own tokens"
  ON public.doctor_google_fit FOR INSERT
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own tokens"
  ON public.doctor_google_fit FOR UPDATE
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own tokens"
  ON public.doctor_google_fit FOR DELETE
  USING (doctor_id = auth.uid());

-- RLS policies for doctor_health_data
CREATE POLICY "Doctors can view own health data"
  ON public.doctor_health_data FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "System can insert health data"
  ON public.doctor_health_data FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "System can update health data"
  ON public.doctor_health_data FOR UPDATE
  USING (doctor_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_doctor_google_fit_updated_at
  BEFORE UPDATE ON public.doctor_google_fit
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();