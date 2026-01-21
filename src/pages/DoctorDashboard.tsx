import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Bell, Settings, LogOut, Search, Heart, Thermometer, Wind, Users, AlertTriangle, Plus, ChevronRight, RefreshCw } from "lucide-react";
import VitalCard from "@/components/cards/VitalCard";
import PatientCard from "@/components/cards/PatientCard";
import LiveChart from "@/components/dashboard/LiveChart";
import EmergencyAlert from "@/components/dashboard/EmergencyAlert";
import PatientDetailModal from "@/components/dashboard/PatientDetailModal";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { Input } from "@/components/ui/input";
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
}

interface MyPatient {
  id: string;
  name: string;
  age: number;
  room: string;
  diagnosis?: string;
  email?: string;
  admission_date?: string;
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
  const [showAlert, setShowAlert] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientVitals, setSelectedPatientVitals] = useState<PatientVitals | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [myPatients, setMyPatients] = useState<MyPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState("Doctor");
  const [activeTab, setActiveTab] = useState<"patients" | "mypatients" | "alerts">("patients");
  const [searchQuery, setSearchQuery] = useState("");

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
      
      // Fetch doctor profile
      const { data: profile } = await supabase
        .from("doctor_profiles")
        .select("full_name, profession")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (profile?.full_name) {
        setDoctorName(profile.full_name);
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch ICU patients
  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("is_icu", true)
        .order("status", { ascending: false });

      if (error) throw error;

      // Map database status to component status
      const mappedPatients = (data || []).map(p => ({
        ...p,
        status: p.status as "normal" | "warning" | "critical",
      }));

      setPatients(mappedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all patients assigned to this doctor
  const fetchMyPatients = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name, age, room, diagnosis, email, admission_date")
        .eq("doctor_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyPatients(data || []);
    } catch (error) {
      console.error("Error fetching my patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();

    // Subscribe to real-time patient updates
    const channel = supabase
      .channel("patients-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "patients",
        },
        () => {
          fetchPatients();
          fetchMyPatients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMyPatients();
    }
  }, [userId]);

  // Check for critical patients and show alert
  useEffect(() => {
    const criticalPatient = patients.find((p) => p.status === "critical");
    if (criticalPatient) {
      const timer = setTimeout(() => setShowAlert(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [patients]);

  // Fetch patient vitals when a patient is selected
  const handlePatientClick = async (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);

    try {
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
        // Generate simulated vitals if no data exists
        setSelectedPatientVitals({
          heartRate: Math.floor(60 + Math.random() * 40),
          bloodPressureSystolic: Math.floor(110 + Math.random() * 30),
          bloodPressureDiastolic: Math.floor(70 + Math.random() * 20),
          oxygenLevel: Math.floor(94 + Math.random() * 6),
          temperature: Number((36 + Math.random() * 2).toFixed(1)),
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

  // Filter patients based on search
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { icon: Users, label: "Total ICU Patients", value: patients.length, color: "text-primary" },
    { icon: Heart, label: "Normal", value: patients.filter((p) => p.status === "normal").length, color: "text-success" },
    { icon: AlertTriangle, label: "Warning", value: patients.filter((p) => p.status === "warning").length, color: "text-warning" },
    { icon: Bell, label: "Critical", value: patients.filter((p) => p.status === "critical").length, color: "text-destructive" },
  ];

  const criticalPatient = patients.find((p) => p.status === "critical");

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Alert */}
      {criticalPatient && (
        <EmergencyAlert
          isVisible={showAlert}
          patientName={criticalPatient.name}
          room={criticalPatient.room}
          alertType="Critical Condition"
          value="Immediate attention required"
          onDismiss={() => setShowAlert(false)}
          onContact={() => {
            setShowAlert(false);
            handlePatientClick(criticalPatient);
          }}
        />
      )}

      {/* Patient Detail Modal */}
      <PatientDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        vitals={selectedPatientVitals}
      />

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
            onClick={() => setActiveTab("patients")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "patients" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Users className="h-5 w-5" />
            ICU Patients
          </button>
          <button
            onClick={() => setActiveTab("mypatients")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "mypatients" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Users className="h-5 w-5" />
            My Patients
            <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {myPatients.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "alerts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Bell className="h-5 w-5" />
            Alerts
            {patients.filter(p => p.status === "critical" || p.status === "warning").length > 0 && (
              <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                {patients.filter(p => p.status === "critical" || p.status === "warning").length}
              </span>
            )}
          </button>
          <Link to="/dashboard/doctor/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        {/* User */}
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

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="glass border-b border-border p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="lg:hidden">
                <Activity className="h-8 w-8 text-primary" />
              </div>
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
            <div className="flex items-center gap-3">
              <Button variant="glass" size="icon" className="relative" onClick={() => setActiveTab("alerts")}>
                <Bell className="h-5 w-5" />
                {patients.filter(p => p.status === "critical").length > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center"
                  >
                    {patients.filter(p => p.status === "critical").length}
                  </motion.span>
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome, {doctorName}</h1>
              <p className="text-muted-foreground">Monitor your ICU patients in real-time</p>
            </div>
            <Button variant="ghost" className="gap-2" onClick={fetchPatients}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="glass rounded-xl p-6 shadow-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  {stat.label === "Critical" && stat.value > 0 && (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-destructive"
                    />
                  )}
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {activeTab === "patients" ? (
            <>
              {/* Live Vital Charts for Critical Patient */}
              {criticalPatient && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      Live Vitals - {criticalPatient.room} (Critical)
                    </h2>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => handlePatientClick(criticalPatient)}>
                      View Details <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <VitalCard
                      icon={Heart}
                      label="Heart Rate"
                      value={110}
                      unit="BPM"
                      status="critical"
                      showECG
                      trend="up"
                    />
                    <VitalCard
                      icon={Thermometer}
                      label="Temperature"
                      value={39.2}
                      unit="°C"
                      status="warning"
                      trend="up"
                    />
                    <VitalCard
                      icon={Wind}
                      label="Oxygen Level"
                      value={89}
                      unit="%"
                      status="critical"
                      trend="down"
                    />
                  </div>
                </motion.div>
              )}

              {/* Live Charts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
              >
                <LiveChart
                  title="Heart Rate Monitor"
                  dataKey="heartRate"
                  color="hsl(var(--destructive))"
                  unit="BPM"
                  minValue={50}
                  maxValue={150}
                />
                <LiveChart
                  title="SpO₂ Level"
                  dataKey="oxygen"
                  color="hsl(var(--primary))"
                  unit="%"
                  minValue={80}
                  maxValue={100}
                />
              </motion.div>

              {/* Patient Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">ICU Patients</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      Normal ({patients.filter((p) => p.status === "normal").length})
                    </Button>
                    <Button variant="ghost" size="sm">
                      Warning ({patients.filter((p) => p.status === "warning").length})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Critical ({patients.filter((p) => p.status === "critical").length})
                    </Button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading patients...</div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No ICU patients found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredPatients
                      .sort((a, b) => {
                        const statusOrder = { critical: 0, warning: 1, normal: 2 };
                        return statusOrder[a.status] - statusOrder[b.status];
                      })
                      .map((patient) => (
                        <PatientCard
                          key={patient.id}
                          patient={{
                            id: patient.id,
                            name: patient.name,
                            age: patient.age,
                            room: patient.room,
                            heartRate: 0,
                            temperature: 0,
                            oxygenLevel: 0,
                            status: patient.status,
                            lastUpdate: "Just now",
                          }}
                          onClick={() => handlePatientClick(patient)}
                        />
                      ))}
                  </div>
                )}
              </motion.div>
            </>
          ) : activeTab === "mypatients" ? (
            /* My Patients Tab */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">My Assigned Patients</h2>
              {myPatients.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No patients assigned to you yet</p>
                  <p className="text-sm">Patients will appear here when assigned by reception</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {myPatients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="glass rounded-xl p-6 shadow-card cursor-pointer"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Room:</span>
                          <span className="font-medium text-foreground">{patient.room}</span>
                        </div>
                        {patient.diagnosis && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Diagnosis:</span>
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
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* Alerts Tab */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Patient Alerts</h2>
              <AlertsPanel 
                doctorId={userId} 
                onAlertClick={(patientId) => {
                  const patient = patients.find(p => p.id === patientId);
                  if (patient) {
                    handlePatientClick(patient);
                  }
                }}
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
