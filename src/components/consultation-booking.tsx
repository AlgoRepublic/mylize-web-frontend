import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar,
  Clock,
  User,
  Users,
  Video,
  Phone,
  MapPin,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Check,
  AlertCircle,
  Star,
  MessageCircle,
  FileText,
  Download,
  Upload,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  BellRing,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  MoreHorizontal,
  Eye,
  ExternalLink,
  Copy,
  Share2,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Shield,
  Award,
  Gift,
  Heart,
  ThumbsUp,
  Send,
  Headphones,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useTranslation } from "react-i18next";
import { Progress } from "./ui/progress";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface ConsultationSession {
  id: string;
  title: string;
  description: string;
  type: "one-on-one" | "group" | "workshop" | "masterclass";
  format: "video" | "phone" | "in-person";
  duration: number; // in minutes
  price: number;
  maxParticipants?: number;
  scheduledAt: Date;
  status: "scheduled" | "completed" | "cancelled" | "in-progress";
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  recording?: string;
  materials?: string[];
  rating?: number;
  feedback?: string;
  tags: string[];
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isActive: boolean;
  consultationType: "one-on-one" | "group" | "workshop" | "all";
}

interface ConsultationTemplate {
  id: string;
  title: string;
  description: string;
  type: "one-on-one" | "group" | "workshop" | "masterclass";
  duration: number;
  price: number;
  maxParticipants?: number;
  isActive: boolean;
  tags: string[];
}

interface ConsultationMetrics {
  totalSessions: number;
  totalRevenue: number;
  completedSessions: number;
  averageRating: number;
  totalHours: number;
  repeatClients: number;
  cancellationRate: number;
  monthlyGrowth: number;
}

const mockSessions: ConsultationSession[] = [
  {
    id: "consult-001",
    title: "Personal Trading Strategy Review",
    description: "One-on-one session to analyze current trading approach and develop personalized strategy improvements.",
    type: "one-on-one",
    format: "video",
    duration: 60,
    price: 150,
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    status: "scheduled",
    clientName: "John Smith",
    clientEmail: "john.smith@email.com",
    clientPhone: "+1-555-0123",
    paymentStatus: "paid",
    notes: "Client wants to focus on risk management and position sizing",
    tags: ["Strategy", "Risk Management", "Personal"]
  },
  {
    id: "consult-002",
    title: "Advanced Options Trading Workshop",
    description: "Group workshop covering advanced options strategies and market analysis techniques.",
    type: "workshop",
    format: "video",
    duration: 120,
    price: 75,
    maxParticipants: 10,
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    status: "scheduled",
    clientName: "Group Session",
    clientEmail: "workshops@analyst.com",
    paymentStatus: "paid",
    notes: "7 participants registered so far",
    tags: ["Options", "Advanced", "Workshop"]
  },
  {
    id: "consult-003",
    title: "Portfolio Analysis & Optimization",
    description: "Comprehensive review of investment portfolio with optimization recommendations.",
    type: "one-on-one",
    format: "video",
    duration: 90,
    price: 200,
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "completed",
    clientName: "Sarah Johnson",
    clientEmail: "sarah.j@email.com",
    paymentStatus: "paid",
    rating: 5,
    feedback: "Excellent analysis! Very detailed recommendations that I can implement immediately.",
    recording: "recording_003.mp4",
    materials: ["portfolio_analysis_report.pdf", "recommended_adjustments.xlsx"],
    tags: ["Portfolio", "Analysis", "Optimization"]
  }
];

const mockTemplates: ConsultationTemplate[] = [
  {
    id: "template-001",
    title: "Beginner Trading Consultation",
    description: "Introduction to forex trading, basic concepts, and getting started guide.",
    type: "one-on-one",
    duration: 45,
    price: 100,
    isActive: true,
    tags: ["Beginner", "Introduction", "Basics"]
  },
  {
    id: "template-002",
    title: "Risk Management Masterclass",
    description: "Advanced session covering comprehensive risk management strategies and implementation.",
    type: "masterclass",
    duration: 180,
    price: 250,
    maxParticipants: 20,
    isActive: true,
    tags: ["Risk Management", "Advanced", "Strategy"]
  },
  {
    id: "template-003",
    title: "Weekly Market Outlook",
    description: "Group session analyzing upcoming week's market events and trading opportunities.",
    type: "group",
    duration: 60,
    price: 50,
    maxParticipants: 15,
    isActive: true,
    tags: ["Market Analysis", "Weekly", "Outlook"]
  }
];

