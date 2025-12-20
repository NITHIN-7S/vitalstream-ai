import { motion } from "framer-motion";
import { FileText, AlertTriangle, Shield, Scale, Server, Activity } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingParticles from "@/components/animations/FloatingParticles";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TermsPage = () => {
  const sections = [
    {
      id: "acceptance",
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: `By accessing and using the HealthPulse IoT-Based Healthcare Monitoring System ("Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.

These terms apply to all users of the Service, including but not limited to healthcare providers, medical staff, patients, and administrative personnel. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any modifications.`
    },
    {
      id: "disclaimer",
      icon: AlertTriangle,
      title: "2. Medical Disclaimer & Non-Liability",
      content: `IMPORTANT NOTICE: Doctors, hospital staff, and administrators are not responsible for incorrect, delayed, or inaccurate data provided by IoT devices, sensors, network failures, or cloud transmission errors. The system is intended to assist medical decision-making, not replace professional judgment.

The HealthPulse system provides real-time monitoring data as a supplementary tool for healthcare professionals. It should never be used as the sole basis for medical decisions. Healthcare providers must always exercise their professional judgment and consider multiple data sources when making clinical decisions.

We explicitly disclaim liability for:
• Sensor malfunctions or calibration errors
• Network connectivity interruptions
• Cloud service outages or delays
• Data transmission errors or corruption
• Software bugs or system failures
• Third-party service disruptions`
    },
    {
      id: "usage",
      icon: Activity,
      title: "3. Usage Limitations",
      content: `The Service is designed for use in controlled healthcare environments by trained medical professionals. Users must:

• Ensure proper installation and maintenance of all IoT devices
• Verify sensor calibration according to manufacturer specifications
• Maintain adequate network infrastructure for reliable data transmission
• Have backup monitoring systems in place for critical patients
• Train all personnel on system limitations and proper usage

The Service is NOT intended for:
• Home medical care without professional supervision
• Emergency-only monitoring without additional safeguards
• Replacement of direct patient observation
• Use in environments with electromagnetic interference
• Deployment without proper IT infrastructure support`
    },
    {
      id: "system-dependency",
      icon: Server,
      title: "4. System Dependency Disclaimer",
      content: `Users acknowledge that the HealthPulse system depends on multiple technological components, including but not limited to:

Hardware Components:
• IoT sensors (pulse oximeters, temperature sensors, ECG modules)
• Microcontrollers (ESP32, Arduino)
• Network equipment (routers, access points)

Software Components:
• Cloud computing services
• Database systems
• Web application servers
• Mobile notification services

Any failure in these components may result in data loss, delayed alerts, or system unavailability. Users must maintain contingency plans and should not rely solely on this system for patient monitoring.`
    },
    {
      id: "emergency",
      icon: AlertTriangle,
      title: "5. Emergency Handling Responsibility",
      content: `While the HealthPulse system provides automated emergency alerts, the responsibility for emergency response lies entirely with the healthcare facility and its staff. The system:

• Provides alerts based on predefined thresholds
• Does not guarantee delivery of all notifications
• Cannot account for all medical emergencies
• Should supplement, not replace, standard emergency protocols

Healthcare facilities must maintain:
• Traditional patient monitoring systems as backup
• Manual alert procedures
• Trained emergency response teams
• Regular drills and protocol reviews

Response time depends on many factors outside our control, including network conditions, device status, and staff availability.`
    },
    {
      id: "device-malfunction",
      icon: Shield,
      title: "6. Device Malfunction Disclaimer",
      content: `IoT devices and sensors are subject to wear, environmental conditions, and technical limitations. We disclaim responsibility for:

• Sensor degradation over time
• Battery failures in wireless devices
• Physical damage from handling or accidents
• Environmental interference (temperature, humidity, electromagnetic)
• Compatibility issues with third-party equipment
• Firmware or software update complications

Users are responsible for:
• Regular device inspection and maintenance
• Timely replacement of worn or damaged sensors
• Following manufacturer guidelines for device care
• Reporting any suspected malfunctions immediately
• Maintaining service contracts and warranties`
    },
    {
      id: "jurisdiction",
      icon: Scale,
      title: "7. Legal Jurisdiction",
      content: `These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from the use of this Service shall be subject to the exclusive jurisdiction of the courts located in Kakinada, Andhra Pradesh, India.

By using this Service, you consent to:
• Personal jurisdiction in the specified courts
• Service of process by registered mail or electronic means
• Resolution of disputes through arbitration when possible
• Waiver of jury trial rights where applicable

International users acknowledge that this Service is operated from India and agree to comply with all applicable local laws in addition to Indian regulations.`
    },
    {
      id: "data-accuracy",
      icon: FileText,
      title: "8. Data Accuracy & Integrity",
      content: `While we strive to maintain accurate and reliable data transmission, we cannot guarantee:

• 100% accuracy of sensor readings
• Real-time data synchronization in all conditions
• Complete data integrity during transmission
• Preservation of historical data indefinitely
• Compatibility with all medical record systems

Healthcare providers should:
• Cross-reference system data with direct patient assessment
• Document any discrepancies between system readings and clinical observations
• Report data anomalies for investigation
• Maintain independent records of critical patient information`
    },
    {
      id: "modifications",
      icon: FileText,
      title: "9. Service Modifications",
      content: `We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, including:

• Adding or removing features
• Changing system requirements
• Updating security protocols
• Modifying pricing or subscription terms
• Altering data retention policies

We will make reasonable efforts to notify users of significant changes, but cannot guarantee advance notice in all circumstances. Continued use of the Service after modifications constitutes acceptance of the updated terms.`
    },
    {
      id: "termination",
      icon: Shield,
      title: "10. Termination of Service",
      content: `Either party may terminate the Service agreement:

User Termination:
• Users may discontinue use at any time
• Proper data export should be completed before termination
• Outstanding fees must be settled

Provider Termination:
• We may terminate for violation of these terms
• We may terminate for non-payment
• We may terminate for security concerns

Upon termination:
• Access to the Service will be revoked
• Data retention policies will apply
• Transition assistance may be available upon request
• No refunds for partial subscription periods`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Legal Documentation</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using the HealthPulse IoT Healthcare Monitoring System.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: December 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={section.id}
                  className="glass rounded-xl px-6 border-none shadow-card"
                >
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <section.icon className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-semibold text-foreground text-left">
                        {section.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="pl-14 text-muted-foreground whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 glass rounded-2xl p-8 border border-warning/20 bg-warning/5"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-warning/10 text-warning">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Important Legal Notice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  By using the HealthPulse system, you acknowledge that this technology is designed 
                  to assist healthcare professionals and should never be used as a substitute for 
                  professional medical judgment, direct patient care, or established emergency protocols. 
                  The system operators, developers, and affiliated healthcare institutions are not liable 
                  for any outcomes resulting from system malfunctions, data inaccuracies, or misinterpretation 
                  of system-generated alerts.
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

export default TermsPage;
