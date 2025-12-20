import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Phone, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmergencyAlertProps {
  isVisible: boolean;
  patientName: string;
  room: string;
  alertType: string;
  value: string;
  onDismiss: () => void;
  onContact: () => void;
}

const EmergencyAlert = ({
  isVisible,
  patientName,
  room,
  alertType,
  value,
  onDismiss,
  onContact,
}: EmergencyAlertProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px hsl(var(--destructive) / 0.3)",
                "0 0 40px hsl(var(--destructive) / 0.6)",
                "0 0 20px hsl(var(--destructive) / 0.3)",
              ],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="bg-destructive/95 backdrop-blur-lg rounded-2xl p-6 border-2 border-destructive shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="p-3 bg-destructive-foreground/20 rounded-full"
                >
                  <Bell className="h-6 w-6 text-destructive-foreground" />
                </motion.div>
                <div>
                  <motion.h3
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                    className="text-lg font-bold text-destructive-foreground"
                  >
                    EMERGENCY ALERT
                  </motion.h3>
                  <p className="text-sm text-destructive-foreground/80">Immediate attention required</p>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-destructive-foreground/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-destructive-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-destructive-foreground/10 rounded-lg">
                <span className="text-sm text-destructive-foreground/80">Patient</span>
                <span className="font-semibold text-destructive-foreground">{patientName}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive-foreground/10 rounded-lg">
                <span className="text-sm text-destructive-foreground/80">Room</span>
                <span className="font-semibold text-destructive-foreground">{room}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive-foreground/10 rounded-lg">
                <span className="text-sm text-destructive-foreground/80">{alertType}</span>
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="font-bold text-destructive-foreground text-lg"
                >
                  {value}
                </motion.span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={onContact}
                className="flex-1 bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Doctor
              </Button>
              <Button
                onClick={onDismiss}
                variant="outline"
                className="border-destructive-foreground/30 text-destructive-foreground hover:bg-destructive-foreground/10"
              >
                Acknowledge
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyAlert;
