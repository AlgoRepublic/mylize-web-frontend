import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bell, Search, Globe, Plus, TrendingUp, AlertTriangle, Activity, DollarSign, Shield, Building2, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AnimatedLineChart, AnimatedAreaChart, AnimatedBarChart, AnimatedPieChart } from "./animated-charts";
import { Statistics } from "./statistics";
import { ActiveSignalsMonitor } from "./active-signals-monitor";
import { SignalCenter } from "./signal-center";
import { ContentPublishing } from "./content-publishing";
import { AnalystNews } from "./analyst-news";
import { CoursesVideos } from "./courses-videos";
import { LiveStreaming } from "./live-streaming";
import { ConsultationBooking } from "./consultation-booking";
import { SubscriberChat } from "./subscriber-chat";
import { DiscountCodes } from "./discount-codes";
import { ReferralSystem } from "./referral-system";
import { PayoutDashboard } from "./payout-dashboard";
import { Settings } from "./settings";
import { PlanUpgrade } from "./plan-upgrade";
import { KYCVerification } from "./kyc-verification";
import { CompanyAssociation } from "./company-association";
import { ProfileBranding } from "./profile-branding";
import { SubscriptionPackages } from "./subscription-packages";
import { useTranslation } from "react-i18next";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showLanguage?: boolean;
  actions?: React.ReactNode;
  onLanguageChange?: (lng: string) => void;
  currentLanguage?: string;
}

function DashboardHeader({ title, subtitle, showSearch = true, showLanguage = true, actions, onLanguageChange, currentLanguage }: DashboardHeaderProps) {
  const { t, i18n } = useTranslation();
  const activeLang = currentLanguage || i18n.language || "en";
  const isRtl = activeLang.startsWith("ar");

  const handleLanguageToggle = () => {
    const nextLng = activeLang.startsWith("ar") ? "en" : "ar";
    i18n.changeLanguage(nextLng);
    onLanguageChange?.(nextLng);
  };

  return (
    <motion.div
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 lg:mb-8 p-4 lg:p-6 bg-white rounded-xl shadow-sm border"
      style={{ borderColor: COLORS.lightGray }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm font-sans mt-1" style={{ color: COLORS.dark + "80" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: COLORS.dark + "60" }} />
            <Input
              placeholder={t("dashboard.searchPlaceholder")}
              className="pl-10 w-full sm:w-48 lg:w-64 border-gray-200 focus:border-orange-300"
            />
          </div>
        )}

        <div className="flex items-center gap-2 lg:gap-4">
          {showLanguage && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 flex-shrink-0"
              type="button"
              onClick={handleLanguageToggle}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">
                {activeLang.startsWith("ar")
                  ? t("common.languageCodeArabic")
                  : t("common.languageCodeEnglish")}
              </span>
            </Button>
          )}

          <Button 
            size="sm" 
            className="gap-2 relative overflow-hidden flex-shrink-0"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Bell className="w-4 h-4" />
            <span
              className={`absolute -top-1 ${
                isRtl ? "-left-1" : "-right-1"
              } w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white`}
            >
              12
            </span>
          </Button>

          {actions}
        </div>
      </div>
    </motion.div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color?: string;
}

