import { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { AnalystDashboard } from "./components/analyst-dashboard";
import { CriticalAlerts } from "./components/critical-alerts";
import { AuthLogin } from "./components/auth-login";
import { AuthSignup } from "./components/auth-signup";
import { Button } from "./components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./contexts/AuthContext";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

export default function App() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [activeView, setActiveView] = useState("Dashboard");
  const [activeSubView, setActiveSubView] = useState("Overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false); // Close mobile menu on desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    await logout();
    setActiveView("Dashboard");
    setActiveSubView("Overview");
  };

  const handleNavigation = (section: string, subSection?: string) => {
    setActiveView(section);
    if (subSection) {
      setActiveSubView(subSection);
    }
    // Close mobile menu after navigation
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleAlertAction = (alertId: string, action: string) => {
    console.log(`Alert ${alertId}: ${action}`);
    // Handle alert actions like navigating to signal details, closing positions, etc.
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.lightGray }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: COLORS.lightGray, borderTopColor: COLORS.primary }} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show auth screens
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <AuthLogin
          onSwitchToSignup={() => setAuthView('signup')}
        />
      );
    } else {
      return (
        <AuthSignup
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden" style={{ backgroundColor: COLORS.lightGray }}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 relative z-50">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <span className="text-white font-bold text-sm">FA</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg" style={{ color: COLORS.dark }}>
                Forex Analyst
              </h1>
              <p className="text-xs text-gray-500">Professional Dashboard</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: COLORS.dark }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: COLORS.dark }} />
            )}
          </Button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      <span className="text-white font-bold text-sm">FA</span>
                    </div>
                    <div>
                      <h1 className="font-serif font-bold text-lg" style={{ color: COLORS.dark }}>
                        Forex Analyst
                      </h1>
                      <p className="text-xs text-gray-500">Professional Dashboard</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2"
                  >
                    <X className="w-5 h-5" style={{ color: COLORS.dark }} />
                  </Button>
                </div>
              </div>
              <Sidebar onNavigate={handleNavigation} onLogout={handleLogout} user={user} isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onNavigate={handleNavigation} onLogout={handleLogout} user={user} isMobile={false} />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <AnalystDashboard 
          activeView={activeView}
          activeSubView={activeSubView}
          isMobile={isMobile}
          onNavigate={handleNavigation}
          user={user}
        />
      </div>

      {/* Critical Alerts - Floating overlay */}
      <CriticalAlerts onAlertAction={handleAlertAction} isMobile={isMobile} />
    </div>
  );
}