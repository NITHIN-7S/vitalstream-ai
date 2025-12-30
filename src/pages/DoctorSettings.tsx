import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, ArrowLeft, Save, Lock, User, Briefcase, Phone, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DoctorSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    full_name: "",
    profession: "",
    specialization: "",
    phone: "",
    department: "",
    license_number: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Check auth and fetch profile
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
      fetchProfile(user.id);
    };
    checkAuth();
  }, [navigate]);

  const fetchProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("doctor_profiles")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          profession: data.profession || "",
          specialization: data.specialization || "",
          phone: data.phone || "",
          department: data.department || "",
          license_number: data.license_number || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("doctor_profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("doctor_profiles")
          .update(profile)
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("doctor_profiles")
          .insert({ ...profile, user_id: userId });
        if (error) throw error;
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border p-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/dashboard/doctor">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">
              Health<span className="text-primary">Pulse</span>
            </span>
          </div>
          <h1 className="text-lg font-semibold ml-4">Settings</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Update your personal and professional details</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Dr. John Smith"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profession"
                    value={profile.profession}
                    onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                    placeholder="Senior Doctor"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={profile.specialization}
                  onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  placeholder="Cardiology"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    placeholder="ICU"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={profile.license_number}
                  onChange={(e) => setProfile({ ...profile, license_number: e.target.value })}
                  placeholder="MED-12345"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="hero" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Password Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-warning/10">
              <Lock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="outline" disabled={passwordLoading} className="gap-2">
                <Lock className="h-4 w-4" />
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default DoctorSettings;
