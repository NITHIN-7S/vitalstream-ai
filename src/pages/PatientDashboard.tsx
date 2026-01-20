import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Bell, Settings, LogOut, Heart, Thermometer, Wind, User, Phone, Calendar, FileText, ChevronRight, MessageCircle, MapPin, Loader2 } from "lucide-react";
import VitalCard from "@/components/cards/VitalCard";
import LiveChart from "@/components/dashboard/LiveChart";
import ECGWave from "@/components/animations/ECGWave";
import ContactForm from "@/components/dashboard/ContactForm";
import NearbyHospitalsMap from "@/components/dashboard/NearbyHospitalsMap";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const vitals = {
    heartRate: { value: 78, status: "normal" as const, trend: "stable" as const },
    temperature: { value: 37.2, status: "normal" as const, trend: "stable" as const },
    oxygenLevel: { value: 98, status: "normal" as const, trend: "up" as const },
    bloodPressure: { systolic: 120, diastolic: 80, status: "normal" as const },
  };

  const recentAlerts = [
    { time: "2 hours ago", message: "Vital signs stable", type: "info" },
    { time: "6 hours ago", message: "Medication administered", type: "success" },
    { time: "12 hours ago", message: "Doctor checkup completed", type: "info" },
  ];

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
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium">
            <Activity className="h-5 w-5" />
            My Health
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <FileText className="h-5 w-5" />
            Reports
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Calendar className="h-5 w-5" />
            Appointments
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <MessageCircle className="h-5 w-5" />
            Messages
          </a>
          <a href="#hospitals" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <MapPin className="h-5 w-5" />
            Nearby Hospitals
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </a>
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
              <h1 className="text-xl font-semibold text-foreground">My Health Dashboard</h1>
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

          {/* Charts & Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Heart Rate History */}
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
                  <div className="space-y-3">
                    <Button variant="hero" className="w-full gap-2" onClick={handleCallDoctor}>
                      <Phone className="h-4 w-4" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
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

          {/* Medications & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Medications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Current Medications</h3>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
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

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "success" ? "bg-success" : "bg-primary"
                    }`} />
                    <div>
                      <p className="text-foreground">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ECG Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-6 shadow-card"
          >
            <h3 className="font-semibold text-foreground mb-4">Live ECG Monitor</h3>
            <div className="h-32 rounded-lg bg-card overflow-hidden">
              <ECGWave className="h-full" speed={2} />
            </div>
          </motion.div>

          {/* Nearby Hospitals & Contact Form Section */}
          <div id="hospitals" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Nearby Hospitals</h2>
              <NearbyHospitalsMap />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Contact Support</h2>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;