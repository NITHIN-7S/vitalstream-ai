
-- Create devices table
CREATE TABLE public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_name TEXT NOT NULL,
  device_label TEXT,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  doctor_id UUID,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'connected', 'warning', 'offline')),
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Receptionists can do everything with devices
CREATE POLICY "Receptionists can view all devices"
  ON public.devices FOR SELECT
  USING (public.has_role(auth.uid(), 'receptionist'));

CREATE POLICY "Receptionists can insert devices"
  ON public.devices FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'receptionist'));

CREATE POLICY "Receptionists can update devices"
  ON public.devices FOR UPDATE
  USING (public.has_role(auth.uid(), 'receptionist'));

CREATE POLICY "Receptionists can delete devices"
  ON public.devices FOR DELETE
  USING (public.has_role(auth.uid(), 'receptionist'));

-- Doctors can view devices assigned to their patients
CREATE POLICY "Doctors can view assigned patient devices"
  ON public.devices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = devices.patient_id
        AND patients.doctor_id = auth.uid()
    )
  );

-- Patients can view their own device
CREATE POLICY "Patients can view own device"
  ON public.devices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = devices.patient_id
        AND patients.user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed some default devices
INSERT INTO public.devices (device_name, device_label, status) VALUES
  ('Device 1', 'Bedside Monitor A1', 'available'),
  ('Device 2', 'Bedside Monitor A2', 'available'),
  ('Device 3', 'Bedside Monitor A3', 'available'),
  ('Device 4', 'Bedside Monitor B1', 'available'),
  ('Device 5', 'Bedside Monitor B2', 'available'),
  ('Device 6', 'Bedside Monitor B3', 'available'),
  ('Device 7', 'Portable Monitor P1', 'available'),
  ('Device 8', 'Portable Monitor P2', 'available'),
  ('Device 9', 'ICU Monitor I1', 'available'),
  ('Device 10', 'ICU Monitor I2', 'available');
