import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users,
  Copy,
  Share2,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Link,
  Mail,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  Calculator,
  Banknote,
  CreditCard,
  Activity,
  Send,
  Receipt,
  History,
  UserPlus,
  Code,
  Tag
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner@2.0.3";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface Owner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bankAccount?: string;
  paymentMethod: "bank_transfer" | "paypal" | "crypto" | "cash";
  paymentDetails: string;
  isActive: boolean;
  createdAt: Date;
  owedAmount: number;
  totalPaid: number;
}

interface ReferralCode {
  id: string;
  code: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  commissionRate: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
  usageCount: number;
  maxUsage?: number;
  totalEarnings: number;
}

interface OwedTransaction {
  id: string;
  ownerId: string;
  ownerName: string;
  amount: number;
  description: string;
  date: Date;
  notes?: string;
}

interface Transfer {
  id: string;
  ownerId: string;
  ownerName: string;
  amount: number;
  transactionNumber: string;
  transferDate: Date;
  notes?: string;
}

interface SystemStats {
  totalOwners: number;
  activeOwners: number;
  totalOwed: number;
  totalPaid: number;
  thisMonthTransactions: number;
  thisMonthTransfers: number;
}

const mockSystemStats: SystemStats = {
  totalOwners: 8,
  activeOwners: 6,
  totalOwed: 1285.50,
  totalPaid: 4135.25,
  thisMonthTransactions: 15,
  thisMonthTransfers: 8
};

const mockOwners: Owner[] = [
  {
    id: "1",
    name: "Ahmed Al-Rashid",
    email: "ahmed@business.com",
    phone: "+965-9999-1234",
    bankAccount: "KW12 CBK0 0000 0000 0000 1234",
    paymentMethod: "bank_transfer",
    paymentDetails: "Commercial Bank of Kuwait - Account 1234",
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    owedAmount: 485.75,
    totalPaid: 1850.00
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@trading.co",
    phone: "+965-9999-5678",
    paymentMethod: "paypal",
    paymentDetails: "PayPal: sarah.johnson@email.com",
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    owedAmount: 320.50,
    totalPaid: 1200.25
  },
  {
    id: "3",
    name: "Mohammad Al-Sabah",
    email: "mohammad@finance.kw",
    phone: "+965-9999-9012",
    bankAccount: "KW98 NBK0 0000 0000 0000 5678",
    paymentMethod: "bank_transfer",
    paymentDetails: "National Bank of Kuwait - Account 5678",
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    owedAmount: 275.25,
    totalPaid: 675.00
  },
  {
    id: "4",
    name: "Fatima Al-Zahra",
    email: "fatima@invest.kw",
    phone: "+965-9999-3456",
    paymentMethod: "crypto",
    paymentDetails: "Bitcoin Wallet: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    owedAmount: 150.00,
    totalPaid: 300.00
  },
  {
    id: "5",
    name: "Omar Al-Mutairi",
    email: "omar@consulting.kw",
    phone: "+965-9999-7890",
    paymentMethod: "cash",
    paymentDetails: "Cash pickup at office",
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    owedAmount: 54.00,
    totalPaid: 110.00
  }
];

