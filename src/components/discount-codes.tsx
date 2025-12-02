import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Gift,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  Users,
  DollarSign,
  Percent,
  Target,
  TrendingUp,
  Search,
  Filter,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Star,
  Crown,
  Shield,
  Award,
  Hash,
  Settings,
  MoreHorizontal,
  RefreshCw,
  Share2,
  QrCode,
  Send,
  Tag,
  Sparkles,
  Activity,
  MessageSquare,
  Bell,
  ExternalLink,
  Upload,
  FileText,
  Calendar as CalendarIcon,
  Timer,
  Coins,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface DiscountCode {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  applicablePackages: string[];
  createdAt: Date;
  updatedAt: Date;
  revenue: number;
  customersSaved: string[];
  conversionRate: number;
  tier?: "basic" | "premium" | "vip";
}

interface CodeTemplate {
  id: string;
  name: string;
  codePattern: string;
  description: string;
  defaultType: "percentage" | "fixed_amount";
  defaultValue: number;
  category: string;
}

interface DiscountAnalytics {
  totalCodes: number;
  activeCodes: number;
  totalRevenue: number;
  totalSavings: number;
  averageConversion: number;
  topPerformingCode: string;
  usageByPackage: { packageId: string; usage: number }[];
  dailyUsage: { date: string; usage: number }[];
}

