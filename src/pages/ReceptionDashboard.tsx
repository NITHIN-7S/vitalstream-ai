import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  EyeOff
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PatientCredentials {
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
}

const ReceptionDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [credentials, setCredentials] = useState<PatientCredentials | null>(null);
  const [registeredPatients, setRegisteredPatients] = useState<RegisteredPatient[]>([]);
  const [doctors, setDoctors] = useState<{id: string, full_name: string}[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const [patientForm, setPatientForm] = useState({
    email: "",
    name: "",
    age: "",
    gender: "",
    room: "",
    bed_number: "",
    diagnosis: "",
    emergency_contact: "",
    emergency_phone: "",
    doctor_id: ""
  });

  useEffect(() => {
    checkAuth();
    fetchDoctors();
    fetchRegisteredPatients();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth/receptionist");
    }
  };

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from("doctor_profiles")
      .select("user_id, full_name");
    
    if (data) {
      setDoctors(data.map(d => ({ id: d.user_id, full_name: d.full_name || "Unknown" })));
    }
  };

  const fetchRegisteredPatients = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("patients")
      .select("id, name, email, room, created_at, password_given")
      .eq("registered_by", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (data) {
      setRegisteredPatients(data as RegisteredPatient[]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("register-patient", {
        body: patientForm
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setCredentials(data.credentials);
      setShowCredentialsDialog(true);
      
      toast({
        title: "Patient Registered!",
        description: "Credentials generated successfully.",
      });

      // Reset form
      setPatientForm({
        email: "",
        name: "",
        age: "",
        gender: "",
        room: "",
        bed_number: "",
        diagnosis: "",
        emergency_contact: "",
        emergency_phone: "",
        doctor_id: ""
      });

      fetchRegisteredPatients();

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register patient",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCredentials = () => {
    if (credentials) {
      navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Credentials copied to clipboard",
      });
    }
  };

  const markPasswordGiven = async (patientId: string) => {
    await supabase
      .from("patients")
      .update({ password_given: true })
      .eq("id", patientId);
    
    fetchRegisteredPatients();
    toast({
      title: "Updated",
      description: "Patient marked as credentials given",
    });
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Patient Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Register New Patient
                </CardTitle>
                <CardDescription>
                  Enter patient details to generate login credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterPatient} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={patientForm.name}
                        onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                        placeholder="Patient's full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={patientForm.email}
                        onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                        placeholder="patient@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={patientForm.age}
                        onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                        placeholder="Age"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={patientForm.gender}
                        onValueChange={(value) => setPatientForm({ ...patientForm, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border">
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="room">Room *</Label>
                      <Input
                        id="room"
                        value={patientForm.room}
                        onChange={(e) => setPatientForm({ ...patientForm, room: e.target.value })}
                        placeholder="Room #"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bed_number">Bed Number</Label>
                      <Input
                        id="bed_number"
                        value={patientForm.bed_number}
                        onChange={(e) => setPatientForm({ ...patientForm, bed_number: e.target.value })}
                        placeholder="Bed #"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor_id">Assigned Doctor</Label>
                      <Select
                        value={patientForm.doctor_id}
                        onValueChange={(value) => setPatientForm({ ...patientForm, doctor_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Doctor" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border">
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Textarea
                      id="diagnosis"
                      value={patientForm.diagnosis}
                      onChange={(e) => setPatientForm({ ...patientForm, diagnosis: e.target.value })}
                      placeholder="Primary diagnosis or reason for admission"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact">Emergency Contact</Label>
                      <Input
                        id="emergency_contact"
                        value={patientForm.emergency_contact}
                        onChange={(e) => setPatientForm({ ...patientForm, emergency_contact: e.target.value })}
                        placeholder="Contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_phone">Emergency Phone</Label>
                      <Input
                        id="emergency_phone"
                        value={patientForm.emergency_phone}
                        onChange={(e) => setPatientForm({ ...patientForm, emergency_phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register Patient
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recently Registered Patients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Recently Registered
                </CardTitle>
                <CardDescription>
                  Patients you registered today
                </CardDescription>
              </CardHeader>
              <CardContent>
                {registeredPatients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No patients registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {registeredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.email} • Room {patient.room}
                          </p>
                        </div>
                        {!patient.password_given ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markPasswordGiven(patient.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark Given
                          </Button>
                        ) : (
                          <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                            ✓ Credentials Given
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Credentials Dialog */}
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Patient Registered Successfully
            </DialogTitle>
            <DialogDescription>
              Share these credentials with the patient or their relative
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
                    <p className="font-mono text-sm">
                      {showPassword ? credentials.password : "••••••••••"}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={copyCredentials} className="flex-1">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Credentials
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCredentialsDialog(false)}
                >
                  Done
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ Please write down or copy these credentials. The password cannot be retrieved later.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceptionDashboard;
