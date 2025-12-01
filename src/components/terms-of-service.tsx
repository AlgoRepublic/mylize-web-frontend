import { motion } from "motion/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Shield, Scale, AlertTriangle, Clock, Mail, CheckCircle } from "lucide-react";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <CheckCircle className="w-5 h-5" />,
      content: `By accessing and using the Forex Analyst platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

These Terms of Service constitute a legally binding agreement between you and Forex Analyst regarding your use of our financial analysis platform and related services.`
    },
    {
      title: "2. Service Description",
      icon: <Shield className="w-5 h-5" />,
      content: `Forex Analyst is a professional financial analysis platform that provides:
• Trading signals and market analysis
• Educational content and courses
• Live streaming and consultation services
• Portfolio management tools
• Community features and chat services

Our platform is designed for professional traders and financial analysts. All information provided is for educational and analytical purposes only.`
    },
    {
      title: "3. User Accounts and Registration",
      icon: <Mail className="w-5 h-5" />,
      content: `To access certain features of the Service, you must register for an account. When you register, you agree to:
• Provide accurate, current, and complete information
• Maintain and promptly update your account information
• Maintain the security of your password and account
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized use

You are responsible for safeguarding your account credentials and for all activities that occur under your account.`
    },
    {
      title: "4. Financial Disclaimer",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `IMPORTANT: Trading foreign exchange, commodities, and other financial instruments carries a high level of risk and may not be suitable for all investors.

• Past performance does not guarantee future results
• All trading signals and analysis are for educational purposes only
• You should never invest money that you cannot afford to lose
• We do not provide personalized investment advice
• Always conduct your own research and due diligence
• Consider seeking advice from an independent financial advisor

By using our service, you acknowledge that you understand these risks and accept full responsibility for your trading decisions.`
    },
    {
      title: "5. Subscription and Payments",
      icon: <Scale className="w-5 h-5" />,
      content: `Subscription fees are charged monthly or annually as selected during registration. By subscribing, you agree to:
• Pay all applicable fees and charges
• Automatic renewal unless cancelled
• No refunds for partial months of service
• Price changes with 30 days notice
• Cancellation takes effect at the end of the current billing period

Demo accounts are provided for evaluation purposes and may be terminated at any time without notice.`
    },
    {
      title: "6. Prohibited Uses",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `You may not use our Service:
• For any unlawful purpose or to solicit unlawful acts
• To violate any international, federal, provincial, or state regulations or laws
• To transmit malicious code or compromise system security
• To spam, phish, or engage in other unsolicited communications
• To impersonate another person or entity
• To reproduce, duplicate, or reverse engineer any part of the Service
• To share account credentials with unauthorized parties
• For market manipulation or insider trading activities`
    },
    {
      title: "7. Intellectual Property Rights",
      icon: <Shield className="w-5 h-5" />,
      content: `The Service and its original content, features, and functionality are owned by Forex Analyst and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

You may not:
• Copy, modify, or distribute our content without permission
• Use our trademarks or service marks without authorization
• Create derivative works based on our platform
• Reverse engineer or attempt to extract source code

Users retain ownership of content they create but grant us license to use, display, and distribute such content within the platform.`
    },
    {
      title: "8. Limitation of Liability",
      icon: <Scale className="w-5 h-5" />,
      content: `In no event shall Forex Analyst, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:
• Loss of profits or trading losses
• Loss of data or use
• Business interruption
• Personal injury or property damage

Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the incident.`
    },
    {
      title: "9. Data Protection and Privacy",
      icon: <Shield className="w-5 h-5" />,
      content: `We are committed to protecting your privacy and personal data. Our Privacy Policy explains how we collect, use, and protect your information.

Key points:
• We use industry-standard encryption and security measures
• Personal data is never sold to third parties
• You have rights to access, modify, and delete your data
• We comply with applicable data protection regulations
• Security incidents are reported according to legal requirements

Please review our Privacy Policy for detailed information about our data practices.`
    },
    {
      title: "10. Termination",
      icon: <Clock className="w-5 h-5" />,
      content: `We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including:
• Breach of these Terms of Service
• Non-payment of fees
• Fraudulent or illegal activity
• Violation of applicable laws or regulations
• Long-term inactivity

Upon termination, your right to use the Service will cease immediately. Provisions that by their nature should survive termination will remain in effect.`
    },
    {
      title: "11. Changes to Terms",
      icon: <Clock className="w-5 h-5" />,
      content: `We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated effective date.

• Material changes will be communicated via email
• Continued use after changes constitutes acceptance
• You should review these terms periodically
• If you disagree with changes, you may terminate your account

Your continued use of the Service after any modifications indicates your acceptance of the new terms.`
    },
    {
      title: "12. Contact Information",
      icon: <Mail className="w-5 h-5" />,
      content: `If you have any questions about these Terms of Service, please contact us:

Email: legal@forexanalyst.com
Address: [Company Address]
Phone: [Support Phone Number]

For technical support, use: support@forexanalyst.com
For billing inquiries, use: billing@forexanalyst.com

We strive to respond to all inquiries within 48 hours during business days.`
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
              <Scale className="w-5 h-5" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <h2 className="font-serif" style={{ color: COLORS.dark }}>
                Terms of Service
              </h2>
              <DialogDescription>
                Please read these terms carefully before using our platform.
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-6">
            {/* Introduction */}
            <motion.div
              className="bg-orange-50 border border-orange-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-sans font-medium text-orange-900 mb-2">
                    Important Legal Notice
                  </h4>
                  <p className="text-sm text-orange-800">
                    These Terms of Service govern your use of the Forex Analyst platform. 
                    By creating an account or using our services, you agree to be bound by these terms.
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

            {/* Terms Sections */}
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
                By using Forex Analyst, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service.
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
              I Accept These Terms
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}