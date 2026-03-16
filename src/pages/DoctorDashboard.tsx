import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Bell, Settings, LogOut, Search, Users, ChevronRight, RefreshCw, Wifi, User, Briefcase, Phone, Building, Lock, Save, Eye, EyeOff, Loader2, Menu, X } from "lucide-react";
import PatientCard from "@/components/cards/PatientCard";
import PatientDetailModal from "@/components/dashboard/PatientDetailModal";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import DeviceActivity from "@/components/dashboard/DeviceActivity";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender?: string;
  room: string;
  bed_number?: string;
  diagnosis?: string;
  status: "normal" | "warning" | "critical";
  is_icu: boolean;
  emergency_contact?: string;
  emergency_phone?: string;
  admission_date?: string;
  email?: string;
  user_id?: string;
}

interface MyPatient {
  id: string;
  name: string;
  age: number;
  room: string;
  diagnosis?: string;
  email?: string;
  admission_date?: string;
  bed_number?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  user_id?: string;
  status: "normal" | "warning" | "critical";
}

interface PatientVitals {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenLevel: number;
  temperature: number;
  glucoseLevel: number;
  respiratoryRate: number;
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientVitals, setSelectedPatientVitals] = useState<PatientVitals | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myPatients, setMyPatients] = useState<MyPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState("Doctor");
  const [activeTab, setActiveTab] = useState<"mypatients" | "alerts" | "devices" | "settings">("mypatients");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Profile state
  const [profile, setProfile] = useState({
    full_name: "",
    profession: "",
    specialization: "",
    phone: "",
    department: "",
    license_number: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Password state
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
      
      const { data: profileData } = await supabase
        .from("doctor_profiles")
        .select("full_name, profession, specialization, phone, department, license_number")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (profileData?.full_name) {
        setDoctorName(profileData.full_name);
      }
      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          profession: profileData.profession || "",
          specialization: profileData.specialization || "",
          phone: profileData.phone || "",
          department: profileData.department || "",
          license_number: profileData.license_number || "",
        });
      }
    };
    checkAuth();
  }, [navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setProfileLoading(true);
    try {
      const { data: existing } = await supabase
        .from("doctor_profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("doctor_profiles")
          .update(profile)
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("doctor_profiles")
          .insert({ ...profile, user_id: userId });
        if (error) throw error;
      }
      setDoctorName(profile.full_name || "Doctor");
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
      if (error) throw error;

      if (userId) {
        await supabase
          .from("doctor_profiles")
          .update({ stored_password: passwords.newPassword })
          .eq("user_id", userId);
      }
      toast.success("Password updated successfully");
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Fetch all patients assigned to this doctor
  const fetchMyPatients = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name, age, room, diagnosis, email, admission_date, status, bed_number, emergency_contact, emergency_phone, user_id")
        .eq("doctor_id", userId)
        .eq("is_discharged", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyPatients((data || []).map(p => ({
        ...p,
        status: (p.status as "normal" | "warning" | "critical") || "normal"
      })));
    } catch (error) {
      console.error("Error fetching my patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("patients-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patients" },
        () => { fetchMyPatients(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMyPatients();
    }
  }, [userId]);

  const handlePatientClick = async (patient: MyPatient) => {
    const fullPatient: Patient = {
      ...patient,
      status: patient.status,
      is_icu: false,
    };
    setSelectedPatient(fullPatient);
    setIsModalOpen(true);

    try {
      // Check if a device is connected to this patient
      const { data: deviceData } = await supabase
        .from("device_activity")
        .select("id, heart_rate, oxygen_level, body_temperature, steps")
        .eq("patient_id", patient.id)
        .eq("status", "connected")
        .limit(1)
        .maybeSingle();

      if (!deviceData) {
        // No device connected - don't show vitals
        setSelectedPatientVitals(null);
        return;
      }

      // Device is connected - fetch vitals
      const { data, error } = await supabase
        .from("patient_vitals")
        .select("*")
        .eq("patient_id", patient.id)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSelectedPatientVitals({
          heartRate: data.heart_rate || 0,
          bloodPressureSystolic: data.blood_pressure_systolic || 0,
          bloodPressureDiastolic: data.blood_pressure_diastolic || 0,
          oxygenLevel: Number(data.oxygen_level) || 0,
          temperature: Number(data.temperature) || 0,
          glucoseLevel: data.glucose_level || 0,
          respiratoryRate: data.respiratory_rate || 0,
        });
      } else {
        // Device connected but no vitals recorded yet - show device readings
        setSelectedPatientVitals({
          heartRate: deviceData.heart_rate || Math.floor(60 + Math.random() * 40),
          bloodPressureSystolic: Math.floor(110 + Math.random() * 30),
          bloodPressureDiastolic: Math.floor(70 + Math.random() * 20),
          oxygenLevel: deviceData.oxygen_level || Math.floor(94 + Math.random() * 6),
          temperature: deviceData.body_temperature || Number((36 + Math.random() * 2).toFixed(1)),
          glucoseLevel: Math.floor(80 + Math.random() * 60),
          respiratoryRate: Math.floor(12 + Math.random() * 8),
        });
      }
    } catch (error) {
      console.error("Error fetching vitals:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const filteredPatients = myPatients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { id: "mypatients" as const, icon: Users, label: "My Patients", badge: myPatients.length },
    { id: "devices" as const, icon: Wifi, label: "Devices" },
    { id: "alerts" as const, icon: Bell, label: "Alerts" },
    { id: "settings" as const, icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Patient Detail Modal */}
      <PatientDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient ? {
          ...selectedPatient,
          bedNumber: selectedPatient.bed_number,
          admissionDate: selectedPatient.admission_date,
          emergencyContact: selectedPatient.emergency_contact,
          emergencyPhone: selectedPatient.emergency_phone,
          user_id: selectedPatient.user_id
        } : null}
        vitals={selectedPatientVitals}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-border hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">
              Health<span className="text-primary">Pulse</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.badge !== undefined && (
                <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">DR</span>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{doctorName}</p>
              <p className="text-xs text-muted-foreground">Doctor</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-7 w-7 text-primary" />
                <span className="text-lg font-bold">Health<span className="text-primary">Pulse</span></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">DR</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{doctorName}</p>
                  <p className="text-xs text-muted-foreground">Doctor</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <header className="glass border-b border-border p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="glass" size="icon" className="relative" onClick={() => setActiveTab("alerts")}>
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome, {doctorName}</h1>
              <p className="text-muted-foreground">Monitor your patients in real-time</p>
            </div>
            <Button variant="ghost" className="gap-2" onClick={fetchMyPatients}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </motion.div>

          {activeTab === "mypatients" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">My Assigned Patients</h2>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading patients...</div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No patients assigned to you yet</p>
                  <p className="text-sm">Patients will appear here when assigned by reception</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredPatients.map((patient) => {
                    const statusColors = {
                      normal: "bg-success/20 text-success border-success/30",
                      warning: "bg-warning/20 text-warning border-warning/30",
                      critical: "bg-destructive/20 text-destructive border-destructive/30"
                    };
                    const statusLabels = {
                      normal: "Stable",
                      warning: "Warning",
                      critical: "Critical"
                    };
                    return (
                      <motion.div
                        key={patient.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        onClick={() => handlePatientClick(patient)}
                        className={`glass rounded-xl p-6 shadow-card cursor-pointer border ${
                          patient.status === "critical" ? "border-destructive/50" : 
                          patient.status === "warning" ? "border-warning/50" : "border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              patient.status === "critical" ? "bg-destructive/20" :
                              patient.status === "warning" ? "bg-warning/20" : "bg-primary/20"
                            }`}>
                              <span className={`text-lg font-bold ${
                                patient.status === "critical" ? "text-destructive" :
                                patient.status === "warning" ? "text-warning" : "text-primary"
                              }`}>
                                {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[patient.status]}`}>
                            {statusLabels[patient.status]}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room:</span>
                            <span className="font-medium text-foreground">{patient.room}</span>
                          </div>
                          {patient.diagnosis && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Condition:</span>
                              <span className="font-medium text-foreground truncate max-w-[150px]">{patient.diagnosis}</span>
                            </div>
                          )}
                          {patient.admission_date && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Admitted:</span>
                              <span className="font-medium text-foreground">
                                {new Date(patient.admission_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : activeTab === "alerts" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Patient Alerts</h2>
              <AlertsPanel 
                doctorId={userId} 
                onAlertClick={(patientId) => {
                  const patient = myPatients.find(p => p.id === patientId);
                  if (patient) handlePatientClick(patient);
                }}
              />
            </motion.div>
          ) : activeTab === "devices" ? (
            <DeviceActivity role="doctor" userId={userId || undefined} />
          ) : activeTab === "settings" ? (
            <div className="space-y-6">
              {/* Update Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl border border-border p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                    <p className="text-sm text-muted-foreground">Update your personal and professional details</p>
                  </div>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="full_name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Dr. John Smith" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="profession" value={profile.profession} onChange={(e) => setProfile({ ...profile, profession: e.target.value })} placeholder="Senior Doctor" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input id="specialization" value={profile.specialization} onChange={(e) => setProfile({ ...profile, specialization: e.target.value })} placeholder="Cardiology" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="department" value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} placeholder="ICU" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+1 234 567 8900" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license_number">License Number</Label>
                      <Input id="license_number" value={profile.license_number} onChange={(e) => setProfile({ ...profile, license_number: e.target.value })} placeholder="MED-12345" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" variant="hero" disabled={profileLoading} className="gap-2">
                      <Save className="h-4 w-4" />
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </motion.div>

              {/* Change Password */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl border border-border p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-warning/10">
                    <Lock className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
                    <p className="text-sm text-muted-foreground">Update your password. Changes will sync to reception.</p>
                  </div>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className="pl-10 pr-10"
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" variant="outline" disabled={passwordLoading} className="gap-2">
                      <Lock className="h-4 w-4" />
                      {passwordLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Note: Your new password will be visible to the receptionist for account recovery purposes.
                  </p>
                </form>
              </motion.div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