function StatsCard({ title, value, change, trend = "neutral", icon, color = COLORS.primary }: StatsCardProps) {
  const getTrendColor = () => {
    if (trend === "up") return "#10B981";
    if (trend === "down") return "#EF4444";
    return COLORS.dark + "80";
  };

  return (
    <motion.div
      className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border card-hover"
      style={{ borderColor: COLORS.lightGray }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-sans font-medium truncate" style={{ color: COLORS.dark + "80" }}>
            {title}
          </p>
          <p className="text-lg lg:text-2xl font-sans font-bold mt-1" style={{ color: COLORS.dark }}>
            {value}
          </p>
          {change && (
            <p className="text-xs lg:text-sm font-sans font-medium mt-1 truncate" style={{ color: getTrendColor() }}>
              {change}
            </p>
          )}
        </div>
        <div 
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-3"
          style={{ backgroundColor: color + "20" }}
        >
          <div style={{ color: color }}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface User {
  email: string;
  fullName: string;
  accountType: 'demo' | 'subscriber';
  isAuthenticated: boolean;
}

interface AnalystDashboardProps {
  activeView?: string;
  activeSubView?: string;
  isMobile?: boolean;
  user?: User | null;
  onNavigate?: (section: string, subSection?: string) => void;
}

export function AnalystDashboard({ activeView = "Dashboard", activeSubView = "Overview", isMobile = false, user, onNavigate }: AnalystDashboardProps) {
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState(activeView);
  const [currentSubView, setCurrentSubView] = useState(activeSubView);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

  const handleNavigation = (section: string, subSection?: string) => {
    setCurrentView(section);
    if (subSection) {
      setCurrentSubView(subSection);
    }
    onNavigate?.(section, subSection);
  };

  // Listen for sidebar navigation changes
  useEffect(() => {
    setCurrentView(activeView);
    setCurrentSubView(activeSubView);
  }, [activeView, activeSubView]);

  useEffect(() => {
    setCurrentLanguage(i18n.language || "en");
  }, [i18n.language]);

  const renderDashboardOverview = () => (
    <div className={`space-y-8 ${currentLanguage.startsWith("ar") ? "rtl" : ""}`}>
      <DashboardHeader
        title={t("dashboard.welcome", {
          name: user?.fullName?.split(" ")[0] || t("common.languageEnglish"),
        })}
        subtitle={
          user?.accountType === "demo"
            ? t("dashboard.subtitleDemo")
            : t("dashboard.subtitleAnalyst")
        }
        onLanguageChange={setCurrentLanguage}
        currentLanguage={currentLanguage}
        actions={
          <Button className="gap-2" style={{ backgroundColor: COLORS.primary }}>
            <Plus className="w-4 h-4" />
            {t("dashboard.quickAction")}
          </Button>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title={t("dashboard.metrics.activeSubscriptions")}
          value="1,234"
          change={t("dashboard.metrics.activeSubscriptionsChange")}
          trend="up"
          icon={<Bell className="w-6 h-6" />}
        />
        <StatsCard
          title={t("dashboard.metrics.openSignals")}
          value="8"
          change={t("dashboard.metrics.openSignalsChange")}
          trend="neutral"
          icon={<motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full" />
          </motion.div>}
          color="#8B5CF6"
        />
        <StatsCard
          title={t("dashboard.metrics.consultationBookings")}
          value="15"
          change={t("dashboard.metrics.consultationBookingsChange")}
          trend="up"
          icon={<Globe className="w-6 h-6" />}
          color="#10B981"
        />
        <StatsCard
          title={t("dashboard.metrics.monthlyRevenue")}
          value="$12,450"
          change={t("dashboard.metrics.monthlyRevenueChange")}
          trend="up"
          icon={<div className="text-2xl">💰</div>}
          color="#F59E0B"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8">
        <div className="xl:col-span-2">
          <AnimatedAreaChart 
            title={t("dashboard.charts.subscriptionGrowthTitle")}
            subtitle={t("dashboard.charts.subscriptionGrowthSubtitle")}
          />
        </div>
        <Statistics />
        <AnimatedLineChart 
          title={t("dashboard.charts.signalPerformanceTitle")}
          subtitle={t("dashboard.charts.signalPerformanceSubtitle")}
        />
        <AnimatedBarChart 
          title={t("dashboard.charts.revenueBreakdownTitle")}
          subtitle={t("dashboard.charts.revenueBreakdownSubtitle")}
        />
        <AnimatedPieChart 
          title={t("dashboard.charts.subscriberDistributionTitle")}
          subtitle={t("dashboard.charts.subscriberDistributionSubtitle")}
        />
      </div>

      {/* Recent Activity Feed */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
          {t("dashboard.recentActivityTitle")}
        </h3>
        <div className="space-y-3">
          {[
            { type: "subscription", message: t("dashboard.recentActivity.subscription"), time: t("dashboard.recentActivity.ago2m"), color: "#10B981" },
            { type: "signal", message: t("dashboard.recentActivity.signal"), time: t("dashboard.recentActivity.ago1h"), color: COLORS.primary },
            { type: "consultation", message: t("dashboard.recentActivity.consultation"), time: t("dashboard.recentActivity.ago3h"), color: "#8B5CF6" },
            { type: "payout", message: t("dashboard.recentActivity.payout"), time: t("dashboard.recentActivity.ago1d"), color: "#F59E0B" }
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activity.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-sans font-medium" style={{ color: COLORS.dark }}>
                  {activity.message}
                </p>
                <p className="text-xs font-sans" style={{ color: COLORS.dark + "60" }}>
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-8">
      <DashboardHeader
        title={t("dashboard.notificationsComingSoonTitle")}
        subtitle={t("dashboard.notificationsComingSoonSubtitle")}
      />
      
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="text-center py-12">
          <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
          <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
            {t("dashboard.notificationsComingSoonTitle")}
          </h3>
          <p className="text-sm font-sans" style={{ color: COLORS.dark + "80" }}>
            {t("dashboard.notificationsComingSoonBody")}
          </p>
        </div>
      </motion.div>
    </div>
  );

  const renderSignalCenter = () => (
    <div className="space-y-8">
      <SignalCenter />
    </div>
  );

  const renderContentPublishing = () => (
    <div className="space-y-8">
      <ContentPublishing />
    </div>
  );

  const renderSubscriptionPackages = () => (
    <div className="space-y-8">
      <SubscriptionPackages />
    </div>
  );

  const renderKYCVerification = () => (
    <div className="space-y-8">
      <KYCVerification />
    </div>
  );

  const renderProfileBranding = () => (
    <div className="space-y-8">
      <ProfileBranding />
    </div>
  );

  const renderCompanyAssociation = () => (
    <div className="space-y-8">
      <CompanyAssociation />
    </div>
  );

  const renderPrivateAccess = () => (
    <div className={`space-y-8 ${currentLanguage.startsWith("ar") ? "rtl" : ""}`}>
      <DashboardHeader
        title={t("pages.privateAccess.title")}
        subtitle={t("pages.privateAccess.subtitle")}
      />
      
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
          <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
            {t("pages.privateAccess.comingSoonTitle")}
          </h3>
          <p className="text-sm font-sans" style={{ color: COLORS.dark + "80" }}>
            {t("pages.privateAccess.comingSoonBody")}
          </p>
        </div>
      </motion.div>
    </div>
  );

  // Render different views based on active selection
  const renderContent = () => {
    // Handle main sections
    if (currentView === "Dashboard") {
      switch (currentSubView) {
        case "Overview":
          return renderDashboardOverview();
        case "Notifications":
          return renderNotifications();
        default:
          return renderDashboardOverview();
      }
    }
    
    // Handle Content & Trading section
    if (currentView === "Content & Trading") {
      switch (currentSubView) {
        case "Signal Center":
          return renderSignalCenter();
        case "Signal Monitor":
          return (
            <div className={`space-y-8 ${currentLanguage.startsWith("ar") ? "rtl" : ""}`}>
              <DashboardHeader
                title={t("pages.activeSignals.title")}
                subtitle={t("pages.activeSignals.subtitle")}
              />
              <ActiveSignalsMonitor />
            </div>
          );
        case "Content Publishing":
          return renderContentPublishing();
        case "News Center":
          return (
            <div className="space-y-8">
              <AnalystNews />
            </div>
          );
        case "Subscription Packages":
          return renderSubscriptionPackages();
        default:
          return renderSignalCenter();
      }
    }

    // Handle Profile & Company section
    if (currentView === "Profile & Company") {
      switch (currentSubView) {
        case "KYC Verification":
          return renderKYCVerification();
        case "Profile & Branding":
          return renderProfileBranding();
        case "Company Association":
          return renderCompanyAssociation();
        case "Private Access":
          return renderPrivateAccess();
        default:
          return renderKYCVerification();
      }
    }

    // Handle Education & Live section
    if (currentView === "Education & Live") {
      switch (currentSubView) {
        case "Courses & Videos":
          return (
            <div className="space-y-8">
              <CoursesVideos />
            </div>
          );
        case "Live Streaming":
          return (
            <div className="space-y-8">
              <LiveStreaming />
            </div>
          );
        case "Consultation Booking":
          return (
            <div className="space-y-8">
              <ConsultationBooking />
            </div>
          );
        default:
          return (
            <div className="space-y-8">
              <CoursesVideos />
            </div>
          );
      }
    }

    // Handle Communication section
    if (currentView === "Communication") {
      switch (currentSubView) {
        case "Subscriber Chat":
          return (
            <div className="space-y-8">
              <SubscriberChat />
            </div>
          );
        default:
          return (
            <div className="space-y-8">
              <SubscriberChat />
            </div>
          );
      }
    }

    // Handle Marketing & Revenue section
    if (currentView === "Marketing & Revenue") {
      switch (currentSubView) {
        case "Discount Codes":
          return (
            <div className="space-y-8">
              <DiscountCodes />
            </div>
          );
        case "Referral System":
          return (
            <div className="space-y-8">
              <ReferralSystem />
            </div>
          );
        case "Payout Dashboard":
          return (
            <div className="space-y-8">
              <PayoutDashboard />
            </div>
          );
        default:
          return (
            <div className="space-y-8">
              <DiscountCodes />
            </div>
          );
      }
    }

    // Default fallback
    switch (currentView) {
      case "Dashboard":
        return renderDashboardOverview();
      case "Settings":
        return (
          <div className="space-y-8">
            <Settings onNavigate={handleNavigation} />
          </div>
        );
      case "Plan Upgrade":
        return (
          <div className="space-y-8">
            <PlanUpgrade onBack={() => handleNavigation("Settings")} />
          </div>
        );
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div 
      className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} overflow-auto`} 
      style={{ backgroundColor: COLORS.lightGray + "50" }}
    >
      {renderContent()}
    </div>
  );
}