const mockAvailability: AvailabilitySlot[] = [
  { id: "avail-001", dayOfWeek: 1, startTime: "09:00", endTime: "12:00", isActive: true, consultationType: "all" },
  { id: "avail-002", dayOfWeek: 1, startTime: "14:00", endTime: "17:00", isActive: true, consultationType: "one-on-one" },
  { id: "avail-003", dayOfWeek: 2, startTime: "10:00", endTime: "15:00", isActive: true, consultationType: "all" },
  { id: "avail-004", dayOfWeek: 3, startTime: "09:00", endTime: "12:00", isActive: true, consultationType: "group" },
  { id: "avail-005", dayOfWeek: 4, startTime: "13:00", endTime: "18:00", isActive: true, consultationType: "all" },
  { id: "avail-006", dayOfWeek: 5, startTime: "09:00", endTime: "16:00", isActive: true, consultationType: "all" }
];

const mockMetrics: ConsultationMetrics = {
  totalSessions: 156,
  totalRevenue: 23450,
  completedSessions: 142,
  averageRating: 4.8,
  totalHours: 234,
  repeatClients: 45,
  cancellationRate: 8,
  monthlyGrowth: 15
};

function SessionCard({ 
  session, 
  onEdit, 
  onCancel, 
  onViewDetails,
  onStartSession 
}: { 
  session: ConsultationSession;
  onEdit: (session: ConsultationSession) => void;
  onCancel: (id: string) => void;
  onViewDetails: (session: ConsultationSession) => void;
  onStartSession: (session: ConsultationSession) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "#3B82F6";
      case "completed": return "#10B981";
      case "cancelled": return "#EF4444";
      case "in-progress": return COLORS.primary;
      default: return COLORS.dark;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled": return <Calendar className="w-3 h-3" />;
      case "completed": return <CheckCircle2 className="w-3 h-3" />;
      case "cancelled": return <XCircle className="w-3 h-3" />;
      case "in-progress": return <Play className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "video": return <Video className="w-4 h-4" />;
      case "phone": return <Phone className="w-4 h-4" />;
      case "in-person": return <MapPin className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "one-on-one": return "#8B5CF6";
      case "group": return "#10B981";
      case "workshop": return "#F59E0B";
      case "masterclass": return "#EF4444";
      default: return COLORS.primary;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isUpcoming = session.scheduledAt > new Date();
  const isToday = session.scheduledAt.toDateString() === new Date().toDateString();
  const canStart = isToday && isUpcoming && Math.abs(session.scheduledAt.getTime() - new Date().getTime()) < 30 * 60 * 1000; // Within 30 minutes

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl border shadow-sm transition-all duration-300 overflow-hidden"
      style={{ borderColor: COLORS.lightGray }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: getTypeColor(session.type) + "20",
                color: getTypeColor(session.type)
              }}
            >
              {session.type === "one-on-one" ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant="outline" 
                  style={{ 
                    borderColor: getStatusColor(session.status) + "40",
                    color: getStatusColor(session.status)
                  }}
                >
                  <div className="flex items-center gap-1">
                    {getStatusIcon(session.status)}
                    <span className="capitalize font-semibold">{session.status.replace('-', ' ')}</span>
                  </div>
                </Badge>
                {session.paymentStatus === "paid" && (
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Paid
                  </Badge>
                )}
              </div>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  borderColor: getTypeColor(session.type) + "40",
                  color: getTypeColor(session.type)
                }}
              >
                {session.type.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onViewDetails(session)}>
              <Eye className="w-4 h-4" />
            </Button>
            {session.status === "scheduled" && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(session)}>
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-red-600">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Session Info */}
        <div className="mb-4">
          <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: COLORS.dark }}>
            {session.title}
          </h3>
          <p className="text-sm mb-3 line-clamp-2" style={{ color: COLORS.dark + "80" }}>
            {session.description}
          </p>
          
          {/* Client Info */}
          <div className="flex items-center gap-4 text-sm mb-3" style={{ color: COLORS.dark + "80" }}>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{session.clientName}</span>
            </div>
            {getFormatIcon(session.format)}
            <span className="capitalize">{session.format}</span>
          </div>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: COLORS.dark }}>
              {session.scheduledAt.toLocaleDateString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Date
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: COLORS.dark }}>
              {session.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Time
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-green-600">
              {formatDuration(session.duration)}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Duration
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: COLORS.primary }}>
              ${session.price}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Fee
            </div>
          </div>
        </div>

        {/* Rating & Feedback for completed sessions */}
        {session.status === "completed" && session.rating && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${index < session.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-yellow-700">{session.rating}/5</span>
            </div>
            {session.feedback && (
              <p className="text-xs text-yellow-800 italic">{session.feedback}</p>
            )}
          </div>
        )}

        {/* Tags */}
        {session.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-1 flex-wrap">
              {session.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {session.notes && (
          <div className="mb-4 p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-800">
              <MessageCircle className="w-3 h-3 inline mr-1" />
              {session.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {canStart && session.status === "scheduled" && (
            <Button 
              className="flex-1"
              style={{ backgroundColor: COLORS.primary }}
              onClick={() => onStartSession(session)}
            >
              <Play className="w-4 h-4 mr-1" />
              Start Session
            </Button>
          )}
          
          {session.status === "scheduled" && !canStart && (
            <div className="flex gap-2 flex-1">
              <Button size="sm" variant="outline" className="flex-1">
                <Calendar className="w-4 h-4 mr-1" />
                Reschedule
              </Button>
              <Button size="sm" variant="outline" onClick={() => onCancel(session.id)} className="text-red-600">
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          )}

          {session.status === "completed" && (
            <div className="flex gap-2 flex-1">
              {session.recording && (
                <Button size="sm" variant="outline" className="flex-1">
                  <Play className="w-4 h-4 mr-1" />
                  View Recording
                </Button>
              )}
              {session.materials && session.materials.length > 0 && (
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              )}
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {session.status === "in-progress" && (
            <Button 
              className="flex-1"
              style={{ backgroundColor: "#10B981" }}
              onClick={() => onViewDetails(session)}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Join Session
            </Button>
          )}
        </div>

        {/* Upcoming session alert */}
        {isToday && isUpcoming && (
          <div className="mt-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <Bell className="w-4 h-4" />
              <span>Session starts in {Math.ceil((session.scheduledAt.getTime() - new Date().getTime()) / (1000 * 60))} minutes</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SessionEditor({ 
  session, 
  templates,
  isOpen, 
  onClose, 
  onSave 
}: { 
  session?: ConsultationSession; 
  templates: ConsultationTemplate[];
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (sessionData: Partial<ConsultationSession>) => void; 
}) {
  const [formData, setFormData] = useState({
    title: session?.title || "",
    description: session?.description || "",
    type: session?.type || "one-on-one" as const,
    format: session?.format || "video" as const,
    duration: session?.duration || 60,
    price: session?.price || 0,
    maxParticipants: session?.maxParticipants || 1,
    scheduledAt: session?.scheduledAt || new Date(),
    clientName: session?.clientName || "",
    clientEmail: session?.clientEmail || "",
    clientPhone: session?.clientPhone || "",
    notes: session?.notes || "",
    tags: session?.tags || []
  });

  const [newTag, setNewTag] = useState("");

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

  const loadTemplate = (template: ConsultationTemplate) => {
    setFormData({
      ...formData,
      title: template.title,
      description: template.description,
      type: template.type,
      duration: template.duration,
      price: template.price,
      maxParticipants: template.maxParticipants || 1,
      tags: template.tags
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-4 lg:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: COLORS.primary }} />
            {session ? "Edit Consultation" : "Schedule New Consultation"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Templates */}
          {!session && templates.length > 0 && (
            <div>
              <Label>Quick Start Templates</Label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
                {templates.filter(t => t.isActive).map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    onClick={() => loadTemplate(template)}
                    className="justify-start h-auto p-3 text-left"
                  >
                    <div>
                      <div className="font-medium text-xs">{template.title}</div>
                      <div className="text-xs text-gray-500">{template.duration}min • ${template.price}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="session-title">Session Title</Label>
              <Input
                id="session-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter session title..."
              />
            </div>
            
            <div>
              <Label htmlFor="session-description">Description</Label>
              <Textarea
                id="session-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what will be covered in this consultation..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-type">Session Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-on-one">One-on-One</SelectItem>
                    <SelectItem value="group">Group Session</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="masterclass">Masterclass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="session-format">Format</Label>
                <Select value={formData.format} onValueChange={(value: any) => setFormData({ ...formData, format: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="in-person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="session-duration">Duration (minutes)</Label>
                <Input
                  id="session-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  min="15"
                  step="15"
                />
              </div>

              <div>
                <Label htmlFor="session-price">Price ($)</Label>
                <Input
                  id="session-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                />
              </div>

              {(formData.type === "group" || formData.type === "workshop" || formData.type === "masterclass") && (
                <div>
                  <Label htmlFor="max-participants">Max Participants</Label>
                  <Input
                    id="max-participants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 1 })}
                    min="1"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Scheduling */}
          <div>
            <Label htmlFor="scheduled-time">Scheduled Date & Time</Label>
            <Input
              id="scheduled-time"
              type="datetime-local"
              value={formData.scheduledAt?.toISOString().slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, scheduledAt: new Date(e.target.value) })}
            />
          </div>

          {/* Client Information */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Client Information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Enter client name..."
                />
              </div>

              <div>
                <Label htmlFor="client-email">Client Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="client@email.com"
                />
              </div>

              <div>
                <Label htmlFor="client-phone">Client Phone (Optional)</Label>
                <Input
                  id="client-phone"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="+1-555-0123"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="session-notes">Session Notes</Label>
            <Textarea
              id="session-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any specific requirements or notes for this session..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Session Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.title || !formData.clientName || !formData.clientEmail}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Save className="w-4 h-4 mr-1" />
              {session ? "Update Session" : "Schedule Session"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CalendarView({ 
  sessions, 
  onSessionClick, 
  onDateClick,
  onCreateSession 
}: { 
  sessions: ConsultationSession[];
  onSessionClick: (session: ConsultationSession) => void;
  onDateClick: (date: Date) => void;
  onCreateSession: () => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and calculate calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const getDaysInMonth = () => {
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => 
      session.scheduledAt.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "one-on-one": return "#8B5CF6";
      case "group": return "#10B981";
      case "workshop": return "#F59E0B";
      case "masterclass": return "#EF4444";
      default: return COLORS.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "#3B82F6";
      case "completed": return "#10B981";
      case "cancelled": return "#EF4444";
      case "in-progress": return COLORS.primary;
      default: return COLORS.dark;
    }
  };

  const SessionDot = ({ session }: { session: ConsultationSession }) => (
    <motion.div
      className="w-2 h-2 rounded-full mb-1 cursor-pointer"
      style={{ backgroundColor: getSessionTypeColor(session.type) }}
      whileHover={{ scale: 1.2 }}
      onClick={(e) => {
        e.stopPropagation();
        onSessionClick(session);
      }}
      title={`${session.title} - ${session.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
    />
  );

  const CalendarDay = ({ date, isWeekView = false }: { date: Date; isWeekView?: boolean }) => {
    const daysSessions = getSessionsForDate(date);
    const isCurrentMonthDay = isCurrentMonth(date);
    const isTodayDay = isToday(date);
    
    return (
      <motion.div
        className={`
          ${isWeekView ? 'flex-1 min-h-32' : 'aspect-square'} 
          border border-gray-200 p-2 cursor-pointer transition-all duration-200 hover:bg-gray-50
          ${!isCurrentMonthDay && !isWeekView ? 'text-gray-400 bg-gray-50' : 'bg-white'}
          ${isTodayDay ? 'bg-blue-50 border-blue-300' : ''}
        `}
        onClick={() => onDateClick(date)}
        whileHover={{ scale: isWeekView ? 1 : 1.02 }}
        whileTap={{ scale: isWeekView ? 1 : 0.98 }}
      >
        <div className="flex flex-col h-full">
          <div className={`
            text-sm font-medium mb-1 
            ${isTodayDay ? 'text-blue-600' : isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'}
          `}>
            {date.getDate()}
            {isTodayDay && (
              <motion.div
                className="w-1 h-1 bg-blue-500 rounded-full ml-1 inline-block"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            {daysSessions.slice(0, isWeekView ? 6 : 3).map((session) => (
              <motion.div
                key={session.id}
                className="text-xs p-1 rounded truncate cursor-pointer"
                style={{ 
                  backgroundColor: getSessionTypeColor(session.type) + "20",
                  color: getSessionTypeColor(session.type),
                  borderLeft: `3px solid ${getSessionTypeColor(session.type)}`
                }}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSessionClick(session);
                }}
                title={session.title}
              >
                <div className="font-medium">{session.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="truncate">{session.title}</div>
                {isWeekView && (
                  <div className="text-xs opacity-75">{session.clientName}</div>
                )}
              </motion.div>
            ))}
            
            {daysSessions.length > (isWeekView ? 6 : 3) && (
              <div className="text-xs text-gray-500 font-medium">
                +{daysSessions.length - (isWeekView ? 6 : 3)} more
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.lightGray }}>
      {/* Calendar Header */}
      <div className="p-6 border-b" style={{ borderColor: COLORS.lightGray }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="font-serif font-semibold text-xl" style={{ color: COLORS.dark }}>
              {monthNames[currentMonth]} {currentYear}
            </h3>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => calendarView === "month" ? navigateMonth(-1) : navigateWeek(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentDate(new Date());
                }}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => calendarView === "month" ? navigateMonth(1) : navigateWeek(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={calendarView === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCalendarView("month")}
                className="text-xs"
              >
                Month
              </Button>
              <Button
                variant={calendarView === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCalendarView("week")}
                className="text-xs"
              >
                Week
              </Button>
            </div>

            <Button 
              size="sm"
              onClick={onCreateSession}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Session
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#8B5CF6" + "40" }} />
            <span>One-on-One</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10B981" + "40" }} />
            <span>Group</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F59E0B" + "40" }} />
            <span>Workshop</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#EF4444" + "40" }} />
            <span>Masterclass</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {calendarView === "month" ? (
          <div>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {getDaysInMonth().map((date, index) => (
                <CalendarDay key={index} date={date} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Week Header */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {getWeekDays().map((date, index) => (
                <div key={index} className="p-2 text-center">
                  <div className="text-sm font-medium text-gray-500">{weekDays[index]}</div>
                  <div className={`text-lg font-semibold ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Week Days */}
            <div className="flex gap-0 border border-gray-200 rounded-lg overflow-hidden min-h-96">
              {getWeekDays().map((date, index) => (
                <CalendarDay date={date} isWeekView={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Calendar Footer with Quick Stats */}
      <div className="p-4 border-t bg-gray-50" style={{ borderColor: COLORS.lightGray }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              {sessions.filter(s => s.scheduledAt.getMonth() === currentMonth && s.status === "scheduled").length}
            </div>
            <div className="text-xs text-gray-500">This Month</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {sessions.filter(s => s.scheduledAt.toDateString() === today.toDateString()).length}
            </div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {sessions.filter(s => s.scheduledAt > today && s.status === "scheduled").length}
            </div>
            <div className="text-xs text-gray-500">Upcoming</div>
          </div>
          <div>
            <div className="text-lg font-semibold" style={{ color: COLORS.primary }}>
              ${sessions.filter(s => s.scheduledAt.getMonth() === currentMonth).reduce((sum, s) => sum + s.price, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvailabilityManager({ 
  availability, 
  onUpdateAvailability 
}: { 
  availability: AvailabilitySlot[];
  onUpdateAvailability: (slots: AvailabilitySlot[]) => void;
}) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const toggleSlot = (slotId: string) => {
    const updatedSlots = availability.map(slot => 
      slot.id === slotId ? { ...slot, isActive: !slot.isActive } : slot
    );
    onUpdateAvailability(updatedSlots);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
      <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
        Availability Schedule
      </h3>
      
      <div className="space-y-4">
        {daysOfWeek.map((day, dayIndex) => {
          const daySlots = availability.filter(slot => slot.dayOfWeek === dayIndex);
          
          return (
            <div key={dayIndex} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium" style={{ color: COLORS.dark }}>{day}</h4>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Slot
                </Button>
              </div>
              
              {daySlots.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">No availability set</p>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={slot.isActive}
                          onCheckedChange={() => toggleSlot(slot.id)}
                        />
                        <span className="text-sm font-medium">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {slot.consultationType === "all" ? "All Types" : slot.consultationType}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ConsultationBooking() {
  const [sessions, setSessions] = useState<ConsultationSession[]>(mockSessions);
  const [templates, setTemplates] = useState<ConsultationTemplate[]>(mockTemplates);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(mockAvailability);
  const [activeTab, setActiveTab] = useState("sessions");
  const [showSessionEditor, setShowSessionEditor] = useState(false);
  const [editingSession, setEditingSession] = useState<ConsultationSession | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { t } = useTranslation();

  const handleCreateSession = () => {
    setEditingSession(undefined);
    setShowSessionEditor(true);
  };

  const handleEditSession = (session: ConsultationSession) => {
    setEditingSession(session);
    setShowSessionEditor(true);
  };

  const handleSaveSession = (sessionData: Partial<ConsultationSession>) => {
    if (editingSession) {
      setSessions(prev => prev.map(session => 
        session.id === editingSession.id 
          ? { ...session, ...sessionData }
          : session
      ));
    } else {
      const newSession: ConsultationSession = {
        id: `consult-${Date.now()}`,
        status: "scheduled",
        paymentStatus: "pending",
        scheduledAt: new Date(),
        ...sessionData
      } as ConsultationSession;
      setSessions(prev => [newSession, ...prev]);
    }
  };

  const handleCancelSession = (id: string) => {
    setSessions(prev => prev.map(session => 
      session.id === id 
        ? { ...session, status: "cancelled" as const }
        : session
    ));
  };

  const handleStartSession = (session: ConsultationSession) => {
    setSessions(prev => prev.map(s => 
      s.id === session.id 
        ? { ...s, status: "in-progress" as const }
        : s
    ));
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    const matchesType = typeFilter === "all" || session.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const upcomingSessions = sessions.filter(s => s.status === "scheduled" && s.scheduledAt > new Date()).length;
  const todaySessions = sessions.filter(s => s.scheduledAt.toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl" style={{ color: COLORS.dark }}>
            {t("pages.consultationBooking.title")}
          </h1>
          <p className="text-sm lg:text-base" style={{ color: COLORS.dark + "80" }}>
            {t("pages.consultationBooking.subtitle")}
          </p>
        </div>
        
        <Button 
          onClick={handleCreateSession}
          className="flex-shrink-0"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Schedule Session
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{ borderColor: COLORS.lightGray }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
                Total Sessions
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {mockMetrics.totalSessions}
              </p>
            </div>
            <div 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <Calendar className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: COLORS.primary }} />
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
                Upcoming
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {upcomingSessions}
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-blue-100">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
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
                Today
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {todaySessions}
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-green-100">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
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
                Revenue
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.primary }}>
                ${mockMetrics.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-orange-100">
              <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-64"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="one-on-one">One-on-One</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="masterclass">Masterclass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sessions Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
            layout
          >
            <AnimatePresence>
              {filteredSessions.map((session) => (
                <SessionCard
                  // key={session.id}
                  session={session}
                  onEdit={handleEditSession}
                  onCancel={handleCancelSession}
                  onViewDetails={(session) => console.log("View details", session)}
                  onStartSession={handleStartSession}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: COLORS.dark }}>
                No sessions found
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
                Try adjusting your search or schedule a new session
              </p>
              <Button 
                onClick={handleCreateSession}
                style={{ backgroundColor: COLORS.primary }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Schedule Session
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <CalendarView
            sessions={sessions}
            onSessionClick={(session) => {
              setEditingSession(session);
              setShowSessionEditor(true);
            }}
            onDateClick={(date) => {
              // Auto-fill the date when creating a new session
              setEditingSession(undefined);
              setShowSessionEditor(true);
            }}
            onCreateSession={handleCreateSession}
          />
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <AvailabilityManager
            availability={availability}
            onUpdateAvailability={setAvailability}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Completion Rate</span>
                  <span className="font-semibold text-green-600">
                    {Math.round((mockMetrics.completedSessions / mockMetrics.totalSessions) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Average Rating</span>
                  <span className="font-semibold" style={{ color: COLORS.dark }}>
                    {mockMetrics.averageRating}/5.0
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Repeat Clients</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>
                    {mockMetrics.repeatClients}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Cancellation Rate</span>
                  <span className="font-semibold text-red-600">
                    {mockMetrics.cancellationRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Revenue Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Average Session Fee</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>
                    ${Math.round(mockMetrics.totalRevenue / mockMetrics.totalSessions)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Revenue per Hour</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>
                    ${Math.round(mockMetrics.totalRevenue / mockMetrics.totalHours)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Monthly Growth</span>
                  <span className="font-semibold text-green-600">
                    +{mockMetrics.monthlyGrowth}%
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: COLORS.dark }}>Total Revenue</span>
                  <span className="font-bold text-lg" style={{ color: COLORS.primary }}>
                    ${mockMetrics.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Session Editor Dialog */}
      <SessionEditor
        session={editingSession}
        templates={templates}
        isOpen={showSessionEditor}
        onClose={() => setShowSessionEditor(false)}
        onSave={handleSaveSession}
      />
    </div>
  );
}