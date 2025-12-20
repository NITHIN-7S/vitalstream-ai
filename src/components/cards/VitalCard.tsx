import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import ECGWave from "@/components/animations/ECGWave";

interface VitalCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  status: "normal" | "warning" | "critical";
  showECG?: boolean;
  trend?: "up" | "down" | "stable";
}

const statusColors = {
  normal: {
    bg: "bg-success/10",
    border: "border-success/30",
    text: "text-success",
    glow: "shadow-success/20",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    text: "text-warning",
    glow: "shadow-warning/20",
  },
  critical: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    text: "text-destructive",
    glow: "shadow-destructive/20",
  },
};

const VitalCard = ({
  icon: Icon,
  label,
  value,
  unit,
  status,
  showECG = false,
  trend,
}: VitalCardProps) => {
  const colors = statusColors[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`relative overflow-hidden rounded-xl glass border ${colors.border} p-6 shadow-card hover:shadow-elevated transition-all duration-300 ${
        status === "critical" ? "animate-pulse-glow" : ""
      }`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${colors.bg} opacity-50`} />

      {/* ECG Wave Background */}
      {showECG && (
        <div className="absolute inset-0 opacity-20">
          <ECGWave
            className="h-full"
            color={status === "critical" ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
            speed={status === "critical" ? 1 : 2}
          />
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`h-5 w-5 ${colors.text}`} />
          </div>
          {status === "critical" && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold"
            >
              CRITICAL
            </motion.span>
          )}
          {status === "warning" && (
            <span className="px-2 py-1 rounded-full bg-warning text-warning-foreground text-xs font-semibold">
              WARNING
            </span>
          )}
          {status === "normal" && (
            <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs font-semibold">
              NORMAL
            </span>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <motion.span
            key={value}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`text-4xl font-bold ${colors.text}`}
          >
            {value}
          </motion.span>
          <span className="text-muted-foreground ml-1">{unit}</span>
        </div>

        {/* Label */}
        <p className="text-sm text-muted-foreground font-medium">{label}</p>

        {/* Trend Indicator */}
        {trend && (
          <div className="mt-3 flex items-center gap-1">
            {trend === "up" && (
              <span className="text-xs text-success flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Increasing
              </span>
            )}
            {trend === "down" && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Decreasing
              </span>
            )}
            {trend === "stable" && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                </svg>
                Stable
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VitalCard;
