import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X, Eye, StopCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface CriticalAlert {
  id: string;
  type: "stop_loss_warning" | "target_reached" | "market_event" | "system_alert";
  title: string;
  message: string;
  pair?: string;
  severity: "high" | "critical";
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: string;
    variant?: "primary" | "secondary" | "destructive";
  }>;
}

interface CriticalAlertsProps {
  onAlertAction?: (alertId: string, action: string) => void;
  isMobile?: boolean;
}

export function CriticalAlerts({ onAlertAction, isMobile = false }: CriticalAlertsProps) {
  const [alerts, setAlerts] = useState<CriticalAlert[]>([
    {
      id: "alert-001",
      type: "stop_loss_warning",
      title: "Stop Loss Warning",
      message: "USD/JPY signal approaching stop loss - only 15 pips away",
      pair: "USD/JPY",
      severity: "critical",
      timestamp: new Date(),
      actions: [
        { label: "Close Signal", action: "close", variant: "destructive" },
        { label: "Modify SL", action: "modify", variant: "secondary" },
        { label: "View Details", action: "view", variant: "primary" }
      ]
    },
    {
      id: "alert-002",
      type: "market_event",
      title: "High Impact News",
      message: "USD NFP release in 5 minutes - may affect USD pairs",
      severity: "high",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      actions: [
        { label: "View Calendar", action: "calendar", variant: "primary" },
        { label: "Dismiss", action: "dismiss", variant: "secondary" }
      ]
    }
  ]);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleAction = (alertId: string, action: string) => {
    onAlertAction?.(alertId, action);
    if (action === "dismiss" || action === "close") {
      dismissAlert(alertId);
    }
  };

  const getAlertColor = (severity: string) => {
    return severity === "critical" ? "#EF4444" : "#F59E0B";
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "stop_loss_warning":
        return <StopCircle className="w-5 h-5" />;
      case "target_reached":
        return <Eye className="w-5 h-5" />;
      case "market_event":
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  // Simulate new alerts coming in
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 10 seconds
        const newAlert: CriticalAlert = {
          id: `alert-${Date.now()}`,
          type: "stop_loss_warning",
          title: "Position Update",
          message: `${["EUR/USD", "GBP/JPY", "AUD/USD"][Math.floor(Math.random() * 3)]} signal update - monitor closely`,
          severity: Math.random() > 0.5 ? "high" : "critical",
          timestamp: new Date(),
          actions: [
            { label: "View", action: "view", variant: "primary" },
            { label: "Dismiss", action: "dismiss", variant: "secondary" }
          ]
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]); // Keep only last 5 alerts
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className={`fixed z-50 space-y-3 ${
      isMobile 
        ? "top-20 left-4 right-4" 
        : "top-4 right-4 max-w-md"
    }`}>
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: isMobile ? 0 : 100, y: isMobile ? -20 : 0, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: isMobile ? 0 : 100, y: isMobile ? -20 : 0, scale: 0.9 }}
            whileHover={{ scale: isMobile ? 1 : 1.02 }}
            className={`bg-white rounded-xl shadow-2xl border-l-4 p-3 lg:p-4 ${
              isMobile ? "w-full" : "min-w-[350px]"
            }`}
            style={{ 
              borderLeftColor: getAlertColor(alert.severity),
              boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2 lg:mb-3">
              <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                <div 
                  className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg flex items-center justify-center flex-shrink-0`}
                  style={{ 
                    backgroundColor: getAlertColor(alert.severity) + "20",
                    color: getAlertColor(alert.severity)
                  }}
                >
                  {getAlertIcon(alert.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className={`font-sans font-semibold ${isMobile ? 'text-xs' : 'text-sm'} truncate`} style={{ color: COLORS.dark }}>
                    {alert.title}
                  </h4>
                  {alert.pair && (
                    <span className="text-xs font-medium" style={{ color: COLORS.primary }}>
                      {alert.pair}
                    </span>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.id)}
                className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} p-0 hover:bg-gray-100 flex-shrink-0 ml-2`}
              >
                <X className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              </Button>
            </div>

            {/* Message */}
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} mb-2 lg:mb-3`} style={{ color: COLORS.dark + "E0" }}>
              {alert.message}
            </p>

            {/* Timestamp */}
            <p className="text-xs mb-2 lg:mb-3" style={{ color: COLORS.dark + "80" }}>
              {alert.timestamp.toLocaleTimeString()}
            </p>

            {/* Actions */}
            {alert.actions && alert.actions.length > 0 && (
              <div className={`flex gap-1 lg:gap-2 ${isMobile ? 'flex-col' : 'flex-wrap'}`}>
                {alert.actions.map((actionItem, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={actionItem.variant === "primary" ? "default" : "outline"}
                    onClick={() => handleAction(alert.id, actionItem.action)}
                    className={`text-xs ${isMobile ? 'h-8 w-full' : 'h-7'}`}
                    style={{
                      backgroundColor: actionItem.variant === "primary" ? COLORS.primary : undefined,
                      borderColor: actionItem.variant === "destructive" ? "#EF4444" : undefined,
                      color: actionItem.variant === "destructive" ? "#EF4444" : undefined
                    }}
                  >
                    {actionItem.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Pulsing indicator for critical alerts */}
            {alert.severity === "critical" && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}