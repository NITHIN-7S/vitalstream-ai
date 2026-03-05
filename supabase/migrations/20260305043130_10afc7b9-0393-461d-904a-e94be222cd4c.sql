
-- Create device_activity table
CREATE TABLE public.device_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_number integer NOT NULL,
  patient_id uuid REFERENCES public.patients(id) ON DELETE SET NULL,
  heart_rate integer,
  oxygen_level integer,
  body_temperature numeric(4,1),
  steps integer,
  recorded_at timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'not_connected',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add unique constraint on device_number
ALTER TABLE public.device_activity ADD CONSTRAINT device_activity_device_number_unique UNIQUE (device_number);

-- Enable RLS
ALTER TABLE public.device_activity ENABLE ROW LEVEL SECURITY;

-- Receptionist: full access
CREATE POLICY "Receptionists can view all device activity"
  ON public.device_activity FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'receptionist'));

CREATE POLICY "Receptionists can insert device activity"
  ON public.device_activity FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'receptionist'));

CREATE POLICY "Receptionists can update device activity"
  ON public.device_activity FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'receptionist'));

-- Doctor: view devices of assigned patients only
CREATE POLICY "Doctors can view assigned patient devices"
  ON public.device_activity FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = device_activity.patient_id
        AND patients.doctor_id = auth.uid()
    )
  );

-- Patient: view own device only
CREATE POLICY "Patients can view own device"
  ON public.device_activity FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = device_activity.patient_id
        AND patients.user_id = auth.uid()
    )
  );

-- Seed 10 devices
INSERT INTO public.device_activity (device_number, status) VALUES
  (1, 'not_connected'),
  (2, 'not_connected'),
  (3, 'not_connected'),
  (4, 'not_connected'),
  (5, 'not_connected'),
  (6, 'not_connected'),
  (7, 'not_connected'),
  (8, 'not_connected'),
  (9, 'not_connected'),
  (10, 'not_connected');
