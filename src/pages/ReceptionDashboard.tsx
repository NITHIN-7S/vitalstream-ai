import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Activity, UserPlus, LogOut, Users, Copy, Check, Loader2, ClipboardList, Eye, EyeOff,
  Stethoscope, Phone, Building, X, Wifi, Menu, Settings, Plus, FileText, Unplug
} from "lucide-react";
import DeviceActivity from "@/components/dashboard/DeviceActivity";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Credentials { email: string; password: string; }

interface RegisteredPatient {
  id: string; name: string; email: string; room: string; created_at: string;
  password_given: boolean; stored_password: string | null; doctor_id: string | null;
}

interface Doctor {
  id: string; user_id: string; full_name: string | null; specialization: string | null;
  phone: string | null; department: string | null; stored_password: string | null;
}

interface ConnectedDevice {
  id: string; device_number: number; patient_id: string | null;
  status: string; heart_rate: number | null; oxygen_level: number | null;
  body_temperature: number | null; steps: number | null;
}

interface DischargedPatient {
  id: string; name: string; email: string | null; room: string;
  discharged_at: string;
}

const ReceptionDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<{id: string; device_number: number}[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [isDoctorLoading, setIsDoctorLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [credentialsDialogType, setCredentialsDialogType] = useState<"patient" | "doctor">("patient");
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [registeredPatients, setRegisteredPatients] = useState<RegisteredPatient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPatientPasswords, setShowPatientPasswords] = useState<Record<string, boolean>>({});
  const [showDoctorPasswords, setShowDoctorPasswords] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("patients");

  // Panel states
  const [showPatientPanel, setShowPatientPanel] = useState(false);
  const [showDoctorPanel, setShowDoctorPanel] = useState(false);

  // Discharge form state
  const [dischargeForm, setDischargeForm] = useState({
    patientName: "", deviceNumber: "", doctorName: "", joiningDate: "", leavingDate: ""
  });
  const [isDischarging, setIsDischarging] = useState(false);
  const [dischargedPatients, setDischargedPatients] = useState<DischargedPatient[]>([]);

  // New device state
  const [isCreatingDevice, setIsCreatingDevice] = useState(false);
  const [newDeviceLabel, setNewDeviceLabel] = useState("");

  const [patientForm, setPatientForm] = useState({
    email: "", name: "", age: "", gender: "", room: "",
    bed_number: "", diagnosis: "", emergency_contact: "",
    emergency_phone: "", doctor_id: "", device_number: ""
  });

  const [doctorForm, setDoctorForm] = useState({
    email: "", full_name: "", specialization: "", phone: "", department: ""
  });

  useEffect(() => {
    checkAuth();
    fetchDoctors();
    fetchRegisteredPatients();
    fetchAvailableDevices();
    fetchConnectedDevices();
    fetchDischargedPatients();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/auth/receptionist");
  };

  const fetchDoctors = async () => {
    const { data } = await supabase.from("doctor_profiles").select("id, user_id, full_name, specialization, phone, department, stored_password");
    if (data) setDoctors(data as Doctor[]);
  };

  const fetchRegisteredPatients = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("patients").select("id, name, email, room, created_at, password_given, stored_password, doctor_id").eq("registered_by", user.id).order("created_at", { ascending: false });
    if (data) setRegisteredPatients(data as RegisteredPatient[]);
  };

  const fetchAvailableDevices = async () => {
    const { data } = await supabase.from("device_activity").select("id, device_number").eq("status", "not_connected").is("patient_id", null).order("device_number", { ascending: true });
    if (data) setAvailableDevices(data);
  };

  const fetchConnectedDevices = async () => {
    const { data } = await supabase.from("device_activity").select("*").eq("status", "connected").order("device_number", { ascending: true });
    if (data) setConnectedDevices(data as ConnectedDevice[]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("register-patient", { body: patientForm });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (patientForm.device_number && data.patient) {
        const deviceNum = parseInt(patientForm.device_number);
        await supabase.from("device_activity").update({
          patient_id: data.patient.id, status: "connected",
          heart_rate: Math.floor(60 + Math.random() * 51),
          oxygen_level: Math.floor(92 + Math.random() * 9),
          body_temperature: parseFloat((36.0 + Math.random() * 2.5).toFixed(1)),
          steps: Math.floor(Math.random() * 5001),
          recorded_at: new Date().toISOString(),
        }).eq("device_number", deviceNum);
      }

      setCredentials(data.credentials);
      setCredentialsDialogType("patient");
      setShowCredentialsDialog(true);
      toast({ title: "Patient Registered!", description: "Credentials generated successfully." });
      setPatientForm({ email: "", name: "", age: "", gender: "", room: "", bed_number: "", diagnosis: "", emergency_contact: "", emergency_phone: "", doctor_id: "", device_number: "" });
      fetchRegisteredPatients();
      fetchAvailableDevices();
      fetchConnectedDevices();
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message || "Failed to register patient", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDoctorLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("register-doctor", { body: doctorForm });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setCredentials(data.credentials);
      setCredentialsDialogType("doctor");
      setShowCredentialsDialog(true);
      toast({ title: "Doctor Registered!", description: "Credentials generated successfully." });
      setDoctorForm({ email: "", full_name: "", specialization: "", phone: "", department: "" });
      fetchDoctors();
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message || "Failed to register doctor", variant: "destructive" });
    } finally {
      setIsDoctorLoading(false);
    }
  };

  const copyCredentials = () => {
    if (credentials) {
      navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied!", description: "Credentials copied to clipboard" });
    }
  };

  const copyPatientCredentials = (patient: RegisteredPatient) => {
    if (patient.stored_password) {
      navigator.clipboard.writeText(`Email: ${patient.email}\nPassword: ${patient.stored_password}`);
      toast({ title: "Copied!", description: "Patient credentials copied to clipboard" });
    }
  };

  const copyDoctorCredentials = (doctor: Doctor) => {
    if (doctor.stored_password) {
      navigator.clipboard.writeText(`Password: ${doctor.stored_password}`);
      toast({ title: "Copied!", description: "Doctor password copied to clipboard" });
    }
  };

  const markPasswordGiven = async (patientId: string) => {
    await supabase.from("patients").update({ password_given: true }).eq("id", patientId);
    fetchRegisteredPatients();
    toast({ title: "Updated", description: "Patient marked as credentials given" });
  };

  const togglePatientPassword = (patientId: string) => {
    setShowPatientPasswords(prev => ({ ...prev, [patientId]: !prev[patientId] }));
  };

  const toggleDoctorPassword = (doctorId: string) => {
    setShowDoctorPasswords(prev => ({ ...prev, [doctorId]: !prev[doctorId] }));
  };

  const getDoctorById = (doctorId: string | null) => {
    if (!doctorId) return null;
    return doctors.find(d => d.user_id === doctorId);
  };

  const handleDisconnectDevice = async (deviceId: string) => {
    try {
      await supabase.from("device_activity").update({
        patient_id: null, status: "not_connected",
        heart_rate: null, oxygen_level: null, body_temperature: null, steps: null
      }).eq("id", deviceId);
      toast({ title: "Device Disconnected", description: "IoT device has been disconnected from the patient." });
      fetchAvailableDevices();
      fetchConnectedDevices();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to disconnect device", variant: "destructive" });
    }
  };

  const handleGenerateDischarge = () => {
    if (!dischargeForm.patientName || !dischargeForm.joiningDate || !dischargeForm.leavingDate) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setIsDischarging(true);
    
    // Generate discharge sheet as printable content
    const dischargeContent = `
DISCHARGE SUMMARY
==========================================
Hospital: HealthPulse Medical Center
Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

Patient Name: ${dischargeForm.patientName}
Connected Device: ${dischargeForm.deviceNumber || 'N/A'}
Assigned Doctor: ${dischargeForm.doctorName || 'N/A'}
Admission Date: ${dischargeForm.joiningDate}
Discharge Date: ${dischargeForm.leavingDate}

Duration of Stay: ${Math.ceil((new Date(dischargeForm.leavingDate).getTime() - new Date(dischargeForm.joiningDate).getTime()) / (1000 * 60 * 60 * 24))} days

==========================================
This is a computer-generated discharge summary.
    `.trim();

    const blob = new Blob([dischargeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discharge_${dischargeForm.patientName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Discharge Sheet Generated", description: "The discharge summary has been downloaded." });
    setDischargeForm({ patientName: "", deviceNumber: "", doctorName: "", joiningDate: "", leavingDate: "" });
    setIsDischarging(false);
  };

  const handleCreateNewDevice = async () => {
    setIsCreatingDevice(true);
    try {
      // Get the highest device number
      const { data: allDevices } = await supabase.from("device_activity").select("device_number").order("device_number", { ascending: false }).limit(1);
      const nextNumber = allDevices && allDevices.length > 0 ? allDevices[0].device_number + 1 : 1;

      const { error } = await supabase.from("device_activity").insert({
        device_number: nextNumber,
        status: "not_connected",
        patient_id: null,
      });

      if (error) throw error;

      toast({ title: "Device Created", description: `Device ${nextNumber} has been added successfully.` });
      setNewDeviceLabel("");
      fetchAvailableDevices();
      fetchConnectedDevices();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create device", variant: "destructive" });
    } finally {
      setIsCreatingDevice(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-7 w-7 text-primary" />
                <span className="text-lg font-bold">Health<span className="text-primary">Pulse</span></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {[
                { id: "patients", icon: Users, label: "Register Patient" },
                { id: "doctors", icon: Stethoscope, label: "Register Doctor" },
                { id: "devices", icon: Wifi, label: "Device Activity" },
                { id: "discharge", icon: FileText, label: "Discharge Sheet" },
                { id: "manage-devices", icon: Settings, label: "Manage Devices" },
              ].map(item => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                  <item.icon className="h-5 w-5" />{item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />Logout
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Health<span className="text-primary">Pulse</span></span>
            <span className="ml-2 px-2 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs">Reception</span>
          </div>
          <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 flex justify-center">
        <div className="w-full max-w-4xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="patients" className="gap-2"><Users className="h-4 w-4" /><span className="hidden sm:inline">Register Patient</span></TabsTrigger>
              <TabsTrigger value="doctors" className="gap-2"><Stethoscope className="h-4 w-4" /><span className="hidden sm:inline">Register Doctor</span></TabsTrigger>
              <TabsTrigger value="devices" className="gap-2"><Wifi className="h-4 w-4" /><span className="hidden sm:inline">Devices</span></TabsTrigger>
              <TabsTrigger value="discharge" className="gap-2"><FileText className="h-4 w-4" /><span className="hidden sm:inline">Discharge</span></TabsTrigger>
              <TabsTrigger value="manage-devices" className="gap-2"><Settings className="h-4 w-4" /><span className="hidden sm:inline">Manage</span></TabsTrigger>
            </TabsList>

            {/* PATIENT REGISTRATION TAB */}
            <TabsContent value="patients">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />Register New Patient</CardTitle>
                    <CardDescription>Enter patient details to generate login credentials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegisterPatient} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input id="name" value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} placeholder="Patient's full name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" type="email" value={patientForm.email} onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })} placeholder="patient@email.com" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age *</Label>
                          <Input id="age" type="number" value={patientForm.age} onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })} placeholder="Age" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={patientForm.gender} onValueChange={(value) => setPatientForm({ ...patientForm, gender: value })}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent className="bg-background border">
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="room">Room *</Label>
                          <Input id="room" value={patientForm.room} onChange={(e) => setPatientForm({ ...patientForm, room: e.target.value })} placeholder="Room #" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bed_number">Bed Number</Label>
                          <Input id="bed_number" value={patientForm.bed_number} onChange={(e) => setPatientForm({ ...patientForm, bed_number: e.target.value })} placeholder="Bed #" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doctor_id">Assigned Doctor *</Label>
                          <Select value={patientForm.doctor_id} onValueChange={(value) => setPatientForm({ ...patientForm, doctor_id: value })} required>
                            <SelectTrigger><SelectValue placeholder="Select Doctor" /></SelectTrigger>
                            <SelectContent className="bg-background border">
                              {doctors.map((doctor) => (
                                <SelectItem key={doctor.user_id} value={doctor.user_id}>
                                  <div className="flex flex-col">
                                    <span>{doctor.full_name || "Unknown"}</span>
                                    {doctor.specialization && <span className="text-xs text-muted-foreground">{doctor.specialization}</span>}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="device_number">Device Number</Label>
                        <Select value={patientForm.device_number} onValueChange={(value) => setPatientForm({ ...patientForm, device_number: value })}>
                          <SelectTrigger><SelectValue placeholder="Select Device (optional)" /></SelectTrigger>
                          <SelectContent className="bg-background border">
                            {availableDevices.map((device) => (
                              <SelectItem key={device.id} value={String(device.device_number)}>Device {device.device_number}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Textarea id="diagnosis" value={patientForm.diagnosis} onChange={(e) => setPatientForm({ ...patientForm, diagnosis: e.target.value })} placeholder="Primary diagnosis or reason for admission" rows={2} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergency_contact">Emergency Contact</Label>
                          <Input id="emergency_contact" value={patientForm.emergency_contact} onChange={(e) => setPatientForm({ ...patientForm, emergency_contact: e.target.value })} placeholder="Contact name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergency_phone">Emergency Phone</Label>
                          <Input id="emergency_phone" value={patientForm.emergency_phone} onChange={(e) => setPatientForm({ ...patientForm, emergency_phone: e.target.value })} placeholder="Phone number" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Registering...</>) : (<><UserPlus className="h-4 w-4 mr-2" />Register Patient</>)}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* DOCTOR REGISTRATION TAB */}
            <TabsContent value="doctors">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />Register New Doctor</CardTitle>
                    <CardDescription>Enter doctor details to create their account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegisterDoctor} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="doc-name">Full Name *</Label>
                          <Input id="doc-name" value={doctorForm.full_name} onChange={(e) => setDoctorForm({ ...doctorForm, full_name: e.target.value })} placeholder="Dr. Full Name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doc-email">Email *</Label>
                          <Input id="doc-email" type="email" value={doctorForm.email} onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })} placeholder="doctor@email.com" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="doc-specialization">Specialization *</Label>
                          <Input id="doc-specialization" value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} placeholder="e.g., Cardiologist" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doc-phone">Phone *</Label>
                          <Input id="doc-phone" type="tel" value={doctorForm.phone} onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })} placeholder="+91 9876543210" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doc-department">Department</Label>
                        <Input id="doc-department" value={doctorForm.department} onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })} placeholder="e.g., ICU, Cardiology" />
                      </div>
                      <Button type="submit" className="w-full" disabled={isDoctorLoading}>
                        {isDoctorLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Registering...</>) : (<><Stethoscope className="h-4 w-4 mr-2" />Register Doctor</>)}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* DEVICE ACTIVITY TAB */}
            <TabsContent value="devices">
              <DeviceActivity role="receptionist" />
            </TabsContent>

            {/* DISCHARGE SHEET TAB */}
            <TabsContent value="discharge">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Generate Discharge Sheet</CardTitle>
                    <CardDescription>Fill in the details to generate a patient discharge summary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="discharge-name">Patient Name *</Label>
                          <Input id="discharge-name" value={dischargeForm.patientName} onChange={(e) => setDischargeForm({ ...dischargeForm, patientName: e.target.value })} placeholder="Patient's full name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discharge-device">Connected Device Number</Label>
                          <Input id="discharge-device" value={dischargeForm.deviceNumber} onChange={(e) => setDischargeForm({ ...dischargeForm, deviceNumber: e.target.value })} placeholder="e.g., 3" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discharge-doctor">Assigned Doctor Name</Label>
                        <Input id="discharge-doctor" value={dischargeForm.doctorName} onChange={(e) => setDischargeForm({ ...dischargeForm, doctorName: e.target.value })} placeholder="Dr. Name" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="discharge-joining">Joining Date *</Label>
                          <Input id="discharge-joining" type="date" value={dischargeForm.joiningDate} onChange={(e) => setDischargeForm({ ...dischargeForm, joiningDate: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discharge-leaving">Leaving Date *</Label>
                          <Input id="discharge-leaving" type="date" value={dischargeForm.leavingDate} onChange={(e) => setDischargeForm({ ...dischargeForm, leavingDate: e.target.value })} required />
                        </div>
                      </div>
                      <Button onClick={handleGenerateDischarge} className="w-full" disabled={isDischarging}>
                        {isDischarging ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>) : (<><FileText className="h-4 w-4 mr-2" />Generate Discharge Sheet</>)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* MANAGE DEVICES TAB */}
            <TabsContent value="manage-devices">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Add New Device */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" />Add New Device</CardTitle>
                    <CardDescription>Increase the number of IoT devices available in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-muted-foreground flex-1">
                        Click the button to add a new device to your pool. The device will be assigned the next available number automatically.
                      </p>
                      <Button onClick={handleCreateNewDevice} disabled={isCreatingDevice} className="gap-2">
                        {isCreatingDevice ? (<><Loader2 className="h-4 w-4 animate-spin" />Adding...</>) : (<><Plus className="h-4 w-4" />Add Device</>)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Connected Devices with Disconnect */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Unplug className="h-5 w-5 text-primary" />Connected Devices</CardTitle>
                    <CardDescription>Disconnect IoT devices from patients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {connectedDevices.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Wifi className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No devices are currently connected</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {connectedDevices.map((device) => (
                          <div key={device.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                                <Wifi className="h-5 w-5 text-success" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">Device {device.device_number}</p>
                                <p className="text-xs text-muted-foreground">
                                  HR: {device.heart_rate || '-'} • Temp: {device.body_temperature || '-'}°C • Steps: {device.steps || '-'}
                                </p>
                              </div>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleDisconnectDevice(device.id)} className="gap-1">
                              <Unplug className="h-4 w-4" />
                              Disconnect
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setShowDoctorPanel(true); setShowPatientPanel(false); }}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center relative" title="View Registered Doctors">
          <Stethoscope className="h-6 w-6" />
          {doctors.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">{doctors.length}</span>}
        </motion.button>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setShowPatientPanel(true); setShowDoctorPanel(false); }}
          className="w-14 h-14 rounded-full bg-success text-success-foreground shadow-lg flex items-center justify-center relative" title="View Registered Patients">
          <Users className="h-6 w-6" />
          {registeredPatients.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">{registeredPatients.length}</span>}
        </motion.button>
      </div>

      {/* Patient Panel */}
      <AnimatePresence>
        {showPatientPanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowPatientPanel(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Registered Patients</h2>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{registeredPatients.length}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPatientPanel(false)}><X className="h-5 w-5" /></Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {registeredPatients.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground"><Users className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No patients registered yet</p></div>
                ) : (
                  <div className="space-y-3">
                    {registeredPatients.map((patient) => {
                      const assignedDoctor = getDoctorById(patient.doctor_id);
                      return (
                        <div key={patient.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <div><p className="font-medium">{patient.name}</p><p className="text-sm text-muted-foreground">Room {patient.room}</p></div>
                            {!patient.password_given ? (
                              <Button size="sm" variant="outline" onClick={() => markPasswordGiven(patient.id)}><Check className="h-4 w-4 mr-1" />Mark Given</Button>
                            ) : (
                              <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">✓ Given</span>
                            )}
                          </div>
                          <div className="p-3 bg-background rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground">LOGIN CREDENTIALS</span>
                              <Button size="sm" variant="ghost" onClick={() => copyPatientCredentials(patient)}><Copy className="h-3 w-3" /></Button>
                            </div>
                            <p className="text-sm font-mono">{patient.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm font-mono">{showPatientPasswords[patient.id] ? patient.stored_password || "N/A" : "••••••••••"}</p>
                              <Button type="button" variant="ghost" size="sm" onClick={() => togglePatientPassword(patient.id)}>
                                {showPatientPasswords[patient.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          {assignedDoctor && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Stethoscope className="h-3 w-3" /><span>Dr. {assignedDoctor.full_name}</span>
                              {assignedDoctor.specialization && <span className="text-primary">({assignedDoctor.specialization})</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Doctor Panel */}
      <AnimatePresence>
        {showDoctorPanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowDoctorPanel(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Registered Doctors</h2>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{doctors.length}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowDoctorPanel(false)}><X className="h-5 w-5" /></Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {doctors.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground"><Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No doctors registered yet</p></div>
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">{(doctor.full_name || "DR").split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="font-medium">Dr. {doctor.full_name || "Unknown"}</p>
                            {doctor.specialization && <p className="text-sm text-primary">{doctor.specialization}</p>}
                          </div>
                        </div>
                        {doctor.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /><span>{doctor.phone}</span></div>}
                        {doctor.department && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building className="h-4 w-4" /><span>{doctor.department}</span></div>}
                        {doctor.stored_password && (
                          <div className="p-3 bg-background rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground">LOGIN CREDENTIALS</span>
                              <Button size="sm" variant="ghost" onClick={() => copyDoctorCredentials(doctor)}><Copy className="h-3 w-3" /></Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-mono">{showDoctorPasswords[doctor.id] ? doctor.stored_password : "••••••••••"}</p>
                              <Button type="button" variant="ghost" size="sm" onClick={() => toggleDoctorPassword(doctor.id)}>
                                {showDoctorPasswords[doctor.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        )}
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">Patients assigned: {registeredPatients.filter(p => p.doctor_id === doctor.user_id).length}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Credentials Dialog */}
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              {credentialsDialogType === "patient" ? "Patient" : "Doctor"} Registered Successfully
            </DialogTitle>
            <DialogDescription>Share these credentials with the {credentialsDialogType === "patient" ? "patient or their relative" : "doctor"}</DialogDescription>
          </DialogHeader>
          {credentials && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div><span className="text-xs text-muted-foreground">Email</span><p className="font-mono text-sm">{credentials.email}</p></div>
                <div>
                  <span className="text-xs text-muted-foreground">Password</span>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm">{showPassword ? credentials.password : "••••••••••"}</p>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>
              <Button onClick={copyCredentials} className="w-full gap-2" variant="outline">
                {copied ? <><Check className="h-4 w-4" />Copied!</> : <><Copy className="h-4 w-4" />Copy Credentials</>}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceptionDashboard;
