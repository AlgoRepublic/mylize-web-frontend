import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft,
  Check,
  Crown,
  Star,
  Package,
  Zap,
  Shield,
  Users,
  Database,
  Video,
  BarChart3,
  Headphones,
  Clock,
  CreditCard,
  Building,
  Smartphone,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  DollarSign,
  Calendar,
  Globe,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface SubscriptionPlan {
  id: string;
  name: "basic" | "professional" | "enterprise";
  displayName: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
  limits: {
    subscribers: number;
    signals: number;
    storage: number; // GB
    courses: number;
  };
  popular?: boolean;
  recommended?: boolean;
  savings?: string;
}

interface PaymentMethod {
  id: string;
  type: "knet" | "visa" | "mastercard" | "apple_pay";
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
  brand?: string;
}

const plans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "basic",
    displayName: "Basic Plan",
    price: 29.99,
    yearlyPrice: 299.99,
    currency: "USD",
    savings: "Save 17%",
    features: [
      "Up to 100 subscribers",
      "10 signals per month",
      "10GB storage",
      "5 courses",
      "Email support",
      "Basic analytics",
      "Mobile app access",
      "Standard templates"
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
    yearlyPrice: 999.99,
    currency: "USD",
    popular: true,
    savings: "Save 17%",
    features: [
      "Up to 1,000 subscribers",
      "Unlimited signals",
      "100GB storage",
      "25 courses",
      "Live streaming",
      "Advanced analytics",
      "API access",
      "Priority support",
      "Custom branding",
      "WhatsApp integration",
      "Advanced charts",
      "Consultation booking"
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
    yearlyPrice: 2999.99,
    currency: "USD",
    recommended: true,
    savings: "Save 17%",
    features: [
      "Unlimited subscribers",
      "Unlimited signals",
      "1TB storage",
      "Unlimited courses",
      "Live streaming",
      "White-label solution",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Advanced security",
      "Custom API endpoints",
      "Multi-region hosting",
      "24/7 phone support",
      "Training sessions"
    ],
    limits: {
      subscribers: -1, // unlimited
      signals: -1, // unlimited
      storage: 1000,
      courses: -1 // unlimited
    }
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
    nickname: "Primary Card",
    brand: "visa"
  },
  {
    id: "pm_2",
    type: "knet",
    isDefault: false,
    nickname: "K-Net Account"
  },
  {
    id: "pm_3",
    type: "apple_pay",
    isDefault: false,
    nickname: "Apple Pay"
  }
];

