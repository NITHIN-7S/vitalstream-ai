import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Bell, Settings, LogOut, Search, Heart, Thermometer, Wind, Users, AlertTriangle, Plus, ChevronRight, RefreshCw } from "lucide-react";
import VitalCard from "@/components/cards/VitalCard";
import PatientCard from "@/components/cards/PatientCard";
import LiveChart from "@/components/dashboard/LiveChart";
import EmergencyAlert from "@/components/dashboard/EmergencyAlert";
import { Input } from "@/components/ui/input";

const DoctorDashboard = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Simulated patient data
  const patients = [
    {
      id: "1",
      name: "John Anderson",
      age: 67,
      room: "ICU-101",
      heartRate: 78,
      temperature: 37.2,
      oxygenLevel: 98,
      status: "normal" as const,
      lastUpdate: "2 min ago",
    },
    {
      id: "2",
      name: "Sarah Williams",
      age: 54,
      room: "ICU-102",
      heartRate: 92,
      temperature: 38.1,
      oxygenLevel: 95,
      status: "warning" as const,
      lastUpdate: "1 min ago",
    },
    {
      id: "3",
      name: "Michael Chen",
      age: 72,
      room: "ICU-103",
      heartRate: 110,
      temperature: 39.2,
      oxygenLevel: 89,
      status: "critical" as const,
      lastUpdate: "30 sec ago",
    },
    {
      id: "4",
      name: "Emily Brown",
      age: 45,
      room: "ICU-104",
      heartRate: 72,
      temperature: 36.8,
      oxygenLevel: 99,
      status: "normal" as const,
      lastUpdate: "3 min ago",
    },
    {
      id: "5",
      name: "Robert Davis",
      age: 61,
      room: "ICU-105",
      heartRate: 88,
      temperature: 37.5,
      oxygenLevel: 96,
      status: "normal" as const,
      lastUpdate: "1 min ago",
    },
    {
      id: "6",
      name: "Lisa Thompson",
      age: 58,
      room: "ICU-106",
      heartRate: 95,
      temperature: 37.8,
      oxygenLevel: 93,
      status: "warning" as const,
      lastUpdate: "45 sec ago",
    },
  ];

  // Trigger emergency alert for critical patient
  useEffect(() => {
    const criticalPatient = patients.find((p) => p.status === "critical");
    if (criticalPatient) {
      const timer = setTimeout(() => setShowAlert(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const stats = [
    { icon: Users, label: "Total Patients", value: patients.length, color: "text-primary" },
    { icon: Heart, label: "Normal", value: patients.filter((p) => p.status === "normal").length, color: "text-success" },
    { icon: AlertTriangle, label: "Warning", value: patients.filter((p) => p.status === "warning").length, color: "text-warning" },
    { icon: Bell, label: "Critical", value: patients.filter((p) => p.status === "critical").length, color: "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Alert */}
      <EmergencyAlert
        isVisible={showAlert}
        patientName="Michael Chen"
        room="ICU-103"
        alertType="Oxygen Level"
        value="89% SpO₂"
        onDismiss={() => setShowAlert(false)}
        onContact={() => {
          setShowAlert(false);
          // Handle contact
        }}
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
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium">
            <Activity className="h-5 w-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Users className="h-5 w-5" />
            Patients
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Bell className="h-5 w-5" />
            Alerts
            <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">3</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </a>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">DR</span>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Dr. Rachel Smith</p>
              <p className="text-xs text-muted-foreground">Cardiologist</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
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
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="glass" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="hero" className="gap-2 hidden sm:flex">
                <Plus className="h-4 w-4" />
                Add Patient
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
              <h1 className="text-2xl font-bold text-foreground">Welcome, Dr. Smith</h1>
              <p className="text-muted-foreground">Monitor your ICU patients in real-time</p>
            </div>
            <Button variant="ghost" className="gap-2">
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
            {stats.map((stat, index) => (
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

          {/* Live Vital Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Live Vitals - ICU-103 (Critical)</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                View All <ChevronRight className="h-4 w-4" />
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
              <h2 className="text-xl font-semibold text-foreground">All Patients</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {patients
                .sort((a, b) => {
                  const statusOrder = { critical: 0, warning: 1, normal: 2 };
                  return statusOrder[a.status] - statusOrder[b.status];
                })
                .map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onClick={() => setSelectedPatient(patient.id)}
                  />
                ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
