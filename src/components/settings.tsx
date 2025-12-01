import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings as SettingsIcon,
  User,
  CreditCard,
  Bell,
  Shield,
  Key,
  Globe,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  Package,
  Star,
  Crown,
  Zap,
  Check,
  X,
  Edit,
  Save,
  Camera,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  RefreshCw,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Building,
  MapPin,
  Lock,
  Unlock,
  Switch as SwitchIcon,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Tablet,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Database,
  HardDrive,
  Cpu,
  Activity,
  BarChart3,
  TrendingUp,
  Percent
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner@2.0.3";
import { BillingManagement } from "./billing-management";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface PlatformSubscription {
  id: string;
  plan: "basic" | "professional" | "enterprise";
  status: "active" | "cancelled" | "past_due" | "trialing";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextBillingDate?: Date;
  amount: number;
  currency: string;
  paymentMethod: {
    type: "card" | "bank_account";
    last4: string;
    brand?: string;
  };
  features: string[];
  usage: {
    subscribers: { current: number; limit: number };
    signals: { current: number; limit: number };
    storage: { current: number; limit: number }; // in GB
    courses: { current: number; limit: number };
  };
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  timezone: string;
  language: string;
  website: string;
}

interface NotificationSettings {
  email: {
    newSubscribers: boolean;
    paymentUpdates: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
  };
  push: {
    newMessages: boolean;
    signalAlerts: boolean;
    consultationReminders: boolean;
    systemNotifications: boolean;
  };
  sms: {
    criticalAlerts: boolean;
    paymentFailures: boolean;
    securityAlerts: boolean;
  };
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  deviceTracking: boolean;
  passwordLastChanged: Date;
  activeSessions: number;
}

const mockSubscription: PlatformSubscription = {
  id: "sub_1234567890",
  plan: "professional",
  status: "active",
  currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  amount: 99.99,
  currency: "USD",
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "visa"
  },
  features: [
    "Up to 1,000 subscribers",
    "Unlimited signals",
    "100GB storage",
    "Live streaming",
    "Advanced analytics",
    "API access",
    "Priority support"
  ],
  usage: {
    subscribers: { current: 342, limit: 1000 },
    signals: { current: 127, limit: -1 }, // unlimited
    storage: { current: 23.5, limit: 100 },
    courses: { current: 8, limit: 25 }
  }
};

const mockProfile: UserProfile = {
  id: "user_123",
  firstName: "John",
  lastName: "Analyst",
  email: "john@forexanalyst.com",
  phone: "+1 (555) 123-4567",
  company: "Elite Forex Trading",
  title: "Senior Market Analyst",
  bio: "Professional forex analyst with 8+ years experience in currency markets and technical analysis.",
  avatar: "",
  location: "New York, NY",
  timezone: "America/New_York",
  language: "en",
  website: "https://eliteforextrading.com"
};

const mockNotifications: NotificationSettings = {
  email: {
    newSubscribers: true,
    paymentUpdates: true,
    systemUpdates: true,
    marketingEmails: false,
    securityAlerts: true
  },
  push: {
    newMessages: true,
    signalAlerts: true,
    consultationReminders: true,
    systemNotifications: false
  },
  sms: {
    criticalAlerts: true,
    paymentFailures: true,
    securityAlerts: true
  }
};

const mockSecurity: SecuritySettings = {
  twoFactorEnabled: true,
  loginNotifications: true,
  deviceTracking: true,
  passwordLastChanged: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  activeSessions: 3
};

