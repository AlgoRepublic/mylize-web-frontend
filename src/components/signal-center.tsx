import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Filter,
  Plus,
  Edit3,
  Trash2,
  Save,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  BarChart3,
  DollarSign,
  Percent,
  Calendar,
  X,
  Copy,
  ExternalLink,
  Send,
  Users,
  TrendingUp as Growth
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { unsplash_tool } from "../tools/unsplash";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface TakeProfit {
  id: string;
  level: number;
  price: number;
  percentage: number; // Percentage of position to close
  description?: string;
}

interface Signal {
  id: string;
  pair: string;
  direction: "buy" | "sell";
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  takeProfits: TakeProfit[];
  pips: number;
  percentage: number;
  status: "active" | "pending" | "closed" | "warning" | "critical" | "draft";
  openTime: string;
  riskLevel: "low" | "medium" | "high";
  timeInTrade: string;
  notes?: string;
  analysis?: string;
  chartImage?: string;
  chartDescription?: string;
  riskReward: number;
  confidence: number;
  sessionType: "london" | "new_york" | "tokyo" | "sydney" | "overlap";
  tags: string[];
  createdAt: Date;
  publishedAt?: Date;
}

interface SignalFormData {
  pair: string;
  direction: "buy" | "sell";
  entryPrice: string;
  stopLoss: string;
  takeProfits: TakeProfit[];
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  sessionType: "london" | "new_york" | "tokyo" | "sydney" | "overlap";
  notes: string;
  analysis: string;
  chartImage?: string;
  chartDescription: string;
  tags: string[];
}

const CURRENCY_PAIRS = [
  // Major Pairs
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD",
  // Minor Pairs
  "EUR/GBP", "EUR/JPY", "GBP/JPY", "AUD/JPY", "CHF/JPY", "CAD/JPY",
  // Exotic Pairs
  "USD/TRY", "EUR/TRY", "USD/ZAR", "USD/MXN",
  // Commodities
  "XAU/USD", "XAG/USD", "WTI/USD", "BRENT/USD",
  // Crypto
  "BTC/USD", "ETH/USD", "LTC/USD", "ADA/USD"
];

const TRADING_SESSIONS = {
  sydney: { name: "Sydney", time: "22:00 - 07:00 GMT", color: "#8B5CF6" },
  tokyo: { name: "Tokyo", time: "00:00 - 09:00 GMT", color: "#EF4444" },
  london: { name: "London", time: "08:00 - 17:00 GMT", color: "#10B981" },
  new_york: { name: "New York", time: "13:00 - 22:00 GMT", color: "#3B82F6" },
  overlap: { name: "Session Overlap", time: "High Volume", color: "#F59E0B" }
};

const mockSignals: Signal[] = [
  {
    id: "SIG-001",
    pair: "EUR/USD",
    direction: "buy",
    entryPrice: 1.0850,
    currentPrice: 1.0895,
    stopLoss: 1.0800,
    takeProfits: [
      { id: "tp1", level: 1, price: 1.0900, percentage: 30, description: "First target - resistance level" },
      { id: "tp2", level: 2, price: 1.0950, percentage: 50, description: "Main target - weekly resistance" },
      { id: "tp3", level: 3, price: 1.1000, percentage: 20, description: "Extension - psychological level" }
    ],
    pips: 45,
    percentage: 4.15,
    status: "active",
    openTime: "2h 15m ago",
    riskLevel: "medium",
    timeInTrade: "2h 15m",
    notes: "Strong bullish momentum after ECB dovish comments",
    analysis: "EUR/USD showing strong bullish momentum following ECB's dovish stance. Technical indicators align with fundamental outlook. Expecting continuation towards 1.0950 resistance level.",
    chartImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    chartDescription: "4H chart showing bullish breakout above key resistance with volume confirmation",
    riskReward: 2.5,
    confidence: 85,
    sessionType: "london",
    tags: ["ECB", "Breakout", "Bullish"],
    createdAt: new Date("2024-01-20T10:30:00"),
    publishedAt: new Date("2024-01-20T10:35:00")
  },
  {
    id: "SIG-002", 
    pair: "GBP/JPY",
    direction: "sell",
    entryPrice: 189.45,
    currentPrice: 189.12,
    stopLoss: 190.00,
    takeProfits: [
      { id: "tp1", level: 1, price: 188.80, percentage: 40, description: "Initial target - support level" },
      { id: "tp2", level: 2, price: 188.20, percentage: 40, description: "Main target - daily support" },
      { id: "tp3", level: 3, price: 187.50, percentage: 20, description: "Extended target" }
    ],
    pips: 33,
    percentage: 1.74,
    status: "warning",
    openTime: "45m ago",
    riskLevel: "high",
    timeInTrade: "45m",
    notes: "Approaching resistance level - watch for reversal signals",
    analysis: "GBP/JPY showing signs of exhaustion at current levels. Risk-off sentiment favoring JPY strength.",
    riskReward: 1.8,
    confidence: 70,
    sessionType: "overlap",
    tags: ["Risk-off", "JPY Strength"],
    createdAt: new Date("2024-01-20T09:15:00"),
    publishedAt: new Date("2024-01-20T09:20:00")
  }
];

