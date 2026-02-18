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
  Activity, 
  UserPlus, 
  LogOut, 
  Users, 
  Copy, 
  Check,
  Loader2,
  ClipboardList,
  Eye,
  EyeOff,
  Stethoscope,
  Phone,
  Building,
  X,
  ChevronLeft
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Credentials {
  email: string;
  password: string;
}

interface RegisteredPatient {
  id: string;
  name: string;
  email: string;
  room: string;
  created_at: string;
  password_given: boolean;
  stored_password: string | null;
  doctor_id: string | null;
}

interface Doctor {
  id: string;
  user_id: string;
  full_name: string | null;
  specialization: string | null;
  phone: string | null;
  department: string | null;
  stored_password: string | null;
}

const ReceptionDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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

  // Panel states for slide-in panels
  const [showPatientPanel, setShowPatientPanel] = useState(false);
  const [showDoctorPanel, setShowDoctorPanel] = useState(false);

  const [patientForm, setPatientForm] = useState({
    email: "", name: "", age: "", gender: "", room: "",
    bed_number: "", diagnosis: "", emergency_contact: "",
    emergency_phone: "", doctor_id: ""
  });

  const [doctorForm, setDoctorForm] = useState({
    email: "", full_name: "", specialization: "", phone: "", department: ""
  });

  useEffect(() => {
    checkAuth();
    fetchDoctors();
    fetchRegisteredPatients();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/auth/receptionist");
  };

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from("doctor_profiles")
      .select("id, user_id, full_name, specialization, phone, department, stored_password");
    if (data) setDoctors(data as Doctor[]);
  };

  const fetchRegisteredPatients = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("patients")
      .select("id, name, email, room, created_at, password_given, stored_password, doctor_id")
      .eq("registered_by", user.id)
      .order("created_at", { ascending: false });
    if (data) setRegisteredPatients(data as RegisteredPatient[]);
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

      setCredentials(data.credentials);
      setCredentialsDialogType("patient");
      setShowCredentialsDialog(true);
      toast({ title: "Patient Registered!", description: "Credentials generated successfully." });
      setPatientForm({ email: "", name: "", age: "", gender: "", room: "", bed_number: "", diagnosis: "", emergency_contact: "", emergency_phone: "", doctor_id: "" });
      fetchRegisteredPatients();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">
              Health<span className="text-primary">Pulse</span>
            </span>
            <span className="ml-2 px-2 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs">
              Reception
            </span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content — centered registration forms */}
      <main className="container mx-auto px-4 py-10 flex justify-center">
        <div className="w-full max-w-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patients" className="gap-2">
                <Users className="h-4 w-4" />
                Register Patient
              </TabsTrigger>
              <TabsTrigger value="doctors" className="gap-2">
                <Stethoscope className="h-4 w-4" />
                Register Doctor
              </TabsTrigger>
            </TabsList>

            {/* PATIENT REGISTRATION TAB */}
            <TabsContent value="patients">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Register New Patient
                    </CardTitle>
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
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Register New Doctor
                    </CardTitle>
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
          </Tabs>
        </div>
      </main>

      {/* Floating Action Buttons — bottom right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* Doctors list FAB */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setShowDoctorPanel(true); setShowPatientPanel(false); }}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center relative"
          title="View Registered Doctors"
        >
          <Stethoscope className="h-6 w-6" />
          {doctors.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
              {doctors.length}
            </span>
          )}
        </motion.button>

        {/* Patients list FAB */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setShowPatientPanel(true); setShowDoctorPanel(false); }}
          className="w-14 h-14 rounded-full bg-success text-success-foreground shadow-lg flex items-center justify-center relative"
          title="View Registered Patients"
        >
          <Users className="h-6 w-6" />
          {registeredPatients.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
              {registeredPatients.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Slide-in Patient Details Panel */}
      <AnimatePresence>
        {showPatientPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowPatientPanel(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Registered Patients</h2>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{registeredPatients.length}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPatientPanel(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {registeredPatients.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No patients registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {registeredPatients.map((patient) => {
                      const assignedDoctor = getDoctorById(patient.doctor_id);
                      return (
                        <div key={patient.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">Room {patient.room}</p>
                            </div>
                            {!patient.password_given ? (
                              <Button size="sm" variant="outline" onClick={() => markPasswordGiven(patient.id)}>
                                <Check className="h-4 w-4 mr-1" />Mark Given
                              </Button>
                            ) : (
                              <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">✓ Given</span>
                            )}
                          </div>
                          <div className="p-3 bg-background rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground">LOGIN CREDENTIALS</span>
                              <Button size="sm" variant="ghost" onClick={() => copyPatientCredentials(patient)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm font-mono">{patient.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm font-mono">
                                {showPatientPasswords[patient.id] ? patient.stored_password || "N/A" : "••••••••••"}
                              </p>
                              <Button type="button" variant="ghost" size="sm" onClick={() => togglePatientPassword(patient.id)}>
                                {showPatientPasswords[patient.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          {assignedDoctor && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Stethoscope className="h-3 w-3" />
                              <span>Dr. {assignedDoctor.full_name}</span>
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

      {/* Slide-in Doctor Details Panel */}
      <AnimatePresence>
        {showDoctorPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowDoctorPanel(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Registered Doctors</h2>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{doctors.length}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowDoctorPanel(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {doctors.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No doctors registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">
                              {(doctor.full_name || "DR").split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Dr. {doctor.full_name || "Unknown"}</p>
                            {doctor.specialization && <p className="text-sm text-primary">{doctor.specialization}</p>}
                          </div>
                        </div>
                        {doctor.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" /><span>{doctor.phone}</span>
                          </div>
                        )}
                        {doctor.department && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="h-4 w-4" /><span>{doctor.department}</span>
                          </div>
                        )}
                        {doctor.stored_password && (
                          <div className="p-3 bg-background rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground">LOGIN CREDENTIALS</span>
                              <Button size="sm" variant="ghost" onClick={() => copyDoctorCredentials(doctor)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-mono">
                                {showDoctorPasswords[doctor.id] ? doctor.stored_password : "••••••••••"}
                              </p>
                              <Button type="button" variant="ghost" size="sm" onClick={() => toggleDoctorPassword(doctor.id)}>
                                {showDoctorPasswords[doctor.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        )}
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Patients assigned: {registeredPatients.filter(p => p.doctor_id === doctor.user_id).length}
                          </p>
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
            <DialogDescription>
              Share these credentials with the {credentialsDialogType === "patient" ? "patient or their relative" : "doctor"}
            </DialogDescription>
          </DialogHeader>
          {credentials && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-mono text-sm">{credentials.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Password</Label>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm">{showPassword ? credentials.password : "••••••••••"}</p>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={copyCredentials} className="flex-1">
                  {copied ? (<><Check className="h-4 w-4 mr-2" />Copied!</>) : (<><Copy className="h-4 w-4 mr-2" />Copy Credentials</>)}
                </Button>
                <Button variant="outline" onClick={() => setShowCredentialsDialog(false)}>Done</Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ Credentials are stored securely. You can always view them from the {credentialsDialogType} list.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceptionDashboard;
