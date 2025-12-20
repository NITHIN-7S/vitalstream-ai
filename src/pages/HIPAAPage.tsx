import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Users, 
  Server,
  CheckCircle,
  AlertTriangle,
  Key,
  Database
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingParticles from "@/components/animations/FloatingParticles";

const HIPAAPage = () => {
  const complianceItems = [
    {
      icon: Lock,
      title: "Protected Health Information (PHI)",
      description: "All patient health information is classified as PHI and handled according to HIPAA regulations. This includes vital signs, medical history, treatment records, and any data that can identify a patient.",
      points: [
        "Unique patient identifiers are protected",
        "Medical record numbers are encrypted",
        "Health conditions and diagnoses are secured",
        "Treatment information is access-controlled"
      ]
    },
    {
      icon: Key,
      title: "Data Encryption",
      description: "We implement industry-leading encryption standards to protect patient data at every stage of its lifecycle.",
      points: [
        "AES-256 encryption for data at rest",
        "TLS 1.3 for data in transit",
        "End-to-end encryption for sensitive transmissions",
        "Encrypted backup storage"
      ]
    },
    {
      icon: Users,
      title: "Secure Access Control",
      description: "Role-based access control ensures that only authorized personnel can access patient information based on their job responsibilities.",
      points: [
        "Multi-factor authentication required",
        "Role-based permissions (Doctor, Nurse, Admin)",
        "Session timeout and automatic logout",
        "IP-based access restrictions available"
      ]
    },
    {
      icon: FileText,
      title: "Audit Logging",
      description: "Comprehensive audit trails track all access to patient information, supporting compliance requirements and security investigations.",
      points: [
        "All PHI access is logged with timestamps",
        "User identification for every action",
        "Modification history preserved",
        "Logs retained for compliance period"
      ]
    },
    {
      icon: Eye,
      title: "Limited Data Exposure",
      description: "We follow the minimum necessary standard, ensuring that users only see the patient information required for their specific job functions.",
      points: [
        "Need-to-know data access principle",
        "Data masking for non-essential fields",
        "Restricted access to sensitive categories",
        "Regular access reviews and updates"
      ]
    },
    {
      icon: Server,
      title: "Infrastructure Security",
      description: "Our cloud infrastructure meets or exceeds HIPAA security requirements with enterprise-grade protections.",
      points: [
        "SOC 2 Type II certified data centers",
        "Physical security and access controls",
        "Redundant systems and failover",
        "Regular security assessments"
      ]
    }
  ];

  const complianceBadges = [
    { label: "HIPAA Compliant", color: "text-success", bg: "bg-success/10" },
    { label: "SOC 2 Type II", color: "text-primary", bg: "bg-primary/10" },
    { label: "ISO 27001", color: "text-accent", bg: "bg-accent/10" },
    { label: "GDPR Ready", color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-success/5 via-transparent to-transparent" />
        <FloatingParticles count={15} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6"
            >
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Healthcare Compliance</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              HIPAA <span className="text-gradient">Compliance</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              HealthPulse is designed with HIPAA compliance at its core, ensuring the highest standards of patient data protection and privacy.
            </p>
          </motion.div>

          {/* Compliance Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            {complianceBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full ${badge.bg} ${badge.color} font-medium text-sm flex items-center gap-2`}
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 currentColor",
                      "0 0 0 4px transparent"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-current"
                />
                {badge.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Compliance Details */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Compliance Framework
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive security measures protecting patient health information at every level
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 shadow-card"
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(var(--success), 0.2)",
                      "0 0 0 8px rgba(var(--success), 0)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex p-3 rounded-xl bg-success/10 text-success mb-4"
                >
                  <item.icon className="h-6 w-6" />
                </motion.div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {item.description}
                </p>
                
                <ul className="space-y-2">
                  {item.points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto text-center shadow-elevated"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex p-4 rounded-2xl bg-success/10 text-success mb-6"
            >
              <Shield className="h-12 w-12" />
            </motion.div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Our Commitment to Compliance
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              HealthPulse maintains continuous compliance through regular audits, employee training, 
              and security updates. We work with third-party security firms to validate our practices 
              and ensure we meet the highest standards of healthcare data protection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                {
                  title: "Regular Audits",
                  description: "Annual third-party security audits and assessments"
                },
                {
                  title: "Employee Training",
                  description: "Mandatory HIPAA training for all team members"
                },
                {
                  title: "Incident Response",
                  description: "24/7 security monitoring and response team"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-muted/50"
                >
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notice Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-warning/20 bg-warning/5"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-warning/10 text-warning">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Compliance Disclaimer</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  While HealthPulse implements comprehensive HIPAA-compliant security measures, 
                  healthcare facilities using this system are responsible for ensuring their own 
                  HIPAA compliance, including proper staff training, access management, and 
                  adherence to all applicable healthcare regulations. This system is a tool to 
                  support compliance efforts but does not guarantee regulatory compliance for 
                  the healthcare facility.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HIPAAPage;
