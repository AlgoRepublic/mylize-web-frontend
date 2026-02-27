import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Shield,
  Lock,
  Calendar,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Star,
  Crown,
  Package,
  Zap,
  Clock,
  RefreshCw,
  Download,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle,
  XCircle,
  Smartphone,
  Banknote,
  Globe,
  Building
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface PaymentMethod {
  id: string;
  type: "knet" | "visa" | "mastercard" | "apple_pay";
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
  brand?: string;
  billingAddress?: {
    country: string;
    city: string;
    postalCode: string;
  };
}

interface SubscriptionPlan {
  id: string;
  name: "basic" | "professional" | "enterprise";
  displayName: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
  limits: {
    subscribers: number;
    signals: number;
    storage: number; // GB
    courses: number;
  };
  popular?: boolean;
  recommended?: boolean;
}

interface BillingHistory {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  description: string;
  invoiceUrl?: string;
  paymentMethod: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
    nickname: "Primary Card",
    brand: "visa",
    billingAddress: {
      country: "Kuwait",
      city: "Kuwait City",
      postalCode: "12345"
    }
  },
  {
    id: "pm_2",
    type: "knet",
    isDefault: false,
    nickname: "K-Net Account",
    billingAddress: {
      country: "Kuwait",
      city: "Kuwait City",
      postalCode: "12345"
    }
  },
  {
    id: "pm_3",
    type: "apple_pay",
    isDefault: false,
    nickname: "Apple Pay"
  }
];

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "basic",
    displayName: "Basic Plan",
    price: 29.99,
    currency: "USD",
    interval: "monthly",
    features: [
      "Up to 100 subscribers",
      "10 signals per month",
      "10GB storage",
      "5 courses",
      "Email support",
      "Basic analytics"
    ],
    limits: {
      subscribers: 100,
      signals: 10,
      storage: 10,
      courses: 5
    }
  },
  {
    id: "professional",
    name: "professional",
    displayName: "Professional Plan",
    price: 99.99,
    currency: "USD",
    interval: "monthly",
    popular: true,
    features: [
      "Up to 1,000 subscribers",
      "Unlimited signals",
      "100GB storage",
      "25 courses",
      "Live streaming",
      "Advanced analytics",
      "API access",
      "Priority support"
    ],
    limits: {
      subscribers: 1000,
      signals: -1, // unlimited
      storage: 100,
      courses: 25
    }
  },
  {
    id: "enterprise",
    name: "enterprise",
    displayName: "Enterprise Plan",
    price: 299.99,
    currency: "USD",
    interval: "monthly",
    recommended: true,
    features: [
      "Unlimited subscribers",
      "Unlimited signals",
      "1TB storage",
      "Unlimited courses",
      "Live streaming",
      "White-label solution",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee"
    ],
    limits: {
      subscribers: -1, // unlimited
      signals: -1, // unlimited
      storage: 1000,
      courses: -1 // unlimited
    }
  }
];

const mockBillingHistory: BillingHistory[] = [
  {
    id: "inv_1",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    amount: 99.99,
    currency: "USD",
    status: "paid",
    description: "Professional Plan - Monthly",
    invoiceUrl: "#",
    paymentMethod: "Visa •••• 4242"
  },
  {
    id: "inv_2",
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    amount: 99.99,
    currency: "USD",
    status: "paid",
    description: "Professional Plan - Monthly",
    invoiceUrl: "#",
    paymentMethod: "K-Net"
  },
  {
    id: "inv_3",
    date: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
    amount: 99.99,
    currency: "USD",
    status: "paid",
    description: "Professional Plan - Monthly",
    invoiceUrl: "#",
    paymentMethod: "Apple Pay"
  }
];