const mockReferralCodes: ReferralCode[] = [
  {
    id: "1",
    code: "AHMED-VIP24",
    name: "Ahmed VIP Clients",
    description: "VIP client referrals for premium services",
    ownerId: "1",
    ownerName: "Ahmed Al-Rashid",
    commissionRate: 25,
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    usageCount: 18,
    totalEarnings: 1580.00
  },
  {
    id: "2",
    code: "SARAH-TRADE",
    name: "Sarah Trading Network",
    description: "Trading network and educational referrals",
    ownerId: "2",
    ownerName: "Sarah Johnson",
    commissionRate: 30,
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    usageCount: 12,
    maxUsage: 50,
    totalEarnings: 1320.75
  },
  {
    id: "3",
    code: "MOHAMMAD-CORP",
    name: "Mohammad Corporate",
    description: "Corporate clients and business partnerships",
    ownerId: "3",
    ownerName: "Mohammad Al-Sabah",
    commissionRate: 20,
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    usageCount: 8,
    totalEarnings: 850.00
  },
  {
    id: "4",
    code: "AHMED-GOLD",
    name: "Ahmed Gold Package",
    description: "Gold package referrals with higher commission",
    ownerId: "1",
    ownerName: "Ahmed Al-Rashid",
    commissionRate: 35,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    usageCount: 6,
    totalEarnings: 870.00
  },
  {
    id: "5",
    code: "SARAH-BASIC",
    name: "Sarah Basic Services",
    description: "Basic services and starter packages",
    ownerId: "2",
    ownerName: "Sarah Johnson",
    commissionRate: 15,
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    usageCount: 15,
    totalEarnings: 500.00
  },
  {
    id: "6",
    code: "FATIMA-SPECIAL",
    name: "Fatima Special Offer",
    description: "Special promotional offer - inactive",
    ownerId: "4",
    ownerName: "Fatima Al-Zahra",
    commissionRate: 40,
    isActive: false,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    usageCount: 3,
    totalEarnings: 450.00
  }
];

const mockOwedTransactions: OwedTransaction[] = [
  {
    id: "1",
    ownerId: "1",
    ownerName: "Ahmed Al-Rashid",
    amount: 125.75,
    description: "VIP client referral - Khalid Al-Mutairi",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: "Premium service signup"
  },
  {
    id: "2",
    ownerId: "1",
    ownerName: "Ahmed Al-Rashid",
    amount: 360.00,
    description: "Gold package referral - Multiple clients",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    notes: "Bulk referral bonus"
  },
  {
    id: "3",
    ownerId: "2",
    ownerName: "Sarah Johnson",
    amount: 180.50,
    description: "Trading course referrals",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: "Educational package sales"
  },
  {
    id: "4",
    ownerId: "2",
    ownerName: "Sarah Johnson",
    amount: 140.00,
    description: "Basic package referrals - New traders",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "5",
    ownerId: "3",
    ownerName: "Mohammad Al-Sabah",
    amount: 275.25,
    description: "Corporate consulting referral - Noor Al-Sabah",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: "Large corporate deal"
  },
  {
    id: "6",
    ownerId: "4",
    ownerName: "Fatima Al-Zahra",
    amount: 150.00,
    description: "Special promotion referrals",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: "7",
    ownerId: "5",
    ownerName: "Omar Al-Mutairi",
    amount: 54.00,
    description: "Basic service referrals",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  }
];

const mockTransfers: Transfer[] = [
  {
    id: "1",
    ownerId: "1",
    ownerName: "Ahmed Al-Rashid",
    amount: 500.00,
    transactionNumber: "TXN-2024-001",
    transferDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    notes: "Monthly payout - Bank transfer"
  },
  {
    id: "2",
    ownerId: "2",
    ownerName: "Sarah Johnson",
    amount: 350.00,
    transactionNumber: "TXN-2024-002",
    transferDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    notes: "PayPal transfer completed"
  },
  {
    id: "3",
    ownerId: "1",
    ownerName: "Ahmed Al-Rashid",
    amount: 750.00,
    transactionNumber: "TXN-2024-003",
    transferDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    notes: "Large payout - Bank transfer"
  },
  {
    id: "4",
    ownerId: "3",
    ownerName: "Mohammad Al-Sabah",
    amount: 400.00,
    transactionNumber: "TXN-2024-004",
    transferDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    notes: "Corporate commission payout"
  },
  {
    id: "5",
    ownerId: "2",
    ownerName: "Sarah Johnson",
    amount: 275.00,
    transactionNumber: "TXN-2024-005",
    transferDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    notes: "Educational package commissions"
  },
  {
    id: "6",
    ownerId: "4",
    ownerName: "Fatima Al-Zahra",
    amount: 150.00,
    transactionNumber: "TXN-2024-006",
    transferDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    notes: "Crypto wallet transfer"
  },
  {
    id: "7",
    ownerId: "3",
    ownerName: "Mohammad Al-Sabah",
    amount: 275.00,
    transactionNumber: "TXN-2024-007",
    transferDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    notes: "NBK bank transfer"
  },
  {
    id: "8",
    ownerId: "5",
    ownerName: "Omar Al-Mutairi",
    amount: 110.00,
    transactionNumber: "TXN-2024-008",
    transferDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    notes: "Cash pickup completed"
  }
];

