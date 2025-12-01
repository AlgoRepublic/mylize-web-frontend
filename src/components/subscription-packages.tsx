import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Star, 
  Crown, 
  Zap,
  Check,
  X,
  Eye,
  EyeOff,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Award,
  Shield,
  Activity,
  BarChart3,
  Settings,
  Copy,
  ExternalLink,
  Package,
  Gift,
  Percent,
  AlertCircle,
  Save,
  RefreshCw
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface PackageFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  highlight?: boolean;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing: "monthly" | "yearly" | "quarterly";
  tier: "basic" | "premium" | "vip";
  isActive: boolean;
  isPopular?: boolean;
  features: PackageFeature[];
  subscriberCount: number;
  monthlyRevenue: number;
  conversionRate: number;
  createdDate: Date;
  lastModified: Date;
  trialDays?: number;
  maxSignals?: number;
  priority: number;
}

interface PackageAnalytics {
  totalRevenue: number;
  totalSubscribers: number;
  averageRevenuePer: number;
  conversionRate: number;
  churnRate: number;
  growthRate: number;
}

const commonFeatures: PackageFeature[] = [
  { id: "signals", name: "Trading Signals", description: "Real-time trading signals", included: true },
  { id: "analysis", name: "Market Analysis", description: "Daily market insights", included: true },
  { id: "support", name: "Customer Support", description: "Email support", included: true },
  { id: "mobile", name: "Mobile Access", description: "Mobile app access", included: true },
  { id: "alerts", name: "Price Alerts", description: "Custom price notifications", included: false },
  { id: "priority", name: "Priority Support", description: "24/7 priority support", included: false, highlight: true },
  { id: "consultation", name: "1-on-1 Consultation", description: "Personal trading consultation", included: false, highlight: true },
  { id: "research", name: "Premium Research", description: "Detailed research reports", included: false },
  { id: "webinars", name: "Live Webinars", description: "Weekly live trading sessions", included: false, highlight: true },
  { id: "discord", name: "Private Discord", description: "VIP Discord community", included: false, highlight: true },
  { id: "early", name: "Early Access", description: "Early access to new features", included: false },
  { id: "custom", name: "Custom Indicators", description: "Personalized trading indicators", included: false, highlight: true }
];

const mockPackages: SubscriptionPackage[] = [
  {
    id: "pkg-1",
    name: "Starter",
    description: "Perfect for beginners starting their trading journey",
    price: 29,
    currency: "USD",
    billing: "monthly",
    tier: "basic",
    isActive: true,
    features: commonFeatures.map(f => ({ 
      ...f, 
      included: ["signals", "analysis", "support", "mobile"].includes(f.id) 
    })),
    subscriberCount: 234,
    monthlyRevenue: 6786,
    conversionRate: 12.5,
    createdDate: new Date("2024-01-15"),
    lastModified: new Date("2024-01-20"),
    trialDays: 7,
    maxSignals: 5,
    priority: 1
  },
  {
    id: "pkg-2",
    name: "Professional",
    description: "Advanced features for serious traders",
    price: 79,
    currency: "USD",
    billing: "monthly",
    tier: "premium",
    isActive: true,
    isPopular: true,
    features: commonFeatures.map(f => ({ 
      ...f, 
      included: !["consultation", "discord", "custom"].includes(f.id) 
    })),
    subscriberCount: 456,
    monthlyRevenue: 36024,
    conversionRate: 18.3,
    createdDate: new Date("2024-01-10"),
    lastModified: new Date("2024-01-18"),
    trialDays: 14,
    maxSignals: 20,
    priority: 2
  },
  {
    id: "pkg-3",
    name: "VIP Elite",
    description: "Exclusive access with premium benefits",
    price: 199,
    currency: "USD",
    billing: "monthly",
    tier: "vip",
    isActive: true,
    features: commonFeatures.map(f => ({ ...f, included: true })),
    subscriberCount: 89,
    monthlyRevenue: 17711,
    conversionRate: 25.7,
    createdDate: new Date("2024-01-05"),
    lastModified: new Date("2024-01-16"),
    trialDays: 21,
    priority: 3
  }
];

const mockAnalytics: PackageAnalytics = {
  totalRevenue: 60521,
  totalSubscribers: 779,
  averageRevenuePer: 77.74,
  conversionRate: 16.8,
  churnRate: 8.2,
  growthRate: 23.5
};

