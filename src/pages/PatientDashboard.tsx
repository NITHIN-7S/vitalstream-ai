import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Bell, Settings, LogOut, Heart, Thermometer, Wind, User, Phone, FileText, MapPin, Loader2, Lock, Eye, EyeOff, Upload, ChevronRight } from "lucide-react";
import VitalCard from "@/components/cards/VitalCard";
import LiveChart from "@/components/dashboard/LiveChart";
import ECGWave from "@/components/animations/ECGWave";
import ContactForm from "@/components/dashboard/ContactForm";
import NearbyHospitalsMap from "@/components/dashboard/NearbyHospitalsMap";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PatientData {
  name: string;
  age: number;
  room: string;
  admissionDate: string;
  doctor: string | null;
  doctorSpecialty: string | null;
  doctorPhone: string | null;
  condition: string | null;
}

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"health" | "reports" | "hospitals" | "settings">("health");
  const [patientData, setPatientData] = useState<PatientData>({
    name: "Loading...",
    age: 0,
    room: "",
    admissionDate: "",
    doctor: null,
    doctorSpecialty: null,
    doctorPhone: null,
    condition: null,
  });

  // Settings state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Reports state
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportDescription, setReportDescription] = useState("");
  const [isUploadingReport, setIsUploadingReport] = useState(false);
  const [reports, setReports] = useState<{ id: string; name: string; date: string; description: string }[]>([]);

  const vitals = {
    heartRate: { value: 78, status: "normal" as const, trend: "stable" as const },
    temperature: { value: 37.2, status: "normal" as const, trend: "stable" as const },
    oxygenLevel: { value: 98, status: "normal" as const, trend: "up" as const },
    bloodPressure: { systolic: 120, diastolic: 80, status: "normal" as const },
  };

  const medications = [
    { name: "Aspirin", dosage: "100mg", frequency: "Once daily", nextDose: "8:00 AM" },
    { name: "Metoprolol", dosage: "50mg", frequency: "Twice daily", nextDose: "8:00 AM" },
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", nextDose: "8:00 AM" },
  ];

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth/patient");
        return;
      }

      // Fetch patient data
      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (patientError || !patient) {
        toast({
          title: "Error",
          description: "Could not load patient data",
          variant: "destructive",
        });
        return;
      }

      // Fetch doctor info if assigned
      let doctorInfo = { name: null as string | null, specialty: null as string | null, phone: null as string | null };
      if (patient.doctor_id) {
        const { data: doctor } = await supabase
          .from("doctor_profiles")
          .select("full_name, specialization, phone")
          .eq("user_id", patient.doctor_id)
          .single();
        
        if (doctor) {
          doctorInfo = {
            name: doctor.full_name,
            specialty: doctor.specialization,
            phone: doctor.phone,
          };
        }
      }

      setPatientData({
        name: patient.name,
        age: patient.age,
        room: patient.room,
        admissionDate: patient.admission_date ? new Date(patient.admission_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A",
        doctor: doctorInfo.name ? `Dr. ${doctorInfo.name}` : null,
        doctorSpecialty: doctorInfo.specialty,
        doctorPhone: doctorInfo.phone,
        condition: patient.diagnosis,
      });
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCallDoctor = () => {
    if (patientData.doctorPhone) {
      window.location.href = `tel:${patientData.doctorPhone}`;
    } else {
      toast({
        title: "No phone number",
        description: "Doctor's phone number is not available",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      // Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      // Also update the stored_password in patients table for receptionist visibility
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("patients")
          .update({ stored_password: passwordForm.newPassword })
          .eq("user_id", user.id);
      }

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });
      setShowPasswordDialog(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingReport(true);
    
    // Simulate upload - in real implementation, upload to Supabase Storage
    setTimeout(() => {
      const newReport = {
        id: Date.now().toString(),
        name: reportFile.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: reportDescription || "Medical Report",
      };
      setReports([newReport, ...reports]);
      setReportFile(null);
      setReportDescription("");
      setIsUploadingReport(false);
      toast({
        title: "Report Uploaded",
        description: "Your medical report has been uploaded successfully",
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-border hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">
              Health<span className="text-primary">Pulse</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveSection("health")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeSection === "health" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Activity className="h-5 w-5" />
            My Health
          </button>
          <button
            onClick={() => setActiveSection("reports")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeSection === "reports" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <FileText className="h-5 w-5" />
            Reports
          </button>
          <button
            onClick={() => setActiveSection("hospitals")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeSection === "hospitals" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <MapPin className="h-5 w-5" />
            Nearby Hospitals
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeSection === "settings" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <User className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{patientData.name}</p>
              <p className="text-xs text-muted-foreground">Room {patientData.room}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="glass border-b border-border p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                {activeSection === "health" && "My Health Dashboard"}
                {activeSection === "reports" && "Medical Reports"}
                {activeSection === "hospitals" && "Nearby Hospitals"}
                {activeSection === "settings" && "Settings"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="glass" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="hero" className="gap-2" onClick={handleCallDoctor} disabled={!patientData.doctorPhone}>
                <Phone className="h-4 w-4" />
                Contact Doctor
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {activeSection === "health" && (
            <>
              {/* Patient Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 shadow-card"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-success" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{patientData.name}</h2>
                      <p className="text-muted-foreground">{patientData.condition || "Under Observation"}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">Age: {patientData.age}</span>
                        <span className="text-muted-foreground">Room: {patientData.room}</span>
                        <span className="text-muted-foreground">Admitted: {patientData.admissionDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </span>
                    <span className="text-success font-medium">Condition Stable</span>
                  </div>
                </div>
              </motion.div>

              {/* Current Vitals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Current Vitals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <VitalCard
                    icon={Heart}
                    label="Heart Rate"
                    value={vitals.heartRate.value}
                    unit="BPM"
                    status={vitals.heartRate.status}
                    showECG
                    trend={vitals.heartRate.trend}
                  />
                  <VitalCard
                    icon={Thermometer}
                    label="Temperature"
                    value={vitals.temperature.value}
                    unit="°C"
                    status={vitals.temperature.status}
                    trend={vitals.temperature.trend}
                  />
                  <VitalCard
                    icon={Wind}
                    label="Oxygen Level"
                    value={vitals.oxygenLevel.value}
                    unit="%"
                    status={vitals.oxygenLevel.status}
                    trend={vitals.oxygenLevel.trend}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="glass rounded-xl p-6 shadow-card border border-success/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-success/10">
                        <Activity className="h-5 w-5 text-success" />
                      </div>
                      <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs font-semibold">
                        NORMAL
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-success">
                        {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
                      </span>
                      <span className="text-muted-foreground ml-1">mmHg</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Blood Pressure</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Charts & Doctor Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <LiveChart
                    title="Heart Rate History (24h)"
                    dataKey="heartRate"
                    color="hsl(var(--destructive))"
                    unit="BPM"
                    minValue={60}
                    maxValue={100}
                  />
                </motion.div>

                {/* Doctor Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass rounded-xl p-6 shadow-card"
                >
                  <h3 className="font-semibold text-foreground mb-4">Your Doctor</h3>
                  {patientData.doctor ? (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {patientData.doctor.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{patientData.doctor}</p>
                          <p className="text-sm text-muted-foreground">{patientData.doctorSpecialty || "General Physician"}</p>
                          {patientData.doctorPhone && (
                            <p className="text-xs text-primary mt-1">{patientData.doctorPhone}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="hero" className="w-full gap-2" onClick={handleCallDoctor}>
                        <Phone className="h-4 w-4" />
                        Call Now
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No doctor assigned yet</p>
                      <p className="text-sm">Please contact reception</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Medications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-xl p-6 shadow-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Current Medications</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medications.map((med) => (
                    <div
                      key={med.name}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{med.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.frequency}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">Next: {med.nextDose}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ECG Wave */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass rounded-xl p-6 shadow-card"
              >
                <h3 className="font-semibold text-foreground mb-4">Live ECG Monitor</h3>
                <div className="h-24">
                  <ECGWave className="w-full h-full" color="hsl(var(--destructive))" speed={2} />
                </div>
              </motion.div>
            </>
          )}

          {activeSection === "reports" && (
            <>
              {/* Upload Report */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 shadow-card"
              >
                <h3 className="font-semibold text-foreground mb-4">Upload Medical Report</h3>
                <form onSubmit={handleUploadReport} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-file">Select File</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="report-file"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-desc">Description (Optional)</Label>
                    <Input
                      id="report-desc"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="e.g., Blood Test Report, X-Ray..."
                    />
                  </div>
                  <Button type="submit" disabled={!reportFile || isUploadingReport}>
                    {isUploadingReport ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Report
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Reports List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6 shadow-card"
              >
                <h3 className="font-semibold text-foreground mb-4">Your Reports</h3>
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reports uploaded yet</p>
                    <p className="text-sm">Upload your medical reports to keep track of them</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{report.name}</p>
                            <p className="text-sm text-muted-foreground">{report.description} • {report.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}

          {activeSection === "hospitals" && (
            <>
              {/* Nearby Hospitals Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <NearbyHospitalsMap />
              </motion.div>

              {/* Hospital Support Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ContactForm />
              </motion.div>
            </>
          )}

          {activeSection === "settings" && (
            <>
              {/* Account Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 shadow-card"
              >
                <h3 className="font-semibold text-foreground mb-6">Account Settings</h3>
                
                {/* Profile Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{patientData.name}</p>
                      <p className="text-sm text-muted-foreground">Room {patientData.room} • Age {patientData.age}</p>
                      <p className="text-xs text-muted-foreground mt-1">Admitted: {patientData.admissionDate}</p>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Security</h4>
                  <div className="p-4 rounded-lg border border-border bg-background">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Password</p>
                          <p className="text-sm text-muted-foreground">Change your login password</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Doctor Info in Settings */}
                <div className="space-y-4 mt-8">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Doctor</h4>
                  {patientData.doctor ? (
                    <div className="p-4 rounded-lg border border-border bg-background">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {patientData.doctor.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{patientData.doctor}</p>
                          <p className="text-sm text-muted-foreground">{patientData.doctorSpecialty || "General Physician"}</p>
                        </div>
                        {patientData.doctorPhone && (
                          <Button variant="hero" size="sm" onClick={handleCallDoctor}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-border bg-background text-center text-muted-foreground">
                      No doctor assigned yet
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your new password. This will also update your credentials with the receptionist.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleChangePassword} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="pl-10 pr-10"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  className="pl-10"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
              >
                Cancel
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Note: Your new password will be visible to the receptionist for account recovery purposes.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;
