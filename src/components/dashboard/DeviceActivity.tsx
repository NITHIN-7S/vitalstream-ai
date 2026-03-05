import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Wifi, WifiOff, User, RefreshCw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface DeviceRecord {
  id: string;
  device_number: number;
  patient_id: string | null;
  heart_rate: number | null;
  oxygen_level: number | null;
  body_temperature: number | null;
  steps: number | null;
  recorded_at: string | null;
  status: string;
}

interface PatientInfo {
  id: string;
  name: string;
  room: string;
}

interface DeviceActivityProps {
  role: "receptionist" | "doctor" | "patient";
  userId?: string;
}

const DeviceActivity = ({ role, userId }: DeviceActivityProps) => {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [patients, setPatients] = useState<Record<string, PatientInfo>>({});
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from("device_activity")
        .select("*")
        .order("device_number", { ascending: true });

      if (error) throw error;

      const deviceList = (data || []) as DeviceRecord[];
      setDevices(deviceList);

      // Fetch patient names for assigned devices
      const patientIds = deviceList
        .filter(d => d.patient_id)
        .map(d => d.patient_id!);

      if (patientIds.length > 0) {
        const uniqueIds = [...new Set(patientIds)];
        const { data: patientData } = await supabase
          .from("patients")
          .select("id, name, room")
          .in("id", uniqueIds);

        if (patientData) {
          const pMap: Record<string, PatientInfo> = {};
          patientData.forEach(p => { pMap[p.id] = p; });
          setPatients(pMap);
        }
      }
    } catch (error) {
      console.error("Error fetching device activity:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const connectedCount = devices.filter(d => d.status === "connected").length;
  const notConnectedCount = devices.filter(d => d.status === "not_connected").length;

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Device Activity</h2>
          <p className="text-muted-foreground">
            {role === "receptionist"
              ? "Monitor all 10 IoT health devices and their patient assignments."
              : role === "doctor"
              ? "Device readings for your assigned patients."
              : "Your connected device readings."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDevices}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Devices</p>
            <p className="text-3xl font-bold text-foreground">{devices.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Connected</p>
            <p className="text-3xl font-bold text-success">{connectedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Not Connected</p>
            <p className="text-3xl font-bold text-muted-foreground">{notConnectedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Device Cards */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading devices...</div>
      ) : devices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Wifi className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>No devices found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device, index) => {
            const patient = device.patient_id ? patients[device.patient_id] : null;
            const isConnected = device.status === "connected";

            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-elevated transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Device {device.device_number}
                      </span>
                      <Badge
                        variant={isConnected ? "default" : "outline"}
                        className={isConnected ? "bg-success text-success-foreground" : ""}
                      >
                        {isConnected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    {patient ? (
                      <div>
                        <CardTitle className="text-lg">{patient.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <User className="h-3 w-3" />
                          <span>Room {patient.room}</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <CardTitle className="text-lg text-muted-foreground">No Patient Assigned</CardTitle>
                        <CardDescription>Awaiting assignment</CardDescription>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Connection indicator */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        {isConnected ? (
                          <Wifi className="h-4 w-4 text-success" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">Connection</span>
                      </div>
                      <span className={`text-sm font-medium ${isConnected ? "text-success" : "text-muted-foreground"}`}>
                        {isConnected ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Vitals Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 rounded-lg bg-destructive/10">
                        <p className="text-[10px] font-medium text-muted-foreground">Heart Rate</p>
                        <p className="text-lg font-bold text-foreground">
                          {device.heart_rate != null ? `${device.heart_rate} bpm` : "NULL"}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-primary/10">
                        <p className="text-[10px] font-medium text-muted-foreground">SpO₂</p>
                        <p className="text-lg font-bold text-foreground">
                          {device.oxygen_level != null ? `${device.oxygen_level}%` : "NULL"}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-warning/10">
                        <p className="text-[10px] font-medium text-muted-foreground">Temp</p>
                        <p className="text-lg font-bold text-foreground">
                          {device.body_temperature != null ? `${device.body_temperature}°C` : "NULL"}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-success/10">
                        <p className="text-[10px] font-medium text-muted-foreground">Steps</p>
                        <p className="text-lg font-bold text-foreground">
                          {device.steps != null ? device.steps : "NULL"}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>{isConnected ? "Monitoring Active" : "Standby"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Recorded: {formatTime(device.recorded_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeviceActivity;
