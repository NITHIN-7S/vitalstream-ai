import { motion } from "framer-motion";
import { User, Heart, Thermometer, Wind, AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientData {
  id: string;
  name: string;
  age: number;
  room: string;
  heartRate: number;
  temperature: number;
  oxygenLevel: number;
  status: "normal" | "warning" | "critical";
  lastUpdate: string;
}

interface PatientCardProps {
  patient: PatientData;
  onClick?: () => void;
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

const PatientCard = ({ patient, onClick }: PatientCardProps) => {
  const config = statusConfig[patient.status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`glass rounded-xl border ${config.border} p-5 cursor-pointer transition-all duration-300 hover:shadow-elevated ${
        patient.status === "critical" ? "animate-pulse-glow" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${config.bg}`}>
            <User className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">Room {patient.room} • {patient.age} years</p>
          </div>
        </div>
        <motion.span
          animate={patient.status === "critical" ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}
        >
          {config.text}
        </motion.span>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <Heart className="h-4 w-4 text-destructive mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{patient.heartRate}</p>
          <p className="text-xs text-muted-foreground">BPM</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <Thermometer className="h-4 w-4 text-warning mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{patient.temperature}°</p>
          <p className="text-xs text-muted-foreground">Temp</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <Wind className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{patient.oxygenLevel}%</p>
          <p className="text-xs text-muted-foreground">SpO₂</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Updated {patient.lastUpdate}
        </span>
        {patient.status === "critical" && (
          <Button variant="destructive" size="sm" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Alert
          </Button>
        )}
        {patient.status !== "critical" && (
          <Button variant="ghost" size="sm" className="gap-1">
            <Phone className="h-3 w-3" />
            Contact
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default PatientCard;