function SubscriptionCard({ subscription, onUpgrade, onManage }: {
  subscription: PlatformSubscription;
  onUpgrade: () => void;
  onManage: () => void;
}) {
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "basic": return "#10B981";
      case "professional": return COLORS.primary;
      case "enterprise": return "#8B5CF6";
      default: return "#6B7280";
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "basic": return <Package className="w-6 h-6" />;
      case "professional": return <Star className="w-6 h-6" />;
      case "enterprise": return <Crown className="w-6 h-6" />;
      default: return <Package className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "#10B981";
      case "trialing": return "#3B82F6";
      case "past_due": return "#F59E0B";
      case "cancelled": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const daysLeft = Math.ceil((subscription.currentPeriodEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      className="bg-white rounded-xl border shadow-sm overflow-hidden"
      style={{ borderColor: COLORS.lightGray }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Header */}
      <div 
        className="p-6 text-white relative overflow-hidden"
        style={{ backgroundColor: getPlanColor(subscription.plan) }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-4 translate-y-4"></div>
        </div>
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              {getPlanIcon(subscription.plan)}
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl capitalize">
                {subscription.plan} Plan
              </h3>
              <p className="text-white/80 text-sm">
                ${subscription.amount}/month
              </p>
            </div>
          </div>
          
          <Badge 
            style={{ 
              backgroundColor: getStatusColor(subscription.status) + "20",
              color: getStatusColor(subscription.status),
              border: `1px solid ${getStatusColor(subscription.status)}40`
            }}
            className="text-xs"
          >
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-white/80 text-xs">Current Period</div>
            <div className="font-medium">
              {subscription.currentPeriodStart.toLocaleDateString()} - {subscription.currentPeriodEnd.toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-white/80 text-xs">Days Remaining</div>
            <div className="font-medium">{daysLeft} days</div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="p-6 space-y-4">
        <h4 className="font-medium" style={{ color: COLORS.dark }}>Usage Overview</h4>
        
        <div className="space-y-3">
          {/* Subscribers */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Subscribers</span>
              <span>{subscription.usage.subscribers.current.toLocaleString()} / {subscription.usage.subscribers.limit.toLocaleString()}</span>
            </div>
            <Progress 
              value={(subscription.usage.subscribers.current / subscription.usage.subscribers.limit) * 100}
              className="h-2"
            />
          </div>

          {/* Storage */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Storage</span>
              <span>{subscription.usage.storage.current}GB / {subscription.usage.storage.limit}GB</span>
            </div>
            <Progress 
              value={(subscription.usage.storage.current / subscription.usage.storage.limit) * 100}
              className="h-2"
            />
          </div>

          {/* Courses */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Courses</span>
              <span>{subscription.usage.courses.current} / {subscription.usage.courses.limit}</span>
            </div>
            <Progress 
              value={(subscription.usage.courses.current / subscription.usage.courses.limit) * 100}
              className="h-2"
            />
          </div>

          {/* Signals */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Signals</span>
              <span>{subscription.usage.signals.current} / Unlimited</span>
            </div>
            <div className="h-2 bg-green-100 rounded-full">
              <div className="h-2 bg-green-500 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 pt-0 flex gap-3">
        <Button variant="outline" onClick={onManage} className="flex-1">
          <CreditCard className="w-4 h-4 mr-2" />
          Manage Billing
        </Button>
        <Button 
          onClick={onUpgrade}
          style={{ backgroundColor: COLORS.primary }}
          className="flex-1"
          type="button"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button>
      </div>
    </motion.div>
  );
}

function ProfileSettings({ profile, onUpdateProfile }: {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif font-semibold text-lg" style={{ color: COLORS.dark }}>
            Profile Information
          </h3>
          <p className="text-sm text-gray-600">
            Manage your personal information and professional details
          </p>
        </div>
        
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} style={{ backgroundColor: COLORS.primary }} type="button">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Avatar Section */}
      <motion.div 
        className="bg-white rounded-xl border p-6"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback style={{ backgroundColor: COLORS.primary + "20", color: COLORS.primary }}>
                {formData.firstName[0]}{formData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                style={{ backgroundColor: COLORS.primary }}
                type="button"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium" style={{ color: COLORS.dark }}>Profile Photo</h4>
            <p className="text-sm text-gray-600 mb-3">
              Upload a professional photo that represents you to your subscribers
            </p>
            {isEditing && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Personal Information */}
      <motion.div 
        className="bg-white rounded-xl border p-6"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="font-medium mb-4" style={{ color: COLORS.dark }}>Personal Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>First Name</Label>
            {isEditing ? (
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">{profile.firstName}</div>
            )}
          </div>
          
          <div className="space-y-3">
            <Label>Last Name</Label>
            {isEditing ? (
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">{profile.lastName}</div>
            )}
          </div>
          
          <div className="space-y-3">
            <Label>Email Address</Label>
            {isEditing ? (
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">{profile.email}</div>
            )}
          </div>
          
          <div className="space-y-3">
            <Label>Phone Number</Label>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">{profile.phone}</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Professional Information */}
      <motion.div 
        className="bg-white rounded-xl border p-6"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="font-medium mb-4" style={{ color: COLORS.dark }}>Professional Information</h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Company</Label>
              {isEditing ? (
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{profile.company}</div>
              )}
            </div>
            
            <div className="space-y-3">
              <Label>Title</Label>
              {isEditing ? (
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{profile.title}</div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Professional Bio</Label>
            {isEditing ? (
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                placeholder="Write a brief professional bio that describes your expertise and background..."
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md min-h-[100px]">{profile.bio}</div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Website</Label>
              {isEditing ? (
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profile.website}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Label>Location</Label>
              {isEditing ? (
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{profile.location}</div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function NotificationSettings({ notifications, onUpdateNotifications }: {
  notifications: NotificationSettings;
  onUpdateNotifications: (updates: Partial<NotificationSettings>) => void;
}) {
  const updateEmailNotification = (key: keyof NotificationSettings['email'], value: boolean) => {
    onUpdateNotifications({
      email: { ...notifications.email, [key]: value }
    });
    toast.success("Email notification preference updated");
  };

  const updatePushNotification = (key: keyof NotificationSettings['push'], value: boolean) => {
    onUpdateNotifications({
      push: { ...notifications.push, [key]: value }
    });
    toast.success("Push notification preference updated");
  };

  const updateSMSNotification = (key: keyof NotificationSettings['sms'], value: boolean) => {
    onUpdateNotifications({
      sms: { ...notifications.sms, [key]: value }
    });
    toast.success("SMS notification preference updated");
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <motion.div 
        className="bg-white rounded-xl border p-6"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary + "20" }}
          >
            <Mail className="w-5 h-5" style={{ color: COLORS.primary }} />
          </div>
          <div>
            <h4 className="font-medium" style={{ color: COLORS.dark }}>Email Notifications</h4>
            <p className="text-sm text-gray-600">Choose what email updates you'd like to receive</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            { key: 'newSubscribers' as const, label: 'New Subscribers', description: 'Get notified when someone subscribes to your service' },
            { key: 'paymentUpdates' as const, label: 'Payment Updates', description: 'Billing and payment related notifications' },
            { key: 'systemUpdates' as const, label: 'System Updates', description: 'Important platform updates and maintenance notices' },
            { key: 'marketingEmails' as const, label: 'Marketing Emails', description: 'Tips, feature announcements, and promotional content' },
            { key: 'securityAlerts' as const, label: 'Security Alerts', description: 'Important security-related notifications' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              <Switch
                checked={notifications.email[item.key]}
                onCheckedChange={(checked) => updateEmailNotification(item.key, checked)}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Push Notifications */}
      <motion.div 
        className="bg-white rounded-xl border p-6"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#3B82F620" }}
          >
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium" style={{ color: COLORS.dark }}>Push Notifications</h4>
            <p className="text-sm text-gray-600">Manage in-app and browser notifications</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            { key: 'newMessages' as const, label: 'New Messages', description: 'Chat messages from subscribers' },
            { key: 'signalAlerts' as const, label: 'Signal Alerts', description: 'When your trading signals trigger alerts' },
            { key: 'consultationReminders' as const, label: 'Consultation Reminders', description: 'Upcoming consultation appointments' },
            { key: 'systemNotifications' as const, label: 'System Notifications', description: 'General system and platform notifications' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              <Switch
                checked={notifications.push[item.key]}
                onCheckedChange={(checked) => updatePushNotification(item.key, checked)}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* SMS Notifications */}
      <motion.div 
        className="bg-white rounded-xl border p-6"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#10B98120" }}
          >
            <Phone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium" style={{ color: COLORS.dark }}>SMS Notifications</h4>
            <p className="text-sm text-gray-600">Critical alerts sent via text message</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            { key: 'criticalAlerts' as const, label: 'Critical Alerts', description: 'Urgent market alerts and system issues' },
            { key: 'paymentFailures' as const, label: 'Payment Failures', description: 'Failed payment attempts and billing issues' },
            { key: 'securityAlerts' as const, label: 'Security Alerts', description: 'Account security and login notifications' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              <Switch
                checked={notifications.sms[item.key]}
                onCheckedChange={(checked) => updateSMSNotification(item.key, checked)}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SecuritySettings({ security, onUpdateSecurity }: {
  security: SecuritySettings;
  onUpdateSecurity: (updates: Partial<SecuritySettings>) => void;
}) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const daysSincePasswordChange = Math.floor((new Date().getTime() - security.passwordLastChanged.getTime()) / (1000 * 60 * 60 * 24));

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    onUpdateSecurity({ passwordLastChanged: new Date() });
    setPasswordData({ current: "", new: "", confirm: "" });
    setShowChangePassword(false);
    toast.success("Password changed successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Authentication */}
      <motion.div 
        className="bg-white rounded-xl border p-6"
        style={{ borderColor: COLORS.lightGray }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary + "20" }}
          >
            <Shield className="w-5 h-5" style={{ color: COLORS.primary }} />
          </div>
          <div>
            <h4 className="font-medium" style={{ color: COLORS.dark }}>Authentication & Security</h4>
            <p className="text-sm text-gray-600">Manage your account security settings</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Two-Factor Authentication</div>
                <div className="text-xs text-gray-500">Add an extra layer of security to your account</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">Enabled</Badge>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Key className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Password</div>
                <div className="text-xs text-gray-500">Last changed {daysSincePasswordChange} days ago</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowChangePassword(true)}>
              Change Password
            </Button>
          </div>

          {/* Login Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Bell className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Login Notifications</div>
                <div className="text-xs text-gray-500">Get notified of new login attempts</div>
              </div>
            </div>
            <Switch
              checked={security.loginNotifications}
              onCheckedChange={(checked) => onUpdateSecurity({ loginNotifications: checked })}
            />
          </div>

          {/* Device Tracking */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Monitor className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Device Tracking</div>
                <div className="text-xs text-gray-500">Track and manage your active sessions</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{security.activeSessions} active</span>
              <Button variant="outline" size="sm">Manage Devices</Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif" style={{ color: COLORS.dark }}>
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new secure password
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
              />
            </div>
            
            <div className="space-y-3">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
              />
            </div>

            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowChangePassword(false)} type="button">
                Cancel
              </Button>
              <Button 
                onClick={handlePasswordChange}
                style={{ backgroundColor: COLORS.primary }}
                disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
                type="button"
              >
                Change Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SettingsProps {
  onNavigate?: (section: string, subSection?: string) => void;
}

export function Settings({ onNavigate }: SettingsProps = {}) {
  const [subscription, setSubscription] = useState<PlatformSubscription>(mockSubscription);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [notifications, setNotifications] = useState<NotificationSettings>(mockNotifications);
  const [security, setSecurity] = useState<SecuritySettings>(mockSecurity);
  const [showBillingManagement, setShowBillingManagement] = useState(false);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleUpdateNotifications = (updates: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...updates }));
  };

  const handleUpdateSecurity = (updates: Partial<SecuritySettings>) => {
    setSecurity(prev => ({ ...prev, ...updates }));
  };

  const handleUpgradePlan = () => {
    onNavigate?.("Plan Upgrade");
  };

  const handleManageBilling = () => {
    setShowBillingManagement(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl lg:text-3xl" style={{ color: COLORS.dark }}>
          Account Settings
        </h1>
        <p className="text-sm lg:text-base" style={{ color: COLORS.dark + "80" }}>
          Manage your platform subscription, profile, and account preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionCard 
            subscription={subscription}
            onUpgrade={handleUpgradePlan}
            onManage={handleManageBilling}
          />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings 
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings 
            notifications={notifications}
            onUpdateNotifications={handleUpdateNotifications}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings 
            security={security}
            onUpdateSecurity={handleUpdateSecurity}
          />
        </TabsContent>
      </Tabs>

      {/* Billing Management Dialog */}
      <BillingManagement 
        isOpen={showBillingManagement}
        onClose={() => setShowBillingManagement(false)}
      />
    </div>
  );
}