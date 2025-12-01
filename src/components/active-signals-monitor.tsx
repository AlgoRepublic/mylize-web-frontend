import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Target, 
  StopCircle,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Eye,
  MoreVertical,
  Filter
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

// Mock real-time signal data
interface Signal {
  id: string;
  pair: string;
  direction: "buy" | "sell";
  entryPrice: number;
  currentPrice: number;
  targetPrice: number;
  stopLoss: number;
  pips: number;
  percentage: number;
  status: "active" | "pending" | "closed" | "warning" | "critical";
  openTime: string;
  signalStrength: number;
  riskLevel: "low" | "medium" | "high";
  timeInTrade: string;
  notes?: string;
}

const mockSignals: Signal[] = [
  {
    id: "SIG-001",
    pair: "EUR/USD",
    direction: "buy",
    entryPrice: 1.0850,
    currentPrice: 1.0895,
    targetPrice: 1.0950,
    stopLoss: 1.0800,
    pips: 45,
    percentage: 4.15,
    status: "active",
    openTime: "2h 15m ago",
    signalStrength: 8.5,
    riskLevel: "medium",
    timeInTrade: "2h 15m",
    notes: "Strong bullish momentum"
  },
  {
    id: "SIG-002",
    pair: "GBP/JPY",
    direction: "sell",
    entryPrice: 189.45,
    currentPrice: 189.12,
    targetPrice: 188.50,
    stopLoss: 190.00,
    pips: 33,
    percentage: 1.74,
    status: "warning",
    openTime: "45m ago",
    signalStrength: 6.2,
    riskLevel: "high",
    timeInTrade: "45m",
    notes: "Approaching resistance level"
  },
  {
    id: "SIG-003",
    pair: "USD/JPY",
    direction: "buy",
    entryPrice: 148.20,
    currentPrice: 147.95,
    targetPrice: 149.50,
    stopLoss: 147.50,
    pips: -25,
    percentage: -1.69,
    status: "critical",
    openTime: "1h 30m ago",
    signalStrength: 4.1,
    riskLevel: "high",
    timeInTrade: "1h 30m",
    notes: "Near stop loss - monitor closely"
  },
  {
    id: "SIG-004",
    pair: "AUD/USD",
    direction: "sell",
    entryPrice: 0.6580,
    currentPrice: 0.6545,
    targetPrice: 0.6500,
    stopLoss: 0.6620,
    pips: 35,
    percentage: 5.32,
    status: "active",
    openTime: "3h 20m ago",
    signalStrength: 7.8,
    riskLevel: "low",
    timeInTrade: "3h 20m",
    notes: "Solid downtrend continuation"
  },
  {
    id: "SIG-005",
    pair: "XAU/USD",
    direction: "buy",
    entryPrice: 2015.50,
    currentPrice: 2018.25,
    targetPrice: 2035.00,
    stopLoss: 2005.00,
    pips: 275,
    percentage: 1.36,
    status: "pending",
    openTime: "10m ago",
    signalStrength: 9.1,
    riskLevel: "medium",
    timeInTrade: "10m",
    notes: "Waiting for breakout confirmation"
  }
];

interface SignalCardProps {
  signal: Signal;
  onQuickAction: (signalId: string, action: string) => void;
}

