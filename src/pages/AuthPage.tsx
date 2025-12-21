import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Mail, Lock, User, Stethoscope, Eye, EyeOff, MapPin, Loader2 } from "lucide-react";
import HangingLamp from "@/components/animations/HangingLamp";
import GlowingBorderCard from "@/components/animations/GlowingBorderCard";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const { role } = useParams<{ role: "doctor" | "patient" }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", confirmPassword: "", location: "" });

  const getLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setSignupForm(prev => ({ ...prev, location: address }));
            toast({
              title: "Location detected",
              description: "Your location has been added to your profile.",
            });
          } catch {
            setSignupForm(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          }
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Location error:", error);
          toast({
            title: "Location access denied",
            description: "Please enter your location manually.",
            variant: "destructive",
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Please enter your location manually.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
    }
  };

  const isDoctor = role === "doctor";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${isDoctor ? "Doctor" : "Patient"}`,
      });
      navigate(isDoctor ? "/dashboard/doctor" : "/dashboard/patient");
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Welcome to HealthPulse. Please verify your email.",
      });
      navigate(isDoctor ? "/dashboard/doctor" : "/dashboard/patient");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0f]">
      {/* Dark ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d15] to-[#0a0a0f]" />
      
      {/* Subtle stars/particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hanging Lamp */}
      <HangingLamp isOn={isLampOn} onToggle={() => setIsLampOn(!isLampOn)} />

      {/* Main content container */}
      <div className="container mx-auto px-4 relative z-10 pt-48">
        <div className="max-w-md mx-auto">
          {/* Auth Card with Glowing Border */}
          <AnimatePresence>
            {isLampOn && (
              <GlowingBorderCard isVisible={isLampOn}>
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-6"
                >
                  <Link to="/" className="inline-flex items-center gap-2 mb-4">
                    <Activity className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-white">
                      Health<span className="text-primary">Pulse</span>
                    </span>
                  </Link>
                  
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                    isDoctor ? "bg-primary/20 text-primary" : "bg-emerald-500/20 text-emerald-400"
                  } mb-3`}>
                    {isDoctor ? (
                      <Stethoscope className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                    <span className="text-xs font-medium">{isDoctor ? "Doctor Portal" : "Patient Portal"}</span>
                  </div>

                  <h1 className="text-2xl font-bold text-white mb-1">
                    {isDoctor ? "Doctor Access" : "Patient Access"}
                  </h1>
                  <p className="text-sm text-zinc-400">
                    {isDoctor
                      ? "Monitor your patients in real-time"
                      : "View your health data and connect with doctors"}
                  </p>
                </motion.div>

                {/* Tabs */}
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-800/50">
                    <TabsTrigger value="login" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Sign Up</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-zinc-300">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-zinc-300">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900" />
                          <span className="text-zinc-400">Remember me</span>
                        </label>
                        <a href="#" className="text-primary hover:underline">
                          Forgot password?
                        </a>
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
                            {isDoctor ? <Stethoscope className="h-4 w-4 ml-2" /> : <User className="h-4 w-4 ml-2" />}
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Signup Tab */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-zinc-300">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-zinc-300">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-zinc-300">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
                            value={signupForm.password}
                            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm" className="text-zinc-300">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="signup-confirm"
                            type="password"
                            placeholder="Confirm your password"
                            className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
                            value={signupForm.confirmPassword}
                            onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-location" className="text-zinc-300">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="signup-location"
                            type="text"
                            placeholder="Your location"
                            className="pl-10 pr-24 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary"
                            value={signupForm.location}
                            onChange={(e) => setSignupForm({ ...signupForm, location: e.target.value })}
                          />
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={getLocation}
                            disabled={isGettingLocation}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors flex items-center gap-1"
                          >
                            {isGettingLocation ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <MapPin className="h-3 w-3" />
                            )}
                            Detect
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 mt-1" required />
                        <span className="text-zinc-400">
                          I agree to the{" "}
                          <a href="#" className="text-primary hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                        </span>
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
                            Create Account
                            {isDoctor ? <Stethoscope className="h-4 w-4 ml-2" /> : <User className="h-4 w-4 ml-2" />}
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                {/* Switch Role */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-4 text-sm text-zinc-500"
                >
                  {isDoctor ? "Not a doctor?" : "Are you a doctor?"}{" "}
                  <Link
                    to={isDoctor ? "/auth/patient" : "/auth/doctor"}
                    className="text-primary hover:underline font-medium"
                  >
                    {isDoctor ? "Patient Login" : "Doctor Login"}
                  </Link>
                </motion.p>

                {/* Back to home */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mt-3"
                >
                  <Link
                    to="/"
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    ← Back to Home
                  </Link>
                </motion.div>
              </GlowingBorderCard>
            )}
          </AnimatePresence>

          {/* Initial instruction when lamp is off */}
          <AnimatePresence>
            {!isLampOn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="text-center mt-32"
              >
                <motion.p
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-zinc-600 text-lg"
                >
                  Click the lamp cord to begin
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
