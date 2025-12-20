import { motion } from "framer-motion";
import { Heart, Bell, Shield, Clock, MonitorSpeaker, Zap, Cpu, Wifi, Cloud, Database, Globe, Server, ArrowRight, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ECGWave from "@/components/animations/ECGWave";
import FloatingParticles from "@/components/animations/FloatingParticles";
import HeartbeatIcon from "@/components/animations/HeartbeatIcon";

const AboutPage = () => {
  const features = [
    {
      icon: Heart,
      title: "Real-Time Vital Signs Monitoring",
      description: "Continuous tracking of heart rate, SpO₂, temperature with high-precision IoT sensors.",
    },
    {
      icon: Wifi,
      title: "IoT Sensor Integration",
      description: "Seamless connectivity with medical-grade sensors for accurate health data collection.",
    },
    {
      icon: Cloud,
      title: "Cloud-Based Data Processing",
      description: "Secure cloud infrastructure for real-time data processing and storage.",
    },
    {
      icon: Shield,
      title: "Secure Doctor & Patient Login",
      description: "Role-based authentication with encrypted credentials and secure access control.",
    },
    {
      icon: Bell,
      title: "Automated Emergency Alerts & Buzzer Activation",
      description: "Instant threshold-based alerts with audible buzzer activation for critical conditions.",
    },
    {
      icon: MonitorSpeaker,
      title: "Hospital-Only Doctor Notifications",
      description: "Real-time notifications sent directly to assigned hospital doctors.",
    },
  ];

  const techStack = [
    { icon: Heart, label: "IoT Sensors", description: "Heart Rate, Temperature, SpO₂" },
    { icon: Cpu, label: "ESP32 / Arduino", description: "Microcontroller Processing" },
    { icon: Cloud, label: "Cloud Infrastructure", description: "Real-time Data Sync" },
    { icon: Database, label: "Secure Databases", description: "Encrypted Storage" },
    { icon: Globe, label: "Web Technologies", description: "React, TypeScript, Tailwind" },
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
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <FloatingParticles count={20} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <HeartbeatIcon size={20} />
              <span className="text-sm font-medium text-primary">About HealthPulse</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Real-Time IoT Healthcare
              <br />
              <span className="text-gradient">Monitoring System</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive patient monitoring solution that combines IoT sensors, cloud technology, 
              and intelligent alerting to provide continuous healthcare surveillance in hospital environments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground">
                HealthPulse is designed to revolutionize ICU patient monitoring by providing real-time 
                vital sign tracking and automated emergency response systems. Our platform connects 
                IoT medical sensors directly to healthcare professionals, ensuring no critical moment goes unnoticed.
              </p>
              <p className="text-lg text-muted-foreground">
                Using advanced cloud connectivity and intelligent threshold monitoring, we deliver 
                instant alerts when patient conditions require immediate attention, supporting 
                timely medical intervention and potentially saving lives.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 shadow-elevated"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <HeartbeatIcon size={64} />
                <div className="h-20 w-48">
                  <ECGWave className="h-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "24/7", label: "Continuous Monitoring" },
                  { value: "<1s", label: "Alert Response" },
                  { value: "99.9%", label: "System Uptime" },
                  { value: "Real-Time", label: "Data Sync" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-background/50"
                  >
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Integrated Features
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
            {features.map((feature) => (
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

      {/* Technology Stack Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Integrated Technology Stack
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seamlessly connected technology for reliable healthcare delivery
            </p>
          </motion.div>

          {/* Architecture Flow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 flex-wrap"
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
                  className="glass rounded-2xl p-6 shadow-card text-center min-w-[180px]"
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
        </div>
      </section>

      {/* Hospital Location Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Hospital Location
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Government General Hospital (GGH), Kakinada
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-4 shadow-elevated overflow-hidden"
          >
            <div className="relative">
              {/* Animated Map Marker */}
              <motion.div
                className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MapPin className="h-5 w-5" />
                </motion.div>
                <span className="text-sm font-medium">GGH Kakinada</span>
              </motion.div>
              
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.6661358082584!2d82.2276!3d16.9550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3829e0a1dfe8e9%3A0x8f2a5b7c4a5b8f2a!2sGovernment%20General%20Hospital%2C%20Kakinada!5e0!3m2!1sen!2sin!4v1703084800000!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: "1rem" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="GGH Kakinada Location"
              ></iframe>
            </div>
            
            <div className="mt-4 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>GGH Road, Ayodyanagar, Near Old Bus Stand, Kakinada – 533001</span>
              </div>
              <motion.a
                href="https://maps.google.com/?q=Government+General+Hospital+Kakinada"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
              >
                Get Directions
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;