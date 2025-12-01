import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DollarSign,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  CreditCard,
  Banknote,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MoreHorizontal,
  Bell,
  Shield,
  Lock,
  Target,
  PieChart,
  BarChart3,
  Activity,
  Zap,
  Star,
  Award,
  Crown,
  FileText,
  ExternalLink,
  Copy,
  Send,
  Timer,
  Percent,
  Hash,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  Info,
  Minus,
  AlertTriangle,
  Coins
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
import { toast } from "sonner@2.0.3";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface PayoutMethod {
  id: string;
  type: "bank_account" | "card" | "paypal" | "crypto";
  name: string;
  accountNumber?: string;
  bankName?: string;
  cardLast4?: string;
  email?: string;
  address?: string;
  isDefault: boolean;
  isVerified: boolean;
  addedDate: Date;
  status: "active" | "pending" | "suspended";
}

interface PayoutTransaction {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  method: PayoutMethod;
  scheduledDate: Date;
  processedDate?: Date;
  fee: number;
  netAmount: number;
  reference: string;
  description: string;
  type: "manual" | "scheduled" | "instant";
}

interface EarningsBreakdown {
  subscriptions: number;
  consultations: number;
  courses: number;
  signals: number;
  referrals: number;
  total: number;
}

interface PayoutSchedule {
  id: string;
  frequency: "weekly" | "bi_weekly" | "monthly" | "quarterly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  minimumAmount: number;
  isActive: boolean;
  nextPayoutDate: Date;
  method: PayoutMethod;
}

const mockPayoutMethods: PayoutMethod[] = [
  {
    id: "pm-001",
    type: "bank_account",
    name: "Primary Business Account",
    accountNumber: "****7892",
    bankName: "Chase Business Banking",
    isDefault: true,
    isVerified: true,
    addedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "active"
  },
  {
    id: "pm-002",
    type: "card",
    name: "Business Debit Card",
    cardLast4: "4521",
    bankName: "Wells Fargo",
    isDefault: false,
    isVerified: true,
    addedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "active"
  },
  {
    id: "pm-003",
    type: "paypal",
    name: "PayPal Business",
    email: "business@analyst.com",
    isDefault: false,
    isVerified: true,
    addedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    status: "active"
  }
];

const mockSchedules: PayoutSchedule[] = [
  {
    id: "sched-001",
    frequency: "monthly",
    dayOfMonth: 1,
    minimumAmount: 500,
    isActive: true,
    nextPayoutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    method: mockPayoutMethods[0]
  },
  {
    id: "sched-002", 
    frequency: "weekly",
    dayOfWeek: 5, // Friday
    minimumAmount: 200,
    isActive: true,
    nextPayoutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    method: mockPayoutMethods[1]
  }
];

const mockTransactions: PayoutTransaction[] = [
  {
    id: "tx-001",
    amount: 2500,
    currency: "USD",
    status: "completed",
    method: mockPayoutMethods[0],
    scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    processedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    fee: 12.50,
    netAmount: 2487.50,
    reference: "PAY-20240121-001",
    description: "Monthly earnings payout",
    type: "scheduled"
  },
  {
    id: "tx-002",
    amount: 750,
    currency: "USD",
    status: "processing",
    method: mockPayoutMethods[0],
    scheduledDate: new Date(),
    fee: 3.75,
    netAmount: 746.25,
    reference: "PAY-20240122-002",
    description: "Consultation fees payout",
    type: "manual"
  },
  {
    id: "tx-003",
    amount: 1200,
    currency: "USD",
    status: "pending",
    method: mockPayoutMethods[1],
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    fee: 6.00,
    netAmount: 1194.00,
    reference: "PAY-20240123-003",
    description: "Course sales payout",
    type: "scheduled"
  }
];

const mockEarnings: EarningsBreakdown = {
  subscriptions: 15420,
  consultations: 3280,
  courses: 2150,
  signals: 1890,
  referrals: 650,
  total: 23390
};

