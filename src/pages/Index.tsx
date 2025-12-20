import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Stethoscope, User, Heart, Shield, Zap, Clock, Bell, MonitorSpeaker, Wifi, Database, Cloud, Cpu, ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ECGWave from "@/components/animations/ECGWave";
import FloatingParticles from "@/components/animations/FloatingParticles";
import HeartbeatIcon from "@/components/animations/HeartbeatIcon";

const Index = () => {
  const features = [
    {
      icon: Heart,
      title: "Real-Time Vitals",
      description: "Monitor heart rate, SpO₂, temperature, and more with precision IoT sensors.",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Instant emergency notifications when patient vitals exceed safe thresholds.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "HIPAA-compliant data encryption and role-based access control.",
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Continuous patient surveillance with automated logging and reporting.",
    },
    {
      icon: MonitorSpeaker,
      title: "Live Dashboards",
      description: "Beautiful, animated dashboards for doctors and medical staff.",
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Sub-second data updates ensure no critical moment is missed.",
    },
  ];

  const techStack = [
    { icon: Cpu, label: "IoT Sensors", description: "High-precision medical sensors" },
    { icon: Wifi, label: "Connectivity", description: "Real-time data transmission" },
    { icon: Cloud, label: "Cloud Platform", description: "Scalable infrastructure" },
    { icon: Database, label: "Database", description: "Secure data storage" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <FloatingParticles count={30} />
        
        {/* ECG Wave Background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          <ECGWave className="h-full" speed={3} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">Real-Time ICU Monitoring System</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Smart Healthcare
              <br />
              <span className="text-gradient">Powered by IoT</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Advanced patient monitoring with real-time analytics, emergency alerts, 
              and cloud connectivity. Saving lives through intelligent healthcare technology.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link to="/auth/doctor">
                <Button variant="hero" size="xl" className="gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Doctor Login
                </Button>
              </Link>
              <Link to="/auth/patient">
                <Button variant="heroOutline" size="xl" className="gap-2">
                  <User className="h-5 w-5" />
                  Patient Login
                </Button>
              </Link>
              <Link to="/dashboard/doctor">
                <Button variant="glass" size="xl" className="gap-2">
                  <Activity className="h-5 w-5" />
                  View Live Monitoring
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { value: "Real-Time", label: "Monitoring" },
                { value: "Cloud", label: "Connected" },
                { value: "<1s", label: "Alert Time" },
                { value: "24/7", label: "Alerts Active" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="glass rounded-xl p-6 shadow-card"
                >
                  <p className="text-3xl font-bold text-gradient mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs">Scroll to explore</span>
            <ChevronRight className="h-4 w-4 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Intelligent Healthcare Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive monitoring solutions designed for modern ICU environments
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 group"
              >
                <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Architecture Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              IoT System Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seamlessly connected technology stack for reliable healthcare delivery
            </p>
          </motion.div>

          {/* Architecture Flow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-16"
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="glass rounded-2xl p-6 shadow-card text-center min-w-[160px]"
                >
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-3">
                    <tech.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{tech.label}</h4>
                  <p className="text-xs text-muted-foreground">{tech.description}</p>
                </motion.div>
                {index < techStack.length - 1 && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Demo Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12 shadow-elevated max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <HeartbeatIcon size={48} />
              <div className="h-16 w-40">
                <ECGWave className="h-full" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Experience Real-Time Monitoring
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              See our advanced dashboard in action. Monitor patient vitals, receive instant alerts, 
              and access comprehensive health analytics.
            </p>
            <Link to="/dashboard/doctor">
              <Button variant="hero" size="xl" className="gap-2">
                <Activity className="h-5 w-5" />
                Launch Demo Dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 md:p-16 text-center"
          >
            <FloatingParticles count={20} />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 mb-6"
              >
                <Shield className="h-4 w-4 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">HIPAA Compliant</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Start Real-Time Patient Monitoring
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                Experience intelligent healthcare monitoring with real-time vital signs tracking,
                automated emergency alerts, and cloud-connected analytics.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth/doctor">
                  <Button size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Get Started as Doctor
                  </Button>
                </Link>
                <Button size="xl" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Sales
                </Button>
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
