import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Wifi, WifiOff, AlertTriangle, User, RefreshCw, Plus, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Device {
  id: string;
  device_name: string;
  device_label: string | null;
  patient_id: string | null;
  doctor_id: string | null;
  status: string;
  assigned_at: string | null;
  updated_at: string;
}

interface PatientInfo {
  id: string;
  name: string;
  room: string;
  status: string | null;
}

interface VitalsInfo {
  heart_rate: number | null;
  oxygen_level: number | null;
  temperature: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  glucose_level: number | null;
  respiratory_rate: number | null;
  recorded_at: string | null;
}

interface DeviceActivityProps {
  role: "receptionist" | "doctor" | "patient";
  userId?: string;
}

const statusConfig: Record<string, { color: string; label: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
  connected: { color: "text-success", label: "Monitoring", badgeVariant: "default" },
  warning: { color: "text-warning", label: "Warning", badgeVariant: "secondary" },
  offline: { color: "text-muted-foreground", label: "Offline", badgeVariant: "outline" },
  available: { color: "text-primary", label: "Available", badgeVariant: "outline" },
};

const DeviceActivity = ({ role, userId }: DeviceActivityProps) => {
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [patients, setPatients] = useState<Record<string, PatientInfo>>({});
  const [vitals, setVitals] = useState<Record<string, VitalsInfo>>({});
  const [loading, setLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceLabel, setNewDeviceLabel] = useState("");

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from("devices")
        .select("*")
        .order("device_name", { ascending: true });

      if (error) throw error;

      const deviceList = (data || []) as Device[];
      setDevices(deviceList);

      // Fetch patient info for assigned devices
      const patientIds = deviceList
        .filter(d => d.patient_id)
        .map(d => d.patient_id!);

      if (patientIds.length > 0) {
        const uniqueIds = [...new Set(patientIds)];
        const { data: patientData } = await supabase
          .from("patients")
          .select("id, name, room, status")
          .in("id", uniqueIds);

        if (patientData) {
          const pMap: Record<string, PatientInfo> = {};
          patientData.forEach(p => { pMap[p.id] = p as PatientInfo; });
          setPatients(pMap);
        }

        // Fetch latest vitals for each patient
        const vitalsMap: Record<string, VitalsInfo> = {};
        for (const pid of uniqueIds) {
          const { data: vData } = await supabase
            .from("patient_vitals")
            .select("heart_rate, oxygen_level, temperature, blood_pressure_systolic, blood_pressure_diastolic, glucose_level, respiratory_rate, recorded_at")
            .eq("patient_id", pid)
            .order("recorded_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (vData) vitalsMap[pid] = vData as VitalsInfo;
        }
        setVitals(vitalsMap);
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    try {
      const { error } = await supabase.from("devices").insert({
        device_name: newDeviceName.trim(),
        device_label: newDeviceLabel.trim() || null,
        status: "available",
      });

      if (error) throw error;

      toast({ title: "Device Added", description: `${newDeviceName} has been added to the pool` });
      setNewDeviceName("");
      setNewDeviceLabel("");
      setShowAddDevice(false);
      fetchDevices();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const assignedDevices = devices.filter(d => d.patient_id);
  const connectedCount = devices.filter(d => d.status === "connected").length;
  const warningCount = devices.filter(d => d.status === "warning").length;
  const offlineCount = devices.filter(d => d.status === "offline").length;

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  // Filter devices based on role
  const visibleDevices = role === "receptionist"
    ? devices
    : assignedDevices;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Device Activity</h2>
          <p className="text-muted-foreground">Continuous monitoring of connected patient devices with updated health data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 text-primary" />
            <span>Latest from database</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDevices}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          {role === "receptionist" && (
            <Button size="sm" onClick={() => setShowAddDevice(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Device
            </Button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <p className="text-sm text-muted-foreground">Warning</p>
            <p className="text-3xl font-bold text-warning">{warningCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Offline</p>
            <p className="text-3xl font-bold text-destructive">{offlineCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Device Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading devices...</div>
      ) : visibleDevices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Wifi className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>No devices {role === "receptionist" ? "available" : "assigned"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleDevices.map((device, index) => {
            const patient = device.patient_id ? patients[device.patient_id] : null;
            const deviceVitals = device.patient_id ? vitals[device.patient_id] : null;
            const config = statusConfig[device.status] || statusConfig.available;

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
                        {device.device_name}
                      </span>
                      <Badge
                        variant={config.badgeVariant}
                        className={device.status === "connected" ? "bg-success text-success-foreground" : device.status === "warning" ? "bg-warning text-warning-foreground" : ""}
                      >
                        {config.label}
                      </Badge>
                    </div>
                    {patient ? (
                      <div>
                        <CardTitle className="text-lg">{patient.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <User className="h-3 w-3" />
                          <span>Connected Patient • Room {patient.room}</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <CardTitle className="text-lg text-muted-foreground">Unassigned</CardTitle>
                        <CardDescription>{device.device_label || "No label"}</CardDescription>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Connection Status */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        {device.status === "offline" ? (
                          <WifiOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Wifi className="h-4 w-4 text-success" />
                        )}
                        <span className="text-sm">Connection</span>
                      </div>
                      <span className={`text-sm font-medium ${config.color}`}>
                        {device.status === "offline" ? "Disconnected" : "Connected"}
                      </span>
                    </div>

                    {/* Vitals Grid — only for assigned + connected devices */}
                    {patient && device.status !== "offline" && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-lg bg-destructive/10">
                          <p className="text-[10px] font-medium text-muted-foreground">HR</p>
                          <p className="text-lg font-bold text-foreground">{deviceVitals?.heart_rate ?? "--"}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-primary/10">
                          <p className="text-[10px] font-medium text-muted-foreground">SpO₂</p>
                          <p className="text-lg font-bold text-foreground">{deviceVitals?.oxygen_level ? `${deviceVitals.oxygen_level}%` : "--"}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-warning/10">
                          <p className="text-[10px] font-medium text-muted-foreground">Temp</p>
                          <p className="text-lg font-bold text-foreground">{deviceVitals?.temperature ? `${deviceVitals.temperature}°F` : "--"}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-success/10">
                          <p className="text-[10px] font-medium text-muted-foreground">BP</p>
                          <p className="text-lg font-bold text-foreground">
                            {deviceVitals?.blood_pressure_systolic ? `${deviceVitals.blood_pressure_systolic}/${deviceVitals.blood_pressure_diastolic}` : "--"}
                          </p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-accent/10">
                          <p className="text-[10px] font-medium text-muted-foreground">Glucose</p>
                          <p className="text-lg font-bold text-foreground">{deviceVitals?.glucose_level ?? "--"}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-secondary/50">
                          <p className="text-[10px] font-medium text-muted-foreground">RR</p>
                          <p className="text-lg font-bold text-foreground">{deviceVitals?.respiratory_rate ?? "--"}</p>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>{device.status !== "offline" && patient ? "Monitoring Active" : device.status === "available" ? "Standby" : "Inactive"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated: {formatTime(deviceVitals?.recorded_at || device.updated_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Device Dialog */}
      <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>Add a new monitoring device to the pool</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDevice} className="space-y-4">
            <div className="space-y-2">
              <Label>Device Name *</Label>
              <Input
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                placeholder="e.g., Device 11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Device Label</Label>
              <Input
                value={newDeviceLabel}
                onChange={(e) => setNewDeviceLabel(e.target.value)}
                placeholder="e.g., ICU Monitor I3"
              />
            </div>
            <Button type="submit" className="w-full">Add Device</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceActivity;