function PackageCard({ 
  package: pkg, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onDuplicate 
}: { 
  package: SubscriptionPackage;
  onEdit: (pkg: SubscriptionPackage) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDuplicate: (pkg: SubscriptionPackage) => void;
}) {
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "basic": return <Package className="w-5 h-5" />;
      case "premium": return <Star className="w-5 h-5" />;
      case "vip": return <Crown className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "basic": return "#10B981";
      case "premium": return "#3B82F6";
      case "vip": return "#8B5CF6";
      default: return COLORS.primary;
    }
  };

  const includedFeatures = pkg.features.filter(f => f.included);
  const highlightFeatures = includedFeatures.filter(f => f.highlight);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={`relative bg-white rounded-xl p-6 border shadow-lg transition-all duration-300 ${
        pkg.isPopular ? 'ring-2 ring-blue-200' : ''
      } ${!pkg.isActive ? 'opacity-60' : ''}`}
      style={{ borderColor: pkg.isPopular ? "#3B82F6" : COLORS.lightGray }}
    >
      {/* Popular Badge */}
      {pkg.isPopular && (
        <div 
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: "#3B82F6" }}
        >
          Most Popular
        </div>
      )}

      {/* Status Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: getTierColor(pkg.tier) + "20",
              color: getTierColor(pkg.tier)
            }}
          >
            {getTierIcon(pkg.tier)}
          </div>
          <Badge 
            variant="outline"
            className="capitalize"
            style={{ 
              borderColor: getTierColor(pkg.tier) + "40",
              color: getTierColor(pkg.tier)
            }}
          >
            {pkg.tier}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={pkg.isActive}
            onCheckedChange={() => onToggleStatus(pkg.id)}
          />
          <span className="text-xs" style={{ color: COLORS.dark + "60" }}>
            {pkg.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Package Info */}
      <div className="mb-6">
        <h3 className="text-xl font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
          {pkg.name}
        </h3>
        <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
          {pkg.description}
        </p>
        
        {/* Pricing */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-sans font-bold" style={{ color: COLORS.dark }}>
            ${pkg.price}
          </span>
          <span className="text-sm" style={{ color: COLORS.dark + "60" }}>
            /{pkg.billing}
          </span>
        </div>
        
        {pkg.trialDays && (
          <Badge variant="outline" className="text-xs">
            {pkg.trialDays} days free trial
          </Badge>
        )}
      </div>

      {/* Key Features */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3" style={{ color: COLORS.dark }}>
          Key Features ({includedFeatures.length})
        </h4>
        <div className="space-y-2">
          {includedFeatures.slice(0, 4).map((feature) => (
            <div key={feature.id} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm" style={{ color: COLORS.dark + "80" }}>
                {feature.name}
                {feature.highlight && (
                  <Badge variant="outline" className="ml-2 text-xs border-orange-300 text-orange-600">
                    Premium
                  </Badge>
                )}
              </span>
            </div>
          ))}
          {includedFeatures.length > 4 && (
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              +{includedFeatures.length - 4} more features
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-sans font-semibold" style={{ color: COLORS.dark }}>
            {pkg.subscriberCount}
          </div>
          <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
            Subscribers
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-sans font-semibold" style={{ color: COLORS.primary }}>
            ${pkg.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
            Revenue
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-sans font-semibold text-green-600">
            {pkg.conversionRate}%
          </div>
          <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
            Conversion
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          onClick={() => onEdit(pkg)}
          style={{ backgroundColor: COLORS.primary }}
          className="flex-1"
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onDuplicate(pkg)}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onDelete(pkg.id)}
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Last Modified */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.dark + "60" }}>
          <Clock className="w-3 h-3" />
          <span>Modified {pkg.lastModified.toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}

function PackageEditor({ 
  package: pkg, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  package?: SubscriptionPackage; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (pkg: Partial<SubscriptionPackage>) => void; 
}) {
  const [formData, setFormData] = useState<Partial<SubscriptionPackage>>(
    pkg || {
      name: "",
      description: "",
      price: 0,
      currency: "USD",
      billing: "monthly",
      tier: "basic",
      isActive: true,
      features: commonFeatures.map(f => ({ ...f, included: false })),
      trialDays: 7,
      priority: 1
    }
  );

  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);

  const handleFeatureToggle = (featureId: string, included: boolean) => {
    const updatedFeatures = formData.features?.map(f => 
      f.id === featureId ? { ...f, included } : f
    ) || [];
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(formData);
    setIsSaving(false);
    onClose();
  };

  const includedFeatures = formData.features?.filter(f => f.included) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" style={{ color: COLORS.primary }} />
            {pkg ? "Edit Package" : "Create New Package"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Professional"
                />
              </div>
              
              <div>
                <Label htmlFor="tier">Tier Level</Label>
                <Select 
                  value={formData.tier} 
                  onValueChange={(value: "basic" | "premium" | "vip") => 
                    setFormData({ ...formData, tier: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this package offers..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trialDays">Free Trial Days</Label>
                <Input
                  id="trialDays"
                  type="number"
                  value={formData.trialDays || 0}
                  onChange={(e) => setFormData({ ...formData, trialDays: parseInt(e.target.value) })}
                  min="0"
                  max="30"
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Display Priority</Label>
                <Select 
                  value={formData.priority?.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Highest</SelectItem>
                    <SelectItem value="2">2 - High</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="billing">Billing Cycle</Label>
                <Select 
                  value={formData.billing} 
                  onValueChange={(value: "monthly" | "yearly" | "quarterly") => 
                    setFormData({ ...formData, billing: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Alert>
              <DollarSign className="w-4 h-4" />
              <AlertDescription>
                Pricing strategy tip: Consider offering discounts for yearly subscriptions to improve retention.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold" style={{ color: COLORS.dark }}>
                Package Features
              </h3>
              <Badge variant="outline">
                {includedFeatures.length} features selected
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonFeatures.map((feature) => {
                const isIncluded = formData.features?.find(f => f.id === feature.id)?.included || false;
                return (
                  <div key={feature.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Switch
                      checked={isIncluded}
                      onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: COLORS.dark }}>
                          {feature.name}
                        </span>
                        {feature.highlight && (
                          <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Preview */}
          <TabsContent value="preview" className="space-y-4">
            <h3 className="text-lg font-serif font-semibold" style={{ color: COLORS.dark }}>
              Package Preview
            </h3>
            
            <div className="max-w-sm mx-auto">
              <div className="bg-white rounded-xl p-6 border shadow-lg" style={{ borderColor: COLORS.lightGray }}>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
                    {formData.name || "Package Name"}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
                    {formData.description || "Package description"}
                  </p>
                  
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-3xl font-sans font-bold" style={{ color: COLORS.dark }}>
                      ${formData.price || 0}
                    </span>
                    <span className="text-sm" style={{ color: COLORS.dark + "60" }}>
                      /{formData.billing}
                    </span>
                  </div>
                  
                  {formData.trialDays && formData.trialDays > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {formData.trialDays} days free trial
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2 mb-6">
                  {includedFeatures.slice(0, 6).map((feature) => (
                    <div key={feature.id} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm" style={{ color: COLORS.dark + "80" }}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                  {includedFeatures.length > 6 && (
                    <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
                      +{includedFeatures.length - 6} more features
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Choose Plan
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name || !formData.price || isSaving}
            style={{ backgroundColor: COLORS.primary }}
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
              </motion.div>
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            {isSaving ? "Saving..." : pkg ? "Update Package" : "Create Package"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsOverview({ analytics }: { analytics: PackageAnalytics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary + "20" }}
          >
            <DollarSign className="w-6 h-6" style={{ color: COLORS.primary }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
              Total Revenue
            </p>
            <p className="text-2xl font-sans font-bold" style={{ color: COLORS.dark }}>
              ${analytics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-600">
              +{analytics.growthRate}% this month
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#3B82F6" + "20" }}
          >
            <Users className="w-6 h-6" style={{ color: "#3B82F6" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
              Total Subscribers
            </p>
            <p className="text-2xl font-sans font-bold" style={{ color: COLORS.dark }}>
              {analytics.totalSubscribers.toLocaleString()}
            </p>
            <p className="text-xs text-green-600">
              Active subscriptions
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#10B981" + "20" }}
          >
            <Target className="w-6 h-6" style={{ color: "#10B981" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
              Conversion Rate
            </p>
            <p className="text-2xl font-sans font-bold" style={{ color: COLORS.dark }}>
              {analytics.conversionRate}%
            </p>
            <p className="text-xs text-green-600">
              Above industry average
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#8B5CF6" + "20" }}
          >
            <BarChart3 className="w-6 h-6" style={{ color: "#8B5CF6" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
              Avg Revenue Per User
            </p>
            <p className="text-2xl font-sans font-bold" style={{ color: COLORS.dark }}>
              ${analytics.averageRevenuePer}
            </p>
            <p className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Per month
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#F59E0B" + "20" }}
          >
            <TrendingUp className="w-6 h-6" style={{ color: "#F59E0B" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
              Growth Rate
            </p>
            <p className="text-2xl font-sans font-bold" style={{ color: COLORS.dark }}>
              +{analytics.growthRate}%
            </p>
            <p className="text-xs text-green-600">
              Monthly growth
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#EF4444" + "20" }}
          >
            <Activity className="w-6 h-6" style={{ color: "#EF4444" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
              Churn Rate
            </p>
            <p className="text-2xl font-sans font-bold" style={{ color: COLORS.dark }}>
              {analytics.churnRate}%
            </p>
            <p className="text-xs text-red-600">
              Monthly churn
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function SubscriptionPackages() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>(mockPackages);
  const [analytics, setAnalytics] = useState<PackageAnalytics>(mockAnalytics);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCreatePackage = () => {
    setEditingPackage(undefined);
    setShowEditor(true);
  };

  const handleEditPackage = (pkg: SubscriptionPackage) => {
    setEditingPackage(pkg);
    setShowEditor(true);
  };

  const handleSavePackage = (packageData: Partial<SubscriptionPackage>) => {
    if (editingPackage) {
      // Update existing package
      setPackages(prev => prev.map(pkg => 
        pkg.id === editingPackage.id 
          ? { ...pkg, ...packageData, lastModified: new Date() }
          : pkg
      ));
    } else {
      // Create new package
      const newPackage: SubscriptionPackage = {
        id: `pkg-${Date.now()}`,
        subscriberCount: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
        createdDate: new Date(),
        lastModified: new Date(),
        ...packageData
      } as SubscriptionPackage;
      setPackages(prev => [...prev, newPackage]);
    }
  };

  const handleDeletePackage = (id: string) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
    ));
  };

  const handleDuplicatePackage = (pkg: SubscriptionPackage) => {
    const duplicatedPackage: SubscriptionPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      name: `${pkg.name} Copy`,
      subscriberCount: 0,
      monthlyRevenue: 0,
      conversionRate: 0,
      createdDate: new Date(),
      lastModified: new Date(),
      isActive: false
    };
    setPackages(prev => [...prev, duplicatedPackage]);
  };

  const activePackages = packages.filter(pkg => pkg.isActive);
  const inactivePackages = packages.filter(pkg => !pkg.isActive);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            Subscription Packages
          </h2>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            Create and manage subscription tiers to monetize your analysis services
          </p>
        </div>
        
        <Button 
          onClick={handleCreatePackage}
          className="gap-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4" />
          Create Package
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="packages">Packages ({packages.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <AnalyticsOverview analytics={analytics} />
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
                Package Performance
              </h3>
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pkg.isActive ? "#10B981" : "#EF4444" }}
                      />
                      <span className="text-sm font-medium" style={{ color: COLORS.dark }}>
                        {pkg.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                        ${pkg.monthlyRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
                        {pkg.subscriberCount} subscribers
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: COLORS.dark }}>
                      New subscriber to Professional plan
                    </p>
                    <p className="text-xs" style={{ color: COLORS.dark + "60" }}>
                      2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: COLORS.dark }}>
                      VIP Elite package updated
                    </p>
                    <p className="text-xs" style={{ color: COLORS.dark + "60" }}>
                      1 hour ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: COLORS.dark }}>
                      Starter package trial expired
                    </p>
                    <p className="text-xs" style={{ color: COLORS.dark + "60" }}>
                      3 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-6">
          {/* Active Packages */}
          {activePackages.length > 0 && (
            <div>
              <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
                Active Packages ({activePackages.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {activePackages
                    .sort((a, b) => a.priority - b.priority)
                    .map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      package={pkg}
                      onEdit={handleEditPackage}
                      onDelete={handleDeletePackage}
                      onToggleStatus={handleToggleStatus}
                      onDuplicate={handleDuplicatePackage}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Inactive Packages */}
          {inactivePackages.length > 0 && (
            <div>
              <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
                Inactive Packages ({inactivePackages.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {inactivePackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      package={pkg}
                      onEdit={handleEditPackage}
                      onDelete={handleDeletePackage}
                      onToggleStatus={handleToggleStatus}
                      onDuplicate={handleDuplicatePackage}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Empty State */}
          {packages.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
              <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
                No packages yet
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
                Create your first subscription package to start monetizing your analysis services.
              </p>
              <Button 
                onClick={handleCreatePackage}
                style={{ backgroundColor: COLORS.primary }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Create First Package
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsOverview analytics={analytics} />
          
          <Alert>
            <BarChart3 className="w-4 h-4" />
            <AlertDescription>
              Detailed analytics charts and reports are coming soon. You'll be able to track conversion funnels, 
              subscriber lifetime value, and package performance over time.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Package Editor Dialog */}
      <PackageEditor
        package={editingPackage}
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingPackage(undefined);
        }}
        onSave={handleSavePackage}
      />
    </div>
  );
}