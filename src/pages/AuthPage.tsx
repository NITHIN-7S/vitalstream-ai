import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Mail, Lock, User, Stethoscope, Eye, EyeOff, ArrowLeft, ClipboardList } from "lucide-react";
import ECGWave from "@/components/animations/ECGWave";
import FloatingParticles from "@/components/animations/FloatingParticles";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog";
const AuthPage = () => {
  const { role } = useParams<{ role: "doctor" | "patient" | "receptionist" }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Default to doctor if no role specified
  const currentRole = role || "doctor";
  const isDoctor = currentRole === "doctor";
  const isReceptionist = currentRole === "receptionist";
  const isPatient = currentRole === "patient";

  // Get redirect path based on role
  const getRedirectPath = () => {
    if (isDoctor) return "/dashboard/doctor";
    if (isReceptionist) return "/dashboard/reception";
    return "/dashboard/patient";
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(getRedirectPath());
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate(getRedirectPath());
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isDoctor, isReceptionist]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Verify user role matches the portal they're trying to access
      const { data: roleData } = await supabase.rpc('get_user_role', { _user_id: data.user.id });
      
      const expectedRole = currentRole as 'doctor' | 'receptionist' | 'patient';
      
      if (roleData && roleData !== expectedRole) {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: `You are registered as a ${roleData}. Please use the ${roleData} portal to login.`,
          variant: "destructive",
        });
        return;
      }

      const roleLabel = isDoctor ? "Doctor" : isReceptionist ? "Receptionist" : "Patient";
      toast({
        title: "Welcome back!",
        description: `Logged in as ${roleLabel}`,
      });
      navigate(getRedirectPath());
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      <FloatingParticles count={20} />
      
      {/* ECG Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10">
        <ECGWave className="h-full" speed={3} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Activity className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold">
                Health<span className="text-primary">Pulse</span>
              </span>
            </Link>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDoctor ? "bg-primary/10 text-primary" : isReceptionist ? "bg-accent/20 text-accent-foreground" : "bg-success/10 text-success"
            } mb-4`}>
              {isDoctor ? (
                <Stethoscope className="h-4 w-4" />
              ) : isReceptionist ? (
                <ClipboardList className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isDoctor ? "Doctor Portal" : isReceptionist ? "Reception Portal" : "Patient Portal"}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isDoctor ? "Doctor Access" : isReceptionist ? "Reception Access" : "Patient Access"}
            </h1>
            <p className="text-muted-foreground">
              {isDoctor
                ? "Monitor your patients in real-time"
                : isReceptionist
                ? "Register patients and manage admissions"
                : "View your health data and connect with doctors"}
            </p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 shadow-elevated"
          >
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full mb-6 grid-cols-1">
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <ForgotPasswordDialog />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Sign In
                        {isDoctor ? <Stethoscope className="h-4 w-4 ml-2" /> : isReceptionist ? <ClipboardList className="h-4 w-4 ml-2" /> : <User className="h-4 w-4 ml-2" />}
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

            </Tabs>
          </motion.div>

          {/* Switch Role */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6 text-muted-foreground"
          >
            {isDoctor ? "Not a doctor?" : "Are you a doctor?"}{" "}
            <Link
              to={isDoctor ? "/auth/patient" : "/auth/doctor"}
              className="text-primary hover:underline font-medium"
            >
              {isDoctor ? "Patient Login" : "Doctor Login"}
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
