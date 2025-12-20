import { motion } from "framer-motion";
import { 
  Heart, 
  Activity, 
  Wifi, 
  Cloud, 
  Database, 
  Shield, 
  Bell, 
  Clock,
  Zap,
  Lock,
  MonitorSpeaker,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingParticles from "@/components/animations/FloatingParticles";
import ECGWave from "@/components/animations/ECGWave";

const FeaturesPage = () => {
  const features = [
    {
      icon: Heart,
      title: "Real-Time Patient Monitoring",
      description: "Continuous monitoring of vital signs including heart rate, blood pressure, oxygen saturation, and body temperature with sub-second updates.",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      icon: Wifi,
      title: "IoT Sensor Integration",
      description: "Seamless integration with high-precision medical-grade IoT sensors using ESP32/Arduino microcontrollers for accurate data collection.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Cloud,
      title: "Cloud-Based Data Storage",
      description: "Secure cloud infrastructure ensures your patient data is safely stored, backed up, and accessible from any authorized device.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Lock,
      title: "Secure Doctor & Patient Access",
      description: "Role-based authentication with encrypted credentials ensures only authorized medical personnel can access sensitive patient information.",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      icon: Bell,
      title: "Automated Emergency Alerts",
      description: "Instant notifications triggered when vital signs exceed safe thresholds, ensuring rapid medical response to critical situations.",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      icon: AlertTriangle,
      title: "Buzzer Alarm Activation",
      description: "Integrated buzzer alarm system provides immediate audible alerts at the patient's bedside during critical health events.",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      icon: MonitorSpeaker,
      title: "Hospital Doctor Notifications",
      description: "Automatic message notifications sent directly to assigned doctors when patient vitals indicate emergency conditions.",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Clock,
      title: "24/7 Continuous Monitoring",
      description: "Round-the-clock patient surveillance with automated logging, historical trend analysis, and comprehensive health reports.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <FloatingParticles count={20} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Advanced Healthcare Technology</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Powerful <span className="text-gradient">Features</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive healthcare monitoring solutions designed for modern ICU environments. 
              Real-time data, intelligent alerts, and secure access.
            </p>
          </motion.div>
        </div>

        {/* ECG Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10">
          <ECGWave className="h-full" speed={4} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 group"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex p-4 rounded-xl ${feature.bgColor} ${feature.color} mb-4`}
                >
                  <feature.icon className="h-6 w-6" />
                </motion.div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated indicator */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className="h-0.5 bg-gradient-to-r from-primary to-accent mt-4 origin-left"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose HealthPulse?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system combines cutting-edge IoT technology with healthcare expertise to deliver reliable, real-time patient monitoring.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "HIPAA Compliant",
                description: "Full compliance with healthcare data protection regulations ensuring patient privacy and data security.",
              },
              {
                icon: Zap,
                title: "Instant Response",
                description: "Sub-second data transmission and alert notifications ensure no critical moment is ever missed.",
              },
              {
                icon: Database,
                title: "Reliable Infrastructure",
                description: "Enterprise-grade cloud infrastructure with 99.9% uptime guarantee for continuous monitoring.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 glass rounded-2xl shadow-card"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4"
                >
                  <item.icon className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
