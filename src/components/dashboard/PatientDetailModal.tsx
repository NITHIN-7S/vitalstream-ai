import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Thermometer, Wind, Droplets, Activity, User, Phone, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import ECGWave from "@/components/animations/ECGWave";

interface PatientVitals {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenLevel: number;
  temperature: number;
  glucoseLevel: number;
  respiratoryRate: number;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender?: string;
  room: string;
  bedNumber?: string;
  diagnosis?: string;
  status: "normal" | "warning" | "critical";
  admissionDate?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  vitals: PatientVitals | null;
}

const statusConfig = {
  normal: {
    bg: "bg-success/10",
    border: "border-success/30",
    badge: "bg-success text-success-foreground",
    text: "Normal",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    badge: "bg-warning text-warning-foreground",
    text: "Warning",
  },
  critical: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    badge: "bg-destructive text-destructive-foreground",
    text: "Critical",
  },
};

const PatientDetailModal = ({ isOpen, onClose, patient, vitals }: PatientDetailModalProps) => {
  if (!patient) return null;
  
  const config = statusConfig[patient.status];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[90vh] bg-card rounded-2xl shadow-elevated z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className={`p-6 border-b border-border ${config.bg}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full ${config.bg} border ${config.border}`}>
                    <User className="h-8 w-8 text-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{patient.name}</h2>
                    <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                      <span>{patient.age} years</span>
                      <span>•</span>
                      <span>{patient.gender || "Not specified"}</span>
                      <span>•</span>
                      <span>Room {patient.room}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={patient.status === "critical" ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${config.badge}`}
                  >
                    {config.text}
                  </motion.span>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* ECG Animation for critical patients */}
              {patient.status === "critical" && (
                <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-destructive">Live ECG Monitor</span>
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="flex items-center gap-2"
                    >
                      <span className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-xs text-destructive">LIVE</span>
                    </motion.div>
                  </div>
                  <div className="h-16">
                    <ECGWave color="hsl(var(--destructive))" />
                  </div>
                </div>
              )}

              {/* Vitals Grid */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Current Vitals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <VitalItem
                    icon={Heart}
                    label="Heart Rate"
                    value={vitals?.heartRate || 0}
                    unit="BPM"
                    status={getVitalStatus(vitals?.heartRate, 60, 100)}
                  />
                  <VitalItem
                    icon={Activity}
                    label="Blood Pressure"
                    value={`${vitals?.bloodPressureSystolic || 0}/${vitals?.bloodPressureDiastolic || 0}`}
                    unit="mmHg"
                    status={getVitalStatus(vitals?.bloodPressureSystolic, 90, 140)}
                  />
                  <VitalItem
                    icon={Wind}
                    label="Oxygen Level"
                    value={vitals?.oxygenLevel || 0}
                    unit="%"
                    status={getVitalStatus(vitals?.oxygenLevel, 95, 100, true)}
                  />
                  <VitalItem
                    icon={Thermometer}
                    label="Temperature"
                    value={vitals?.temperature || 0}
                    unit="°C"
                    status={getVitalStatus(vitals?.temperature, 36, 37.5)}
                  />
                  <VitalItem
                    icon={Droplets}
                    label="Glucose Level"
                    value={vitals?.glucoseLevel || 0}
                    unit="mg/dL"
                    status={getVitalStatus(vitals?.glucoseLevel, 70, 140)}
                  />
                  <VitalItem
                    icon={Activity}
                    label="Respiratory Rate"
                    value={vitals?.respiratoryRate || 0}
                    unit="/min"
                    status={getVitalStatus(vitals?.respiratoryRate, 12, 20)}
                  />
                </div>
              </div>

              {/* Patient Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem icon={MapPin} label="Room / Bed" value={`${patient.room} / ${patient.bedNumber || "N/A"}`} />
                  <InfoItem icon={Calendar} label="Admission Date" value={patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : "N/A"} />
                  <InfoItem icon={Activity} label="Diagnosis" value={patient.diagnosis || "Not specified"} />
                  <InfoItem icon={Phone} label="Emergency Contact" value={patient.emergencyContact || "Not specified"} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-secondary/30 flex gap-4">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Close
              </Button>
              {patient.emergencyPhone && (
                <Button variant="hero" className="flex-1 gap-2">
                  <Phone className="h-4 w-4" />
                  Call Emergency Contact
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Helper components
const VitalItem = ({ icon: Icon, label, value, unit, status }: { icon: any; label: string; value: number | string; unit: string; status: "normal" | "warning" | "critical" }) => {
  const colors = {
    normal: "bg-success/10 text-success border-success/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    critical: "bg-destructive/10 text-destructive border-destructive/30",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border ${colors[status]}`}
    >
      <Icon className="h-5 w-5 mb-2" />
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label} ({unit})</p>
    </motion.div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50">
    <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-foreground font-medium">{value}</p>
    </div>
  </div>
);

// Helper function to determine vital status
const getVitalStatus = (value: number | undefined, min: number, max: number, reverse = false): "normal" | "warning" | "critical" => {
  if (!value) return "normal";
  
  if (reverse) {
    if (value >= min) return "normal";
    if (value >= min - 5) return "warning";
    return "critical";
  }
  
  if (value >= min && value <= max) return "normal";
  if (value < min - 10 || value > max + 10) return "critical";
  return "warning";
};

export default PatientDetailModal;
