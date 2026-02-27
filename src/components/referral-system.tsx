import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import {
  useGetReferralDashboardQuery,
  useGetReferralOwnersQuery,
  useGetReferralCodesQuery,
  useGetReferralOwedQuery,
  useGetReferralTransfersQuery,
  useCreateReferralOwnerMutation,
  useCreateReferralCodeMutation,
  useCreateReferralOwedMutation,
  useToggleReferralOwnerMutation,
  useToggleReferralCodeMutation,
  type ReferralOwner,
  type ReferralCode,
  type ReferralOwed,
  type ReferralTransfer,
  ReferralDashboard,
} from "../store/api/referralApi";
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
import { toast } from "sonner";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

// interface SystemStats {
//   totalOwners: number;
//   activeOwners: number;
//   activeOwnersNewThisMonth: number;
//   totalOwed: number;
//   totalPaid: number;
//   thisMonthTransactions: number;
//   thisMonthTransfers: number;
//   totalPaidTransfers: number;
// }

function SystemStatsCard({ stats }: { stats: ReferralDashboard }) {
  const statsData = [
    {
      label: "Active Owners",
      value: stats.activeOwners,
      subtitle: `${stats.totalOwners} total`,
      icon: <Users className="w-5 h-5" />,
      color: COLORS.primary,
      change: `+${stats.activeOwnersNewThisMonth} this month`,
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
      change: `${stats.totalPaidTransfers} transfers`,
      positive: true
    },
    {
      label: "This Month",
      value: stats.thisMonthTransfers,
      subtitle: "Transfers made",
      icon: <Send className="w-5 h-5" />,
      color: "#8B5CF6",
      change:  `${stats.thisMonthTransfersPercentageChange}%`,
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

function AddOwnerDialog({ isOpen, onClose, onAdd, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payload: {
    fullName: string;
    email: string;
    phone?: string;
    phoneCode?: string;
    paymentMethod: string;
    bankAccount?: string;
    paymentDetails: string;
  }) => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCode: "+965",
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
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      phoneCode: formData.phoneCode || "+965",
      paymentMethod: formData.paymentMethod,
      bankAccount: formData.bankAccount || undefined,
      paymentDetails: formData.paymentDetails,
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      phoneCode: "+965",
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

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1 space-y-2">
              <Label>Phone Code</Label>
              <Select
                value={formData.phoneCode}
                onValueChange={(v) => setFormData(prev => ({ ...prev, phoneCode: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+965">+965</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                  <SelectItem value="+971">+971</SelectItem>
                  <SelectItem value="+966">+966</SelectItem>
                  <SelectItem value="+20">+20</SelectItem>
                  <SelectItem value="+91">+91</SelectItem>
                  <SelectItem value="+92">+92</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="99991234"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
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
          <Button variant="outline" onClick={onClose} type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: COLORS.primary }} type="button" disabled={isLoading}>
            {isLoading ? "Adding…" : "Add Owner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReferralCodeGenerator({ onCreate, owners, isLoading }: {
  onCreate: (payload: {
    codeName: string;
    description: string;
    referralOwner: string;
    commissionRate: number;
    maxUsage?: number;
  }) => void;
  owners: ReferralOwner[];
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    commissionRate: 25,
    maxUsage: "",
    ownerId: ""
  });

  const handleGenerate = () => {
    if (!formData.name || !formData.ownerId) {
      toast.error("Please fill in required fields");
      return;
    }

    const selectedOwner = owners.find(o => o.id === formData.ownerId);
    if (!selectedOwner) {
      toast.error("Please select a valid owner");
      return;
    }

    onCreate({
      codeName: formData.name,
      description: formData.description,
      referralOwner: selectedOwner.id,
      commissionRate: formData.commissionRate,
      maxUsage: formData.maxUsage ? parseInt(formData.maxUsage, 10) : undefined,
    });

    setFormData({
      name: "",
      description: "",
      commissionRate: 25,
      maxUsage: "",
      ownerId: ""
    });
    setIsOpen(false);
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

            <div className="space-y-2">
              <Label>Max Usage (Optional)</Label>
              <Input
                type="number"
                placeholder="Unlimited"
                value={formData.maxUsage}
                onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} type="button" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} style={{ backgroundColor: COLORS.primary }} type="button" disabled={isLoading}>
              {isLoading ? "Creating…" : "Create Code"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddOwedAmountDialog({ isOpen, onClose, onAdd, owners, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payload: { referralOwner: string; amount: number; description: string; notes?: string }) => void;
  owners: ReferralOwner[];
  isLoading?: boolean;
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
      referralOwner: selectedOwner.id,
      amount,
      description: formData.description,
      notes: formData.notes || undefined,
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
          <Button variant="outline" onClick={onClose} type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: COLORS.primary }} type="button" disabled={isLoading}>
            {isLoading ? "Adding…" : "Add Amount"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TransferDialog({ isOpen, onClose, onTransfer, owner }: {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (transfer: { ownerId: string; ownerName: string; amount: number; transactionNumber: string; notes?: string; transferDate?: Date }) => void;
  owner: ReferralOwner | null;
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
  const { t } = useTranslation();
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [showAddOwedAmount, setShowAddOwedAmount] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedOwnerForTransfer, setSelectedOwnerForTransfer] = useState<ReferralOwner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dashboardData, isLoading: dashboardLoading } = useGetReferralDashboardQuery();
  const { data: owners = [], isLoading: ownersLoading, refetch: refetchOwners } = useGetReferralOwnersQuery();
  const { data: referralCodes = [], isLoading: codesLoading, refetch: refetchCodes } = useGetReferralCodesQuery();
  const { data: owedTransactions = [], isLoading: owedLoading, refetch: refetchOwed } = useGetReferralOwedQuery();
  const { data: transfers = [], isLoading: transfersLoading, refetch: refetchTransfers } = useGetReferralTransfersQuery();

  const [createOwner, { isLoading: createOwnerLoading }] = useCreateReferralOwnerMutation();
  const [createCode, { isLoading: createCodeLoading }] = useCreateReferralCodeMutation();
  const [createOwed, { isLoading: createOwedLoading }] = useCreateReferralOwedMutation();
  const [toggleOwner] = useToggleReferralOwnerMutation();
  const [toggleCode] = useToggleReferralCodeMutation();

  const stats: ReferralDashboard = useMemo(() => {
    console.log('dashboardData', dashboardData);
    if (dashboardData) {
      return {
        totalOwners: dashboardData.totalOwners,
        activeOwners: dashboardData.activeOwners,
        activeOwnersNewThisMonth: dashboardData.activeOwnersNewThisMonth,
        totalOwed: dashboardData.totalOwed,
        totalPaid: dashboardData.totalPaid,
        thisMonthTransactions: dashboardData.thisMonthTransactions,
        thisMonthTransfers: dashboardData.thisMonthTransfers,
        thisMonthTransfersPercentageChange: dashboardData.thisMonthTransfersPercentageChange,
        totalPaidTransfers: dashboardData.totalPaidTransfers,
      };
    }
    const totalOwners = owners.length;
    const activeOwners = owners.filter((o) => o.isActive).length;
    const totalOwed = owners.reduce((sum, o) => sum + (o.owedAmount ?? 0), 0);
    const totalPaid = owners.reduce((sum, o) => sum + (o.totalPaid ?? 0), 0);
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const thisMonthTransactions = owedTransactions.filter(
      (tx) => new Date(tx.date).getMonth() === thisMonth && new Date(tx.date).getFullYear() === thisYear
    ).length;
    const thisMonthTransfers = transfers.filter(
      (tx) => new Date(tx.transferDate).getMonth() === thisMonth && new Date(tx.transferDate).getFullYear() === thisYear
    ).length;
    return {
      totalOwners,
      activeOwners,
      totalOwed,
      totalPaid,
      thisMonthTransactions,
      thisMonthTransfers,
    };
  }, [dashboardData, owners, owedTransactions, transfers]);

  const handleAddOwner = async (payload: {
    fullName: string;
    email: string;
    phone?: string;
    phoneCode?: string;
    paymentMethod: string;
    bankAccount?: string;
    paymentDetails: string;
  }) => {
    try {
      await createOwner(payload).unwrap();
      toast.success("Owner added successfully!");
      setShowAddOwner(false);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "data" in (err as { data?: { message?: string } }) ? (err as { data: { message?: string } }).data?.message : "Failed to add owner";
      toast.error(msg || "Failed to add owner");
    }
  };

  const handleAddReferralCode = async (payload: {
    codeName: string;
    description: string;
    referralOwner: string;
    commissionRate: number;
    maxUsage?: number;
  }) => {
    try {
      await createCode(payload).unwrap();
      toast.success("Referral code created successfully!");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "data" in (err as { data?: { message?: string } }) ? (err as { data: { message?: string } }).data?.message : "Failed to create code";
      toast.error(msg || "Failed to create code");
    }
  };

  const handleAddOwedAmount = async (payload: { referralOwner: string; amount: number; description: string; notes?: string }) => {
    try {
      await createOwed(payload).unwrap();
      toast.success("Owed amount added successfully!");
      setShowAddOwedAmount(false);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "data" in (err as { data?: { message?: string } }) ? (err as { data: { message?: string } }).data?.message : "Failed to add owed amount";
      toast.error(msg || "Failed to add owed amount");
    }
  };

  const handleTransfer = (newTransfer: { ownerId: string; ownerName: string; amount: number; transactionNumber: string; notes?: string; transferDate?: Date }) => {
    toast.success(`Record transfer of KWD ${newTransfer.amount} to ${newTransfer.ownerName}. Transfer history is loaded from the server.`);
    setSelectedOwnerForTransfer(null);
    setShowTransferDialog(false);
    refetchOwners();
    refetchOwed();
    refetchTransfers();
  };

  const handleOwnerClick = (owner: ReferralOwner) => {
    if (owner.owedAmount > 0) {
      setSelectedOwnerForTransfer(owner);
      setShowTransferDialog(true);
    } else {
      toast.info("No amount owed to this owner");
    }
  };

  const handleToggleOwnerStatus = async (ownerId: string) => {
    try {
      await toggleOwner(ownerId).unwrap();
      toast.success("Owner status updated");
    } catch {
      toast.error("Failed to toggle owner status");
    }
  };

  const handleToggleCodeStatus = async (codeId: string) => {
    try {
      await toggleCode(codeId).unwrap();
      toast.success("Code status updated");
    } catch {
      toast.error("Failed to toggle code status");
    }
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
            {t("pages.referralSystem.title")}
          </h1>
          <p className="text-gray-600">
            {t("pages.referralSystem.subtitle")}
          </p>
        </div>
        
        {/* <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t("pages.referralSystem.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
        </div> */}
      </div>

      {/* Loading / error */}
      {(dashboardLoading || ownersLoading || codesLoading || owedLoading || transfersLoading) && (
        <div className="flex items-center gap-2 text-gray-600">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading referral data…</span>
        </div>
      )}

      {/* System Stats */}
      <SystemStatsCard stats={stats} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="owners" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="owners">
            {t("pages.referralSystem.tabs.ownersBalances")}
          </TabsTrigger>
          <TabsTrigger value="codes">
            {t("pages.referralSystem.tabs.referralCodes")}
          </TabsTrigger>
          <TabsTrigger value="owed">
            {t("pages.referralSystem.tabs.owedAmounts")}
          </TabsTrigger>
          <TabsTrigger value="transfers">
            {t("pages.referralSystem.tabs.transferHistory")}
          </TabsTrigger>
        </TabsList>

        {/* Owners Tab */}
        <TabsContent value="owners" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.dark }}>
              {t("pages.referralSystem.tabs.ownersBalances")} ({filteredOwners.length})
            </h2>
            <Button 
              onClick={() => setShowAddOwner(true)}
              style={{ backgroundColor: COLORS.primary }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {t("pages.referralSystem.actions.addOwner")}
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
                        onCheckedChange={() => handleToggleOwnerStatus(owner.id)}
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
              {t("pages.referralSystem.tabs.referralCodes")} ({filteredCodes.length})
            </h2>
            <ReferralCodeGenerator onCreate={handleAddReferralCode} owners={owners} isLoading={createCodeLoading} />
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
              {t("pages.referralSystem.tabs.owedAmounts")} ({filteredOwedTransactions.length})
            </h2>
            <Button 
              onClick={() => setShowAddOwedAmount(true)}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("pages.referralSystem.actions.addOwedAmount")}
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
              {t("pages.referralSystem.tabs.transferHistory")} ({filteredTransfers.length})
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
        isLoading={createOwnerLoading}
      />

      <AddOwedAmountDialog
        isOpen={showAddOwedAmount}
        onClose={() => setShowAddOwedAmount(false)}
        onAdd={handleAddOwedAmount}
        owners={owners}
        isLoading={createOwedLoading}
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