function PaymentMethodCard({ paymentMethod, onEdit, onDelete, onSetDefault }: {
  paymentMethod: PaymentMethod;
  onEdit: (method: PaymentMethod) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case "visa":
      case "mastercard":
        return <CreditCard className="w-6 h-6" />;
      case "knet":
        return <Building className="w-6 h-6" />;
      case "apple_pay":
        return <Smartphone className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getMethodColor = (type: PaymentMethod['type']) => {
    switch (type) {
      case "visa":
        return "#1A1F71";
      case "mastercard":
        return "#EB001B";
      case "knet":
        return "#00A651";
      case "apple_pay":
        return "#000000";
      default:
        return COLORS.dark;
    }
  };

  const getMethodName = (type: PaymentMethod['type']) => {
    switch (type) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "knet":
        return "K-Net";
      case "apple_pay":
        return "Apple Pay";
      default:
        return "Payment Method";
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl border p-4 relative overflow-hidden"
      style={{ borderColor: COLORS.lightGray }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {paymentMethod.isDefault && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-100 text-green-700 text-xs">Default</Badge>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: getMethodColor(paymentMethod.type) + "15", color: getMethodColor(paymentMethod.type) }}
        >
          {getMethodIcon(paymentMethod.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium" style={{ color: COLORS.dark }}>
              {getMethodName(paymentMethod.type)}
            </h4>
            {paymentMethod.last4 && (
              <span className="text-sm text-gray-500">•••• {paymentMethod.last4}</span>
            )}
          </div>
          
          {paymentMethod.nickname && (
            <p className="text-sm text-gray-600 mb-1">{paymentMethod.nickname}</p>
          )}
          
          {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
            <p className="text-xs text-gray-500">
              Expires {paymentMethod.expiryMonth.toString().padStart(2, '0')}/{paymentMethod.expiryYear}
            </p>
          )}
          
          {paymentMethod.billingAddress && (
            <p className="text-xs text-gray-500">
              {paymentMethod.billingAddress.city}, {paymentMethod.billingAddress.country}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        {!paymentMethod.isDefault && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSetDefault(paymentMethod.id)}
            className="text-xs"
          >
            Set Default
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(paymentMethod)}
          className="text-xs"
        >
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(paymentMethod.id)}
          className="text-xs text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Delete
        </Button>
      </div>
    </motion.div>
  );
}

function PlanCard({ plan, currentPlan, onSelectPlan, isProcessing }: {
  plan: SubscriptionPlan;
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  isProcessing: boolean;
}) {
  const isCurrentPlan = currentPlan === plan.id;
  
  const getPlanIcon = (name: SubscriptionPlan['name']) => {
    switch (name) {
      case "basic":
        return <Package className="w-6 h-6" />;
      case "professional":
        return <Star className="w-6 h-6" />;
      case "enterprise":
        return <Crown className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getPlanColor = (name: SubscriptionPlan['name']) => {
    switch (name) {
      case "basic":
        return "#10B981";
      case "professional":
        return COLORS.primary;
      case "enterprise":
        return "#8B5CF6";
      default:
        return COLORS.dark;
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-xl border-2 p-6 relative overflow-hidden ${
        isCurrentPlan ? "ring-2" : ""
      }`}
      style={{ 
        borderColor: isCurrentPlan ? getPlanColor(plan.name) : COLORS.lightGray,
        ringColor: isCurrentPlan ? getPlanColor(plan.name) + "40" : "transparent"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isCurrentPlan ? { y: -4, boxShadow: "0 12px 30px -8px rgba(0, 0, 0, 0.15)" } : {}}
    >
      {/* Plan Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: getPlanColor(plan.name) + "20", color: getPlanColor(plan.name) }}
          >
            {getPlanIcon(plan.name)}
          </div>
          <div>
            <h3 className="font-serif font-semibold text-lg" style={{ color: COLORS.dark }}>
              {plan.displayName}
            </h3>
            {plan.popular && (
              <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">Most Popular</Badge>
            )}
            {plan.recommended && (
              <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">Recommended</Badge>
            )}
          </div>
        </div>
        
        {isCurrentPlan && (
          <Badge className="bg-green-100 text-green-700">Current Plan</Badge>
        )}
      </div>

      {/* Pricing */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold" style={{ color: COLORS.dark }}>
            ${plan.price}
          </span>
          <span className="text-gray-500">/{plan.interval}</span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-sm" style={{ color: COLORS.dark }}>Features included:</h4>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <Button
        onClick={() => onSelectPlan(plan.id)}
        disabled={isCurrentPlan || isProcessing}
        className="w-full"
        style={{ 
          backgroundColor: isCurrentPlan ? COLORS.lightGray : getPlanColor(plan.name),
          color: isCurrentPlan ? COLORS.dark : "white"
        }}
        type="button"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : isCurrentPlan ? (
          "Current Plan"
        ) : (
          <>
            <ArrowRight className="w-4 h-4 mr-2" />
            {currentPlan ? "Upgrade to this Plan" : "Select Plan"}
          </>
        )}
      </Button>
    </motion.div>
  );
}

function AddPaymentMethodDialog({ isOpen, onClose, onAdd }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: Partial<PaymentMethod>) => void;
}) {
  const [selectedType, setSelectedType] = useState<PaymentMethod['type']>("visa");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nickname: "",
    country: "Kuwait",
    city: "Kuwait City",
    postalCode: ""
  });

  const handleSubmit = () => {
    if (selectedType === "knet" || selectedType === "apple_pay") {
      // For K-Net and Apple Pay, we don't need card details
      onAdd({
        type: selectedType,
        nickname: formData.nickname || (selectedType === "knet" ? "K-Net Account" : "Apple Pay"),
        isDefault: false,
        billingAddress: {
          country: formData.country,
          city: formData.city,
          postalCode: formData.postalCode
        }
      });
    } else {
      // For Visa/Mastercard
      if (!formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
        toast.error("Please fill in all card details");
        return;
      }

      onAdd({
        type: selectedType,
        last4: formData.cardNumber.slice(-4),
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        nickname: formData.nickname || `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Card`,
        brand: selectedType,
        isDefault: false,
        billingAddress: {
          country: formData.country,
          city: formData.city,
          postalCode: formData.postalCode
        }
      });
    }

    // Reset form
    setFormData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      nickname: "",
      country: "Kuwait",
      city: "Kuwait City",
      postalCode: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
            Add Payment Method
          </DialogTitle>
          <DialogDescription>
            Add a new payment method to your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Type */}
          <div className="space-y-3">
            <Label>Payment Method Type</Label>
            <RadioGroup value={selectedType} onValueChange={(value) => setSelectedType(value as PaymentMethod['type'])}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="visa" id="visa" />
                <Label htmlFor="visa" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Visa
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="mastercard" id="mastercard" />
                <Label htmlFor="mastercard" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Mastercard
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="knet" id="knet" />
                <Label htmlFor="knet" className="flex items-center gap-2 cursor-pointer">
                  <Building className="w-4 h-4" />
                  K-Net (Kuwait)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="apple_pay" id="apple_pay" />
                <Label htmlFor="apple_pay" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="w-4 h-4" />
                  Apple Pay
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Card Details (for Visa/Mastercard) */}
          {(selectedType === "visa" || selectedType === "mastercard") && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Card Number</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-3">
                  <Label>Month</Label>
                  <Select value={formData.expiryMonth} onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                          {(i + 1).toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Year</Label>
                  <Select value={formData.expiryYear} onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i} value={(new Date().getFullYear() + i).toString()}>
                          {new Date().getFullYear() + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>CVV</Label>
                  <Input
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Nickname */}
          <div className="space-y-3">
            <Label>Nickname (Optional)</Label>
            <Input
              placeholder="My Primary Card"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
            />
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <Label>Billing Address</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <Label>Country</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kuwait">Kuwait</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                    <SelectItem value="Qatar">Qatar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Postal Code</Label>
              <Input
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: COLORS.primary }} type="button">
            Add Payment Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CancelSubscriptionDialog({ isOpen, onClose, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const cancelReasons = [
    "Too expensive",
    "Not using enough features",
    "Found a better alternative",
    "Technical issues",
    "Temporary pause",
    "Other"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-red-600">
            Cancel Subscription
          </DialogTitle>
          <DialogDescription>
            We're sorry to see you go. Help us improve by telling us why you're canceling.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Your subscription will remain active until the end of your current billing period.
              You'll continue to have access to all features until then.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Label>Reason for canceling (Optional)</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {cancelReasons.map((reasonOption) => (
                  <SelectItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Additional feedback (Optional)</Label>
            <textarea
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
              placeholder="Tell us how we could have done better..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} type="button">
            Keep Subscription
          </Button>
          <Button 
            onClick={onConfirm} 
            className="bg-red-600 hover:bg-red-700 text-white"
            type="button"
          >
            Cancel Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BillingManagement({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "methods" | "plans" | "history">("overview");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlan] = useState("professional");

  const handleAddPaymentMethod = (method: Partial<PaymentMethod>) => {
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: method.type!,
      last4: method.last4,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      isDefault: paymentMethods.length === 0, // Make first method default
      nickname: method.nickname,
      brand: method.brand,
      billingAddress: method.billingAddress
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    toast.success("Payment method added successfully!");
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    toast.success("Payment method removed successfully!");
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    toast.success("Default payment method updated!");
  };

  const handleUpgradePlan = (planId: string) => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Plan upgrade initiated! You'll be redirected to complete the payment.");
      // In real implementation, redirect to payment gateway
    }, 2000);
  };

  const handleCancelSubscription = () => {
    toast.success("Subscription canceled. You'll retain access until your current billing period ends.");
    setShowCancelDialog(false);
    onClose();
  };

  const getStatusColor = (status: BillingHistory['status']) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "refunded":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl" style={{ color: COLORS.dark }}>
            Billing Management
          </DialogTitle>
          <DialogDescription>
            Manage your subscription, payment methods, and billing history
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: "overview", label: "Overview", icon: <DollarSign className="w-4 h-4" /> },
            { id: "methods", label: "Payment Methods", icon: <CreditCard className="w-4 h-4" /> },
            { id: "plans", label: "Plans", icon: <Package className="w-4 h-4" /> },
            { id: "history", label: "History", icon: <Clock className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Current Plan Overview */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLORS.lightGray }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-semibold text-lg" style={{ color: COLORS.dark }}>
                    Current Subscription
                  </h3>
                  <Badge style={{ backgroundColor: COLORS.primary + "20", color: COLORS.primary }}>
                    Professional Plan
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-600">Monthly Cost</div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.dark }}>$99.99</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Billing</div>
                    <div className="text-lg font-medium" style={{ color: COLORS.dark }}>
                      {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Payment Method</div>
                    <div className="text-lg font-medium" style={{ color: COLORS.dark }}>
                      Visa •••• 4242
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={() => setActiveTab("plans")}
                    style={{ backgroundColor: COLORS.primary }}
                    type="button"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("methods")}
                    type="button"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Payment
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCancelDialog(true)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    type="button"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLORS.lightGray }}>
                  <h4 className="font-medium mb-3" style={{ color: COLORS.dark }}>This Month</h4>
                  <div className="text-2xl font-bold text-green-600 mb-1">$99.99</div>
                  <div className="text-sm text-gray-600">Billed on Dec 15</div>
                </div>
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLORS.lightGray }}>
                  <h4 className="font-medium mb-3" style={{ color: COLORS.dark }}>Total Paid</h4>
                  <div className="text-2xl font-bold" style={{ color: COLORS.dark }}>$1,199.88</div>
                  <div className="text-sm text-gray-600">Since Jan 2024</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "methods" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-semibold text-lg" style={{ color: COLORS.dark }}>
                  Payment Methods
                </h3>
                <Button 
                  onClick={() => setShowAddPayment(true)}
                  style={{ backgroundColor: COLORS.primary }}
                  type="button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    // key={method.id}
                    paymentMethod={method}
                    onEdit={() => {}}
                    onDelete={handleDeletePaymentMethod}
                    onSetDefault={handleSetDefaultPaymentMethod}
                  />
                ))}
              </div>

              {paymentMethods.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="font-medium mb-2" style={{ color: COLORS.dark }}>No Payment Methods</h4>
                  <p className="text-gray-600 mb-4">Add a payment method to manage your subscription</p>
                  <Button 
                    onClick={() => setShowAddPayment(true)}
                    style={{ backgroundColor: COLORS.primary }}
                    type="button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "plans" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: COLORS.dark }}>
                  Choose Your Plan
                </h3>
                <p className="text-gray-600">
                  Upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <PlanCard
                    // key={plan.id}
                    plan={plan}
                    currentPlan={currentPlan}
                    onSelectPlan={handleUpgradePlan}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-semibold text-lg" style={{ color: COLORS.dark }}>
                  Billing History
                </h3>
                <Button variant="outline" size="sm" type="button">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: COLORS.lightGray }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockBillingHistory.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.date.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${transaction.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transaction.invoiceUrl && (
                              <Button variant="ghost" size="sm" type="button">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dialogs */}
        <AddPaymentMethodDialog
          isOpen={showAddPayment}
          onClose={() => setShowAddPayment(false)}
          onAdd={handleAddPaymentMethod}
        />

        <CancelSubscriptionDialog
          isOpen={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          onConfirm={handleCancelSubscription}
        />
      </DialogContent>
    </Dialog>
  );
}