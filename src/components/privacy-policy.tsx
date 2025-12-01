import { motion } from "motion/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Shield, Lock, Eye, Database, Globe, UserCheck, Settings, Mail, Clock, CheckCircle } from "lucide-react";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: <Database className="w-5 h-5" />,
      content: `We collect information you provide directly to us, such as when you:
• Create an account or update your profile
• Subscribe to our services or make payments
• Participate in surveys, contests, or promotions
• Contact us for support or feedback
• Use our chat or communication features

Personal Information includes:
• Name, email address, and contact information
• Financial information for billing and payments
• Trading preferences and account settings
• Communication history and support tickets
• Device information and usage data
• IP address and location data (with consent)`
    },
    {
      title: "2. How We Use Your Information",
      icon: <Settings className="w-5 h-5" />,
      content: `We use the information we collect to:

Service Provision:
• Provide, maintain, and improve our platform
• Process transactions and manage subscriptions
• Deliver trading signals and market analysis
• Provide customer support and technical assistance
• Facilitate communication between users

Platform Enhancement:
• Analyze usage patterns to improve user experience
• Develop new features and services
• Conduct research and analytics
• Ensure platform security and prevent fraud
• Comply with legal and regulatory requirements

We never use your personal information for purposes incompatible with those described in this policy without your explicit consent.`
    },
    {
      title: "3. Information Sharing and Disclosure",
      icon: <Eye className="w-5 h-5" />,
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:

Service Providers:
• Payment processors for billing and transactions
• Cloud hosting and data storage providers
• Email and communication service providers
• Analytics and monitoring service providers

Legal Requirements:
• To comply with applicable laws and regulations
• To respond to legal process or government requests
• To protect our rights, property, or safety
• To prevent fraud or investigate security issues
• In connection with business transfers or mergers

All third-party providers are contractually obligated to protect your information and use it only for specified purposes.`
    },
    {
      title: "4. Data Security and Protection",
      icon: <Shield className="w-5 h-5" />,
      content: `We implement comprehensive security measures to protect your personal information:

Technical Safeguards:
• End-to-end encryption for sensitive data
• Secure Socket Layer (SSL) technology
• Multi-factor authentication options
• Regular security audits and penetration testing
• Automated threat detection and prevention

Administrative Safeguards:
• Access controls and user authentication
• Employee training on data protection
• Regular security policy reviews
• Incident response procedures
• Data retention and disposal policies

Physical Safeguards:
• Secure data centers with restricted access
• Environmental monitoring and controls
• Backup and disaster recovery systems

While we strive to protect your information, no security system is 100% secure. We continuously monitor and improve our security practices.`
    },
    {
      title: "5. Cookies and Tracking Technologies",
      icon: <Globe className="w-5 h-5" />,
      content: `We use cookies and similar technologies to enhance your experience:

Essential Cookies:
• Authentication and session management
• Security and fraud prevention
• Basic site functionality and navigation
• Load balancing and performance optimization

Analytics Cookies:
• Usage statistics and behavior analysis
• Performance monitoring and optimization
• A/B testing and feature development
• Error tracking and debugging

Preference Cookies:
• Language and region settings
• Display preferences and customizations
• Notification preferences
• Trading interface configurations

You can control cookie settings through your browser preferences. Disabling certain cookies may limit platform functionality.`
    },
    {
      title: "6. Your Privacy Rights",
      icon: <UserCheck className="w-5 h-5" />,
      content: `You have several rights regarding your personal information:

Access Rights:
• Request copies of your personal data
• Understand how your data is processed
• Receive data in a portable format
• Review data retention periods

Control Rights:
• Update or correct inaccurate information
• Delete your account and associated data
• Object to certain processing activities
• Restrict or limit data processing

Communication Rights:
• Opt-out of marketing communications
• Choose notification preferences
• Control third-party data sharing
• Withdraw consent for specific uses

To exercise these rights, contact us using the information provided in the Contact section. We will respond within 30 days of receiving your request.`
    },
    {
      title: "7. Data Retention",
      icon: <Clock className="w-5 h-5" />,
      content: `We retain your personal information for different periods based on the type of data and purpose:

Account Data:
• Active accounts: Duration of service relationship
• Inactive accounts: 3 years after last activity
• Deleted accounts: 90 days for recovery, then permanent deletion

Transaction Data:
• Payment records: 7 years (regulatory requirements)
• Trading history: 5 years (compliance purposes)
• Support tickets: 3 years for service improvement

Technical Data:
• Log files: 2 years for security and analytics
• Cookies: Various periods based on type
• Analytics data: Aggregated and anonymized after 2 years

Communication Data:
• Chat messages: 1 year (unless part of support case)
• Email communications: 5 years
• Marketing communications: Until opt-out

Data is securely deleted at the end of retention periods unless legal obligations require longer storage.`
    },
    {
      title: "8. International Data Transfers",
      icon: <Globe className="w-5 h-5" />,
      content: `Our platform may transfer your personal information internationally:

Transfer Safeguards:
• Adequate protection standards in destination countries
• Standard contractual clauses with service providers
• Privacy Shield or equivalent frameworks
• Your explicit consent for specific transfers

Data Processing Locations:
• Primary servers located in [Primary Region]
• Backup systems in [Backup Region]
• Cloud services through certified providers
• Customer support centers in [Support Regions]

Transfer Purposes:
• Platform operation and maintenance
• Customer support and service delivery
• Compliance with legal obligations
• Business continuity and disaster recovery

We ensure all international transfers comply with applicable privacy laws and provide adequate protection for your personal information.`
    },
    {
      title: "9. Children's Privacy",
      icon: <UserCheck className="w-5 h-5" />,
      content: `Our platform is not intended for individuals under 18 years of age:

Age Restrictions:
• Users must be 18 or older to create an account
• We do not knowingly collect data from minors
• Parental consent required for users under 18 (where legally permitted)
• Age verification may be required for certain features

If We Learn of Minor Users:
• Immediate account suspension pending verification
• Deletion of personal information if under minimum age
• Contact with parents/guardians if applicable
• Reporting to authorities if required by law

Parents and guardians should monitor their children's online activities and contact us immediately if they believe a minor has provided personal information without permission.`
    },
    {
      title: "10. Third-Party Links and Services",
      icon: <Globe className="w-5 h-5" />,
      content: `Our platform may contain links to third-party websites and services:

External Links:
• News sources and market data providers
• Educational content and research materials
• Social media platforms and sharing services
• Partner services and integrations

Third-Party Responsibility:
• We are not responsible for third-party privacy practices
• External sites have their own privacy policies
• We recommend reviewing policies before sharing information
• We do not control third-party data collection or use

Integrated Services:
• Payment processors and financial institutions
• Communication and messaging platforms
• Analytics and monitoring services
• Cloud storage and backup providers

We carefully select partners but cannot guarantee their privacy practices. Use third-party services at your own discretion.`
    },
    {
      title: "11. Updates to This Policy",
      icon: <CheckCircle className="w-5 h-5" />,
      content: `We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements:

Notification Process:
• Email notification for material changes
• Prominent notice on platform homepage
• Updated effective date on this policy
• Summary of key changes provided

Your Options:
• Review updated policy before continued use
• Contact us with questions or concerns
• Exercise your rights under the new policy
• Terminate your account if you disagree

Change Categories:
• Legal or regulatory compliance updates
• New feature or service additions
• Security enhancement implementations
• Business practice modifications

Continued use of our platform after changes indicates acceptance of the updated policy.`
    },
    {
      title: "12. Contact Information",
      icon: <Mail className="w-5 h-5" />,
      content: `For privacy-related questions, concerns, or requests, please contact us:

Privacy Officer:
Email: privacy@forexanalyst.com
Address: [Company Privacy Office Address]
Phone: [Privacy Hotline Number]

Data Protection Officer (EU):
Email: dpo@forexanalyst.com
Address: [EU Representative Address]

General Contact:
Email: support@forexanalyst.com
Website: www.forexanalyst.com/privacy
Live Chat: Available 24/7 through platform

Response Times:
• Privacy requests: Within 30 days
• Security incidents: Within 72 hours
• General inquiries: Within 48 hours (business days)
• Urgent matters: Within 24 hours

We are committed to addressing your privacy concerns promptly and thoroughly.`
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b" style={{ borderColor: COLORS.lightGray }}>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <Lock className="w-5 h-5" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <h2 className="font-serif" style={{ color: COLORS.dark }}>
                Privacy Policy
              </h2>
              <DialogDescription>
                Learn how we protect and handle your personal information.
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-6">
            {/* Introduction */}
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-sans font-medium text-blue-900 mb-2">
                    Your Privacy Matters
                  </h4>
                  <p className="text-sm text-blue-800">
                    This Privacy Policy explains how Forex Analyst collects, uses, and protects your personal information. 
                    We are committed to maintaining the highest standards of data protection and transparency.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Effective Date */}
            <div className="text-center py-2">
              <p className="text-sm text-gray-600">
                <strong>Effective Date:</strong> January 1, 2024 | <strong>Last Updated:</strong> January 1, 2024
              </p>
            </div>

            <Separator />

            {/* Privacy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: COLORS.lightGray }}
                    >
                      <div style={{ color: COLORS.primary }}>
                        {section.icon}
                      </div>
                    </div>
                    <h3 className="font-serif font-semibold" style={{ color: COLORS.dark }}>
                      {section.title}
                    </h3>
                  </div>
                  
                  <div className="pl-11">
                    <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <Separator />
            
            <motion.div
              className="text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <p className="text-xs text-gray-500">
                By using Forex Analyst, you consent to the collection and use of your information 
                as described in this Privacy Policy.
              </p>
            </motion.div>
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t" style={{ borderColor: COLORS.lightGray }}>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Close
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 sm:flex-none"
              style={{ backgroundColor: COLORS.primary }}
            >
              I Understand
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}