function SignalCard({ 
  signal, 
  onEdit, 
  onDelete, 
  onPublish, 
  onDuplicate 
}: { 
  signal: Signal;
  onEdit: (signal: Signal) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onDuplicate: (signal: Signal) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "#10B981";
      case "warning": return "#F59E0B";
      case "critical": return "#EF4444";
      case "pending": return "#8B5CF6";
      case "draft": return "#6B7280";
      case "closed": return "#6B7280";
      default: return COLORS.dark;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "critical": return <XCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "draft": return <Edit3 className="w-4 h-4" />;
      case "closed": return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const isProfit = signal.pips > 0;
  const sessionInfo = TRADING_SESSIONS[signal.sessionType];

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
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="capitalize text-xs"
                style={{ 
                  borderColor: sessionInfo.color + "40",
                  color: sessionInfo.color
                }}
              >
                {sessionInfo.name}
              </Badge>
              <Badge 
                variant="outline" 
                className="capitalize text-xs"
                style={{ 
                  borderColor: signal.riskLevel === "high" ? "#EF4444" : 
                              signal.riskLevel === "medium" ? "#F59E0B" : "#10B981",
                  color: signal.riskLevel === "high" ? "#EF4444" : 
                         signal.riskLevel === "medium" ? "#F59E0B" : "#10B981"
                }}
              >
                {signal.riskLevel} Risk
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(signal)}>
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(signal)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(signal.id)} className="text-red-600">
            <Trash2 className="w-4 h-4" />
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
          <span className="text-sm font-medium" style={{ color: COLORS.dark }}>
            @ {signal.entryPrice}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.dark + "60" }}>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            R:R {signal.riskReward}
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            {signal.confidence}%
          </div>
        </div>
      </div>

      {/* Current P&L */}
      {signal.status !== "draft" && (
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
        </div>
      )}

      {/* Take Profits */}
      <div className="mb-4">
        <h5 className="text-xs font-medium mb-2" style={{ color: COLORS.dark + "80" }}>
          TAKE PROFIT LEVELS ({signal.takeProfits.length})
        </h5>
        <div className="space-y-1">
          {signal.takeProfits.slice(0, 2).map((tp) => (
            <div key={tp.id} className="flex items-center justify-between text-sm">
              <span style={{ color: COLORS.dark + "60" }}>
                TP{tp.level}: {tp.price}
              </span>
              <span style={{ color: "#10B981" }}>
                {tp.percentage}%
              </span>
            </div>
          ))}
          {signal.takeProfits.length > 2 && (
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              +{signal.takeProfits.length - 2} more levels
            </div>
          )}
        </div>
        
        <div className="mt-2 text-sm">
          <span style={{ color: COLORS.dark + "60" }}>SL: </span>
          <span style={{ color: "#EF4444" }}>{signal.stopLoss}</span>
        </div>
      </div>

      {/* Chart Preview */}
      {signal.chartImage && (
        <div className="mb-4">
          <div 
            className="w-full h-32 bg-cover bg-center rounded-lg border"
            style={{ 
              backgroundImage: `url(${signal.chartImage})`,
              borderColor: COLORS.lightGray
            }}
          />
          {signal.chartDescription && (
            <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
              {signal.chartDescription}
            </p>
          )}
        </div>
      )}

      {/* Tags */}
      {signal.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-1 flex-wrap">
            {signal.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {signal.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{signal.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {signal.status === "draft" ? (
          <Button 
            className="flex-1"
            style={{ backgroundColor: COLORS.primary }}
            onClick={() => onPublish(signal.id)}
          >
            <Send className="w-4 h-4 mr-1" />
            Publish Signal
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View Details
          </Button>
        )}
      </div>

      {/* Time Stamp */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs" style={{ color: COLORS.dark + "60" }}>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Created {signal.createdAt.toLocaleDateString()}</span>
          </div>
          {signal.publishedAt && (
            <span>Published {signal.publishedAt.toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SignalForm({ 
  signal, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  signal?: Signal; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (signalData: Partial<Signal>) => void; 
}) {
  const [formData, setFormData] = useState<SignalFormData>({
    pair: signal?.pair || "",
    direction: signal?.direction || "buy",
    entryPrice: signal?.entryPrice?.toString() || "",
    stopLoss: signal?.stopLoss?.toString() || "",
    takeProfits: signal?.takeProfits || [
      { id: "tp1", level: 1, price: 0, percentage: 50, description: "" },
      { id: "tp2", level: 2, price: 0, percentage: 30, description: "" },
      { id: "tp3", level: 3, price: 0, percentage: 20, description: "" }
    ],
    riskLevel: signal?.riskLevel || "medium",
    confidence: signal?.confidence || 75,
    sessionType: signal?.sessionType || "london",
    notes: signal?.notes || "",
    analysis: signal?.analysis || "",
    chartImage: signal?.chartImage || "",
    chartDescription: signal?.chartDescription || "",
    tags: signal?.tags || []
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isUploadingChart, setIsUploadingChart] = useState(false);

  const handleTakeProfitChange = (index: number, field: keyof TakeProfit, value: string | number) => {
    const updatedTPs = [...formData.takeProfits];
    updatedTPs[index] = { ...updatedTPs[index], [field]: value };
    setFormData({ ...formData, takeProfits: updatedTPs });
  };

  const addTakeProfit = () => {
    const newTP: TakeProfit = {
      id: `tp${formData.takeProfits.length + 1}`,
      level: formData.takeProfits.length + 1,
      price: 0,
      percentage: 10,
      description: ""
    };
    setFormData({ 
      ...formData, 
      takeProfits: [...formData.takeProfits, newTP] 
    });
  };

  const removeTakeProfit = (index: number) => {
    const updatedTPs = formData.takeProfits.filter((_, i) => i !== index);
    // Reorder levels
    const reorderedTPs = updatedTPs.map((tp, i) => ({ ...tp, level: i + 1 }));
    setFormData({ ...formData, takeProfits: reorderedTPs });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ 
        ...formData, 
        tags: [...formData.tags, newTag.trim()] 
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const handleChartUpload = async () => {
    setIsUploadingChart(true);
    try {
      // Simulate chart upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      const chartUrl = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop";
      setFormData({ ...formData, chartImage: chartUrl });
    } catch (error) {
      console.error("Failed to upload chart:", error);
    } finally {
      setIsUploadingChart(false);
    }
  };

  const calculateRiskReward = () => {
    const entry = parseFloat(formData.entryPrice);
    const sl = parseFloat(formData.stopLoss);
    const firstTP = formData.takeProfits[0]?.price || 0;
    
    if (!entry || !sl || !firstTP) return 0;
    
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(firstTP - entry);
    
    return risk > 0 ? (reward / risk) : 0;
  };

  const handleSave = async (asDraft = true) => {
    setIsSaving(true);
    
    const signalData: Partial<Signal> = {
      ...signal,
      pair: formData.pair,
      direction: formData.direction,
      entryPrice: parseFloat(formData.entryPrice),
      stopLoss: parseFloat(formData.stopLoss),
      takeProfits: formData.takeProfits,
      riskLevel: formData.riskLevel,
      confidence: formData.confidence,
      sessionType: formData.sessionType,
      notes: formData.notes,
      analysis: formData.analysis,
      chartImage: formData.chartImage,
      chartDescription: formData.chartDescription,
      tags: formData.tags,
      riskReward: calculateRiskReward(),
      status: asDraft ? "draft" : "active",
      createdAt: signal?.createdAt || new Date(),
      publishedAt: asDraft ? undefined : new Date()
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(signalData);
    setIsSaving(false);
    onClose();
  };

  const totalPercentage = formData.takeProfits.reduce((sum, tp) => sum + tp.percentage, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: COLORS.primary }} />
            {signal ? "Edit Signal" : "Create New Signal"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="levels">Price Levels</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pair">Currency Pair</Label>
                <Select value={formData.pair} onValueChange={(value) => setFormData({ ...formData, pair: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_PAIRS.map((pair) => (
                      <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="direction">Direction</Label>
                <Select 
                  value={formData.direction} 
                  onValueChange={(value: "buy" | "sell") => setFormData({ ...formData, direction: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span>BUY</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sell">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span>SELL</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.0001"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                  placeholder="1.0850"
                />
              </div>
              
              <div>
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.0001"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                  placeholder="1.0800"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Trading Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Brief note about the setup (e.g. Strong bullish momentum after ECB comments)"
                rows={3}
              />
            </div>
            
            {/* Risk Reward Display */}
            {formData.entryPrice && formData.stopLoss && formData.takeProfits[0]?.price && (
              <Alert>
                <BarChart3 className="w-4 h-4" />
                <AlertDescription>
                  Risk/Reward Ratio: <strong>{calculateRiskReward().toFixed(2)}:1</strong>
                  {calculateRiskReward() < 1.5 && " - Consider improving your R:R ratio"}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Price Levels */}
          <TabsContent value="levels" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold" style={{ color: COLORS.dark }}>
                Take Profit Levels
              </h3>
              <Button size="sm" onClick={addTakeProfit} variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Level
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.takeProfits.map((tp, index) => (
                <div key={tp.id} className="p-4 border rounded-lg" style={{ borderColor: COLORS.lightGray }}>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="font-medium">Take Profit {tp.level}</Label>
                    {formData.takeProfits.length > 1 && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeTakeProfit(index)}
                        className="text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Price Level</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={tp.price || ""}
                        onChange={(e) => handleTakeProfitChange(index, "price", parseFloat(e.target.value) || 0)}
                        placeholder="1.0900"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Position Size %</Label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={tp.percentage}
                        onChange={(e) => handleTakeProfitChange(index, "percentage", parseInt(e.target.value) || 0)}
                        placeholder="50"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Label className="text-sm">Description (Optional)</Label>
                    <Input
                      value={tp.description || ""}
                      onChange={(e) => handleTakeProfitChange(index, "description", e.target.value)}
                      placeholder="e.g. First target - resistance level"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: COLORS.dark }}>
                  Total Position Allocation
                </span>
                <span 
                  className={`font-bold ${totalPercentage === 100 ? "text-green-600" : "text-orange-600"}`}
                >
                  {totalPercentage}%
                </span>
              </div>
              {totalPercentage !== 100 && (
                <p className="text-sm text-orange-600 mt-1">
                  Warning: Total should equal 100% for complete position closure
                </p>
              )}
            </div>
          </TabsContent>

          {/* Analysis */}
          <TabsContent value="analysis" className="space-y-4">
            <div>
              <Label htmlFor="analysis">Detailed Analysis</Label>
              <Textarea
                id="analysis"
                value={formData.analysis}
                onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
                placeholder="Provide detailed technical and fundamental analysis for this signal..."
                rows={8}
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                {formData.analysis.length}/1000 characters
              </p>
            </div>
            
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 flex-wrap mt-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="cursor-pointer hover:bg-red-50"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag (e.g. ECB, Breakout, NFP)..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button size="sm" onClick={addTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Chart */}
          <TabsContent value="chart" className="space-y-4">
            <div>
              <Label>Chart Image</Label>
              <div className="mt-2">
                {formData.chartImage ? (
                  <div className="relative">
                    <img 
                      src={formData.chartImage} 
                      alt="Signal Chart" 
                      className="w-full h-64 object-cover rounded-lg border"
                      style={{ borderColor: COLORS.lightGray }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-white"
                      onClick={() => setFormData({ ...formData, chartImage: "" })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    style={{ borderColor: COLORS.lightGray }}
                    onClick={handleChartUpload}
                  >
                    {isUploadingChart ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="w-5 h-5" />
                        </motion.div>
                        <span>Uploading chart...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8" style={{ color: COLORS.dark + "40" }} />
                        <span className="text-sm" style={{ color: COLORS.dark + "60" }}>
                          Click to upload chart image
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="chartDescription">Chart Description</Label>
              <Textarea
                id="chartDescription"
                value={formData.chartDescription}
                onChange={(e) => setFormData({ ...formData, chartDescription: e.target.value })}
                placeholder="Describe what the chart shows (e.g. 4H chart showing bullish breakout above key resistance with volume confirmation)"
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select 
                  value={formData.riskLevel} 
                  onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, riskLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sessionType">Trading Session</Label>
                <Select 
                  value={formData.sessionType} 
                  onValueChange={(value: keyof typeof TRADING_SESSIONS) => setFormData({ ...formData, sessionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRADING_SESSIONS).map(([key, session]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: session.color }}
                          />
                          <span>{session.name}</span>
                          <span className="text-xs text-gray-500">({session.time})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confidence">Confidence Level: {formData.confidence}%</Label>
              <input
                type="range"
                id="confidence"
                min="0"
                max="100"
                value={formData.confidence}
                onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                <span>Low Confidence</span>
                <span>High Confidence</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleSave(true)}
            disabled={!formData.pair || !formData.entryPrice || !formData.stopLoss || isSaving}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save as Draft
          </Button>
          <Button 
            onClick={() => handleSave(false)}
            disabled={!formData.pair || !formData.entryPrice || !formData.stopLoss || isSaving}
            style={{ backgroundColor: COLORS.primary }}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-1" />
            )}
            Publish Signal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SignalCenter() {
  const [signals, setSignals] = useState<Signal[]>(mockSignals);
  const [showForm, setShowForm] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Signal | undefined>(undefined);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateSignal = () => {
    setEditingSignal(undefined);
    setShowForm(true);
  };

  const handleEditSignal = (signal: Signal) => {
    setEditingSignal(signal);
    setShowForm(true);
  };

  const handleSaveSignal = (signalData: Partial<Signal>) => {
    if (editingSignal) {
      // Update existing signal
      setSignals(prev => prev.map(sig => 
        sig.id === editingSignal.id 
          ? { ...sig, ...signalData }
          : sig
      ));
    } else {
      // Create new signal
      const newSignal: Signal = {
        id: `SIG-${Date.now()}`,
        currentPrice: parseFloat(signalData.entryPrice?.toString() || "0"),
        pips: 0,
        percentage: 0,
        openTime: "Just now",
        timeInTrade: "0m",
        ...signalData
      } as Signal;
      setSignals(prev => [newSignal, ...prev]);
    }
  };

  const handleDeleteSignal = (id: string) => {
    setSignals(prev => prev.filter(sig => sig.id !== id));
  };

  const handlePublishSignal = (id: string) => {
    setSignals(prev => prev.map(sig => 
      sig.id === id 
        ? { ...sig, status: "active" as const, publishedAt: new Date() }
        : sig
    ));
  };

  const handleDuplicateSignal = (signal: Signal) => {
    const duplicatedSignal: Signal = {
      ...signal,
      id: `SIG-${Date.now()}`,
      status: "draft",
      createdAt: new Date(),
      publishedAt: undefined,
      openTime: "Just now",
      timeInTrade: "0m"
    };
    setSignals(prev => [duplicatedSignal, ...prev]);
  };

  const filteredSignals = signals.filter(signal => {
    if (filter !== "all" && signal.status !== filter) return false;
    if (searchTerm && !signal.pair.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const statusCounts = {
    all: signals.length,
    active: signals.filter(s => s.status === "active").length,
    draft: signals.filter(s => s.status === "draft").length,
    closed: signals.filter(s => s.status === "closed").length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            Signal Center
          </h2>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            Create, manage, and publish your trading signals with multi-level take profits
          </p>
        </div>
        
        <Button 
          onClick={handleCreateSignal}
          className="gap-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4" />
          Create Signal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <Target className="w-5 h-5" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                {statusCounts.all}
              </p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                Total Signals
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                Active Signals
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.draft}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                Draft Signals
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.closed}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                Closed Signals
              </p>
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
            <option value="all">All Signals ({statusCounts.all})</option>
            <option value="active">Active ({statusCounts.active})</option>
            <option value="draft">Drafts ({statusCounts.draft})</option>
            <option value="closed">Closed ({statusCounts.closed})</option>
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
        <AnimatePresence>
          {filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onEdit={handleEditSignal}
              onDelete={handleDeleteSignal}
              onPublish={handlePublishSignal}
              onDuplicate={handleDuplicateSignal}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredSignals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
          <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
            {filter === "all" ? "No signals yet" : `No ${filter} signals`}
          </h3>
          <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
            {filter === "all" 
              ? "Create your first trading signal with multi-level take profits"
              : `No ${filter} signals found. Try adjusting your filters.`
            }
          </p>
          {filter === "all" && (
            <Button 
              onClick={handleCreateSignal}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Your First Signal
            </Button>
          )}
        </div>
      )}

      {/* Signal Form Dialog */}
      <SignalForm
        signal={editingSignal}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingSignal(undefined);
        }}
        onSave={handleSaveSignal}
      />
    </div>
  );
}