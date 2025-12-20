import { motion } from "framer-motion";
import { Shield, Database, Lock, Eye, Users, Globe, FileText, Settings } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingParticles from "@/components/animations/FloatingParticles";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PrivacyPage = () => {
  const sections = [
    {
      id: "collection",
      icon: Database,
      title: "1. Data Collection",
      content: `HealthPulse collects and processes the following categories of data:

Patient Health Data:
• Vital signs (heart rate, blood pressure, oxygen saturation, temperature)
• ECG readings and waveforms
• Historical health trends and patterns
• Alert and notification history
• Treatment response metrics

User Account Data:
• Name and professional credentials
• Contact information (email, phone)
• Role and department assignments
• Login credentials (encrypted)
• Access logs and activity history

Device Data:
• Sensor identifiers and configurations
• Device status and health metrics
• Calibration records
• Firmware versions

Data is collected automatically from IoT devices and through user interactions with the platform. All collection is performed with appropriate consent and in compliance with applicable healthcare data protection regulations.`
    },
    {
      id: "storage",
      icon: Lock,
      title: "2. Data Storage & Cloud Usage",
      content: `Your data is stored using industry-standard security practices:

Storage Infrastructure:
• Data is hosted on secure cloud servers with redundant backups
• All data is encrypted at rest using AES-256 encryption
• Regular security audits and penetration testing
• Geographic data residency compliance where applicable

Retention Periods:
• Active patient data: Retained during care period plus 7 years
• Historical health records: As required by medical record retention laws
• System logs: 90 days rolling retention
• Audit trails: 5 years minimum

Cloud Services:
• We utilize enterprise-grade cloud infrastructure
• Data centers comply with SOC 2 Type II, ISO 27001 standards
• Regular backup procedures with point-in-time recovery
• Disaster recovery protocols with 99.9% uptime SLA`
    },
    {
      id: "access",
      icon: Eye,
      title: "3. User Access Rights",
      content: `Users have the following rights regarding their data:

Access Rights:
• View all personal data we hold about you
• Request copies of your data in portable formats
• Access audit logs of who has viewed your information
• Review system-generated alerts and notifications

Correction Rights:
• Request correction of inaccurate personal data
• Update contact information and preferences
• Amend medical records through proper clinical channels

Deletion Rights:
• Request deletion of non-essential data
• Close account and remove access credentials
• Note: Medical records may be retained as required by law

Restriction Rights:
• Limit processing of your data in certain circumstances
• Opt out of non-essential communications
• Restrict data sharing with third parties`
    },
    {
      id: "sharing",
      icon: Users,
      title: "4. Data Sharing Limitations",
      content: `We strictly limit sharing of your data:

Authorized Sharing:
• Healthcare providers directly involved in patient care
• Emergency responders during critical events
• Hospital administrators for operational purposes
• Regulatory bodies as required by law

Data is NEVER shared with:
• Marketing or advertising companies
• Data brokers or aggregators
• Unauthorized third parties
• Social media platforms

Third-Party Services:
• We use limited third-party services for infrastructure
• All vendors are vetted for security compliance
• Data processing agreements are in place
• Vendors may only access data as necessary for service provision

Cross-Border Transfers:
• Data is primarily stored within India
• Any international transfers comply with applicable regulations
• Appropriate safeguards are implemented for cross-border data flows`
    },
    {
      id: "security",
      icon: Shield,
      title: "5. Security Practices",
      content: `We implement comprehensive security measures:

Technical Safeguards:
• End-to-end encryption for data in transit (TLS 1.3)
• AES-256 encryption for data at rest
• Multi-factor authentication for all users
• Regular vulnerability assessments and penetration testing
• Intrusion detection and prevention systems

Administrative Safeguards:
• Role-based access control (RBAC)
• Minimum necessary access principle
• Regular security training for all personnel
• Background checks for employees with data access
• Incident response procedures

Physical Safeguards:
• Secure data center facilities
• Access controls and monitoring
• Environmental controls (fire suppression, climate control)
• Redundant power and connectivity

Monitoring:
• 24/7 security monitoring
• Real-time threat detection
• Automated alerting for suspicious activities
• Regular security audits and assessments`
    },
    {
      id: "consent",
      icon: FileText,
      title: "6. Patient Consent Handling",
      content: `Consent is fundamental to our data practices:

Obtaining Consent:
• Clear explanation of data collection purposes
• Opt-in consent for non-essential data processing
• Separate consent for research or secondary uses
• Documented consent with timestamps

Consent Management:
• Patients can review their consent choices at any time
• Easy-to-use interface for updating preferences
• Clear process for withdrawing consent
• Notification of consent changes to relevant parties

Special Categories:
• Additional protections for sensitive health data
• Explicit consent required for genetic or biometric data
• Parental consent for minor patients
• Guardian consent for incapacitated patients

Withdrawal of Consent:
• Right to withdraw consent at any time
• Clear instructions for withdrawal process
• Explanation of consequences of withdrawal
• Data handling procedures post-withdrawal`
    },
    {
      id: "cookies",
      icon: Settings,
      title: "7. Cookies & Tracking",
      content: `Our platform uses cookies and similar technologies:

Essential Cookies:
• Session management and authentication
• Security and fraud prevention
• Load balancing and performance
• User preferences and settings

Analytics Cookies:
• Anonymous usage statistics
• Performance monitoring
• Feature usage analysis
• Error tracking and debugging

We do NOT use:
• Third-party advertising cookies
• Cross-site tracking
• Social media tracking pixels
• Behavioral advertising

Cookie Management:
• Cookie consent banner on first visit
• Granular cookie preference controls
• Option to reject non-essential cookies
• Regular cookie audit and cleanup`
    },
    {
      id: "changes",
      icon: Globe,
      title: "8. Policy Changes",
      content: `We may update this Privacy Policy periodically:

Notification of Changes:
• Material changes will be communicated via email
• In-app notifications for significant updates
• 30-day notice period for major policy changes
• Clear summary of what has changed

Version History:
• All previous versions are archived
• Date of last update clearly displayed
• Change log available upon request

Your Choices:
• Continued use constitutes acceptance of updates
• Option to close account if you disagree with changes
• Grace period to review and respond to major changes

Contact for Questions:
• Email: emergencypulsemonitoring@gmail.com
• Phone: +91 6302614346
• Address: Government General Hospital, Kakinada`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Your Privacy Matters</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We are committed to protecting your privacy and handling your health data with the utmost care and security.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: December 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
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
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
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

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 glass rounded-2xl p-8 text-center"
          >
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Questions About Your Privacy?</h3>
            <p className="text-muted-foreground mb-4">
              Contact our Data Protection Officer for any privacy-related inquiries.
            </p>
            <p className="text-primary font-medium">
              emergencypulsemonitoring@gmail.com
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
