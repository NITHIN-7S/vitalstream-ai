import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Bell, Check, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Alert {
  id: string;
  patient_id: string;
  alert_type: string;
  priority: "low" | "moderate" | "high" | "critical";
  message: string;
  is_acknowledged: boolean;
  created_at: string;
  patient?: {
    name: string;
    room: string;
  };
}

interface AlertsPanelProps {
  doctorId: string | null;
  onAlertClick?: (patientId: string) => void;
}

const priorityConfig = {
  low: {
    bg: "bg-muted",
    border: "border-muted-foreground/20",
    text: "text-muted-foreground",
    icon: Bell,
  },
  moderate: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    text: "text-warning",
    icon: AlertTriangle,
  },
  high: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-500",
    icon: AlertTriangle,
  },
  critical: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    text: "text-destructive",
    icon: AlertTriangle,
  },
};

const AlertsPanel = ({ doctorId, onAlertClick }: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleic5h9markup3d9WhLT1+28NWYORkfltjh1KRADjmL1efVoT0VN4nZ5tiZSB83gtnt15tJHTKI4PDbk1EoNnXW7d+SRCU7feT/0ow8I0GE4Omxey8dRpXu4JxQGieS8N6YVSM6lPHNmE8eMpny1plcJjuZ782WYi1En/DBj2Y1TaPkuoNjPU+wy7J0T0dp0cSbYT1Ii+LLoU0hNpPr14xHGi+W8tCOSxkwmvHOj1QiN53wzY5XIzya786SWSo+n/K7hWA3U6bhq3NZSW3Xt4RONleq27BoP0d41cCXUiQ0kOzUl0oXLpDw0JBRHjKT8M6NUx8zl/HNj1gkPJrx");
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("patient_alerts")
        .select(`
          *,
          patient:patients(name, room)
        `)
        .eq("is_acknowledged", false)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setAlerts(data || []);

      // Check for critical alerts and play alarm
      const criticalAlerts = (data || []).filter(a => a.priority === "critical" || a.priority === "high");
      if (criticalAlerts.length > 0 && soundEnabled && !isAlarmPlaying) {
        playAlarm();
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time alerts
  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel("alerts-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "patient_alerts",
        },
        (payload) => {
          const newAlert = payload.new as Alert;
          setAlerts(prev => [newAlert, ...prev]);
          
          if ((newAlert.priority === "critical" || newAlert.priority === "high") && soundEnabled) {
            playAlarm();
            toast.error(`ALERT: ${newAlert.message}`, {
              duration: 10000,
            });
          } else {
            toast.warning(`New Alert: ${newAlert.message}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId, soundEnabled]);

  const playAlarm = () => {
    if (audioRef.current && !isAlarmPlaying) {
      setIsAlarmPlaying(true);
      audioRef.current.loop = true;
      audioRef.current.play().catch(console.error);
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAlarmPlaying(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("patient_alerts")
        .update({ 
          is_acknowledged: true, 
          acknowledged_at: new Date().toISOString() 
        })
        .eq("id", alertId);

      if (error) throw error;

      setAlerts(prev => prev.filter(a => a.id !== alertId));
      
      // Stop alarm if no more critical alerts
      const remainingCritical = alerts.filter(a => a.id !== alertId && (a.priority === "critical" || a.priority === "high"));
      if (remainingCritical.length === 0) {
        stopAlarm();
      }
      
      toast.success("Alert acknowledged");
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      toast.error("Failed to acknowledge alert");
    }
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.is_acknowledged);
  const criticalCount = unacknowledgedAlerts.filter(a => a.priority === "critical" || a.priority === "high").length;

  return (
    <div className="glass rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <AlertTriangle className="h-5 w-5 text-warning" />
            {criticalCount > 0 && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center"
              >
                {criticalCount}
              </motion.span>
            )}
          </div>
          <h3 className="font-semibold text-foreground">Active Alerts</h3>
        </div>
        <div className="flex items-center gap-2">
          {isAlarmPlaying && (
            <Button variant="destructive" size="sm" onClick={stopAlarm} className="gap-1">
              <VolumeX className="h-4 w-4" />
              Stop Alarm
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={!soundEnabled ? "text-muted-foreground" : ""}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      <AnimatePresence>
        {isAlarmPlaying && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-destructive/20 border-b border-destructive/30"
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="p-3 flex items-center justify-center gap-2 text-destructive font-semibold"
            >
              <AlertTriangle className="h-5 w-5" />
              CRITICAL ALERT - Patient Requires Immediate Attention
              <AlertTriangle className="h-5 w-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading alerts...</div>
        ) : unacknowledgedAlerts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Check className="h-12 w-12 mx-auto mb-2 text-success" />
            <p>No active alerts</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            <AnimatePresence>
              {unacknowledgedAlerts.map((alert) => {
                const config = priorityConfig[alert.priority];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-4 ${config.bg} ${alert.priority === "critical" ? "animate-pulse" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        className="flex items-start gap-3 flex-1 cursor-pointer"
                        onClick={() => onAlertClick?.(alert.patient_id)}
                      >
                        <motion.div
                          animate={alert.priority === "critical" ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <Icon className={`h-5 w-5 ${config.text}`} />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold uppercase ${config.text}`}>
                              {alert.priority}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">{alert.message}</p>
                          {alert.patient && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {alert.patient.name} • Room {alert.patient.room}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