function PlanCard({ plan, currentPlan, billingCycle, isSelected, onSelect, isProcessing }: {
  plan: SubscriptionPlan;
  currentPlan?: string;
  billingCycle: "monthly" | "yearly";
  isSelected: boolean;
  onSelect: (planId: string) => void;
  isProcessing: boolean;
}) {
  const isCurrentPlan = currentPlan === plan.id;
  const displayPrice = billingCycle === "yearly" ? plan.yearlyPrice : plan.price;
  const monthlyEquivalent = billingCycle === "yearly" ? plan.yearlyPrice / 12 : plan.price;
  
  const getPlanIcon = (name: SubscriptionPlan['name']) => {
    switch (name) {
      case "basic":
        return <Package className="w-8 h-8" />;
      case "professional":
        return <Star className="w-8 h-8" />;
      case "enterprise":
        return <Crown className="w-8 h-8" />;
      default:
        return <Package className="w-8 h-8" />;
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
      className={`relative bg-white rounded-2xl border-2 p-8 cursor-pointer overflow-hidden ${
        isSelected ? "ring-4" : ""
      } ${isCurrentPlan ? "opacity-60" : ""}`}
      style={{ 
        borderColor: isSelected ? getPlanColor(plan.name) : COLORS.lightGray,
        ringColor: isSelected ? getPlanColor(plan.name) + "40" : "transparent"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isCurrentPlan ? 0.6 : 1, y: 0 }}
      whileHover={!isCurrentPlan ? { y: -8, boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.15)" } : {}}
      onClick={() => !isCurrentPlan && !isProcessing && onSelect(plan.id)}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full transform translate-x-8 -translate-y-8"
          style={{ backgroundColor: getPlanColor(plan.name) }}
        />
        <div 
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full transform -translate-x-4 translate-y-4"
          style={{ backgroundColor: getPlanColor(plan.name) }}
        />
      </div>

      {/* Plan Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: getPlanColor(plan.name) + "15", color: getPlanColor(plan.name) }}
          >
            {getPlanIcon(plan.name)}
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
              {plan.displayName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {plan.popular && (
                <Badge className="bg-blue-100 text-blue-700 text-xs">Most Popular</Badge>
              )}
              {plan.recommended && (
                <Badge className="bg-purple-100 text-purple-700 text-xs">Recommended</Badge>
              )}
              {isCurrentPlan && (
                <Badge className="bg-green-100 text-green-700 text-xs">Current Plan</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && !isCurrentPlan && (
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: getPlanColor(plan.name) }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>

      {/* Pricing */}
      <div className="relative mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold" style={{ color: COLORS.dark }}>
            ${displayPrice}
          </span>
          <span className="text-gray-500">
            /{billingCycle === "yearly" ? "year" : "month"}
          </span>
        </div>
        
        {billingCycle === "yearly" && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">
              ${monthlyEquivalent.toFixed(2)}/month
            </span>
            <Badge className="bg-green-100 text-green-700 text-xs">
              {plan.savings}
            </Badge>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="relative space-y-4 mb-8">
        <h4 className="font-medium text-lg" style={{ color: COLORS.dark }}>Everything in this plan:</h4>
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: getPlanColor(plan.name) + "20", color: getPlanColor(plan.name) }}
              >
                <Check className="w-3 h-3" />
              </div>
              <span className="text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="relative">
        <Button
          className="w-full py-4 text-lg font-medium"
          disabled={isCurrentPlan || isProcessing}
          style={{ 
            backgroundColor: isCurrentPlan ? COLORS.lightGray : getPlanColor(plan.name),
            color: isCurrentPlan ? COLORS.dark : "white"
          }}
          type="button"
        >
          {isCurrentPlan ? (
            "Current Plan"
          ) : isSelected ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Selected
            </>
          ) : (
            <>
              <ChevronRight className="w-5 h-5 mr-2" />
              Choose This Plan
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

function PaymentMethodSelector({ selectedMethod, onSelect, onAddNew }: {
  selectedMethod: string | null;
  onSelect: (methodId: string) => void;
  onAddNew: () => void;
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
    <div className="space-y-4">
      <h3 className="text-lg font-serif font-semibold" style={{ color: COLORS.dark }}>
        Choose Payment Method
      </h3>

      <RadioGroup value={selectedMethod || ""} onValueChange={onSelect}>
        <div className="space-y-3">
          {mockPaymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-3">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label 
                htmlFor={method.id} 
                className="flex items-center gap-3 flex-1 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: getMethodColor(method.type) + "15", color: getMethodColor(method.type) }}
                >
                  {getMethodIcon(method.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getMethodName(method.type)}</span>
                    {method.last4 && (
                      <span className="text-sm text-gray-500">•••• {method.last4}</span>
                    )}
                    {method.isDefault && (
                      <Badge className="bg-green-100 text-green-700 text-xs">Default</Badge>
                    )}
                  </div>
                  {method.nickname && (
                    <div className="text-sm text-gray-600">{method.nickname}</div>
                  )}
                  {method.expiryMonth && method.expiryYear && (
                    <div className="text-xs text-gray-500">
                      Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </div>
                  )}
                </div>
              </Label>
            </div>
          ))}

          {/* Add New Payment Method */}
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="new" id="new" />
            <Label 
              htmlFor="new" 
              className="flex items-center gap-3 flex-1 p-4 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={onAddNew}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-dashed"
                style={{ borderColor: COLORS.primary, color: COLORS.primary }}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium" style={{ color: COLORS.primary }}>
                  Add New Payment Method
                </div>
                <div className="text-sm text-gray-600">
                  Visa, Mastercard, K-Net, or Apple Pay
                </div>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
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
      onAdd({
        type: selectedType,
        nickname: formData.nickname || (selectedType === "knet" ? "K-Net Account" : "Apple Pay"),
        isDefault: false
      });
    } else {
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
        isDefault: false
      });
    }

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
            Add a new payment method for your subscription
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Payment Method Type</Label>
            <RadioGroup value={selectedType} onValueChange={(value) => setSelectedType(value as PaymentMethod['type'])}>
              <div className="space-y-2">
                {[
                  { value: "visa", label: "Visa", icon: <CreditCard className="w-4 h-4" /> },
                  { value: "mastercard", label: "Mastercard", icon: <CreditCard className="w-4 h-4" /> },
                  { value: "knet", label: "K-Net (Kuwait)", icon: <Building className="w-4 h-4" /> },
                  { value: "apple_pay", label: "Apple Pay", icon: <Smartphone className="w-4 h-4" /> }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg border">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                      {option.icon}
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

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

          <div className="space-y-3">
            <Label>Nickname (Optional)</Label>
            <Input
              placeholder="My Primary Card"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
            />
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

export function PlanUpgrade({ onBack }: { onBack: () => void }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlan] = useState("professional");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    // Auto-select default payment method if available
    const defaultMethod = paymentMethods.find(method => method.isDefault);
    if (defaultMethod) {
      setSelectedPaymentMethod(defaultMethod.id);
    }
  };

  const handleAddPaymentMethod = (method: Partial<PaymentMethod>) => {
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: method.type!,
      last4: method.last4,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      isDefault: paymentMethods.length === 0,
      nickname: method.nickname,
      brand: method.brand
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setSelectedPaymentMethod(newMethod.id);
    toast.success("Payment method added successfully!");
  };

  const handleUpgrade = () => {
    if (!selectedPlan || !selectedPaymentMethod) {
      toast.error("Please select a plan and payment method");
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Plan upgrade successful! Welcome to your new plan.");
      onBack(); // Return to previous page
    }, 3000);
  };

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
  const canUpgrade = selectedPlan && selectedPaymentMethod && selectedPlan !== currentPlan;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} size="sm" type="button">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-bold" style={{ color: COLORS.dark }}>
            Upgrade Your Plan
          </h1>
          <p className="text-lg" style={{ color: COLORS.dark + "80" }}>
            Choose the perfect plan for your growing business
          </p>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <Button
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            onClick={() => setBillingCycle("monthly")}
            className="px-6"
            type="button"
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "ghost"}
            onClick={() => setBillingCycle("yearly")}
            className="px-6"
            type="button"
          >
            Yearly
            <Badge className="ml-2 bg-green-100 text-green-700 text-xs">Save 17%</Badge>
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PlanCard
            // key={plan.id}
            plan={plan}
            currentPlan={currentPlan}
            billingCycle={billingCycle}
            isSelected={selectedPlan === plan.id}
            onSelect={handlePlanSelect}
            isProcessing={isProcessing}
          />
        ))}
      </div>

      {/* Payment Method Selection */}
      <AnimatePresence>
        {selectedPlan && selectedPlan !== currentPlan && (
          <motion.div
            className="bg-white rounded-2xl border p-8"
            style={{ borderColor: COLORS.lightGray }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onSelect={setSelectedPaymentMethod}
              onAddNew={() => setShowPaymentMethodDialog(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Summary */}
      <AnimatePresence>
        {canUpgrade && (
          <motion.div
            className="bg-white rounded-2xl border p-8"
            style={{ borderColor: COLORS.lightGray }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-semibold" style={{ color: COLORS.dark }}>
                Upgrade Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3" style={{ color: COLORS.dark }}>Plan Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{selectedPlanData?.displayName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing:</span>
                      <span className="font-medium">{billingCycle === "yearly" ? "Yearly" : "Monthly"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">
                        ${billingCycle === "yearly" ? selectedPlanData?.yearlyPrice : selectedPlanData?.price}
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3" style={{ color: COLORS.dark }}>Payment Method</h4>
                  <div className="text-sm">
                    {selectedPaymentMethod && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="font-medium">
                          {paymentMethods.find(m => m.id === selectedPaymentMethod)?.nickname}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">
                    Your plan will be upgraded immediately
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    You'll be charged the prorated amount for the current billing period
                  </div>
                </div>
                
                <Button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="px-8 py-3"
                  style={{ backgroundColor: COLORS.primary }}
                  type="button"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Payment Method Dialog */}
      <AddPaymentMethodDialog
        isOpen={showPaymentMethodDialog}
        onClose={() => setShowPaymentMethodDialog(false)}
        onAdd={handleAddPaymentMethod}
      />
    </div>
  );
}