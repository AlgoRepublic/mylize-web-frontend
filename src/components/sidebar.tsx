import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Gift, 
  DollarSign, 
  User, 
  Settings, 
  Bell,
  ShieldCheck,
  Building2,
  Lock,
  Palette,
  Package,
  Signal,
  FileText,
  Calendar,
  MessageCircle,
  Newspaper,
  ChevronDown,
  ChevronRight,
  LogOut
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  badge?: string | number;
}

interface SidebarSubmenuProps {
  items: Array<{ icon: React.ReactNode; label: string; onClick?: () => void; badge?: string | number }>;
  isVisible: boolean;
  activeSubItem?: string;
}

function SidebarSubmenu({ items, isVisible, activeSubItem }: SidebarSubmenuProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="ml-6 mt-1 space-y-1 overflow-hidden"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.05, duration: 0.2 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
            activeSubItem === item.label
              ? "text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
          style={{
            backgroundColor: activeSubItem === item.label ? COLORS.primary : "transparent"
          }}
          onClick={item.onClick}
        >
          <div className="flex items-center justify-center w-4 h-4">
            {item.icon}
          </div>
          <span className="text-sm font-sans font-medium flex-1">{item.label}</span>
          {item.badge && (
            <span 
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: activeSubItem === item.label ? "rgba(255,255,255,0.2)" : COLORS.primary + "20",
                color: activeSubItem === item.label ? "white" : COLORS.primary
              }}
            >
              {item.badge}
            </span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

function SidebarItem({ icon, label, isActive, onClick, hasSubmenu, isExpanded, badge }: SidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div 
        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? "text-white shadow-lg" 
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
        style={{
          backgroundColor: isActive ? COLORS.primary : "transparent"
        }}
      >
        {/* Icon */}
        <div className={`flex items-center justify-center transition-transform duration-200 ${
          isHovered ? "scale-110" : ""
        }`}>
          {icon}
        </div>
        
        {/* Label */}
        <span className="text-sm font-sans font-medium tracking-wide flex-1">
          {label}
        </span>

        {/* Badge */}
        {badge && (
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: isActive ? "rgba(255,255,255,0.2)" : COLORS.primary + "20",
              color: isActive ? "white" : COLORS.primary
            }}
          >
            {badge}
          </span>
        )}

        {/* Submenu indicator */}
        {hasSubmenu && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
          style={{ backgroundColor: COLORS.primary }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}

interface User {
  email: string;
  fullName: string;
  accountType: 'demo' | 'subscriber';
  isAuthenticated: boolean;
}

interface SidebarProps {
  onNavigate?: (section: string, subSection?: string) => void;
  onLogout?: () => void;
  user?: User | null;
  isMobile?: boolean;
}

export function Sidebar({ onNavigate, onLogout, user, isMobile = false }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [activeSubItem, setActiveSubItem] = useState("Overview");
  const [expandedSections, setExpandedSections] = useState<string[]>(["Dashboard"]);

  const toggleSection = (sectionLabel: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionLabel) 
        ? prev.filter(s => s !== sectionLabel)
        : [...prev, sectionLabel]
    );
    setActiveItem(sectionLabel);
    
    // If clicking on the main section, navigate to the first sub-item
    const section = mainSections.find(s => s.label === sectionLabel);
    if (section && section.items.length > 0) {
      const firstSubItem = section.items[0];
      firstSubItem.onClick?.();
    }
  };

  // Dashboard & Overview
  const dashboardItems = [
    { icon: <LayoutDashboard className="w-4 h-4" />, label: "Overview", onClick: () => {
      setActiveSubItem("Overview");
      onNavigate?.("Dashboard", "Overview");
    }},
    { icon: <Bell className="w-4 h-4" />, label: "Notifications", badge: "12", onClick: () => {
      setActiveSubItem("Notifications");
      onNavigate?.("Dashboard", "Notifications");
    }},
  ];

  // Profile & Company Management
  const profileItems = [
    { icon: <ShieldCheck className="w-4 h-4" />, label: "KYC Verification", onClick: () => {
      setActiveSubItem("KYC Verification");
      onNavigate?.("Profile & Company", "KYC Verification");
    }},
    { icon: <Building2 className="w-4 h-4" />, label: "Company Association", onClick: () => {
      setActiveSubItem("Company Association");
      onNavigate?.("Profile & Company", "Company Association");
    }},
    { icon: <Lock className="w-4 h-4" />, label: "Private Access", onClick: () => {
      setActiveSubItem("Private Access");
      onNavigate?.("Profile & Company", "Private Access");
    }},
    { icon: <Palette className="w-4 h-4" />, label: "Profile & Branding", onClick: () => {
      setActiveSubItem("Profile & Branding");
      onNavigate?.("Profile & Company", "Profile & Branding");
    }},
  ];

  // Content & Trading
  const contentItems = [
    { icon: <Package className="w-4 h-4" />, label: "Subscription Packages", onClick: () => {
      setActiveSubItem("Subscription Packages");
      onNavigate?.("Content & Trading", "Subscription Packages");
    }},
    { icon: <Signal className="w-4 h-4" />, label: "Signal Center", badge: "3", onClick: () => {
      setActiveSubItem("Signal Center");
      onNavigate?.("Content & Trading", "Signal Center");
    }},
    { icon: <TrendingUp className="w-4 h-4" />, label: "Signal Monitor", badge: "8", onClick: () => {
      setActiveSubItem("Signal Monitor");
      onNavigate?.("Content & Trading", "Signal Monitor");
    }},
    { icon: <FileText className="w-4 h-4" />, label: "Content Publishing", onClick: () => {
      setActiveSubItem("Content Publishing");
      onNavigate?.("Content & Trading", "Content Publishing");
    }},
    { icon: <Newspaper className="w-4 h-4" />, label: "News Center", onClick: () => {
      setActiveSubItem("News Center");
      onNavigate?.("Content & Trading", "News Center");
    }},
  ];

  // Education & Live Content
  const educationItems = [
    { icon: <BookOpen className="w-4 h-4" />, label: "Courses & Videos", onClick: () => {
      setActiveSubItem("Courses & Videos");
      onNavigate?.("Education & Live", "Courses & Videos");
    }},
    { icon: <Video className="w-4 h-4" />, label: "Live Streaming", onClick: () => {
      setActiveSubItem("Live Streaming");
      onNavigate?.("Education & Live", "Live Streaming");
    }},
    { icon: <Calendar className="w-4 h-4" />, label: "Consultation Booking", badge: "5", onClick: () => {
      setActiveSubItem("Consultation Booking");
      onNavigate?.("Education & Live", "Consultation Booking");
    }},
  ];

  // Communication
  const communicationItems = [
    { icon: <MessageCircle className="w-4 h-4" />, label: "Subscriber Chat", badge: "24", onClick: () => {
      setActiveSubItem("Subscriber Chat");
      onNavigate?.("Communication", "Subscriber Chat");
    }},
  ];

  // Marketing & Revenue
  const marketingItems = [
    { icon: <Gift className="w-4 h-4" />, label: "Discount Codes", onClick: () => {
      setActiveSubItem("Discount Codes");
      onNavigate?.("Marketing & Revenue", "Discount Codes");
    }},
    { icon: <Users className="w-4 h-4" />, label: "Referral System", onClick: () => {
      setActiveSubItem("Referral System");
      onNavigate?.("Marketing & Revenue", "Referral System");
    }},
    { icon: <DollarSign className="w-4 h-4" />, label: "Payout Dashboard", onClick: () => {
      setActiveSubItem("Payout Dashboard");
      onNavigate?.("Marketing & Revenue", "Payout Dashboard");
    }},
  ];

  const mainSections = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      items: dashboardItems,
      badge: "12"
    },
    {
      label: "Profile & Company",
      icon: <User className="w-5 h-5" />,
      items: profileItems
    },
    {
      label: "Content & Trading",
      icon: <TrendingUp className="w-5 h-5" />,
      items: contentItems,
      badge: "3"
    },
    {
      label: "Education & Live",
      icon: <BookOpen className="w-5 h-5" />,
      items: educationItems,
      badge: "5"
    },
    {
      label: "Communication",
      icon: <MessageSquare className="w-5 h-5" />,
      items: communicationItems,
      badge: "24"
    },
    {
      label: "Marketing & Revenue",
      icon: <DollarSign className="w-5 h-5" />,
      items: marketingItems
    }
  ];

  return (
    <motion.div
      className={`${
        isMobile 
          ? "w-full bg-white flex flex-col py-4 px-4 overflow-y-auto" 
          : "w-72 bg-white border-r flex flex-col py-6 px-4 shadow-lg overflow-y-auto"
      }`}
      style={{ borderColor: COLORS.lightGray }}
      initial={isMobile ? { opacity: 0 } : { x: -100, opacity: 0 }}
      animate={isMobile ? { opacity: 1 } : { x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Logo/Brand - Hidden on mobile since it's in the header */}
      {!isMobile && (
        <motion.div 
          className="mb-8 px-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold" style={{ color: COLORS.dark }}>
                AnalystPro
              </h1>
              <p className="text-xs font-sans" style={{ color: COLORS.dark + "80" }}>
                Financial Dashboard
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        {mainSections.map((section, sectionIndex) => (
          <motion.div
            key={section.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: sectionIndex * 0.1 + 0.2 }}
          >
            <SidebarItem
              icon={section.icon}
              label={section.label}
              isActive={activeItem === section.label}
              onClick={() => toggleSection(section.label)}
              hasSubmenu={true}
              isExpanded={expandedSections.includes(section.label)}
              badge={section.badge}
            />
            <SidebarSubmenu
              items={section.items}
              isVisible={expandedSections.includes(section.label)}
              activeSubItem={activeSubItem}
            />
          </motion.div>
        ))}
      </nav>

      {/* Settings & Logout */}
      <motion.div
        className="mt-6 pt-4 border-t space-y-2"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <SidebarItem
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          isActive={activeItem === "Settings"}
          onClick={() => {
            setActiveItem("Settings");
            setActiveSubItem("");
            onNavigate?.("Settings");
          }}
        />
        <SidebarItem
          icon={<LogOut className="w-5 h-5" />}
          label="Logout"
          onClick={onLogout}
        />
      </motion.div>

      {/* User Profile */}
      {user && (
        <motion.div 
          className="mt-6 p-4 rounded-xl border-2 border-dashed"
          style={{ 
            borderColor: COLORS.lightGray,
            backgroundColor: COLORS.lightGray + "50"
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <span className="text-sm font-sans font-medium text-white">
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-sans font-semibold truncate" style={{ color: COLORS.dark }}>
                {user.fullName}
              </div>
              <div className="text-xs font-sans truncate" style={{ color: COLORS.dark + "80" }}>
                {user.accountType === 'demo' ? 'Demo Account' : 'Professional Analyst'}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: user.accountType === 'demo' ? "#F59E0B" : "#10B981" }}
                />
                <span 
                  className="text-xs font-sans font-medium" 
                  style={{ color: user.accountType === 'demo' ? "#F59E0B" : "#10B981" }}
                >
                  {user.accountType === 'demo' ? 'Demo Access' : 'Verified'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}