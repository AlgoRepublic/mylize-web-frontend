import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Users,
  MessageCircle,
  Eye,
  Play,
  Pause,
  Square,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart3,
  Share2,
  Copy,
  ExternalLink,
  Monitor,
  Smartphone,
  Camera,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Radio,
  Globe,
  Shield,
  Star,
  Heart,
  ThumbsUp,
  Send,
  MoreHorizontal,
  Zap,
  Target,
  Award,
  Gift,
  Bell,
  BellRing,
  Download,
  Upload,
  Headphones,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Plus,
  Edit3,
  Trash2,
  Save,
  X
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
import { Slider } from "./ui/slider";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface Stream {
  id: string;
  title: string;
  description: string;
  status: "live" | "scheduled" | "ended" | "offline";
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration: number; // in minutes
  viewers: number;
  peakViewers: number;
  revenue: number;
  category: string;
  isPublic: boolean;
  isPremium: boolean;
  price?: number;
  thumbnail: string;
  streamKey: string;
  chatEnabled: boolean;
  pollsEnabled: boolean;
  recordingEnabled: boolean;
  tags: string[];
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isPremium: boolean;
  isSupporter: boolean;
  amount?: number; // for donations
}

interface StreamMetrics {
  totalStreams: number;
  totalHours: number;
  totalViewers: number;
  totalRevenue: number;
  avgViewers: number;
  avgDuration: number;
  engagementRate: number;
  subscriberGrowth: number;
}

const mockStreams: Stream[] = [
  {
    id: "stream-001",
    title: "Live Market Analysis - EUR/USD & Gold Opportunities",
    description: "Join me for real-time market analysis covering major currency pairs and precious metals. We'll analyze charts, discuss trading opportunities, and take your questions.",
    status: "live",
    startedAt: new Date(Date.now() - 45 * 60 * 1000), // Started 45 minutes ago
    duration: 45,
    viewers: 847,
    peakViewers: 1203,
    revenue: 2847,
    category: "Market Analysis",
    isPublic: true,
    isPremium: false,
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    streamKey: "sk_live_1234567890",
    chatEnabled: true,
    pollsEnabled: true,
    recordingEnabled: true,
    tags: ["EUR/USD", "Gold", "Live Analysis", "Q&A"]
  },
  {
    id: "stream-002",
    title: "Premium Strategy Session: Advanced Fibonacci Techniques",
    description: "Exclusive premium session covering advanced Fibonacci retracement and extension techniques for precision entries and exits.",
    status: "scheduled",
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
    duration: 0,
    viewers: 0,
    peakViewers: 0,
    revenue: 1250,
    category: "Educational",
    isPublic: false,
    isPremium: true,
    price: 25,
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop",
    streamKey: "sk_sched_0987654321",
    chatEnabled: true,
    pollsEnabled: false,
    recordingEnabled: true,
    tags: ["Fibonacci", "Premium", "Advanced", "Strategy"]
  },
  {
    id: "stream-003",
    title: "Weekly Market Wrap-up & Next Week Outlook",
    description: "Comprehensive review of this week's market movements and key levels to watch for the upcoming week.",
    status: "ended",
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000), // Lasted 75 minutes
    duration: 75,
    viewers: 0,
    peakViewers: 1456,
    revenue: 3247,
    category: "Market Review",
    isPublic: true,
    isPremium: false,
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
    streamKey: "sk_ended_1122334455",
    chatEnabled: true,
    pollsEnabled: true,
    recordingEnabled: true,
    tags: ["Weekly Review", "Outlook", "Multi-Pair"]
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-001",
    username: "TradingPro2024",
    message: "Great analysis on EUR/USD! What's your take on the resistance level?",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    isPremium: true,
    isSupporter: false
  },
  {
    id: "msg-002",
    username: "ForexNewbie",
    message: "Thank you for the clear explanation of support and resistance!",
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    isPremium: false,
    isSupporter: false
  },
  {
    id: "msg-003",
    username: "GoldTrader88",
    message: "💰 Donated $10 - Love your gold analysis!",
    timestamp: new Date(Date.now() - 30 * 1000),
    isPremium: true,
    isSupporter: true,
    amount: 10
  }
];

const mockMetrics: StreamMetrics = {
  totalStreams: 156,
  totalHours: 234,
  totalViewers: 45678,
  totalRevenue: 89245,
  avgViewers: 892,
  avgDuration: 67,
  engagementRate: 78,
  subscriberGrowth: 12
};

