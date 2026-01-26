import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Wind, Footprints, Clock, AlertTriangle, CheckCircle, RefreshCw, Link2, ChevronDown, ChevronUp, Watch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HealthData {
  heartRate: number;
  spo2: number;
  steps: number;
  lastUpdated: string;
  status: "NORMAL" | "CRITICAL";
  isDemo?: boolean;
  connected: boolean;
}

interface DoctorHealthPanelProps {
  userId: string;
}

const DoctorHealthPanel = ({ userId }: DoctorHealthPanelProps) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDataFlow, setShowDataFlow] = useState(false);

  const checkConnectionStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-fit-auth?action=check-status`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  };

  const fetchHealthData = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-fit-data`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.error) {
        if (data.needsReauth) {
          setIsConnected(false);
          toast.error("Google Fit session expired. Please reconnect.");
        }
        return;
      }

      setHealthData(data);
      setIsConnected(data.connected);
      
      if (data.isDemo) {
        toast.info("Showing demo data. Real data will appear once synced from Google Fit.");
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
      toast.error("Failed to fetch health data");
    } finally {
      setIsLoading(false);
    }
  };

  const connectGoogleFit = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-fit-auth?action=get-auth-url`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        toast.error("Failed to get authorization URL");
      }
    } catch (error) {
      console.error("Error connecting to Google Fit:", error);
      toast.error("Failed to connect to Google Fit");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    
    // Check for success/error in URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("google_fit_connected") === "true") {
      toast.success("Google Fit connected successfully!");
      setIsConnected(true);
      fetchHealthData();
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (urlParams.get("google_fit_error")) {
      toast.error("Failed to connect Google Fit");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchHealthData();
    }
  }, [isConnected]);

  const dataFlowSteps = [
    { icon: Watch, text: "Doctor wears smartwatch", arrow: true },
    { icon: null, text: "Smartwatch syncs with Noisefit mobile app", arrow: true },
    { icon: null, text: "Noisefit mobile app syncs health data to Google Fit", arrow: true },
    { icon: null, text: "Google Fit securely sends authorized data to backend", arrow: true },
    { icon: null, text: "Backend server stores health data linked to doctor account", arrow: true },
    { icon: null, text: "Doctor dashboard displays latest heart rate, SpO₂, and status", arrow: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 shadow-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Your Health Status</h3>
            <p className="text-xs text-muted-foreground">Google Fit Integration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchHealthData}
              disabled={isLoading}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <>
          {!isConnected ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Link2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Connect Google Fit</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Link your smartwatch data to monitor your health in real-time
              </p>
              <Button onClick={connectGoogleFit} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                Connect Google Fit
              </Button>
            </div>
          ) : (
            <>
              {/* Health Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Heart className="h-6 w-6 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {healthData?.heartRate || "--"}
                  </p>
                  <p className="text-xs text-muted-foreground">❤️ Heart Rate (BPM)</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Wind className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {healthData?.spo2 || "--"}
                  </p>
                  <p className="text-xs text-muted-foreground">🫁 SpO₂ (%)</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Footprints className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {healthData?.steps?.toLocaleString() || "--"}
                  </p>
                  <p className="text-xs text-muted-foreground">👣 Steps Today</p>
                </div>
              </div>

              {/* Status & Last Updated */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 mb-4">
                <div className="flex items-center gap-2">
                  {healthData?.status === "CRITICAL" ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </motion.div>
                      <span className="font-medium text-destructive">🚦 CRITICAL</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="font-medium text-success">🚦 NORMAL</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    ⏱ Last Updated:{" "}
                    {healthData?.lastUpdated
                      ? new Date(healthData.lastUpdated).toLocaleTimeString()
                      : "--:--"}
                  </span>
                </div>
              </div>

              {healthData?.isDemo && (
                <p className="text-xs text-muted-foreground text-center mb-4 italic">
                  * Showing simulated data. Real data will appear once synced from your smartwatch.
                </p>
              )}

              {/* Data Flow Explanation Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDataFlow(!showDataFlow)}
                className="w-full gap-2"
              >
                {showDataFlow ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showDataFlow ? "Hide" : "Show"} How Data Flows
              </Button>

              {showDataFlow && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 rounded-lg bg-muted/30"
                >
                  <h4 className="font-medium text-foreground mb-3">📊 Data Flow Process</h4>
                  <div className="space-y-2">
                    {dataFlowSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary font-medium">{index + 1}.</span>
                        <span className="text-muted-foreground">{step.text}</span>
                        {step.arrow && <span className="text-primary ml-auto">→</span>}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    "Health data is fetched from Google Fit using authorized APIs."
                  </p>
                </motion.div>
              )}
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default DoctorHealthPanel;
