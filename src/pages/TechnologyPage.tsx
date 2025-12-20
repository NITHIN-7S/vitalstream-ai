import { motion } from "framer-motion";
import { 
  Cpu, 
  Wifi, 
  Cloud, 
  Database, 
  Monitor, 
  Bell,
  ArrowRight,
  Server,
  Shield,
  Zap,
  Activity
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingParticles from "@/components/animations/FloatingParticles";
import ECGWave from "@/components/animations/ECGWave";

const TechnologyPage = () => {
  const architectureFlow = [
    { 
      icon: Activity, 
      label: "IoT Sensors", 
      description: "Heart rate, SpO₂, temperature sensors capture patient vitals",
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    { 
      icon: Cpu, 
      label: "Microcontroller", 
      description: "ESP32/Arduino processes and transmits sensor data",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    { 
      icon: Wifi, 
      label: "Connectivity", 
      description: "Secure WiFi/cellular transmission to cloud servers",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    { 
      icon: Cloud, 
      label: "Cloud Platform", 
      description: "Real-time data processing and analytics engine",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    { 
      icon: Database, 
      label: "Database", 
      description: "Secure storage for patient records and history",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    { 
      icon: Monitor, 
      label: "Web Dashboard", 
      description: "Real-time visualization for medical staff",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    { 
      icon: Bell, 
      label: "Doctor Alerts", 
      description: "Instant notifications for critical events",
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
  ];

  const technologies = [
    {
      category: "Hardware",
      items: [
        { name: "ESP32/ESP8266", description: "WiFi-enabled microcontrollers" },
        { name: "Arduino Nano", description: "Compact microcontroller board" },
        { name: "Pulse Oximeter Sensor", description: "MAX30100/MAX30102" },
        { name: "Temperature Sensor", description: "DS18B20 digital sensor" },
        { name: "ECG Module", description: "AD8232 heart monitor" },
      ]
    },
    {
      category: "Cloud & Backend",
      items: [
        { name: "Real-time Database", description: "Live data synchronization" },
        { name: "Cloud Functions", description: "Serverless processing" },
        { name: "Secure Storage", description: "Encrypted data at rest" },
        { name: "API Gateway", description: "RESTful endpoints" },
      ]
    },
    {
      category: "Frontend",
      items: [
        { name: "React", description: "Component-based UI library" },
        { name: "TypeScript", description: "Type-safe development" },
        { name: "Framer Motion", description: "Smooth animations" },
        { name: "Tailwind CSS", description: "Utility-first styling" },
        { name: "Recharts", description: "Data visualization" },
      ]
    },
    {
      category: "Security",
      items: [
        { name: "TLS/SSL", description: "End-to-end encryption" },
        { name: "JWT Authentication", description: "Secure token-based auth" },
        { name: "Role-Based Access", description: "Granular permissions" },
        { name: "HIPAA Compliance", description: "Healthcare standards" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <Server className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Cutting-Edge Infrastructure</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Technology <span className="text-gradient">Stack</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore the advanced technologies powering our real-time healthcare monitoring system. 
              From IoT sensors to cloud infrastructure.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10">
          <ECGWave className="h-full" speed={4} />
        </div>
      </section>

      {/* Architecture Flow */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              System Architecture Flow
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              End-to-end data flow from patient sensors to doctor notifications
            </p>
          </motion.div>

          {/* Animated Architecture Diagram */}
          <div className="relative max-w-6xl mx-auto">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-primary to-success -translate-y-1/2 z-0 opacity-20" />
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
            >
              {architectureFlow.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative z-10"
                >
                  <motion.div
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="glass rounded-2xl p-4 text-center shadow-card h-full"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(var(--primary), 0)",
                          "0 0 0 10px rgba(var(--primary), 0.1)",
                          "0 0 0 0 rgba(var(--primary), 0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className={`inline-flex p-3 rounded-xl ${item.bgColor} ${item.color} mb-3`}
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{item.label}</h4>
                    <p className="text-xs text-muted-foreground leading-tight">{item.description}</p>
                  </motion.div>
                  
                  {/* Arrow for desktop */}
                  {index < architectureFlow.length - 1 && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20"
                    >
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Data Flow Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-success"
              />
              <span className="text-sm font-medium">Live Data Streaming Active</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Technologies We Use
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive stack of modern technologies ensuring reliability, security, and performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technologies.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className="glass rounded-2xl p-6 shadow-card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {catIndex === 0 && <Cpu className="h-5 w-5 text-primary" />}
                    {catIndex === 1 && <Cloud className="h-5 w-5 text-primary" />}
                    {catIndex === 2 && <Monitor className="h-5 w-5 text-primary" />}
                    {catIndex === 3 && <Shield className="h-5 w-5 text-primary" />}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{category.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIndex * 0.1 + itemIndex * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.description}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "<100ms", label: "Data Latency" },
              { value: "99.9%", label: "System Uptime" },
              { value: "256-bit", label: "Encryption" },
              { value: "24/7", label: "Monitoring" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 glass rounded-xl shadow-card"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold text-gradient mb-1"
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TechnologyPage;