function SystemStatsCard({ stats }: { stats: SystemStats }) {
  const statsData = [
    {
      label: "Active Owners",
      value: stats.activeOwners,
      subtitle: `${stats.totalOwners} total`,
      icon: <Users className="w-5 h-5" />,
      color: COLORS.primary,
      change: "+1 this month",
      positive: true
    },
    {
      label: "Total Owed",
      value: `KWD ${stats.totalOwed.toFixed(2)}`,
      subtitle: "Pending payments",
      icon: <Banknote className="w-5 h-5" />,
      color: "#F59E0B",
      change: `${stats.thisMonthTransactions} new`,
      positive: true
    },
    {
      label: "Total Paid",
      value: `KWD ${stats.totalPaid.toLocaleString()}`,
      subtitle: "All-time payments",
      icon: <DollarSign className="w-5 h-5" />,
      color: "#10B981",
      change: `${stats.thisMonthTransfers} transfers`,
      positive: true
    },
    {
      label: "This Month",
      value: stats.thisMonthTransfers,
      subtitle: "Transfers made",
      icon: <Send className="w-5 h-5" />,
      color: "#8B5CF6",
      change: "+25.2%",
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="bg-white rounded-xl border p-6 relative overflow-hidden"
          style={{ borderColor: COLORS.lightGray }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, boxShadow: "0 12px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
            <div 
              className="w-full h-full rounded-full transform translate-x-6 -translate-y-6"
              style={{ backgroundColor: stat.color }}
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.color + "15", color: stat.color }}
              >
                {stat.icon}
              </div>
              <Badge 
                className={`text-xs ${stat.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {stat.change}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              {stat.subtitle && (
                <div className="text-xs text-gray-500">{stat.subtitle}</div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AddOwnerDialog({ isOpen, onClose, onAdd }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (owner: Partial<Owner>) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bankAccount: "",
    paymentMethod: "bank_transfer" as const,
    paymentDetails: ""
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.paymentDetails) {
      toast.error("Please fill in required fields");
      return;
    }

    onAdd({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bankAccount: formData.bankAccount,
      paymentMethod: formData.paymentMethod,
      paymentDetails: formData.paymentDetails,
      isActive: true,
      createdAt: new Date(),
      totalEarnings: 0,
      pendingEarnings: 0,
      totalCodes: 0,
      activeCodes: 0
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      bankAccount: "",
      paymentMethod: "bank_transfer",
      paymentDetails: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
            Add New Owner
          </DialogTitle>
          <DialogDescription>
            Add a new code owner to the referral system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input
              placeholder="e.g., Ahmed Al-Rashid"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Email Address *</Label>
            <Input
              type="email"
              placeholder="ahmed@business.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              placeholder="+965-9999-1234"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method *</Label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={(value: "bank_transfer" | "paypal" | "crypto" | "cash") => 
                setFormData(prev => ({ ...prev, paymentMethod: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.paymentMethod === "bank_transfer" && (
            <div className="space-y-2">
              <Label>Bank Account (IBAN)</Label>
              <Input
                placeholder="KW12 CBK0 0000 0000 0000 1234"
                value={formData.bankAccount}
                onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Payment Details *</Label>
            <Input
              placeholder={
                formData.paymentMethod === "bank_transfer" ? "Commercial Bank of Kuwait - Account 1234" :
                formData.paymentMethod === "paypal" ? "PayPal email address" :
                formData.paymentMethod === "crypto" ? "Crypto wallet address" :
                "Cash pickup details"
              }
              value={formData.paymentDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentDetails: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: COLORS.primary }} type="button">
            Add Owner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReferralCodeGenerator({ onGenerate, owners }: {
  onGenerate: (code: Partial<ReferralCode>) => void;
  owners: Owner[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    commissionRate: 25,
    maxUsage: "",
    expiresAt: "",
    ownerId: ""
  });

  const handleGenerate = () => {
    if (!formData.name || !formData.code || !formData.ownerId) {
      toast.error("Please fill in required fields");
      return;
    }

    const selectedOwner = owners.find(o => o.id === formData.ownerId);
    if (!selectedOwner) {
      toast.error("Please select a valid owner");
      return;
    }

    onGenerate({
      code: formData.code.toUpperCase(),
      name: formData.name,
      description: formData.description,
      ownerId: selectedOwner.id,
      ownerName: selectedOwner.name,
      commissionRate: formData.commissionRate,
      maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : undefined,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
      isActive: true,
      createdAt: new Date(),
      usageCount: 0,
      totalEarnings: 0
    });

    setFormData({
      name: "",
      description: "",
      code: "",
      commissionRate: 25,
      maxUsage: "",
      expiresAt: "",
      ownerId: ""
    });
    setIsOpen(false);
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: COLORS.primary }}
        type="button"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Referral Code
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
              Create Referral Code
            </DialogTitle>
            <DialogDescription>
              Generate a custom referral code for an owner
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Code Name *</Label>
              <Input
                placeholder="e.g., VIP Clients, Gold Package"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Brief description of the code purpose"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Referral Code *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="OWNER-CODE24"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="flex-1"
                />
                <Button variant="outline" onClick={generateRandomCode} type="button">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Code Owner *</Label>
              <Select 
                value={formData.ownerId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, ownerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select code owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.filter(o => o.isActive).map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      <div className="flex items-center gap-2">
                        <span>{owner.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {owner.paymentMethod}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Commission Rate (%)</Label>
              <Select 
                value={formData.commissionRate.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, commissionRate: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="30">30%</SelectItem>
                  <SelectItem value="35">35%</SelectItem>
                  <SelectItem value="40">40%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Max Usage (Optional)</Label>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  value={formData.maxUsage}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Expires At (Optional)</Label>
                <Input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
              Cancel
            </Button>
            <Button onClick={handleGenerate} style={{ backgroundColor: COLORS.primary }} type="button">
              Create Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddOwedAmountDialog({ isOpen, onClose, onAdd, owners }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Partial<OwedTransaction>) => void;
  owners: Owner[];
}) {
  const [formData, setFormData] = useState({
    ownerId: "",
    amount: "",
    description: "",
    notes: ""
  });

  const handleSubmit = () => {
    if (!formData.ownerId || !formData.amount || !formData.description) {
      toast.error("Please fill in required fields");
      return;
    }

    const selectedOwner = owners.find(o => o.id === formData.ownerId);
    if (!selectedOwner) {
      toast.error("Please select a valid owner");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    onAdd({
      ownerId: selectedOwner.id,
      ownerName: selectedOwner.name,
      amount: amount,
      description: formData.description,
      date: new Date(),
      notes: formData.notes
    });

    setFormData({
      ownerId: "",
      amount: "",
      description: "",
      notes: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
            Add Owed Amount
          </DialogTitle>
          <DialogDescription>
            Record a new amount owed to an owner
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Owner *</Label>
            <Select 
              value={formData.ownerId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, ownerId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {owners.filter(o => o.isActive).map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    <div className="flex items-center gap-2">
                      <span>{owner.name}</span>
                      <Badge variant="outline" className="text-xs">
                        KWD {owner.owedAmount.toFixed(2)} owed
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount (KWD) *</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="125.75"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Input
              placeholder="e.g., VIP client referral - Client Name"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              placeholder="Additional notes about the commission"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: COLORS.primary }} type="button">
            Add Amount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TransferDialog({ isOpen, onClose, onTransfer, owner }: {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (transfer: Partial<Transfer>) => void;
  owner: Owner | null;
}) {
  const [formData, setFormData] = useState({
    amount: "",
    transactionNumber: "",
    notes: ""
  });

  useEffect(() => {
    if (owner) {
      setFormData(prev => ({ ...prev, amount: owner.owedAmount.toString() }));
    }
  }, [owner]);

  const handleSubmit = () => {
    if (!formData.amount || !formData.transactionNumber) {
      toast.error("Please fill in required fields");
      return;
    }

    if (!owner) {
      toast.error("No owner selected");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > owner.owedAmount) {
      toast.error("Transfer amount cannot exceed owed amount");
      return;
    }

    onTransfer({
      ownerId: owner.id,
      ownerName: owner.name,
      amount: amount,
      transactionNumber: formData.transactionNumber,
      transferDate: new Date(),
      notes: formData.notes
    });

    setFormData({
      amount: "",
      transactionNumber: "",
      notes: ""
    });
    onClose();
  };

  if (!owner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
            Transfer to {owner.name}
          </DialogTitle>
          <DialogDescription>
            Transfer money to this owner in your system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current owed amount:</span>
              <span className="text-lg font-semibold text-red-600">
                KWD {owner.owedAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Payment method:</span>
              <span className="text-sm font-medium">{owner.paymentDetails}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Transfer Amount (KWD) *</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Transaction Number *</Label>
            <Input
              placeholder="TXN-2024-009"
              value={formData.transactionNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, transactionNumber: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              placeholder="Transfer notes or reference"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: COLORS.primary }} type="button">
            <Send className="w-4 h-4 mr-2" />
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReferralSystem() {
  const [stats] = useState<SystemStats>(mockSystemStats);
  const [owners, setOwners] = useState<Owner[]>(mockOwners);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>(mockReferralCodes);
  const [owedTransactions, setOwedTransactions] = useState<OwedTransaction[]>(mockOwedTransactions);
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [showAddOwedAmount, setShowAddOwedAmount] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedOwnerForTransfer, setSelectedOwnerForTransfer] = useState<Owner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddOwner = (newOwner: Partial<Owner>) => {
    const owner: Owner = {
      id: Date.now().toString(),
      name: newOwner.name!,
      email: newOwner.email!,
      phone: newOwner.phone,
      bankAccount: newOwner.bankAccount,
      paymentMethod: newOwner.paymentMethod!,
      paymentDetails: newOwner.paymentDetails!,
      isActive: true,
      createdAt: new Date(),
      owedAmount: 0,
      totalPaid: 0
    };
    setOwners(prev => [owner, ...prev]);
    toast.success("Owner added successfully!");
  };

  const handleAddReferralCode = (newCode: Partial<ReferralCode>) => {
    const code: ReferralCode = {
      id: Date.now().toString(),
      code: newCode.code!,
      name: newCode.name!,
      description: newCode.description!,
      ownerId: newCode.ownerId!,
      ownerName: newCode.ownerName!,
      commissionRate: newCode.commissionRate!,
      isActive: true,
      createdAt: new Date(),
      expiresAt: newCode.expiresAt,
      usageCount: 0,
      maxUsage: newCode.maxUsage,
      totalEarnings: 0
    };
    setReferralCodes(prev => [code, ...prev]);
    toast.success("Referral code created successfully!");
  };

  const handleAddOwedAmount = (newTransaction: Partial<OwedTransaction>) => {
    const transaction: OwedTransaction = {
      id: Date.now().toString(),
      ownerId: newTransaction.ownerId!,
      ownerName: newTransaction.ownerName!,
      amount: newTransaction.amount!,
      description: newTransaction.description!,
      date: new Date(),
      notes: newTransaction.notes
    };
    setOwedTransactions(prev => [transaction, ...prev]);

    // Update owner's owed amount
    setOwners(prev => prev.map(owner => 
      owner.id === newTransaction.ownerId 
        ? { ...owner, owedAmount: owner.owedAmount + newTransaction.amount! }
        : owner
    ));

    toast.success("Owed amount added successfully!");
  };

  const handleTransfer = (newTransfer: Partial<Transfer>) => {
    const transfer: Transfer = {
      id: Date.now().toString(),
      ownerId: newTransfer.ownerId!,
      ownerName: newTransfer.ownerName!,
      amount: newTransfer.amount!,
      transactionNumber: newTransfer.transactionNumber!,
      transferDate: new Date(),
      notes: newTransfer.notes
    };
    setTransfers(prev => [transfer, ...prev]);

    // Update owner's balances
    setOwners(prev => prev.map(owner => 
      owner.id === newTransfer.ownerId 
        ? { 
            ...owner, 
            owedAmount: owner.owedAmount - newTransfer.amount!,
            totalPaid: owner.totalPaid + newTransfer.amount!
          }
        : owner
    ));

    toast.success(`Transfer of KWD ${newTransfer.amount} completed!`);
    setSelectedOwnerForTransfer(null);
  };

  const handleOwnerClick = (owner: Owner) => {
    if (owner.owedAmount > 0) {
      setSelectedOwnerForTransfer(owner);
      setShowTransferDialog(true);
    } else {
      toast.info("No amount owed to this owner");
    }
  };

  const handleToggleOwnerStatus = (ownerId: string) => {
    setOwners(prev => prev.map(owner => 
      owner.id === ownerId ? { ...owner, isActive: !owner.isActive } : owner
    ));
  };

  const handleToggleCodeStatus = (codeId: string) => {
    setReferralCodes(prev => prev.map(code => 
      code.id === codeId ? { ...code, isActive: !code.isActive } : code
    ));
  };

  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCodes = referralCodes.filter(code =>
    code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOwedTransactions = owedTransactions.filter(transaction =>
    transaction.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransfers = transfers.filter(transfer =>
    transfer.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transfer.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: COLORS.dark }}>
            Referral System
          </h1>
          <p className="text-gray-600">
            Manage referral codes, track transactions, and handle payouts
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search owners, codes, transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      {/* System Stats */}
      <SystemStatsCard stats={stats} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="owners" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="owners">Owners & Balances</TabsTrigger>
          <TabsTrigger value="codes">Referral Codes</TabsTrigger>
          <TabsTrigger value="owed">Owed Amounts</TabsTrigger>
          <TabsTrigger value="transfers">Transfer History</TabsTrigger>
        </TabsList>

        {/* Owners Tab */}
        <TabsContent value="owners" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.dark }}>
              Owners & Balances ({filteredOwners.length})
            </h2>
            <Button 
              onClick={() => setShowAddOwner(true)}
              style={{ backgroundColor: COLORS.primary }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Owner
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredOwners.map((owner, index) => (
              <motion.div
                key={owner.id}
                className="bg-white rounded-xl border p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
                style={{ borderColor: owner.owedAmount > 0 ? COLORS.primary : COLORS.lightGray }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleOwnerClick(owner)}
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback style={{ backgroundColor: COLORS.primary + "20", color: COLORS.primary }}>
                        {owner.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: COLORS.dark }}>
                        {owner.name}
                      </h3>
                      <p className="text-gray-600">{owner.email}</p>
                      {owner.phone && (
                        <p className="text-sm text-gray-500">{owner.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className={`text-xl font-bold ${owner.owedAmount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          KWD {owner.owedAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Amount Owed</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">
                          KWD {owner.totalPaid.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Total Paid</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={owner.isActive ? "default" : "secondary"}>
                        {owner.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {owner.paymentMethod}
                      </Badge>
                      {owner.owedAmount > 0 && (
                        <Badge style={{ backgroundColor: COLORS.primary, color: "white" }} className="text-xs">
                          Click to Transfer
                        </Badge>
                      )}
                      <Switch
                        checked={owner.isActive}
                        onCheckedChange={(e) => {
                          e.stopPropagation();
                          handleToggleOwnerStatus(owner.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {owner.createdAt.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Banknote className="w-4 h-4" />
                      {owner.paymentDetails}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Codes Tab */}
        <TabsContent value="codes" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.dark }}>
              Referral Codes ({filteredCodes.length})
            </h2>
            <ReferralCodeGenerator onGenerate={handleAddReferralCode} owners={owners} />
          </div>

          <div className="grid gap-4">
            {filteredCodes.map((code, index) => (
              <motion.div
                key={code.id}
                className="bg-white rounded-xl border p-6"
                style={{ borderColor: COLORS.lightGray }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: COLORS.primary + "20", color: COLORS.primary }}
                    >
                      <Tag className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-semibold" style={{ color: COLORS.dark }}>
                          {code.code}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(code.code);
                            toast.success("Code copied to clipboard!");
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-base" style={{ color: COLORS.dark }}>
                        {code.name}
                      </h3>
                      <p className="text-gray-600">{code.description}</p>
                      <p className="text-sm text-gray-500">Owner: {code.ownerName}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold" style={{ color: COLORS.primary }}>
                          {code.commissionRate}%
                        </div>
                        <div className="text-xs text-gray-500">Commission</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-blue-600">
                          {code.usageCount}
                        </div>
                        <div className="text-xs text-gray-500">Uses</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-600">
                          KWD {code.totalEarnings.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Earnings</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={code.isActive ? "default" : "secondary"}>
                        {code.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {code.maxUsage && (
                        <Badge variant="outline" className="text-xs">
                          Max: {code.maxUsage}
                        </Badge>
                      )}
                      <Switch
                        checked={code.isActive}
                        onCheckedChange={() => handleToggleCodeStatus(code.id)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {code.createdAt.toLocaleDateString()}
                    </span>
                    {code.expiresAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Expires {code.expiresAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Owed Amounts Tab */}
        <TabsContent value="owed" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.dark }}>
              Owed Amounts ({filteredOwedTransactions.length})
            </h2>
            <Button 
              onClick={() => setShowAddOwedAmount(true)}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Owed Amount
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredOwedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                className="bg-white rounded-xl border p-6"
                style={{ borderColor: COLORS.lightGray }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: COLORS.primary + "20", color: COLORS.primary }}
                    >
                      <Receipt className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: COLORS.dark }}>
                        {transaction.ownerName}
                      </h3>
                      <p className="text-gray-600">{transaction.description}</p>
                      {transaction.notes && (
                        <p className="text-sm text-gray-500">{transaction.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-red-600">
                        KWD {transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">Amount Owed</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {transaction.date.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Transfer History Tab */}
        <TabsContent value="transfers" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.dark }}>
              Transfer History ({filteredTransfers.length})
            </h2>
          </div>

          <div className="grid gap-4">
            {filteredTransfers.map((transfer, index) => (
              <motion.div
                key={transfer.id}
                className="bg-white rounded-xl border p-6"
                style={{ borderColor: COLORS.lightGray }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#10B981", color: "white" }}
                    >
                      <Send className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: COLORS.dark }}>
                        {transfer.ownerName}
                      </h3>
                      <p className="text-gray-600 font-mono">{transfer.transactionNumber}</p>
                      {transfer.notes && (
                        <p className="text-sm text-gray-500">{transfer.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        KWD {transfer.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">Transferred</div>
                    </div>
                    
                    <Badge className="bg-green-100 text-green-700">
                      Completed
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {transfer.transferDate.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Transfer Completed
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddOwnerDialog
        isOpen={showAddOwner}
        onClose={() => setShowAddOwner(false)}
        onAdd={handleAddOwner}
      />

      <AddOwedAmountDialog
        isOpen={showAddOwedAmount}
        onClose={() => setShowAddOwedAmount(false)}
        onAdd={handleAddOwedAmount}
        owners={owners}
      />

      <TransferDialog
        isOpen={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
        onTransfer={handleTransfer}
        owner={selectedOwnerForTransfer}
      />
    </div>
  );
}