const mockDiscountCodes: DiscountCode[] = [
  {
    id: "dc-001",
    code: "WELCOME25",
    name: "Welcome Offer",
    description: "25% off for new subscribers",
    type: "percentage",
    value: 25,
    minPurchase: 50,
    maxDiscount: 100,
    usageLimit: 100,
    usedCount: 34,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    isActive: true,
    applicablePackages: ["basic", "premium"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    revenue: 2450,
    customersSaved: Array.from({length: 34}, (_, i) => `cust-${i + 1}`),
    conversionRate: 68,
    tier: "basic"
  },
  {
    id: "dc-002",
    code: "PREMIUM50",
    name: "Premium Launch",
    description: "$50 off premium subscriptions",
    type: "fixed_amount",
    value: 50,
    minPurchase: 200,
    usageLimit: 50,
    usedCount: 23,
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    isActive: true,
    applicablePackages: ["premium", "vip"],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    revenue: 3450,
    customersSaved: Array.from({length: 23}, (_, i) => `cust-${i + 35}`),
    conversionRate: 85,
    tier: "premium"
  },
  {
    id: "dc-003",
    code: "FLASH15",
    name: "Flash Sale",
    description: "Limited time 15% discount",
    type: "percentage",
    value: 15,
    usageLimit: 200,
    usedCount: 156,
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    isActive: true,
    applicablePackages: ["basic", "premium", "vip"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    revenue: 1890,
    customersSaved: Array.from({length: 156}, (_, i) => `cust-${i + 58}`),
    conversionRate: 92,
    tier: "basic"
  }
];

const codeTemplates: CodeTemplate[] = [
  {
    id: "tpl-001",
    name: "Welcome Series",
    codePattern: "WELCOME{XX}",
    description: "For new subscriber onboarding",
    defaultType: "percentage",
    defaultValue: 20,
    category: "Onboarding"
  },
  {
    id: "tpl-002",
    name: "Premium Launch",
    codePattern: "PREMIUM{XX}",
    description: "Premium package promotions",
    defaultType: "fixed_amount",
    defaultValue: 50,
    category: "Premium"
  },
  {
    id: "tpl-003",
    name: "Flash Sales",
    codePattern: "FLASH{XX}",
    description: "Limited time offers",
    defaultType: "percentage",
    defaultValue: 15,
    category: "Flash"
  },
  {
    id: "tpl-004",
    name: "VIP Exclusive",
    codePattern: "VIP{XXX}",
    description: "Exclusive VIP offers",
    defaultType: "percentage",
    defaultValue: 30,
    category: "VIP"
  }
];

const mockAnalytics: DiscountAnalytics = {
  totalCodes: 15,
  activeCodes: 8,
  totalRevenue: 12450,
  totalSavings: 3240,
  averageConversion: 78,
  topPerformingCode: "FLASH15",
  usageByPackage: [
    { packageId: "basic", usage: 145 },
    { packageId: "premium", usage: 89 },
    { packageId: "vip", usage: 34 }
  ],
  dailyUsage: [
    { date: "2024-01-15", usage: 23 },
    { date: "2024-01-16", usage: 34 },
    { date: "2024-01-17", usage: 45 },
    { date: "2024-01-18", usage: 67 },
    { date: "2024-01-19", usage: 89 },
    { date: "2024-01-20", usage: 76 },
    { date: "2024-01-21", usage: 54 }
  ]
};

function CreateDiscountCodeDialog({ 
  onCreateCode, 
  templates 
}: { 
  onCreateCode: (code: Partial<DiscountCode>) => void;
  templates: CodeTemplate[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    type: "percentage" as "percentage" | "fixed_amount",
    value: 10,
    minPurchase: 0,
    maxDiscount: 0,
    usageLimit: 100,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    applicablePackages: [] as string[],
    tier: "basic" as "basic" | "premium" | "vip"
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("custom");
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);

  const generateCode = (template?: CodeTemplate) => {
    if (template) {
      const pattern = template.codePattern;
      const randomPart = Math.random().toString(36).substring(2, 4).toUpperCase();
      return pattern.replace(/\{XX?\}/g, randomPart);
    } else {
      return `CODE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "custom") {
      setSelectedTemplate("custom");
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        name: template.name,
        code: generateCode(template),
        description: template.description,
        type: template.defaultType,
        value: template.defaultValue
      }));
    }
    setSelectedTemplate(templateId);
  };

  const handleSubmit = () => {
    if (isGeneratingBulk) {
      // Generate multiple codes
      for (let i = 0; i < bulkCount; i++) {
        const template = selectedTemplate !== "custom" ? templates.find(t => t.id === selectedTemplate) : undefined;
        onCreateCode({
          ...formData,
          code: generateCode(template),
          name: `${formData.name} ${i + 1}`,
          startDate: new Date(formData.startDate),
          endDate: formData.endDate ? new Date(formData.endDate) : undefined,
          isActive: true,
          usedCount: 0,
          revenue: 0,
          customersSaved: [],
          conversionRate: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      toast.success(`Generated ${bulkCount} discount codes successfully!`);
    } else {
      onCreateCode({
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        isActive: true,
        usedCount: 0,
        revenue: 0,
        customersSaved: [],
        conversionRate: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success("Discount code created successfully!");
    }
    
    setIsOpen(false);
    setFormData({
      name: "",
      code: "",
      description: "",
      type: "percentage",
      value: 10,
      minPurchase: 0,
      maxDiscount: 0,
      usageLimit: 100,
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      applicablePackages: [],
      tier: "basic"
    });
    setSelectedTemplate("custom");
    setIsGeneratingBulk(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip": return "#8B5CF6";
      case "premium": return "#F59E0B";
      default: return "#3B82F6";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: COLORS.primary }} type="button">
          <Plus className="w-4 h-4 mr-2" />
          Create Discount Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
            Create New Discount Code
          </DialogTitle>
          <DialogDescription>
            Create single or multiple discount codes for your subscription packages
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Bulk Generation Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">Bulk Generation</Label>
              <p className="text-sm text-gray-600">Generate multiple codes at once</p>
            </div>
            <Switch
              checked={isGeneratingBulk}
              onCheckedChange={setIsGeneratingBulk}
            />
          </div>

          {isGeneratingBulk && (
            <div className="space-y-3">
              <Label>Number of Codes</Label>
              <Input
                type="number"
                value={bulkCount}
                onChange={(e) => setBulkCount(Number(e.target.value))}
                min={1}
                max={100}
              />
            </div>
          )}

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Code Template (Optional)</Label>
            <Select value={selectedTemplate || "custom"} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template or create custom" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Code</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <span>{template.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Code Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g., Welcome Offer"
              />
            </div>
            <div className="space-y-3">
              <Label>Discount Code</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({...prev, code: e.target.value.toUpperCase()}))}
                  placeholder="e.g., WELCOME25"
                />
                <Button
                  variant="outline"
                  onClick={() => setFormData(prev => ({...prev, code: generateCode()}))}
                  className="px-3"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              placeholder="Describe this discount code..."
              rows={2}
            />
          </div>

          {/* Discount Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Discount Type</Label>
              <Select value={formData.type} onValueChange={(value: "percentage" | "fixed_amount") => setFormData(prev => ({...prev, type: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Discount Value</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({...prev, value: Number(e.target.value)}))}
                  min={0}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {formData.type === "percentage" ? "%" : "$"}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label>Minimum Purchase ($)</Label>
              <Input
                type="number"
                value={formData.minPurchase}
                onChange={(e) => setFormData(prev => ({...prev, minPurchase: Number(e.target.value)}))}
                min={0}
              />
            </div>
            {formData.type === "percentage" && (
              <div className="space-y-3">
                <Label>Max Discount ($)</Label>
                <Input
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData(prev => ({...prev, maxDiscount: Number(e.target.value)}))}
                  min={0}
                />
              </div>
            )}
            <div className="space-y-3">
              <Label>Usage Limit</Label>
              <Input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData(prev => ({...prev, usageLimit: Number(e.target.value)}))}
                min={1}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({...prev, startDate: e.target.value}))}
              />
            </div>
            <div className="space-y-3">
              <Label>End Date (Optional)</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({...prev, endDate: e.target.value}))}
              />
            </div>
          </div>

          {/* Package Selection */}
          <div className="space-y-3">
            <Label>Applicable Packages</Label>
            <div className="flex flex-wrap gap-2">
              {["basic", "premium", "vip"].map((pkg) => (
                <Button
                  key={pkg}
                  variant={formData.applicablePackages.includes(pkg) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      applicablePackages: prev.applicablePackages.includes(pkg)
                        ? prev.applicablePackages.filter(p => p !== pkg)
                        : [...prev.applicablePackages, pkg]
                    }));
                  }}
                  style={formData.applicablePackages.includes(pkg) ? { backgroundColor: getTierColor(pkg) } : {}}
                >
                  {pkg.charAt(0).toUpperCase() + pkg.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Tier Selection */}
          <div className="space-y-3">
            <Label>Priority Tier</Label>
            <Select value={formData.tier} onValueChange={(value: "basic" | "premium" | "vip") => setFormData(prev => ({...prev, tier: value}))}>
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

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              style={{ backgroundColor: COLORS.primary }}
              disabled={!formData.name || !formData.code}
            >
              {isGeneratingBulk ? `Generate ${bulkCount} Codes` : "Create Code"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DiscountCodeCard({ 
  code, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onCopyCode,
  onViewAnalytics 
}: { 
  code: DiscountCode;
  onEdit: (code: DiscountCode) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onCopyCode: (code: string) => void;
  onViewAnalytics: (code: DiscountCode) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatValue = (type: string, value: number) => {
    return type === "percentage" ? `${value}%` : `$${value}`;
  };

  const getStatusColor = (isActive: boolean, endDate?: Date) => {
    if (!isActive) return "#6B7280";
    if (endDate && endDate < new Date()) return "#EF4444";
    return "#10B981";
  };

  const getStatusText = (isActive: boolean, endDate?: Date) => {
    if (!isActive) return "Inactive";
    if (endDate && endDate < new Date()) return "Expired";
    return "Active";
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "vip": return "#8B5CF6";
      case "premium": return "#F59E0B";
      default: return "#3B82F6";
    }
  };

  const usagePercentage = code.usageLimit ? (code.usedCount / code.usageLimit) * 100 : 0;

  return (
    <motion.div
      className="bg-white rounded-xl border shadow-sm overflow-hidden"
      style={{ borderColor: COLORS.lightGray }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-serif font-semibold text-lg" style={{ color: COLORS.dark }}>
                {code.name}
              </h3>
              <Badge 
                className="text-xs"
                style={{ 
                  backgroundColor: getStatusColor(code.isActive, code.endDate) + "20",
                  color: getStatusColor(code.isActive, code.endDate)
                }}
              >
                {getStatusText(code.isActive, code.endDate)}
              </Badge>
              {code.tier && (
                <Badge 
                  variant="outline"
                  className="text-xs"
                  style={{ 
                    borderColor: getTierColor(code.tier) + "40",
                    color: getTierColor(code.tier)
                  }}
                >
                  {code.tier.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                <span className="font-mono font-bold text-sm" style={{ color: COLORS.dark }}>
                  {code.code}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-1"
                  onClick={() => onCopyCode(code.code)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex items-center gap-1 text-sm" style={{ color: COLORS.primary }}>
                {code.type === "percentage" ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                <span className="font-semibold">{formatValue(code.type, code.value)} OFF</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{code.description}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: COLORS.dark }}>
                  {code.usedCount}
                </div>
                <div className="text-xs text-gray-500">Used</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: COLORS.primary }}>
                  ${code.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {code.conversionRate}%
                </div>
                <div className="text-xs text-gray-500">Conversion</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {code.customersSaved.length}
                </div>
                <div className="text-xs text-gray-500">Customers</div>
              </div>
            </div>

            {/* Usage Progress */}
            {code.usageLimit && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Usage Progress</span>
                  <span>{code.usedCount} / {code.usageLimit}</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewAnalytics(code)}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(code)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onToggleStatus(code.id)}
            >
              {code.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(code.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 pt-4 mt-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Configuration</h4>
                  <div className="space-y-1 text-gray-600">
                    {code.minPurchase && <div>Min Purchase: ${code.minPurchase}</div>}
                    {code.maxDiscount && <div>Max Discount: ${code.maxDiscount}</div>}
                    <div>Start: {code.startDate.toLocaleDateString()}</div>
                    {code.endDate && <div>End: {code.endDate.toLocaleDateString()}</div>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Applicable Packages</h4>
                  <div className="flex flex-wrap gap-1">
                    {code.applicablePackages.map((pkg) => (
                      <Badge key={pkg} variant="outline" className="text-xs">
                        {pkg.charAt(0).toUpperCase() + pkg.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function DiscountCodes() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(mockDiscountCodes);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { t } = useTranslation();

  const filteredCodes = discountCodes.filter(code => {
    const matchesSearch = code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && code.isActive) ||
                         (statusFilter === "inactive" && !code.isActive) ||
                         (statusFilter === "expired" && code.endDate && code.endDate < new Date());
    const matchesType = typeFilter === "all" || code.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateCode = (newCodeData: Partial<DiscountCode>) => {
    const newCode: DiscountCode = {
      ...newCodeData as DiscountCode,
      id: `dc-${Date.now()}`
    };
    setDiscountCodes(prev => [newCode, ...prev]);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Discount code "${code}" copied to clipboard!`);
  };

  const handleToggleStatus = (id: string) => {
    setDiscountCodes(prev => prev.map(code => 
      code.id === id ? { ...code, isActive: !code.isActive } : code
    ));
    toast.success("Code status updated successfully!");
  };

  const handleDeleteCode = (id: string) => {
    setDiscountCodes(prev => prev.filter(code => code.id !== id));
    toast.success("Discount code deleted successfully!");
  };

  const totalRevenue = discountCodes.reduce((sum, code) => sum + code.revenue, 0);
  const totalUsage = discountCodes.reduce((sum, code) => sum + code.usedCount, 0);
  const activeCodes = discountCodes.filter(code => code.isActive).length;
  const averageConversion = discountCodes.length > 0 
    ? discountCodes.reduce((sum, code) => sum + code.conversionRate, 0) / discountCodes.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl" style={{ color: COLORS.dark }}>
            {t("pages.discountCodes.title")}
          </h1>
          <p className="text-sm lg:text-base" style={{ color: COLORS.dark + "80" }}>
            {t("pages.discountCodes.subtitle")}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Codes
          </Button>
          <CreateDiscountCodeDialog 
            onCreateCode={handleCreateCode}
            templates={codeTemplates}
          />
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{ borderColor: COLORS.lightGray }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
                Total Codes
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {discountCodes.length}
              </p>
            </div>
            <div 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <Tag className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: COLORS.primary }} />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{ borderColor: COLORS.lightGray }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
                Active Codes
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {activeCodes}
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-green-100">
              <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{ borderColor: COLORS.lightGray }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
                Total Usage
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {totalUsage}
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-blue-100">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{ borderColor: COLORS.lightGray }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
                Revenue Generated
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.primary }}>
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <DollarSign className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: COLORS.primary }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search discount codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Discount Codes List */}
      <div className="space-y-4">
        {filteredCodes.length > 0 ? (
          filteredCodes.map((code) => (
            <DiscountCodeCard
              code={code}
              onEdit={(code) => console.log("Edit code", code)}
              onDelete={handleDeleteCode}
              onToggleStatus={handleToggleStatus}
              onCopyCode={handleCopyCode}
              onViewAnalytics={(code) => {
                setSelectedCode(code);
                setShowAnalytics(true);
              }}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl border shadow-sm p-12 text-center" style={{ borderColor: COLORS.lightGray }}>
            <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: COLORS.dark }}>
              No Discount Codes Found
            </h3>
            <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Create your first discount code to start offering promotions to your subscribers"
              }
            </p>
            <CreateDiscountCodeDialog 
              onCreateCode={handleCreateCode}
              templates={codeTemplates}
            />
          </div>
        )}
      </div>

      {/* Analytics Modal */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
              Code Analytics: {selectedCode?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed performance metrics and usage analytics for this discount code
            </DialogDescription>
          </DialogHeader>
          
          {selectedCode && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                    {selectedCode.usedCount}
                  </div>
                  <div className="text-sm text-gray-600">Total Uses</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                    ${selectedCode.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedCode.conversionRate}%
                  </div>
                  <div className="text-sm text-gray-600">Conversion</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedCode.customersSaved.length}
                  </div>
                  <div className="text-sm text-gray-600">Customers</div>
                </div>
              </div>
              
              <Alert>
                <BarChart3 className="w-4 h-4" />
                <AlertDescription>
                  Detailed analytics showing code performance, usage patterns, and revenue impact.
                  <br />Conversion rate calculated based on code views vs. actual usage.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}