function AddPayoutMethodDialog({ 
  onAddMethod 
}: { 
  onAddMethod: (method: Partial<PayoutMethod>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [methodType, setMethodType] = useState<PayoutMethod["type"]>("bank_account");
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    cardNumber: "",
    expiryDate: "",
    email: "",
    address: ""
  });

  const handleSubmit = () => {
    const methodData: Partial<PayoutMethod> = {
      type: methodType,
      name: formData.name,
      isDefault: false,
      isVerified: false,
      addedDate: new Date(),
      status: "pending" as const
    };

    switch (methodType) {
      case "bank_account":
        methodData.accountNumber = `****${formData.accountNumber.slice(-4)}`;
        methodData.bankName = formData.bankName;
        break;
      case "card":
        methodData.cardLast4 = formData.cardNumber.slice(-4);
        methodData.bankName = formData.bankName;
        break;
      case "paypal":
        methodData.email = formData.email;
        break;
      case "crypto":
        methodData.address = formData.address;
        break;
    }

    onAddMethod(methodData);
    setIsOpen(false);
    setFormData({
      name: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
      cardNumber: "",
      expiryDate: "",
      email: "",
      address: ""
    });
    toast.success("Payout method added successfully! Verification required.");
  };

  const getMethodIcon = (type: PayoutMethod["type"]) => {
    switch (type) {
      case "bank_account": return <Building className="w-5 h-5" />;
      case "card": return <CreditCard className="w-5 h-5" />;
      case "paypal": return <Wallet className="w-5 h-5" />;
      case "crypto": return <Coins className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: COLORS.primary }} type="button">
          <Plus className="w-4 h-4 mr-2" />
          Add Payout Method
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
            Add New Payout Method
          </DialogTitle>
          <DialogDescription>
            Add a new method for receiving your earnings payouts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Method Type Selection */}
          <div className="space-y-3">
            <Label>Payout Method Type</Label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { type: "bank_account" as const, label: "Bank Account", icon: <Building className="w-5 h-5" /> },
                { type: "card" as const, label: "Debit Card", icon: <CreditCard className="w-5 h-5" /> },
                { type: "paypal" as const, label: "PayPal", icon: <Wallet className="w-5 h-5" /> },
                { type: "crypto" as const, label: "Crypto", icon: <Coins className="w-5 h-5" /> }
              ].map((method) => (
                <Button
                  key={method.type}
                  variant={methodType === method.type ? "default" : "outline"}
                  onClick={() => setMethodType(method.type)}
                  className="flex flex-col gap-2 h-16"
                  style={methodType === method.type ? { backgroundColor: COLORS.primary } : {}}
                  type="button"
                >
                  {method.icon}
                  <span className="text-xs">{method.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Method Name */}
          <div className="space-y-3">
            <Label>Method Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g., Primary Business Account"
            />
          </div>

          {/* Dynamic Fields Based on Type */}
          {methodType === "bank_account" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Bank Name</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({...prev, bankName: e.target.value}))}
                    placeholder="e.g., Chase Bank"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Account Number</Label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({...prev, accountNumber: e.target.value}))}
                    placeholder="Account number"
                    type="password"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Routing Number</Label>
                <Input
                  value={formData.routingNumber}
                  onChange={(e) => setFormData(prev => ({...prev, routingNumber: e.target.value}))}
                  placeholder="9-digit routing number"
                />
              </div>
            </>
          )}

          {methodType === "card" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Bank/Card Issuer</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({...prev, bankName: e.target.value}))}
                    placeholder="e.g., Wells Fargo"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Card Number</Label>
                  <Input
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({...prev, cardNumber: e.target.value}))}
                    placeholder="•••• •••• •••• ••••"
                    type="password"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Expiry Date</Label>
                <Input
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({...prev, expiryDate: e.target.value}))}
                  placeholder="MM/YY"
                />
              </div>
            </>
          )}

          {methodType === "paypal" && (
            <div className="space-y-3">
              <Label>PayPal Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                placeholder="your.paypal@email.com"
              />
            </div>
          )}

          {methodType === "crypto" && (
            <div className="space-y-3">
              <Label>Wallet Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                placeholder="Enter your crypto wallet address"
                rows={3}
              />
            </div>
          )}

          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription>
              All payout methods require verification before they can be used. 
              You'll receive an email with verification instructions after adding.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              style={{ backgroundColor: COLORS.primary }}
              disabled={!formData.name}
              type="button"
            >
              Add Payout Method
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PayoutMethodCard({ 
  method, 
  onEdit, 
  onDelete, 
  onSetDefault,
  onVerify
}: { 
  method: PayoutMethod;
  onEdit: (method: PayoutMethod) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onVerify: (id: string) => void;
}) {
  const getMethodIcon = (type: PayoutMethod["type"]) => {
    switch (type) {
      case "bank_account": return <Building className="w-5 h-5" />;
      case "card": return <CreditCard className="w-5 h-5" />;
      case "paypal": return <Wallet className="w-5 h-5" />;
      case "crypto": return <Coins className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "#10B981";
      case "pending": return "#F59E0B";
      case "suspended": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const getMethodDetails = () => {
    switch (method.type) {
      case "bank_account":
        return `${method.bankName} • ${method.accountNumber}`;
      case "card":
        return `${method.bankName} • •••• ${method.cardLast4}`;
      case "paypal":
        return method.email;
      case "crypto":
        return `${method.address?.slice(0, 8)}...${method.address?.slice(-8)}`;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl border shadow-sm p-6"
      style={{ borderColor: COLORS.lightGray }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary + "20" }}
          >
            <div style={{ color: COLORS.primary }}>
              {getMethodIcon(method.type)}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-serif font-semibold" style={{ color: COLORS.dark }}>
                {method.name}
              </h3>
              {method.isDefault && (
                <Badge style={{ backgroundColor: COLORS.primary + "20", color: COLORS.primary }}>
                  Default
                </Badge>
              )}
              <Badge 
                style={{ 
                  backgroundColor: getStatusColor(method.status) + "20",
                  color: getStatusColor(method.status)
                }}
              >
                {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {getMethodDetails()}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Added {method.addedDate.toLocaleDateString()}</span>
              </div>
              {method.isVerified ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Pending Verification</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!method.isVerified && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onVerify(method.id)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              Verify
            </Button>
          )}
          {!method.isDefault && method.isVerified && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSetDefault(method.id)}
            >
              Set Default
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(method)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(method.id)}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function CreateScheduleDialog({ 
  onCreateSchedule,
  payoutMethods
}: { 
  onCreateSchedule: (schedule: Partial<PayoutSchedule>) => void;
  payoutMethods: PayoutMethod[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    frequency: "monthly" as PayoutSchedule["frequency"],
    dayOfWeek: 5, // Friday
    dayOfMonth: 1,
    minimumAmount: 500,
    methodId: ""
  });

  const calculateNextPayoutDate = (frequency: PayoutSchedule["frequency"], dayOfWeek?: number, dayOfMonth?: number) => {
    const now = new Date();
    const nextPayout = new Date();

    switch (frequency) {
      case "weekly":
        const currentDay = now.getDay();
        const targetDay = dayOfWeek || 5; // Default to Friday
        const daysUntilTarget = (targetDay + 7 - currentDay) % 7;
        nextPayout.setDate(now.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
        break;
      case "bi_weekly":
        const daysSinceLastBiWeekly = now.getDate() % 14;
        const daysUntilNextBiWeekly = 14 - daysSinceLastBiWeekly;
        nextPayout.setDate(now.getDate() + daysUntilNextBiWeekly);
        break;
      case "monthly":
        const targetDate = dayOfMonth || 1;
        nextPayout.setDate(targetDate);
        if (nextPayout <= now) {
          nextPayout.setMonth(nextPayout.getMonth() + 1);
        }
        break;
      case "quarterly":
        const currentMonth = now.getMonth();
        const nextQuarterMonth = Math.ceil((currentMonth + 1) / 3) * 3;
        nextPayout.setMonth(nextQuarterMonth);
        nextPayout.setDate(1);
        break;
    }

    return nextPayout;
  };

  const handleSubmit = () => {
    const selectedMethod = payoutMethods.find(m => m.id === formData.methodId);
    if (!selectedMethod) {
      toast.error("Please select a payout method");
      return;
    }

    const scheduleData: Partial<PayoutSchedule> = {
      frequency: formData.frequency,
      minimumAmount: formData.minimumAmount,
      isActive: true,
      method: selectedMethod,
      nextPayoutDate: calculateNextPayoutDate(
        formData.frequency, 
        formData.dayOfWeek, 
        formData.dayOfMonth
      )
    };

    if (formData.frequency === "weekly") {
      scheduleData.dayOfWeek = formData.dayOfWeek;
    } else if (formData.frequency === "monthly") {
      scheduleData.dayOfMonth = formData.dayOfMonth;
    }

    onCreateSchedule(scheduleData);
    setIsOpen(false);
    setFormData({
      frequency: "monthly",
      dayOfWeek: 5,
      dayOfMonth: 1,
      minimumAmount: 500,
      methodId: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: COLORS.primary }} type="button">
          <Plus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
            Create Payout Schedule
          </DialogTitle>
          <DialogDescription>
            Set up automatic recurring payouts for your earnings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Frequency Selection */}
          <div className="space-y-3">
            <Label>Payout Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value: PayoutSchedule["frequency"]) => setFormData(prev => ({...prev, frequency: value}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Day Selection based on frequency */}
          {formData.frequency === "weekly" && (
            <div className="space-y-3">
              <Label>Day of Week</Label>
              <Select value={formData.dayOfWeek.toString()} onValueChange={(value) => setFormData(prev => ({...prev, dayOfWeek: Number(value)}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.frequency === "monthly" && (
            <div className="space-y-3">
              <Label>Day of Month</Label>
              <Select value={formData.dayOfMonth.toString()} onValueChange={(value) => setFormData(prev => ({...prev, dayOfMonth: Number(value)}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 28}, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {day === 1 ? "1st" : day === 2 ? "2nd" : day === 3 ? "3rd" : `${day}th`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Minimum Amount */}
          <div className="space-y-3">
            <Label>Minimum Payout Amount</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.minimumAmount}
                onChange={(e) => setFormData(prev => ({...prev, minimumAmount: Number(e.target.value)}))}
                min={0}
                step={50}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                USD
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Payouts will only occur if your available balance exceeds this amount
            </p>
          </div>

          {/* Payout Method */}
          <div className="space-y-3">
            <Label>Payout Method</Label>
            <Select value={formData.methodId} onValueChange={(value) => setFormData(prev => ({...prev, methodId: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified payout method" />
              </SelectTrigger>
              <SelectContent>
                {payoutMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center gap-2">
                      <span>{method.name}</span>
                      {method.isDefault && (
                        <Badge style={{ backgroundColor: COLORS.primary + "20", color: COLORS.primary }}>
                          Default
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Schedule Preview</h4>
            <div className="text-sm space-y-1">
              <div>
                <strong>Frequency:</strong> {formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1).replace('_', '-')}
              </div>
              <div>
                <strong>Minimum Amount:</strong> ${formData.minimumAmount.toLocaleString()}
              </div>
              <div>
                <strong>Next Payout:</strong> {calculateNextPayoutDate(formData.frequency, formData.dayOfWeek, formData.dayOfMonth).toLocaleDateString()}
              </div>
            </div>
          </div>

          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              Scheduled payouts will only execute if your available balance meets the minimum amount. 
              Standard processing fees apply to all automatic payouts.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              style={{ backgroundColor: COLORS.primary }}
              disabled={!formData.methodId || payoutMethods.length === 0}
              type="button"
            >
              Create Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PayoutScheduleCard({ 
  schedule, 
  onEdit, 
  onDelete, 
  onToggleStatus
}: { 
  schedule: PayoutSchedule;
  onEdit: (schedule: PayoutSchedule) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}) {
  const getFrequencyLabel = (frequency: PayoutSchedule["frequency"]) => {
    switch (frequency) {
      case "weekly": return "Weekly";
      case "bi_weekly": return "Bi-weekly";
      case "monthly": return "Monthly";
      case "quarterly": return "Quarterly";
    }
  };

  const getScheduleDetails = () => {
    if (schedule.frequency === "weekly" && schedule.dayOfWeek) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return `Every ${days[schedule.dayOfWeek]}`;
    } else if (schedule.frequency === "monthly" && schedule.dayOfMonth) {
      const suffix = schedule.dayOfMonth === 1 ? "st" : 
                    schedule.dayOfMonth === 2 ? "nd" : 
                    schedule.dayOfMonth === 3 ? "rd" : "th";
      return `${schedule.dayOfMonth}${suffix} of each month`;
    } else if (schedule.frequency === "bi_weekly") {
      return "Every 2 weeks";
    } else if (schedule.frequency === "quarterly") {
      return "Every 3 months";
    }
    return "";
  };

  const daysUntilNext = Math.ceil((schedule.nextPayoutDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      className="bg-white rounded-xl border shadow-sm p-6"
      style={{ borderColor: COLORS.lightGray }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: schedule.isActive ? COLORS.primary + "20" : "#6B728020" 
            }}
          >
            <Calendar 
              className="w-6 h-6" 
              style={{ 
                color: schedule.isActive ? COLORS.primary : "#6B7280" 
              }} 
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-serif font-semibold" style={{ color: COLORS.dark }}>
                {getFrequencyLabel(schedule.frequency)} Payout
              </h3>
              <Badge 
                style={{ 
                  backgroundColor: schedule.isActive ? "#10B98120" : "#6B728020",
                  color: schedule.isActive ? "#10B981" : "#6B7280"
                }}
              >
                {schedule.isActive ? "Active" : "Paused"}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {getScheduleDetails()}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500">Minimum Amount</div>
                <div className="font-semibold">${schedule.minimumAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Payout Method</div>
                <div className="font-semibold">{schedule.method.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Next Payout</div>
                <div className="font-semibold">
                  {schedule.nextPayoutDate.toLocaleDateString()}
                  {daysUntilNext > 0 && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({daysUntilNext} day{daysUntilNext !== 1 ? "s" : ""})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!schedule.method.isVerified && (
              <Alert className="mb-3">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Payout method requires verification before scheduled payouts can execute.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Switch
            checked={schedule.isActive}
            onCheckedChange={() => onToggleStatus(schedule.id)}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(schedule)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(schedule.id)}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function TransactionRow({ 
  transaction,
  onViewDetails 
}: { 
  transaction: PayoutTransaction;
  onViewDetails: (transaction: PayoutTransaction) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#10B981";
      case "processing": return "#3B82F6";
      case "pending": return "#F59E0B";
      case "failed": return "#EF4444";
      case "cancelled": return "#6B7280";
      default: return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "processing": return <Clock className="w-4 h-4" />;
      case "pending": return <Timer className="w-4 h-4" />;
      case "failed": return <XCircle className="w-4 h-4" />;
      case "cancelled": return <Minus className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className="bg-white border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      style={{ borderColor: COLORS.lightGray }}
      onClick={() => onViewDetails(transaction)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: getStatusColor(transaction.status) + "20",
              color: getStatusColor(transaction.status)
            }}
          >
            {getStatusIcon(transaction.status)}
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-medium" style={{ color: COLORS.dark }}>
                ${transaction.amount.toLocaleString()}
              </h4>
              <Badge 
                style={{ 
                  backgroundColor: getStatusColor(transaction.status) + "20",
                  color: getStatusColor(transaction.status)
                }}
                className="text-xs"
              >
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {transaction.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
              <span>{transaction.reference}</span>
              <span>•</span>
              <span>{transaction.method.name}</span>
              <span>•</span>
              <span>{transaction.scheduledDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium" style={{ color: COLORS.dark }}>
            ${transaction.netAmount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            Fee: ${transaction.fee.toFixed(2)}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
        </div>
      </div>
    </motion.div>
  );
}

export function PayoutDashboard() {
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>(mockPayoutMethods);
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(mockTransactions);
  const [payoutSchedules, setPayoutSchedules] = useState<PayoutSchedule[]>(mockSchedules);
  const [selectedTransaction, setSelectedTransaction] = useState<PayoutTransaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30_days");

  const totalBalance = 4750;
  const availableBalance = 3890;
  const pendingPayouts = 860;
  const currentMonthEarnings = 12450;
  const previousMonthEarnings = 11280;

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddMethod = (newMethodData: Partial<PayoutMethod>) => {
    const newMethod: PayoutMethod = {
      id: `pm-${Date.now()}`,
      ...newMethodData as PayoutMethod
    };
    setPayoutMethods(prev => [...prev, newMethod]);
  };

  const handleSetDefault = (id: string) => {
    setPayoutMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    toast.success("Default payout method updated!");
  };

  const handleVerifyMethod = (id: string) => {
    setPayoutMethods(prev => prev.map(method =>
      method.id === id ? { ...method, isVerified: true, status: "active" as const } : method
    ));
    toast.success("Payout method verified successfully!");
  };

  const handleDeleteMethod = (id: string) => {
    setPayoutMethods(prev => prev.filter(method => method.id !== id));
    toast.success("Payout method removed successfully!");
  };

  const handleInstantPayout = () => {
    toast.success("Instant payout initiated! Processing fee: $5.99");
  };

  const handleCreateSchedule = (newScheduleData: Partial<PayoutSchedule>) => {
    const newSchedule: PayoutSchedule = {
      id: `sched-${Date.now()}`,
      ...newScheduleData as PayoutSchedule
    };
    setPayoutSchedules(prev => [...prev, newSchedule]);
    toast.success("Payout schedule created successfully!");
  };

  const handleToggleSchedule = (id: string) => {
    setPayoutSchedules(prev => prev.map(schedule =>
      schedule.id === id ? { ...schedule, isActive: !schedule.isActive } : schedule
    ));
    toast.success("Schedule status updated successfully!");
  };

  const handleDeleteSchedule = (id: string) => {
    setPayoutSchedules(prev => prev.filter(schedule => schedule.id !== id));
    toast.success("Payout schedule deleted successfully!");
  };

  const earningsChangePercent = ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl" style={{ color: COLORS.dark }}>
            Payout Dashboard
          </h1>
          <p className="text-sm lg:text-base" style={{ color: COLORS.dark + "80" }}>
            Manage earnings, payout methods, and transaction history
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleInstantPayout}
            style={{ backgroundColor: COLORS.primary }}
            type="button"
          >
            <Zap className="w-4 h-4 mr-2" />
            Instant Payout
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{ borderColor: COLORS.lightGray }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
                Total Balance
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                ${totalBalance.toLocaleString()}
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

        <motion.div
          className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{ borderColor: COLORS.lightGray }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
                Available
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                ${availableBalance.toLocaleString()}
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
                Pending
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                ${pendingPayouts.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-orange-100">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
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
                This Month
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                ${currentMonthEarnings.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">
                  +{earningsChangePercent.toFixed(1)}%
                </span>
              </div>
            </div>
            <div 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: COLORS.primary }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="methods">Payout Methods</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Earnings Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              className="bg-white rounded-xl border shadow-sm p-6"
              style={{ borderColor: COLORS.lightGray }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Earnings Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Subscriptions", amount: mockEarnings.subscriptions, color: COLORS.primary },
                  { label: "Consultations", amount: mockEarnings.consultations, color: "#3B82F6" },
                  { label: "Courses", amount: mockEarnings.courses, color: "#10B981" },
                  { label: "Signals", amount: mockEarnings.signals, color: "#F59E0B" },
                  { label: "Referrals", amount: mockEarnings.referrals, color: "#8B5CF6" }
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${item.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {((item.amount / mockEarnings.total) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl border shadow-sm p-6"
              style={{ borderColor: COLORS.lightGray }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((tx, index) => (
                  <div key={tx.id} className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: tx.status === "completed" ? "#10B981" : 
                                       tx.status === "processing" ? "#3B82F6" : "#F59E0B",
                        color: "white"
                      }}
                    >
                      {tx.status === "completed" ? <CheckCircle className="w-4 h-4" /> : 
                       tx.status === "processing" ? <Clock className="w-4 h-4" /> : 
                       <Timer className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">${tx.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{tx.description}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {tx.scheduledDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          {/* Payout Methods Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-semibold text-lg" style={{ color: COLORS.dark }}>
                Payout Methods
              </h3>
              <p className="text-sm text-gray-600">
                Manage how you receive your earnings
              </p>
            </div>
            <AddPayoutMethodDialog onAddMethod={handleAddMethod} />
          </div>

          {/* Payout Methods Grid */}
          <div className="space-y-4">
            {payoutMethods.map((method) => (
              <PayoutMethodCard
                key={method.id}
                method={method}
                onEdit={(method) => console.log("Edit method", method)}
                onDelete={handleDeleteMethod}
                onSetDefault={handleSetDefault}
                onVerify={handleVerifyMethod}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Transactions Header and Filters */}
          <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7_days">7 Days</SelectItem>
                    <SelectItem value="30_days">30 Days</SelectItem>
                    <SelectItem value="90_days">90 Days</SelectItem>
                    <SelectItem value="all_time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onViewDetails={(tx) => {
                  setSelectedTransaction(tx);
                  setShowTransactionDetails(true);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          {/* Schedule Management */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-semibold text-lg" style={{ color: COLORS.dark }}>
                Automatic Payout Schedule
              </h3>
              <p className="text-sm text-gray-600">
                Set up recurring payouts to automate your earnings withdrawals
              </p>
            </div>
            <CreateScheduleDialog 
              onCreateSchedule={handleCreateSchedule}
              payoutMethods={payoutMethods.filter(m => m.isVerified && m.status === "active")}
            />
          </div>

          {/* Current Schedules */}
          <div className="space-y-4">
            {payoutSchedules.map((schedule) => (
              <PayoutScheduleCard
                key={schedule.id}
                schedule={schedule}
                onEdit={(schedule) => console.log("Edit schedule", schedule)}
                onDelete={handleDeleteSchedule}
                onToggleStatus={handleToggleSchedule}
              />
            ))}
            
            {payoutSchedules.length === 0 && (
              <motion.div
                className="bg-white rounded-xl border shadow-sm p-12 text-center"
                style={{ borderColor: COLORS.lightGray }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
                <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: COLORS.dark }}>
                  No Automatic Schedules
                </h3>
                <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
                  Create your first automatic payout schedule to streamline your earnings withdrawals.
                </p>
                <CreateScheduleDialog 
                  onCreateSchedule={handleCreateSchedule}
                  payoutMethods={payoutMethods.filter(m => m.isVerified && m.status === "active")}
                />
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Modal */}
      <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this payout transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Amount</Label>
                  <p className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                    ${selectedTransaction.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label>Net Amount</Label>
                  <p className="text-2xl font-bold text-green-600">
                    ${selectedTransaction.netAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Status</Label>
                  <p>{selectedTransaction.status}</p>
                </div>
                <div>
                  <Label>Reference</Label>
                  <p className="font-mono">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <Label>Method</Label>
                  <p>{selectedTransaction.method.name}</p>
                </div>
                <div>
                  <Label>Fee</Label>
                  <p>${selectedTransaction.fee.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Scheduled Date</Label>
                  <p>{selectedTransaction.scheduledDate.toLocaleDateString()}</p>
                </div>
                {selectedTransaction.processedDate && (
                  <div>
                    <Label>Processed Date</Label>
                    <p>{selectedTransaction.processedDate.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}