function SignalCard({ signal, onQuickAction }: SignalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "#10B981";
      case "warning": return "#F59E0B";
      case "critical": return "#EF4444";
      case "pending": return "#8B5CF6";
      case "closed": return "#6B7280";
      default: return COLORS.dark;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "#10B981";
      case "medium": return "#F59E0B";
      case "high": return "#EF4444";
      default: return COLORS.dark;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "critical": return <XCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "closed": return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const isProfit = signal.pips > 0;
  const progressToTarget = Math.abs((signal.currentPrice - signal.entryPrice) / (signal.targetPrice - signal.entryPrice)) * 100;
  const progressToStop = Math.abs((signal.currentPrice - signal.entryPrice) / (signal.stopLoss - signal.entryPrice)) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl p-6 border shadow-sm transition-all duration-300"
      style={{ borderColor: signal.status === "critical" ? "#EF4444" : COLORS.lightGray }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: getStatusColor(signal.status) + "20" }}
          >
            <div style={{ color: getStatusColor(signal.status) }}>
              {getStatusIcon(signal.status)}
            </div>
          </div>
          <div>
            <h4 className="font-sans font-semibold" style={{ color: COLORS.dark }}>
              {signal.pair}
            </h4>
            <p className="text-sm" style={{ color: COLORS.dark + "80" }}>
              {signal.id}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="capitalize"
            style={{ 
              borderColor: getRiskColor(signal.riskLevel),
              color: getRiskColor(signal.riskLevel)
            }}
          >
            {signal.riskLevel} Risk
          </Badge>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Direction & Entry */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: signal.direction === "buy" ? "#10B981" : "#EF4444",
              color: "white"
            }}
          >
            {signal.direction === "buy" ? (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                BUY
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                SELL
              </div>
            )}
          </div>
          <span className="text-sm" style={{ color: COLORS.dark + "80" }}>
            @ {signal.entryPrice}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm" style={{ color: COLORS.dark + "80" }}>
            Strength: {signal.signalStrength}/10
          </p>
        </div>
      </div>

      {/* Current P&L */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
            Current P&L
          </span>
          <div className="text-right">
            <div 
              className="font-bold"
              style={{ color: isProfit ? "#10B981" : "#EF4444" }}
            >
              {isProfit ? "+" : ""}{signal.pips} pips
            </div>
            <div 
              className="text-sm"
              style={{ color: isProfit ? "#10B981" : "#EF4444" }}
            >
              {isProfit ? "+" : ""}{signal.percentage.toFixed(2)}%
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ 
              backgroundColor: isProfit ? "#10B981" : "#EF4444",
              width: `${Math.min(Math.abs(progressToTarget), 100)}%`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(progressToTarget), 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Price Levels */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-xs" style={{ color: COLORS.dark + "60" }}>TARGET</p>
          <p className="font-medium" style={{ color: "#10B981" }}>
            {signal.targetPrice}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: COLORS.dark + "60" }}>CURRENT</p>
          <p className="font-semibold" style={{ color: COLORS.dark }}>
            {signal.currentPrice}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: COLORS.dark + "60" }}>STOP LOSS</p>
          <p className="font-medium" style={{ color: "#EF4444" }}>
            {signal.stopLoss}
          </p>
        </div>
      </div>

      {/* Time & Notes */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4" style={{ color: COLORS.dark + "60" }} />
          <span className="text-sm" style={{ color: COLORS.dark + "80" }}>
            Open for {signal.timeInTrade}
          </span>
        </div>
        {signal.notes && (
          <p className="text-sm italic" style={{ color: COLORS.dark + "60" }}>
            "{signal.notes}"
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => onQuickAction(signal.id, "modify")}
        >
          <Target className="w-4 h-4 mr-1" />
          Modify
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => onQuickAction(signal.id, "close")}
        >
          <StopCircle className="w-4 h-4 mr-1" />
          Close
        </Button>
        <Button 
          size="sm" 
          style={{ backgroundColor: COLORS.primary }}
          onClick={() => onQuickAction(signal.id, "view")}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Critical Warning Overlay */}
      {signal.status === "critical" && (
        <motion.div
          className="absolute inset-0 bg-red-500/10 rounded-xl border-2 border-red-500 pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

export function ActiveSignalsMonitor() {
  const [signals, setSignals] = useState<Signal[]>(mockSignals);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRealTime, setIsRealTime] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setSignals(prevSignals => 
        prevSignals.map(signal => {
          // Simulate price movements
          const volatility = 0.001;
          const change = (Math.random() - 0.5) * volatility;
          const newPrice = signal.currentPrice + change;
          
          // Calculate new pips and percentage
          const newPips = signal.direction === "buy" 
            ? (newPrice - signal.entryPrice) * 10000
            : (signal.entryPrice - newPrice) * 10000;
          
          const newPercentage = ((newPrice - signal.entryPrice) / signal.entryPrice) * 100;
          
          // Determine new status based on proximity to stop loss
          let newStatus = signal.status;
          const distanceToStop = Math.abs(newPrice - signal.stopLoss);
          const distanceToEntry = Math.abs(signal.entryPrice - signal.stopLoss);
          
          if (distanceToStop / distanceToEntry < 0.2) {
            newStatus = "critical";
          } else if (distanceToStop / distanceToEntry < 0.4) {
            newStatus = "warning";
          } else if (signal.status !== "pending") {
            newStatus = "active";
          }

          return {
            ...signal,
            currentPrice: Number(newPrice.toFixed(signal.pair.includes("JPY") ? 2 : 4)),
            pips: Number(newPips.toFixed(1)),
            percentage: Number(newPercentage.toFixed(2)),
            status: newStatus
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const handleQuickAction = (signalId: string, action: string) => {
    console.log(`Action ${action} for signal ${signalId}`);
    // Implement quick actions
  };

  const filteredSignals = signals.filter(signal => {
    if (filter !== "all" && signal.status !== filter) return false;
    if (searchTerm && !signal.pair.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const criticalCount = signals.filter(s => s.status === "critical").length;
  const warningCount = signals.filter(s => s.status === "warning").length;
  const activeCount = signals.filter(s => s.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            Active Signals Monitor
          </h2>
          <p className="text-sm" style={{ color: COLORS.dark + "80" }}>
            Real-time monitoring with problem detection
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant={isRealTime ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRealTime(!isRealTime)}
            className="gap-2"
            style={{ backgroundColor: isRealTime ? COLORS.primary : undefined }}
          >
            <Zap className="w-4 h-4" />
            {isRealTime ? "Live" : "Paused"}
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              <p className="text-sm text-gray-600">Critical</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
              <p className="text-sm text-gray-600">Warning</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              <p className="text-sm text-gray-600">Healthy</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{signals.length}</p>
              <p className="text-sm text-gray-600">Total Active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: COLORS.dark + "60" }} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Signals</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warning Only</option>
            <option value="active">Healthy Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>
        
        <Input
          placeholder="Search pairs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Signals Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        layout
      >
        {filteredSignals.map((signal) => (
          <SignalCard
            key={signal.id}
            signal={signal}
            onQuickAction={handleQuickAction}
          />
        ))}
      </motion.div>

      {filteredSignals.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
          <p className="text-lg font-medium" style={{ color: COLORS.dark }}>
            No signals found
          </p>
          <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}