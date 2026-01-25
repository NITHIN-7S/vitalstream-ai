import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Stethoscope, User, ChevronRight, Activity, Shield, Clock, Zap, Heart, Wifi, Cloud, Bell, Users, Lock, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ECGWave from "@/components/animations/ECGWave";
import FloatingParticles from "@/components/animations/FloatingParticles";
import HeartbeatIcon from "@/components/animations/HeartbeatIcon";

const Index = () => {
  const stats = [
    { value: "Real-Time", label: "Monitoring", icon: Activity },
    { value: "Cloud", label: "Connected", icon: Cloud },
    { value: "<1s", label: "Alert Time", icon: Zap },
    { value: "24/7", label: "Active", icon: Clock },
  ];

  const roles = [
    {
      icon: Stethoscope,
      title: "Doctor Portal",
      description: "Monitor patients & receive critical alerts",
      link: "/auth/doctor",
      gradient: "from-primary to-primary/60",
    },
    {
      icon: Users,
      title: "Reception Portal",
      description: "Register patients & manage assignments",
      link: "/auth/receptionist",
      gradient: "from-secondary to-secondary/60",
    },
    {
      icon: User,
      title: "Patient Portal",
      description: "View vitals & connect with doctors",
      link: "/auth/patient",
      gradient: "from-success to-success/60",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-pulse" />
        <FloatingParticles count={40} />
        
        {/* Multiple ECG Waves for depth */}
        <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20">
          <ECGWave className="h-full" speed={2} />
        </div>
        <div className="absolute bottom-10 left-0 right-0 h-32 opacity-10">
          <ECGWave className="h-full" speed={4} />
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,150,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,150,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <motion.span 
                className="relative flex h-3 w-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </motion.span>
              <span className="text-sm font-medium text-primary">IoT-Based Smart Healthcare System</span>
            </motion.div>

            {/* Animated Heartbeat Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px hsl(var(--primary) / 0.3)",
                      "0 0 60px hsl(var(--primary) / 0.6)",
                      "0 0 20px hsl(var(--primary) / 0.3)"
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <HeartbeatIcon className="w-10 h-10 text-primary" />
                </motion.div>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="text-6xl md:text-8xl font-bold mb-4 leading-tight"
            >
              <span className="text-foreground">Health</span>
              <motion.span 
                className="text-primary inline-block"
                animate={{ 
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Pulse
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm md:text-base text-muted-foreground mb-10 tracking-widest uppercase font-light"
            >
              Healthcare Monitoring System using Wearable Devices
            </motion.p>

            {/* Animated divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10"
            />

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link to="/auth/doctor">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="hero" size="xl" className="gap-2 shadow-glow">
                    <Stethoscope className="h-5 w-5" />
                    Get Started
                  </Button>
                </motion.div>
              </Link>
              <Link to="/auth/patient">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="heroOutline" size="xl" className="gap-2">
                    <User className="h-5 w-5" />
                    Patient Login
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.08, y: -8 }}
                  className="glass rounded-xl p-6 shadow-card group cursor-pointer"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-2 group-hover:scale-125 transition-transform duration-300" />
                  </motion.div>
                  <p className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs tracking-wider uppercase">Explore</span>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="h-5 w-5 rotate-90" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Role Cards Section - Condensed */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              Access Portals
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Choose Your <span className="text-gradient">Portal</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group"
              >
                <Link to={role.link}>
                  <div className="glass rounded-2xl p-6 shadow-card relative overflow-hidden h-full border border-border/50 hover:border-primary/30 transition-all duration-500">
                    {/* Animated gradient background */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Animated icon container */}
                    <motion.div 
                      className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <role.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {role.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                    
                    <motion.div 
                      className="flex items-center gap-1 text-primary text-sm font-medium"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                    >
                      Enter Portal <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Security Banner */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass rounded-2xl p-8 shadow-elevated relative overflow-hidden"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-primary via-transparent to-primary rounded-full"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 10px hsl(var(--success) / 0.3)",
                      "0 0 30px hsl(var(--success) / 0.5)",
                      "0 0 10px hsl(var(--success) / 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center"
                >
                  <Shield className="h-7 w-7 text-success" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">HIPAA Compliant & Secure</h3>
                  <p className="text-sm text-muted-foreground">End-to-end encryption with role-based access control</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {[Lock, Cloud, CheckCircle2].map((Icon, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
