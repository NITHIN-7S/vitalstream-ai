
-- Create enum for patient status
CREATE TYPE public.patient_status AS ENUM ('normal', 'warning', 'critical');

-- Create enum for alert priority
CREATE TYPE public.alert_priority AS ENUM ('low', 'moderate', 'high', 'critical');

-- Create patients table for ICU patients
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT,
    room TEXT NOT NULL,
    bed_number TEXT,
    admission_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    diagnosis TEXT,
    status patient_status DEFAULT 'normal',
    is_icu BOOLEAN DEFAULT false,
    emergency_contact TEXT,
    emergency_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create patient vitals table
CREATE TABLE public.patient_vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    oxygen_level DECIMAL(5,2),
    temperature DECIMAL(4,1),
    glucose_level INTEGER,
    respiratory_rate INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create alerts table for moderate danger patients
CREATE TABLE public.patient_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    alert_type TEXT NOT NULL,
    priority alert_priority DEFAULT 'moderate',
    message TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create doctor profiles table
CREATE TABLE public.doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    profession TEXT,
    specialization TEXT,
    phone TEXT,
    department TEXT,
    license_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Doctors can view their patients"
ON public.patients FOR SELECT
TO authenticated
USING (doctor_id = auth.uid() OR doctor_id IS NULL);

CREATE POLICY "Doctors can insert patients"
ON public.patients FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Doctors can update their patients"
ON public.patients FOR UPDATE
TO authenticated
USING (doctor_id = auth.uid() OR doctor_id IS NULL);

-- RLS Policies for patient_vitals
CREATE POLICY "Doctors can view patient vitals"
ON public.patient_vitals FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.patients 
        WHERE patients.id = patient_vitals.patient_id 
        AND (patients.doctor_id = auth.uid() OR patients.doctor_id IS NULL)
    )
);

CREATE POLICY "Doctors can insert patient vitals"
ON public.patient_vitals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for patient_alerts
CREATE POLICY "Doctors can view their alerts"
ON public.patient_alerts FOR SELECT
TO authenticated
USING (doctor_id = auth.uid() OR doctor_id IS NULL);

CREATE POLICY "Doctors can update alerts"
ON public.patient_alerts FOR UPDATE
TO authenticated
USING (doctor_id = auth.uid() OR doctor_id IS NULL);

CREATE POLICY "System can insert alerts"
ON public.patient_alerts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for doctor_profiles
CREATE POLICY "Doctors can view own profile"
ON public.doctor_profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Doctors can insert own profile"
ON public.doctor_profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Doctors can update own profile"
ON public.doctor_profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_vitals;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_profiles_updated_at
BEFORE UPDATE ON public.doctor_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
