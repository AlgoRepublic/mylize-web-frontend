import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageCircle,
  Users,
  User,
  Send,
  Search,
  Filter,
  Plus,
  Settings,
  Paperclip,
  Image,
  File,
  Smile,
  MoreHorizontal,
  Pin,
  Trash2,
  Edit3,
  Copy,
  Reply,
  Forward,
  Flag,
  Shield,
  Crown,
  Star,
  Heart,
  ThumbsUp,
  Eye,
  EyeOff,
  Mic,
  MicOff,
  Phone,
  Video,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart3,
  Activity,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Hash,
  Lock,
  Globe,
  Zap,
  Target,
  Award,
  Gift,
  Download,
  Upload,
  ExternalLink,
  Share2,
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Radio,
  Headphones,
  Monitor,
  Smartphone
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
import { Progress } from "./ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderType: "analyst" | "subscriber" | "premium" | "vip";
  messageType: "text" | "image" | "file" | "system" | "announcement";
  channelId: string;
  parentMessageId?: string; // For replies
  reactions: MessageReaction[];
  isPinned: boolean;
  isEdited: boolean;
  attachments?: MessageAttachment[];
  mentions?: string[];
}

interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

interface MessageAttachment {
  id: string;
  type: "image" | "file" | "document";
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: "general" | "signals" | "premium" | "private" | "announcement";
  isPrivate: boolean;
  memberCount: number;
  unreadCount: number;
  lastMessage?: ChatMessage;
  permissions: ChannelPermissions;
  isActive: boolean;
}

interface ChannelPermissions {
  canPost: boolean;
  canUpload: boolean;
  canPin: boolean;
  canModerate: boolean;
  requiresSubscription: boolean;
  subscriptionTier?: string;
}

interface Subscriber {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  subscriptionTier: "free" | "basic" | "premium" | "vip";
  joinedAt: Date;
  lastActive: Date;
  isOnline: boolean;
  totalMessages: number;
  reputation: number;
  badges: string[];
  isBlocked: boolean;
  isMuted: boolean;
}

interface ChatAnalytics {
  totalMessages: number;
  activeSubscribers: number;
  dailyMessages: number;
  topChannels: { channelId: string; messageCount: number }[];
  engagementRate: number;
  averageResponseTime: number;
  peakHours: number[];
  popularTopics: string[];
}

const mockChannels: ChatChannel[] = [
  {
    id: "general",
    name: "General Discussion",
    description: "Open chat for all subscribers",
    type: "general",
    isPrivate: false,
    memberCount: 1247,
    unreadCount: 12,
    permissions: {
      canPost: true,
      canUpload: true,
      canPin: false,
      canModerate: false,
      requiresSubscription: false
    },
    isActive: true
  },
  {
    id: "signals",
    name: "Trading Signals",
    description: "Live trading signals and market updates",
    type: "signals",
    isPrivate: false,
    memberCount: 892,
    unreadCount: 5,
    permissions: {
      canPost: false,
      canUpload: false,
      canPin: false,
      canModerate: false,
      requiresSubscription: true,
      subscriptionTier: "basic"
    },
    isActive: true
  },
  {
    id: "premium",
    name: "Premium Lounge",
    description: "Exclusive chat for premium subscribers",
    type: "premium",
    isPrivate: true,
    memberCount: 156,
    unreadCount: 3,
    permissions: {
      canPost: true,
      canUpload: true,
      canPin: false,
      canModerate: false,
      requiresSubscription: true,
      subscriptionTier: "premium"
    },
    isActive: true
  },
  {
    id: "announcements",
    name: "Announcements",
    description: "Important updates and news",
    type: "announcement",
    isPrivate: false,
    memberCount: 1456,
    unreadCount: 1,
    permissions: {
      canPost: false,
      canUpload: false,
      canPin: false,
      canModerate: false,
      requiresSubscription: false
    },
    isActive: true
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: "msg-001",
    content: "Good morning everyone! Today we're seeing strong momentum in EUR/USD. Watch for the 1.0850 resistance level.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    senderId: "analyst-001",
    senderName: "John Analyst",
    senderType: "analyst",
    messageType: "text",
    channelId: "signals",
    reactions: [
      { emoji: "👍", userId: "user-1", userName: "TradingPro", timestamp: new Date() },
      { emoji: "🔥", userId: "user-2", userName: "ForexKing", timestamp: new Date() }
    ],
    isPinned: true,
    isEdited: false
  },
  {
    id: "msg-002",
    content: "Thanks for the signal! What's your take on Gold today?",
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    senderId: "user-123",
    senderName: "TradingPro2024",
    senderType: "premium",
    messageType: "text",
    channelId: "general",
    reactions: [],
    isPinned: false,
    isEdited: false
  },
  {
    id: "msg-003",
    content: "Welcome to the Premium Lounge! Here you'll get exclusive market insights and direct access to me.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    senderId: "analyst-001",
    senderName: "John Analyst",
    senderType: "analyst",
    messageType: "announcement",
    channelId: "premium",
    reactions: [
      { emoji: "🎉", userId: "user-3", userName: "PremiumTrader", timestamp: new Date() }
    ],
    isPinned: true,
    isEdited: false
  }
];