function StreamCard({ 
  stream, 
  onEdit, 
  onDelete, 
  onViewAnalytics, 
  onStartStream,
  onEndStream 
}: { 
  stream: Stream;
  onEdit: (stream: Stream) => void;
  onDelete: (id: string) => void;
  onViewAnalytics: (stream: Stream) => void;
  onStartStream: (stream: Stream) => void;
  onEndStream: (stream: Stream) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "#EF4444";
      case "scheduled": return "#3B82F6";
      case "ended": return "#6B7280";
      case "offline": return "#9CA3AF";
      default: return COLORS.dark;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live": return <Radio className="w-3 h-3" />;
      case "scheduled": return <Calendar className="w-3 h-3" />;
      case "ended": return <CheckCircle2 className="w-3 h-3" />;
      case "offline": return <VideoOff className="w-3 h-3" />;
      default: return <Video className="w-3 h-3" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

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
      {/* Stream Thumbnail */}
      <div className="relative h-48">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${stream.thumbnail})` }}
        />
        
        {/* Live/Status Overlay */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="outline" 
            className="bg-white bg-opacity-90"
            style={{ 
              borderColor: getStatusColor(stream.status) + "40",
              color: getStatusColor(stream.status)
            }}
          >
            <div className="flex items-center gap-1">
              {getStatusIcon(stream.status)}
              <span className="capitalize font-semibold">
                {stream.status === "live" ? "LIVE" : stream.status}
              </span>
              {stream.status === "live" && (
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full ml-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </Badge>
        </div>

        {/* Premium Badge */}
        {stream.isPremium && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}

        {/* Viewers/Duration */}
        <div className="absolute bottom-3 right-3">
          {stream.status === "live" ? (
            <Badge variant="outline" className="bg-black bg-opacity-70 text-white border-transparent">
              <Eye className="w-3 h-3 mr-1" />
              {stream.viewers.toLocaleString()}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-black bg-opacity-70 text-white border-transparent">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(stream.duration)}
            </Badge>
          )}
        </div>

        {/* Play Overlay for ended streams */}
        {stream.status === "ended" && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            >
              <Play className="w-6 h-6 ml-1" style={{ color: COLORS.primary }} />
            </motion.div>
          </div>
        )}
      </div>

      {/* Stream Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ 
                backgroundColor: COLORS.primary + "20",
                color: COLORS.primary 
              }}
            >
              <Video className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="text-xs">
              {stream.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onViewAnalytics(stream)}>
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(stream)}>
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(stream.id)} className="text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stream Title & Description */}
        <div className="mb-4">
          <h3 className="font-serif font-semibold text-lg mb-2 line-clamp-2" style={{ color: COLORS.dark }}>
            {stream.title}
          </h3>
          <p className="text-sm line-clamp-2" style={{ color: COLORS.dark + "80" }}>
            {stream.description}
          </p>
        </div>

        {/* Stream Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: COLORS.dark }}>
              {stream.status === "live" ? stream.viewers.toLocaleString() : stream.peakViewers.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {stream.status === "live" ? "Viewers" : "Peak Views"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: COLORS.primary }}>
              ${stream.revenue.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Revenue
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-green-600">
              {stream.status === "live" ? formatDuration(stream.duration) : formatDuration(stream.duration)}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Duration
            </div>
          </div>
        </div>

        {/* Stream Features */}
        <div className="flex items-center gap-4 text-xs mb-4 flex-wrap" style={{ color: COLORS.dark + "60" }}>
          {stream.chatEnabled && (
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>Chat</span>
            </div>
          )}
          {stream.recordingEnabled && (
            <div className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              <span>Recording</span>
            </div>
          )}
          {stream.pollsEnabled && (
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              <span>Polls</span>
            </div>
          )}
          {stream.isPremium && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>${stream.price}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {stream.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-1 flex-wrap">
              {stream.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {stream.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{stream.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {stream.status === "scheduled" ? (
            <Button 
              className="flex-1"
              style={{ backgroundColor: COLORS.primary }}
              onClick={() => onStartStream(stream)}
            >
              <Radio className="w-4 h-4 mr-1" />
              Go Live
            </Button>
          ) : stream.status === "live" ? (
            <div className="flex gap-2 flex-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => onEndStream(stream)}
              >
                <Square className="w-4 h-4 mr-1" />
                End Stream
              </Button>
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ) : stream.status === "ended" ? (
            <div className="flex gap-2 flex-1">
              <Button size="sm" variant="outline" className="flex-1">
                <Play className="w-4 h-4 mr-1" />
                Watch Replay
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onEdit(stream)}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit Stream
            </Button>
          )}
        </div>

        {/* Schedule Info for scheduled streams */}
        {stream.status === "scheduled" && stream.scheduledAt && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Calendar className="w-4 h-4" />
              <span>
                Scheduled for {stream.scheduledAt.toLocaleDateString()} at {stream.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function LiveStreamControl({ 
  stream, 
  isStreamActive,
  onStreamToggle,
  onSettingsUpdate 
}: { 
  stream: Stream;
  isStreamActive: boolean;
  onStreamToggle: () => void;
  onSettingsUpdate: (settings: any) => void;
}) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isChatEnabled, setIsChatEnabled] = useState(stream.chatEnabled);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif font-semibold text-lg" style={{ color: COLORS.dark }}>
            Stream Controls
          </h3>
          <p className="text-sm" style={{ color: COLORS.dark + "80" }}>
            {isStreamActive ? "You are currently live" : "Stream is offline"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isStreamActive && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm font-semibold">LIVE</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Control Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Button
          variant={isVideoEnabled ? "default" : "outline"}
          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          className="h-12"
          style={{ backgroundColor: isVideoEnabled ? COLORS.primary : undefined }}
        >
          {isVideoEnabled ? <Video className="w-5 h-5 mr-2" /> : <VideoOff className="w-5 h-5 mr-2" />}
          Video
        </Button>

        <Button
          variant={isAudioEnabled ? "default" : "outline"}
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className="h-12"
          style={{ backgroundColor: isAudioEnabled ? COLORS.primary : undefined }}
        >
          {isAudioEnabled ? <Mic className="w-5 h-5 mr-2" /> : <MicOff className="w-5 h-5 mr-2" />}
          Audio
        </Button>

        <Button
          variant={isScreenSharing ? "default" : "outline"}
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className="h-12"
          style={{ backgroundColor: isScreenSharing ? COLORS.primary : undefined }}
        >
          <Monitor className="w-5 h-5 mr-2" />
          Share
        </Button>

        <Button
          variant={isChatEnabled ? "default" : "outline"}
          onClick={() => setIsChatEnabled(!isChatEnabled)}
          className="h-12"
          style={{ backgroundColor: isChatEnabled ? COLORS.primary : undefined }}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Chat
        </Button>
      </div>

      {/* Stream Action Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={onStreamToggle}
          className="px-8 py-4 text-lg font-semibold"
          style={{ 
            backgroundColor: isStreamActive ? "#EF4444" : COLORS.primary,
            color: "white"
          }}
        >
          {isStreamActive ? (
            <>
              <Square className="w-5 h-5 mr-2" />
              End Stream
            </>
          ) : (
            <>
              <Radio className="w-5 h-5 mr-2" />
              Go Live
            </>
          )}
        </Button>
      </div>

      {/* Stream Info */}
      {isStreamActive && (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold" style={{ color: COLORS.dark }}>
              {stream.viewers.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Current Viewers
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {Math.floor(stream.duration / 60)}h {stream.duration % 60}m
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Stream Time
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold" style={{ color: COLORS.primary }}>
              ${stream.revenue.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Revenue
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {stream.peakViewers.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              Peak Viewers
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StreamChat({ 
  messages, 
  onSendMessage 
}: { 
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}) {
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.lightGray }}>
      {/* Chat Header */}
      <div className="p-4 border-b" style={{ borderColor: COLORS.lightGray }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" style={{ color: COLORS.primary }} />
            <h3 className="font-serif font-semibold" style={{ color: COLORS.dark }}>
              Live Chat
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm" style={{ color: COLORS.dark + "80" }}>
              {messages.length} messages
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
              style={{ backgroundColor: message.isPremium ? COLORS.primary : "#6B7280" }}
            >
              {message.username.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold text-sm ${message.isPremium ? 'text-orange-600' : 'text-gray-900'}`}>
                  {message.username}
                </span>
                {message.isPremium && (
                  <Badge className="bg-orange-100 text-orange-600 border-orange-300 text-xs px-1 py-0">
                    <Star className="w-2 h-2 mr-1" />
                    Premium
                  </Badge>
                )}
                {message.isSupporter && (
                  <Badge className="bg-pink-100 text-pink-600 border-pink-300 text-xs px-1 py-0">
                    <Heart className="w-2 h-2 mr-1" />
                    Supporter
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="text-sm" style={{ color: COLORS.dark }}>
                {message.message}
                {message.amount && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                    +${message.amount}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t" style={{ borderColor: COLORS.lightGray }}>
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!newMessage.trim()}
            style={{ backgroundColor: COLORS.primary }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StreamEditor({ 
  stream, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  stream?: Stream; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (streamData: Partial<Stream>) => void; 
}) {
  const [formData, setFormData] = useState({
    title: stream?.title || "",
    description: stream?.description || "",
    category: stream?.category || "Market Analysis",
    isPublic: stream?.isPublic ?? true,
    isPremium: stream?.isPremium ?? false,
    price: stream?.price || 0,
    scheduledAt: stream?.scheduledAt || new Date(),
    recordingEnabled: stream?.recordingEnabled ?? true,
    tags: stream?.tags || []
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

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-4 lg:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" style={{ color: COLORS.primary }} />
            {stream ? "Edit Stream" : "Create New Stream"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="stream-title">Stream Title</Label>
              <Input
                id="stream-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter an engaging title for your stream..."
              />
            </div>
            
            <div>
              <Label htmlFor="stream-description">Stream Description</Label>
              <Textarea
                id="stream-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what viewers can expect from this stream..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stream-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Market Review">Market Review</SelectItem>
                    <SelectItem value="Strategy Session">Strategy Session</SelectItem>
                    <SelectItem value="Q&A Session">Q&A Session</SelectItem>
                    <SelectItem value="Live Trading">Live Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="scheduled-time">Scheduled Time</Label>
                <Input
                  id="scheduled-time"
                  type="datetime-local"
                  value={formData.scheduledAt?.toISOString().slice(0, 16)}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: new Date(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Access & Monetization */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Access & Monetization</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label className="font-medium">Public Stream</Label>
                  <p className="text-xs text-gray-600">Allow anyone to discover and join your stream</p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label className="font-medium">Premium Stream</Label>
                  <p className="text-xs text-gray-600">Require payment to access this stream</p>
                </div>
                <Switch
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                />
              </div>

              {formData.isPremium && (
                <div>
                  <Label htmlFor="stream-price">Stream Price ($)</Label>
                  <Input
                    id="stream-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Stream Features</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label className="font-medium flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Recording
                  </Label>
                  <p className="text-xs text-gray-600">Save stream replay</p>
                </div>
                <Switch
                  checked={formData.recordingEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, recordingEnabled: checked })}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Stream Tags</Label>
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
              disabled={!formData.title || !formData.description}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Save className="w-4 h-4 mr-1" />
              {stream ? "Update Stream" : "Create Stream"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LiveStreaming() {
  const [streams, setStreams] = useState<Stream[]>(mockStreams);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [activeTab, setActiveTab] = useState("overview");
  const [showStreamEditor, setShowStreamEditor] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | undefined>();
  const [isStreamActive, setIsStreamActive] = useState(true); // Simulate active stream
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCreateStream = () => {
    setEditingStream(undefined);
    setShowStreamEditor(true);
  };

  const handleEditStream = (stream: Stream) => {
    setEditingStream(stream);
    setShowStreamEditor(true);
  };

  const handleSaveStream = (streamData: Partial<Stream>) => {
    if (editingStream) {
      setStreams(prev => prev.map(stream => 
        stream.id === editingStream.id 
          ? { ...stream, ...streamData }
          : stream
      ));
    } else {
      const newStream: Stream = {
        id: `stream-${Date.now()}`,
        status: "scheduled",
        duration: 0,
        viewers: 0,
        peakViewers: 0,
        revenue: 0,
        thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
        streamKey: `sk_${Date.now()}`,
        ...streamData
      } as Stream;
      setStreams(prev => [newStream, ...prev]);
    }
  };

  const handleDeleteStream = (id: string) => {
    setStreams(prev => prev.filter(stream => stream.id !== id));
  };

  const handleStartStream = (stream: Stream) => {
    setStreams(prev => prev.map(s => 
      s.id === stream.id 
        ? { ...s, status: "live" as const, startedAt: new Date() }
        : s
    ));
  };

  const handleEndStream = (stream: Stream) => {
    setStreams(prev => prev.map(s => 
      s.id === stream.id 
        ? { ...s, status: "ended" as const, endedAt: new Date() }
        : s
    ));
  };

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      username: "You",
      message,
      timestamp: new Date(),
      isPremium: true,
      isSupporter: false
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const filteredStreams = streams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stream.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || stream.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const liveStream = streams.find(stream => stream.status === "live");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl" style={{ color: COLORS.dark }}>
            Live Streaming
          </h1>
          <p className="text-sm lg:text-base" style={{ color: COLORS.dark + "80" }}>
            Stream live market analysis, educational content, and engage with your audience in real-time
          </p>
        </div>
        
        <Button 
          onClick={handleCreateStream}
          className="flex-shrink-0"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Schedule Stream
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{ borderColor: COLORS.lightGray }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium" style={{ color: COLORS.dark + "80" }}>
                Total Streams
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {mockMetrics.totalStreams}
              </p>
            </div>
            <div 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <Video className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: COLORS.primary }} />
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
                Total Viewers
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {mockMetrics.totalViewers.toLocaleString()}
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
                Stream Hours
              </p>
              <p className="text-lg lg:text-2xl font-bold mt-1" style={{ color: COLORS.dark }}>
                {mockMetrics.totalHours}h
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-purple-100">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
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
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center bg-green-100">
              <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="live">Live Control</TabsTrigger>
          <TabsTrigger value="streams">All Streams</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {liveStream && (
            <Alert className="border-red-200 bg-red-50">
              <Radio className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                You have an active live stream: <strong>{liveStream.title}</strong>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Streams */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Recent Streams
              </h3>
              <div className="space-y-3">
                {streams.slice(0, 3).map((stream) => (
                  <div key={stream.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: 
                          stream.status === "live" ? "#EF4444" :
                          stream.status === "scheduled" ? "#3B82F6" :
                          "#6B7280"
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: COLORS.dark }}>
                        {stream.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stream.status === "live" ? "Live now" :
                         stream.status === "scheduled" ? `Scheduled for ${stream.scheduledAt?.toLocaleDateString()}` :
                         `Ended ${stream.endedAt?.toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                        {stream.status === "live" ? stream.viewers.toLocaleString() : stream.peakViewers.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stream.status === "live" ? "viewers" : "peak"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start h-12" 
                  variant="outline"
                  onClick={handleCreateStream}
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Schedule New Stream
                </Button>
                <Button 
                  className="w-full justify-start h-12" 
                  variant="outline"
                  style={{ backgroundColor: liveStream ? COLORS.primary : undefined, color: liveStream ? "white" : undefined }}
                >
                  <Radio className="w-5 h-5 mr-3" />
                  {liveStream ? "Go Live Now" : "Start Instant Stream"}
                </Button>
                <Button className="w-full justify-start h-12" variant="outline">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start h-12" variant="outline">
                  <Settings className="w-5 h-5 mr-3" />
                  Stream Settings
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Live Control Tab */}
        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              {liveStream ? (
                <LiveStreamControl
                  stream={liveStream}
                  isStreamActive={isStreamActive}
                  onStreamToggle={() => setIsStreamActive(!isStreamActive)}
                  onSettingsUpdate={(settings) => console.log(settings)}
                />
              ) : (
                <div className="bg-white rounded-xl border shadow-sm p-8 text-center" style={{ borderColor: COLORS.lightGray }}>
                  <VideoOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: COLORS.dark }}>
                    No Active Stream
                  </h3>
                  <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
                    Start a new stream or schedule one for later
                  </p>
                  <Button 
                    onClick={handleCreateStream}
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <Radio className="w-4 h-4 mr-1" />
                    Start Streaming
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <StreamChat
                messages={chatMessages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </TabsContent>

        {/* All Streams Tab */}
        <TabsContent value="streams" className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <Input
                placeholder="Search streams..."
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
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Streams Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
            layout
          >
            <AnimatePresence>
              {filteredStreams.map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  onEdit={handleEditStream}
                  onDelete={handleDeleteStream}
                  onViewAnalytics={(stream) => console.log("View analytics", stream)}
                  onStartStream={handleStartStream}
                  onEndStream={handleEndStream}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredStreams.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: COLORS.dark }}>
                No streams found
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
                Try adjusting your search or create a new stream
              </p>
              <Button 
                onClick={handleCreateStream}
                style={{ backgroundColor: COLORS.primary }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Stream
              </Button>
            </div>
          )}
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
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Average Viewers</span>
                  <span className="font-semibold" style={{ color: COLORS.dark }}>
                    {mockMetrics.avgViewers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Average Duration</span>
                  <span className="font-semibold" style={{ color: COLORS.dark }}>
                    {mockMetrics.avgDuration} min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Engagement Rate</span>
                  <span className="font-semibold text-green-600">
                    {mockMetrics.engagementRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Subscriber Growth</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>
                    +{mockMetrics.subscriberGrowth}%
                  </span>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: COLORS.lightGray }}>
              <h3 className="font-serif font-semibold text-lg mb-4" style={{ color: COLORS.dark }}>
                Revenue Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Premium Streams</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>
                    $45,230
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Donations</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>
                    $28,450
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: COLORS.dark + "80" }}>Sponsorships</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>
                    $15,565
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

      {/* Stream Editor Dialog */}
      <StreamEditor
        stream={editingStream}
        isOpen={showStreamEditor}
        onClose={() => setShowStreamEditor(false)}
        onSave={handleSaveStream}
      />
    </div>
  );
}