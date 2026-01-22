import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Stethoscope, User, ChevronRight, Activity, Shield, Clock, Zap, Heart, Wifi, Cloud, Bell, Users, Lock, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ECGWave from "@/components/animations/ECGWave";
import FloatingParticles from "@/components/animations/FloatingParticles";

const Index = () => {
  const features = [
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Continuous vital signs monitoring with instant data visualization",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Automated emergency alerts sent directly to assigned doctors",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      icon: Cloud,
      title: "Cloud Connected",
      description: "Secure cloud infrastructure for seamless data synchronization",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security for patient data protection",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  const stats = [
    { value: "Real-Time", label: "Monitoring", icon: Activity },
    { value: "Cloud", label: "Connected", icon: Cloud },
    { value: "<1s", label: "Alert Time", icon: Zap },
    { value: "24/7", label: "Active", icon: Clock },
  ];

  const roles = [
    {
      icon: Stethoscope,
      title: "For Doctors",
      description: "Monitor all your patients from a single dashboard. Receive instant critical alerts and access complete patient histories.",
      features: ["Patient vitals dashboard", "Critical alerts", "Treatment history"],
      link: "/auth/doctor",
      color: "primary",
    },
    {
      icon: Users,
      title: "For Reception",
      description: "Streamline patient admissions and manage doctor assignments. Handle all administrative tasks efficiently.",
      features: ["Patient registration", "Doctor assignment", "Credential management"],
      link: "/auth/receptionist",
      color: "accent",
    },
    {
      icon: User,
      title: "For Patients",
      description: "Access your health data anytime. Stay connected with your care team and track your recovery progress.",
      features: ["View your vitals", "Contact your doctor", "Upload reports"],
      link: "/auth/patient",
      color: "success",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <FloatingParticles count={30} />
        
        {/* ECG Wave Background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          <ECGWave className="h-full" speed={3} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
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
              <span className="text-sm font-medium text-primary">Advanced ICU Monitoring System</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Real-Time Intelligent
              <br />
              <span className="text-gradient">Healthcare Monitoring</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"
            >
              Continuous patient vital monitoring using IoT sensors, cloud connectivity, 
              and automated emergency alert systems to support timely medical intervention inside hospitals.
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
                  Get Started as Doctor
                </Button>
              </Link>
              <Link to="/auth/patient">
                <Button variant="heroOutline" size="xl" className="gap-2">
                  <User className="h-5 w-5" />
                  Login as Patient
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="glass rounded-xl p-6 shadow-card group"
                >
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
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
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Advanced Monitoring <span className="text-gradient">Capabilities</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge IoT sensors with cloud technology to provide comprehensive patient monitoring
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl p-6 shadow-card group"
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-24 relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Get Started
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your <span className="text-gradient">Portal</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access the platform through your dedicated portal. Each role has specialized features designed for your needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl p-8 shadow-card relative overflow-hidden group"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${role.color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-${role.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <role.icon className={`h-8 w-8 text-${role.color}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-3">{role.title}</h3>
                  <p className="text-muted-foreground mb-6">{role.description}</p>
                  
                  <ul className="space-y-2 mb-8">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className={`h-4 w-4 text-${role.color}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={role.link}>
                    <Button variant={index === 0 ? "hero" : "outline"} className="w-full gap-2">
                      {role.title === "For Patients" ? "Login" : "Get Started"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Seamless <span className="text-gradient">Integration</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary hidden md:block" />
              
              {[
                { 
                  step: "01", 
                  title: "Patient Registration", 
                  description: "Receptionist registers patient and assigns a doctor. Secure credentials are generated automatically.",
                  icon: Users
                },
                { 
                  step: "02", 
                  title: "IoT Sensor Connection", 
                  description: "Medical IoT devices connect to our cloud platform, streaming real-time vital signs data.",
                  icon: Wifi
                },
                { 
                  step: "03", 
                  title: "Continuous Monitoring", 
                  description: "Doctors monitor patients through their dashboard. Any abnormalities trigger instant alerts.",
                  icon: Activity
                },
                { 
                  step: "04", 
                  title: "Emergency Response", 
                  description: "Critical conditions trigger automated alerts to assigned doctors for immediate intervention.",
                  icon: Bell
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex gap-8 mb-8 last:mb-0"
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 glass rounded-xl p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 relative bg-gradient-to-b from-transparent via-success/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-12 shadow-elevated">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                  <Lock className="h-4 w-4" />
                  Security First
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Your Data is <span className="text-success">Protected</span>
                </h2>
                <p className="text-muted-foreground mb-6">
                  We implement industry-leading security measures to ensure your medical data remains confidential and secure at all times.
                </p>
                <ul className="space-y-3">
                  {[
                    "HIPAA Compliant Infrastructure",
                    "End-to-End Encryption",
                    "Role-Based Access Control",
                    "Secure Cloud Storage",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground">
                      <Shield className="h-5 w-5 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-primary/20 rounded-2xl blur-3xl" />
                <div className="relative glass rounded-2xl p-8 text-center">
                  <Shield className="h-24 w-24 text-success mx-auto mb-6" />
                  <div className="text-6xl font-bold text-gradient mb-2">100%</div>
                  <p className="text-muted-foreground">Secure & Compliant</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Heart className="h-16 w-16 text-destructive mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform <span className="text-gradient">Patient Care?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join healthcare providers who trust HealthPulse for real-time patient monitoring and emergency response.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/doctor">
                <Button variant="hero" size="xl" className="gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Start as Doctor
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="heroOutline" size="xl" className="gap-2">
                  Learn More
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