const mockSubscribers: Subscriber[] = [
  {
    id: "user-123",
    name: "TradingPro2024",
    email: "tradingpro@email.com",
    subscriptionTier: "premium",
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
    isOnline: true,
    totalMessages: 234,
    reputation: 95,
    badges: ["Early Adopter", "Active Trader"],
    isBlocked: false,
    isMuted: false
  },
  {
    id: "user-456",
    name: "ForexNewbie",
    email: "newbie@email.com",
    subscriptionTier: "basic",
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    isOnline: false,
    totalMessages: 45,
    reputation: 72,
    badges: ["Learner"],
    isBlocked: false,
    isMuted: false
  }
];

const mockAnalytics: ChatAnalytics = {
  totalMessages: 15420,
  activeSubscribers: 892,
  dailyMessages: 342,
  topChannels: [
    { channelId: "general", messageCount: 8234 },
    { channelId: "signals", messageCount: 4567 },
    { channelId: "premium", messageCount: 2341 }
  ],
  engagementRate: 78,
  averageResponseTime: 12, // minutes
  peakHours: [9, 10, 14, 15, 20, 21],
  popularTopics: ["EUR/USD", "Gold", "Bitcoin", "NFP", "Risk Management"]
};

function ChannelSidebar({ 
  channels, 
  activeChannel, 
  onChannelSelect,
  onCreateChannel 
}: { 
  channels: ChatChannel[];
  activeChannel: string;
  onChannelSelect: (channelId: string) => void;
  onCreateChannel: () => void;
}) {
  const getChannelIcon = (type: string) => {
    switch (type) {
      case "general": return <Hash className="w-4 h-4" />;
      case "signals": return <TrendingUp className="w-4 h-4" />;
      case "premium": return <Star className="w-4 h-4" />;
      case "private": return <Lock className="w-4 h-4" />;
      case "announcement": return <Bell className="w-4 h-4" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  const getTierColor = (type: string) => {
    switch (type) {
      case "signals": return "#3B82F6";
      case "premium": return "#F59E0B";
      case "private": return "#8B5CF6";
      case "announcement": return "#EF4444";
      default: return COLORS.dark;
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif font-semibold" style={{ color: COLORS.dark }}>
            Chat Channels
          </h3>
          <Button size="sm" variant="outline" onClick={onCreateChannel}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search channels..."
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {channels.map((channel) => (
            <motion.div
              key={channel.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                ${activeChannel === channel.id 
                  ? 'bg-orange-50 border border-orange-200' 
                  : 'hover:bg-gray-50'
                }
              `}
              onClick={() => onChannelSelect(channel.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: getTierColor(channel.type) + "20",
                  color: getTierColor(channel.type)
                }}
              >
                {getChannelIcon(channel.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate" style={{ color: COLORS.dark }}>
                    {channel.name}
                  </h4>
                  {channel.unreadCount > 0 && (
                    <Badge 
                      className="ml-2 px-1.5 py-0.5 text-xs"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {channel.unreadCount}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {channel.memberCount} members
                  </span>
                  {channel.isPrivate && (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                  {!channel.isActive && (
                    <Pause className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageList({ 
  messages, 
  currentUserId,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  onPin 
}: { 
  messages: ChatMessage[];
  currentUserId: string;
  onReaction: (messageId: string, emoji: string) => void;
  onReply: (message: ChatMessage) => void;
  onEdit: (message: ChatMessage) => void;
  onDelete: (messageId: string) => void;
  onPin: (messageId: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "analyst": return COLORS.primary;
      case "premium": return "#F59E0B";
      case "vip": return "#8B5CF6";
      default: return "#6B7280";
    }
  };

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case "analyst": return { icon: <Crown className="w-3 h-3" />, label: "Analyst", color: COLORS.primary };
      case "premium": return { icon: <Star className="w-3 h-3" />, label: "Premium", color: "#F59E0B" };
      case "vip": return { icon: <Award className="w-3 h-3" />, label: "VIP", color: "#8B5CF6" };
      default: return null;
    }
  };

  const MessageItem = ({ message }: { message: ChatMessage }) => {
    const [showActions, setShowActions] = useState(false);
    const isOwnMessage = message.senderId === currentUserId;
    const userBadge = getUserTypeBadge(message.senderType);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`group p-4 hover:bg-gray-50 transition-colors duration-200 ${message.isPinned ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={message.senderAvatar} />
            <AvatarFallback 
              style={{ backgroundColor: getUserTypeColor(message.senderType) + "20" }}
            >
              {message.senderName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="font-medium text-sm"
                style={{ color: getUserTypeColor(message.senderType) }}
              >
                {message.senderName}
              </span>
              
              {userBadge && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-1 py-0"
                  style={{ 
                    borderColor: userBadge.color + "40",
                    color: userBadge.color
                  }}
                >
                  {userBadge.icon}
                  {userBadge.label}
                </Badge>
              )}
              
              {message.isPinned && (
                <Pin className="w-3 h-3 text-yellow-600" />
              )}
              
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              
              {message.isEdited && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>

            <div className="text-sm mb-2" style={{ color: COLORS.dark }}>
              {message.content}
            </div>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 p-2 bg-gray-100 rounded border">
                    <File className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-700">{attachment.name}</span>
                    <Button size="sm" variant="ghost" className="h-auto p-1">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Reactions */}
            {message.reactions.length > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {message.reactions.reduce((acc: any[], reaction) => {
                  const existing = acc.find(r => r.emoji === reaction.emoji);
                  if (existing) {
                    existing.count++;
                    existing.users.push(reaction.userName);
                  } else {
                    acc.push({
                      emoji: reaction.emoji,
                      count: 1,
                      users: [reaction.userName]
                    });
                  }
                  return acc;
                }, []).map((reaction, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="h-auto px-2 py-1 text-xs"
                    onClick={() => onReaction(message.id, reaction.emoji)}
                  >
                    {reaction.emoji} {reaction.count}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Message Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-1"
              >
                <Button size="sm" variant="ghost" onClick={() => onReaction(message.id, "👍")}>
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onReply(message)}>
                  <Reply className="w-3 h-3" />
                </Button>
                {isOwnMessage && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => onEdit(message)}>
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(message.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost" onClick={() => onPin(message.id)}>
                  <Pin className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageInput({ 
  onSendMessage,
  replyingTo,
  onCancelReply 
}: { 
  onSendMessage: (content: string, attachments?: File[]) => void;
  replyingTo?: ChatMessage;
  onCancelReply?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
      if (onCancelReply) onCancelReply();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const commonEmojis = ["👍", "❤️", "😊", "🔥", "💯", "🎉", "👏", "💰"];

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Reply Context */}
      {replyingTo && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Reply className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500">Replying to</span>
              <span className="font-medium" style={{ color: COLORS.primary }}>
                {replyingTo.senderName}
              </span>
            </div>
            <Button size="sm" variant="ghost" onClick={onCancelReply}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
            {replyingTo.content}
          </p>
        </div>
      )}

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                <File className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-700">{file.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-1"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Input */}
      <div className="p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[40px] max-h-32 resize-none"
              rows={1}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-4 h-4" />
              </Button>
              
              {/* Simple Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="grid grid-cols-4 gap-1">
                    {commonEmojis.map((emoji) => (
                      <Button
                        key={emoji}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              onClick={handleSend}
              disabled={!message.trim() && attachments.length === 0}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}

function SubscriberPanel({ 
  subscribers, 
  onSubscriberAction 
}: { 
  subscribers: Subscriber[];
  onSubscriberAction: (subscriberId: string, action: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === "all" || subscriber.subscriptionTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip": return "#8B5CF6";
      case "premium": return "#F59E0B";
      case "basic": return "#3B82F6";
      default: return "#6B7280";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "vip": return <Award className="w-3 h-3" />;
      case "premium": return <Star className="w-3 h-3" />;
      case "basic": return <User className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-serif font-semibold mb-3" style={{ color: COLORS.dark }}>
          Subscribers ({filteredSubscribers.length})
        </h3>
        
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredSubscribers.map((subscriber) => (
            <motion.div
              key={subscriber.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              whileHover={{ x: 2 }}
            >
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={subscriber.avatar} />
                  <AvatarFallback 
                    style={{ backgroundColor: getTierColor(subscriber.subscriptionTier) + "20" }}
                  >
                    {subscriber.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                {subscriber.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-medium text-sm truncate" style={{ color: COLORS.dark }}>
                    {subscriber.name}
                  </span>
                  <Badge 
                    variant="outline" 
                    className="text-xs px-1 py-0"
                    style={{ 
                      borderColor: getTierColor(subscriber.subscriptionTier) + "40",
                      color: getTierColor(subscriber.subscriptionTier)
                    }}
                  >
                    {getTierIcon(subscriber.subscriptionTier)}
                    {subscriber.subscriptionTier}
                  </Badge>
                </div>
                
                <div className="text-xs text-gray-500">
                  {subscriber.isOnline ? "Online" : `Last seen ${subscriber.lastActive.toLocaleDateString()}`}
                </div>
                
                {subscriber.badges.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {subscriber.badges.slice(0, 2).map((badge, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-1"
                  onClick={() => onSubscriberAction(subscriber.id, "message")}
                >
                  <MessageCircle className="w-3 h-3" />
                </Button>
                
                {subscriber.isMuted && (
                  <VolumeX className="w-3 h-3 text-red-500" />
                )}
                
                {subscriber.isBlocked && (
                  <Shield className="w-3 h-3 text-red-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SubscriberChat() {
  const [channels] = useState<ChatChannel[]>(mockChannels);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [subscribers] = useState<Subscriber[]>(mockSubscribers);
  const [activeChannel, setActiveChannel] = useState("general");
  const [showSubscribers, setShowSubscribers] = useState(true);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | undefined>();
  const [activeTab, setActiveTab] = useState("chat");

  const currentChannelMessages = messages.filter(msg => msg.channelId === activeChannel);
  const currentChannel = channels.find(ch => ch.id === activeChannel);

  const handleSendMessage = (content: string, attachments?: File[]) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      senderId: "analyst-001",
      senderName: "John Analyst",
      senderType: "analyst",
      messageType: "text",
      channelId: activeChannel,
      parentMessageId: replyingTo?.id,
      reactions: [],
      isPinned: false,
      isEdited: false,
      attachments: attachments?.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        mimeType: file.type
      }))
    };

    setMessages(prev => [...prev, newMessage]);
    setReplyingTo(undefined);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? {
            ...msg,
            reactions: [
              ...msg.reactions.filter(r => r.emoji !== emoji || r.userId !== "analyst-001"),
              {
                emoji,
                userId: "analyst-001",
                userName: "John Analyst",
                timestamp: new Date()
              }
            ]
          }
        : msg
    ));
  };

  const onlineSubscribers = subscribers.filter(s => s.isOnline).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl" style={{ color: COLORS.dark }}>
            Subscriber Chat
          </h1>
          <p className="text-sm lg:text-base" style={{ color: COLORS.dark + "80" }}>
            Real-time communication with your subscriber community
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowSubscribers(!showSubscribers)}
          >
            <Users className="w-4 h-4 mr-1" />
            {showSubscribers ? "Hide" : "Show"} Subscribers
          </Button>
        </div>
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
                Active Channels
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {channels.filter(ch => ch.isActive).length}
              </p>
            </div>
            <div 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <Hash className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: COLORS.primary }} />
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
                Online Now
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {onlineSubscribers}
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-green-100">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
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
                Today's Messages
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {mockAnalytics.dailyMessages}
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-blue-100">
              <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
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
                Engagement
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.primary }}>
                {mockAnalytics.engagementRate}%
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-orange-100">
              <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.lightGray }}>
            <div className="flex h-96 lg:h-[600px]">
              {/* Channel Sidebar */}
              <ChannelSidebar
                channels={channels}
                activeChannel={activeChannel}
                onChannelSelect={setActiveChannel}
                onCreateChannel={() => console.log("Create channel")}
              />

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: currentChannel?.type === "premium" ? "#F59E0B20" : COLORS.primary + "20",
                          color: currentChannel?.type === "premium" ? "#F59E0B" : COLORS.primary
                        }}
                      >
                        {currentChannel?.type === "signals" && <TrendingUp className="w-4 h-4" />}
                        {currentChannel?.type === "premium" && <Star className="w-4 h-4" />}
                        {currentChannel?.type === "general" && <Hash className="w-4 h-4" />}
                        {currentChannel?.type === "announcement" && <Bell className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold" style={{ color: COLORS.dark }}>
                          {currentChannel?.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {currentChannel?.memberCount} members • {currentChannelMessages.length} messages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Radio className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <MessageList
                  messages={currentChannelMessages}
                  currentUserId="analyst-001"
                  onReaction={handleReaction}
                  onReply={setReplyingTo}
                  onEdit={(message) => console.log("Edit", message)}
                  onDelete={(id) => console.log("Delete", id)}
                  onPin={(id) => console.log("Pin", id)}
                />

                {/* Message Input */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  replyingTo={replyingTo}
                  onCancelReply={() => setReplyingTo(undefined)}
                />
              </div>

              {/* Subscriber Panel */}
              {showSubscribers && (
                <SubscriberPanel
                  subscribers={subscribers}
                  onSubscriberAction={(id, action) => console.log("Subscriber action", id, action)}
                />
              )}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Message Analytics */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Message Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Total Messages</span>
                  <span className="font-semibold" style={{ color: COLORS.dark }}>
                    {mockAnalytics.totalMessages.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Daily Average</span>
                  <span className="font-semibold" style={{ color: COLORS.dark }}>
                    {mockAnalytics.dailyMessages}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Response Time</span>
                  <span className="font-semibold text-green-600">
                    {mockAnalytics.averageResponseTime} min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Engagement Rate</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>
                    {mockAnalytics.engagementRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Channel Performance */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Channel Performance
              </h3>
              <div className="space-y-4">
                {mockAnalytics.topChannels.map((channel) => {
                  const channelInfo = channels.find(ch => ch.id === channel.channelId);
                  return (
                    <div key={channel.channelId} className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: COLORS.dark + "80" }}>
                        {channelInfo?.name || channel.channelId}
                      </span>
                      <span className="font-semibold" style={{ color: COLORS.dark }}>
                        {channel.messageCount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Popular Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {mockAnalytics.popularTopics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Peak Hours */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Peak Activity Hours
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div
                    key={hour}
                    className={`
                      text-center p-2 rounded text-xs
                      ${mockAnalytics.peakHours.includes(hour) 
                        ? 'bg-orange-100 text-orange-700 font-semibold' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {hour}:00
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>


      </Tabs>
    </div>
  );
}