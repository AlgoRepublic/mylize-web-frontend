import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Newspaper,
  Plus,
  Edit3,
  Trash2,
  Save,
  Send,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Tag,
  TrendingUp,
  AlertTriangle,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  ExternalLink,
  Filter,
  Search,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
  Check,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  Globe,
  Bell,
  BellRing,
  Bookmark,
  BookmarkCheck,
  Settings,
  BarChart3,
  DollarSign,
  Activity,
  PieChart
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

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface AnalystNews {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  urgency: "low" | "medium" | "high" | "urgent";
  status: "draft" | "published" | "scheduled" | "archived";
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  scheduledAt?: Date;
  featuredImage?: string;
  tags: string[];
  affectedPairs: string[];
  marketImpact: "none" | "low" | "medium" | "high";
  views: number;
  likes: number;
  comments: number;
  shares: number;
  subscribers: number;
  isBreaking: boolean;
  isPinned: boolean;
  notifySubscribers: boolean;
  readTime: number;
  slug: string;
}

interface NewsCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const NEWS_CATEGORIES: NewsCategory[] = [
  {
    id: "market-update",
    name: "Market Update",
    description: "Current market conditions and analysis",
    color: "#3B82F6",
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    id: "trading-alert",
    name: "Trading Alert",
    description: "Important trading opportunities and warnings",
    color: "#EF4444",
    icon: <AlertTriangle className="w-4 h-4" />
  },
  {
    id: "analysis",
    name: "Analysis",
    description: "In-depth market and technical analysis",
    color: "#10B981",
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    id: "announcement",
    name: "Announcement",
    description: "Service updates and announcements",
    color: "#8B5CF6",
    icon: <Bell className="w-4 h-4" />
  },
  {
    id: "education",
    name: "Educational",
    description: "Learning content and tutorials",
    color: "#F59E0B",
    icon: <Lightbulb className="w-4 h-4" />
  },
  {
    id: "insights",
    name: "Market Insights",
    description: "Personal insights and commentary",
    color: "#06B6D4",
    icon: <Target className="w-4 h-4" />
  }
];

const mockAnalystNews: AnalystNews[] = [
  {
    id: "news-001",
    title: "🚨 EUR/USD: Major Breakout Above 1.0950 Resistance",
    excerpt: "EUR/USD has finally broken above the critical 1.0950 resistance level with strong volume. This is the breakout we've been waiting for!",
    content: "After weeks of consolidation, EUR/USD has decisively broken above the 1.0950 resistance level that has been capping gains since early January. The breakout occurred with significant volume and strong momentum, suggesting this could be the start of a larger rally toward 1.1100.\n\nKey Technical Levels:\n- Support: 1.0920, 1.0880\n- Resistance: 1.1000, 1.1050\n- Target: 1.1100-1.1150\n\nTrading Plan:\n- Entry: 1.0955-1.0965 (on pullback)\n- Stop Loss: Below 1.0920\n- Take Profit: 1.1100 (partial), 1.1150 (full)\n\nThis move aligns with our weekly outlook and confirms the bullish bias we've maintained. Monitor ECB communications closely as they could provide additional fuel for this rally.",
    category: NEWS_CATEGORIES[1], // Trading Alert
    urgency: "high",
    status: "published",
    author: "John Analyst",
    createdAt: new Date("2024-01-20T14:30:00"),
    updatedAt: new Date("2024-01-20T14:30:00"),
    publishedAt: new Date("2024-01-20T14:35:00"),
    featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    tags: ["EUR/USD", "Breakout", "Technical Analysis", "Trading Alert"],
    affectedPairs: ["EUR/USD", "EUR/GBP", "EUR/JPY"],
    marketImpact: "high",
    views: 2847,
    likes: 156,
    comments: 43,
    shares: 28,
    subscribers: 1205,
    isBreaking: true,
    isPinned: true,
    notifySubscribers: true,
    readTime: 3,
    slug: "eur-usd-major-breakout-above-resistance"
  },
  {
    id: "news-002",
    title: "Weekly Market Outlook: Fed Decision & Key Economic Data Ahead",
    excerpt: "This week brings the Federal Reserve decision and several key economic indicators that could shape market direction for the remainder of January.",
    content: "# Weekly Market Outlook\n\nKey Events This Week:\n\n**Wednesday - Federal Reserve Decision**\n- Expected to hold rates at 5.25-5.50%\n- Focus on Powell's press conference for clues on rate cuts\n- Any dovish shift could weaken USD significantly\n\n**Thursday - US GDP Data**\n- Q4 GDP expected at 2.2% annualized\n- Strong data could delay rate cut expectations\n- Watch for revisions to Q3 numbers\n\n**Friday - Core PCE (Fed's Preferred Inflation Gauge)**\n- Expected to remain at 3.2% YoY\n- Critical for Fed policy outlook\n\n## Trading Bias:\n- **USD**: Cautiously bearish ahead of Fed\n- **EUR**: Bullish on ECB hawkishness\n- **GBP**: Neutral, watching inflation data\n- **JPY**: Bearish on BoJ dovishness\n\nRisk Management: Keep position sizes moderate given high-impact events.",
    category: NEWS_CATEGORIES[0], // Market Update
    urgency: "medium",
    status: "published",
    author: "John Analyst",
    createdAt: new Date("2024-01-15T08:00:00"),
    updatedAt: new Date("2024-01-15T09:30:00"),
    publishedAt: new Date("2024-01-15T10:00:00"),
    tags: ["Weekly Outlook", "Federal Reserve", "Economic Calendar", "USD"],
    affectedPairs: ["USD/EUR", "USD/GBP", "USD/JPY", "DXY"],
    marketImpact: "medium",
    views: 5234,
    likes: 298,
    comments: 67,
    shares: 45,
    subscribers: 1205,
    isBreaking: false,
    isPinned: false,
    notifySubscribers: true,
    readTime: 5,
    slug: "weekly-market-outlook-fed-decision-key-data"
  },
  {
    id: "news-003",
    title: "Service Update: New Advanced Signal Package Now Available",
    excerpt: "Exciting news! We're launching our new Advanced Signal Package with enhanced features, real-time alerts, and premium analysis tools.",
    content: "We're thrilled to announce the launch of our **Advanced Signal Package**, designed for serious traders who want to take their trading to the next level.\n\n## What's Included:\n\n### 🎯 Premium Signals\n- Up to 15 high-probability signals per week\n- Multi-timeframe analysis (4H, Daily, Weekly)\n- Advanced entry/exit strategies\n- Risk management guidelines\n\n### 📱 Real-Time Alerts\n- Instant push notifications\n- SMS alerts for urgent signals\n- Telegram integration\n- Email summaries\n\n### 📊 Enhanced Analysis\n- Detailed market commentary\n- Video analysis (2-3 per week)\n- Live trading sessions\n- Q&A support\n\n### 🎓 Educational Content\n- Weekly strategy guides\n- Risk management tutorials\n- Psychology of trading content\n- Market structure analysis\n\n## Pricing:\n- **Monthly**: $199/month\n- **Quarterly**: $499 (Save 16%)\n- **Annual**: $1,599 (Save 33%)\n\n**Special Launch Offer**: Use code LAUNCH50 for 50% off your first month!\n\nUpgrade today and join our community of successful traders. Limited time offer ends January 31st.\n\n[Upgrade Now](/#upgrade) | [Learn More](/#features)",
    category: NEWS_CATEGORIES[3], // Announcement
    urgency: "medium",
    status: "published",
    author: "John Analyst",
    createdAt: new Date("2024-01-18T12:00:00"),
    updatedAt: new Date("2024-01-18T12:00:00"),
    publishedAt: new Date("2024-01-18T12:30:00"),
    tags: ["Service Update", "Advanced Signals", "Premium", "Launch"],
    affectedPairs: [],
    marketImpact: "none",
    views: 3456,
    likes: 189,
    comments: 52,
    shares: 34,
    subscribers: 1205,
    isBreaking: false,
    isPinned: true,
    notifySubscribers: true,
    readTime: 4,
    slug: "service-update-advanced-signal-package-available"
  },
  {
    id: "news-004",
    title: "Risk Management 101: Position Sizing for Forex Traders",
    excerpt: "Learn the fundamentals of position sizing and how to protect your capital in volatile market conditions. Essential knowledge for every trader.",
    content: "# Risk Management 101: Position Sizing\n\nProper position sizing is the foundation of successful trading. It's not about how much you can make, but how much you can afford to lose.\n\n## The 2% Rule\n\nNever risk more than 2% of your account on a single trade. Here's why:\n\n- **10 consecutive losses**: You'd lose only 18% of your account\n- **With 10% risk per trade**: You'd lose 65% of your account\n\n## Position Size Formula\n\n```\nPosition Size = (Account Risk / Stop Loss Distance) × Exchange Rate\n```\n\n### Example:\n- Account: $10,000\n- Risk: 2% = $200\n- Trade: EUR/USD long at 1.0950\n- Stop Loss: 1.0920 (30 pips)\n- Position Size: $200 / $3 = 0.67 lots\n\n## Risk-Reward Ratios\n\nAlways aim for at least 1:2 risk-reward:\n- Risk: 30 pips\n- Reward: 60+ pips\n\nThis means you can be wrong 60% of the time and still be profitable.\n\n## Market Condition Adjustments\n\n**High Volatility**: Reduce position size by 25-50%\n**Low Volatility**: Can use standard sizing\n**Uncertain Market**: Reduce size or stay flat\n\n## Psychology Factor\n\nIf you're stressed about a trade size, it's too big. You should be able to sleep soundly with any open position.\n\n**Remember**: It's better to live to trade another day than to blow up your account on one \"sure thing\" trade.\n\nNext week, we'll cover correlation risk and how to avoid overexposure to single currency movements.",
    category: NEWS_CATEGORIES[4], // Educational
    urgency: "low",
    status: "published",
    author: "John Analyst",
    createdAt: new Date("2024-01-17T10:00:00"),
    updatedAt: new Date("2024-01-17T10:00:00"),
    publishedAt: new Date("2024-01-17T11:00:00"),
    tags: ["Risk Management", "Position Sizing", "Education", "Trading Psychology"],
    affectedPairs: [],
    marketImpact: "none",
    views: 4123,
    likes: 267,
    comments: 89,
    shares: 56,
    subscribers: 1205,
    isBreaking: false,
    isPinned: false,
    notifySubscribers: false,
    readTime: 6,
    slug: "risk-management-101-position-sizing-forex-traders"
  }
];

function NewsCard({ 
  news, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onTogglePin,
  onToggleBreaking,
  compact = false
}: { 
  news: AnalystNews;
  onEdit: (news: AnalystNews) => void;
  onDelete: (id: string) => void;
  onDuplicate: (news: AnalystNews) => void;
  onTogglePin: (id: string) => void;
  onToggleBreaking: (id: string) => void;
  compact?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || "en").startsWith("ar");
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent": return "#DC2626";
      case "high": return "#EA580C";
      case "medium": return "#CA8A04";
      case "low": return "#059669";
      default: return COLORS.dark;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "#10B981";
      case "draft": return "#6B7280";
      case "scheduled": return "#3B82F6";
      case "archived": return "#EF4444";
      default: return COLORS.dark;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published": return <Globe className="w-4 h-4" />;
      case "draft": return <Edit3 className="w-4 h-4" />;
      case "scheduled": return <Calendar className="w-4 h-4" />;
      case "archived": return <Eye className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={`bg-white rounded-xl border shadow-sm transition-all duration-300 ${compact ? 'p-4' : 'p-6'}`}
      style={{ 
        borderColor: news.isBreaking ? "#EF4444" : news.isPinned ? COLORS.primary : COLORS.lightGray,
        borderWidth: news.isBreaking || news.isPinned ? "2px" : "1px"
      }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Breaking/Pinned Indicators */}
      <div className="flex gap-2 mb-3">
        {news.isBreaking && (
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-red-600" />
            </motion.div>
            <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 font-semibold">
              {t("pages.newsCenter.card.breakingBadge")}
            </Badge>
          </div>
        )}
        {news.isPinned && (
          <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
            {t("pages.newsCenter.card.pinnedBadge")}
          </Badge>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: news.category.color + "20",
              color: news.category.color 
            }}
          >
            {news.category.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge 
                variant="outline"
                style={{ 
                  borderColor: getUrgencyColor(news.urgency) + "40",
                  color: getUrgencyColor(news.urgency)
                }}
              >
                {news.urgency.toUpperCase()} PRIORITY
              </Badge>
              <Badge 
                variant="outline"
                style={{ 
                  borderColor: getStatusColor(news.status) + "40",
                  color: getStatusColor(news.status)
                }}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(news.status)}
                  <span className="capitalize">{news.status}</span>
                </div>
              </Badge>
            </div>
            <p className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {news.category.name} • {formatTimeAgo(news.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onTogglePin(news.id)}
            className={news.isPinned ? "text-orange-600" : ""}
          >
            <Star className={`w-4 h-4 ${news.isPinned ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(news)}>
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(news)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(news.id)} className="text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 
          className={`font-serif font-semibold mb-2 line-clamp-2 ${compact ? 'text-base' : 'text-lg'}`} 
          style={{ color: COLORS.dark }}
        >
          {news.title}
        </h3>
        {!compact && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: COLORS.dark + "80" }}>
            {news.excerpt}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-xs mb-3" style={{ color: COLORS.dark + "60" }}>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {t("pages.newsCenter.card.minRead", { minutes: news.readTime })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>
              {t("pages.newsCenter.card.subscribers", {
                count: news.subscribers.toLocaleString() as any,
              })}
            </span>
          </div>
          {news.marketImpact !== "none" && (
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              <span className="capitalize">
                {news.marketImpact} {t("pages.newsCenter.card.impactSuffix")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {news.featuredImage && !compact && (
        <div className="mb-4">
          <div 
            className="w-full h-32 bg-cover bg-center rounded-lg border"
            style={{ 
              backgroundImage: `url(${news.featuredImage})`,
              borderColor: COLORS.lightGray
            }}
          />
        </div>
      )}

      {/* Affected Pairs */}
      {news.affectedPairs.length > 0 && (
        <div className="mb-4">
          <h5 className="text-xs font-medium mb-2" style={{ color: COLORS.dark + "80" }}>
            {t("pages.newsCenter.card.affectedPairsTitle")}
          </h5>
          <div className="flex gap-1 flex-wrap">
            {news.affectedPairs.slice(0, compact ? 3 : 6).map((pair, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {pair}
              </Badge>
            ))}
            {news.affectedPairs.length > (compact ? 3 : 6) && (
              <Badge variant="outline" className="text-xs">
                {t("pages.newsCenter.card.morePairs", {
                  count: news.affectedPairs.length - (compact ? 3 : 6),
                })}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {news.tags.length > 0 && !compact && (
        <div className="mb-4">
          <div className="flex gap-1 flex-wrap">
            {news.tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {news.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                {t("pages.newsCenter.card.moreTags", {
                  count: news.tags.length - 4,
                })}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      {news.status === "published" && (
        <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: COLORS.dark }}>
              {news.views.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.newsCenter.card.views")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-red-600">
              {news.likes}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.newsCenter.card.likes")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-blue-600">
              {news.comments}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.newsCenter.card.comments")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-green-600">
              {news.shares}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.newsCenter.card.shares")}
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Info */}
      {news.status === "scheduled" && news.scheduledAt && (
        <Alert className="mb-4">
          <Calendar className="w-4 h-4" />
          <AlertDescription>
            {t("pages.newsCenter.card.scheduled", {
              date: news.scheduledAt.toLocaleDateString(),
              time: news.scheduledAt.toLocaleTimeString(),
            })}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {news.status === "draft" ? (
          <Button 
            className="flex-1"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Send className="w-4 h-4 mr-1" />
            {t("pages.newsCenter.card.publishNews")}
          </Button>
        ) : news.status === "published" ? (
          <div className="flex gap-2 flex-1">
            <Button size="sm" variant="outline" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-1" />
              {t("pages.newsCenter.card.viewLive")}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onToggleBreaking(news.id)}
              className={news.isBreaking ? "text-red-600 border-red-300" : ""}
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onEdit(news)}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            {t("pages.newsCenter.card.editNews")}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function NewsEditor({ 
  news, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  news?: AnalystNews; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (newsData: Partial<AnalystNews>) => void; 
}) {
  const [formData, setFormData] = useState({
    title: news?.title || "",
    excerpt: news?.excerpt || "",
    content: news?.content || "",
    category: news?.category?.id || NEWS_CATEGORIES[0].id,
    urgency: news?.urgency || "medium",
    tags: news?.tags || [],
    affectedPairs: news?.affectedPairs || [],
    marketImpact: news?.marketImpact || "none",
    notifySubscribers: news?.notifySubscribers || false,
    isBreaking: news?.isBreaking || false,
    featuredImage: news?.featuredImage || "",
    scheduledAt: news?.scheduledAt ? news.scheduledAt.toISOString().slice(0, 16) : ""
  });

  const [activeTab, setActiveTab] = useState("content");
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newPair, setNewPair] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleContentChange = (value: string) => {
    setFormData({ ...formData, content: value });
    setWordCount(value.trim().split(/\s+/).length);
  };

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

  const addPair = () => {
    if (newPair.trim() && !formData.affectedPairs.includes(newPair.trim())) {
      setFormData({ 
        ...formData, 
        affectedPairs: [...formData.affectedPairs, newPair.trim()] 
      });
      setNewPair("");
    }
  };

  const removePair = (pairToRemove: string) => {
    setFormData({ 
      ...formData, 
      affectedPairs: formData.affectedPairs.filter(pair => pair !== pairToRemove) 
    });
  };

  const handleImageUpload = async () => {
    setIsUploadingImage(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const imageUrl = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop";
      setFormData({ ...formData, featuredImage: imageUrl });
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const calculateReadTime = () => {
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSave = async (action: "draft" | "publish" | "schedule") => {
    setIsSaving(true);
    
    const selectedCategory = NEWS_CATEGORIES.find(cat => cat.id === formData.category);
    
    const newsData: Partial<AnalystNews> = {
      ...news,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: selectedCategory,
      urgency: formData.urgency as any,
      tags: formData.tags,
      affectedPairs: formData.affectedPairs,
      marketImpact: formData.marketImpact as any,
      notifySubscribers: formData.notifySubscribers,
      isBreaking: formData.isBreaking,
      featuredImage: formData.featuredImage,
      readTime: calculateReadTime(),
      updatedAt: new Date(),
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    if (action === "publish") {
      newsData.status = "published";
      newsData.publishedAt = new Date();
    } else if (action === "schedule" && formData.scheduledAt) {
      newsData.status = "scheduled";
      newsData.scheduledAt = new Date(formData.scheduledAt);
    } else {
      newsData.status = "draft";
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(newsData);
    setIsSaving(false);
    onClose();
  };

  const selectedCategory = NEWS_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" style={{ color: COLORS.primary }} />
            {news ? "Edit News Article" : "Create News Article"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div>
              <Label htmlFor="title">News Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter attention-grabbing news title..."
                className="text-lg font-serif"
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                {formData.title.length}/100 characters (optimal for engagement)
              </p>
            </div>
            
            <div>
              <Label htmlFor="excerpt">News Summary</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary that will appear in previews and notifications..."
                rows={3}
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                {formData.excerpt.length}/200 characters (optimal for notifications)
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="content">Full Content</Label>
                <div className="flex items-center gap-4 text-xs" style={{ color: COLORS.dark + "60" }}>
                  <span>{wordCount} words</span>
                  <span>{calculateReadTime()} min read</span>
                </div>
              </div>
              
              {/* Simple Rich Text Toolbar */}
              <div className="flex items-center gap-1 mb-2 p-2 border rounded-lg" style={{ borderColor: COLORS.lightGray }}>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Underline className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <List className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Link className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Quote className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
              
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write your news content... You can use Markdown formatting for better presentation."
                rows={15}
                className="font-mono"
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                Supports Markdown formatting. Aim for 300-1000 words for optimal engagement.
              </p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">News Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div style={{ color: category.color }}>
                            {category.icon}
                          </div>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                    {selectedCategory.description}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="urgency">Priority Level</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="marketImpact">Expected Market Impact</Label>
              <Select value={formData.marketImpact} onValueChange={(value) => setFormData({ ...formData, marketImpact: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Market Impact</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Featured Image</Label>
              <div className="mt-2">
                {formData.featuredImage ? (
                  <div className="relative">
                    <img 
                      src={formData.featuredImage} 
                      alt="Featured Image" 
                      className="w-full h-48 object-cover rounded-lg border"
                      style={{ borderColor: COLORS.lightGray }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-white"
                      onClick={() => setFormData({ ...formData, featuredImage: "" })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    style={{ borderColor: COLORS.lightGray }}
                    onClick={handleImageUpload}
                  >
                    {isUploadingImage ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="w-5 h-5" />
                        </motion.div>
                        <span>Uploading image...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8" style={{ color: COLORS.dark + "40" }} />
                        <span className="text-sm" style={{ color: COLORS.dark + "60" }}>
                          Click to upload featured image
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="scheduledAt">Schedule Publication (Optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                Leave empty to publish immediately or save as draft
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.notifySubscribers}
                  onCheckedChange={(checked) => setFormData({ ...formData, notifySubscribers: checked })}
                />
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notify Subscribers
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isBreaking}
                  onCheckedChange={(checked) => setFormData({ ...formData, isBreaking: checked })}
                />
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Breaking News
                </Label>
              </div>
            </div>
          </TabsContent>

          {/* Targeting Tab */}
          <TabsContent value="targeting" className="space-y-4">
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 flex-wrap mt-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="cursor-pointer hover:bg-red-50"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag (e.g. EUR/USD, Analysis, Alert)..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button size="sm" onClick={addTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Affected Currency Pairs</Label>
              <div className="flex gap-2 flex-wrap mt-2 mb-3">
                {formData.affectedPairs.map((pair, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="cursor-pointer hover:bg-red-50"
                    onClick={() => removePair(pair)}
                  >
                    {pair}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newPair}
                  onChange={(e) => setNewPair(e.target.value)}
                  placeholder="Add currency pair (e.g. EUR/USD, GBP/JPY)..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPair();
                    }
                  }}
                />
                <Button size="sm" onClick={addPair} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                Help subscribers understand which pairs might be affected by this news
              </p>
            </div>

            <Alert>
              <Target className="w-4 h-4" />
              <AlertDescription>
                <strong>Targeting Tip:</strong> Use relevant tags and affected pairs to help subscribers find your content and understand its relevance to their trading positions.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: COLORS.lightGray }}>
                {formData.featuredImage && (
                  <img 
                    src={formData.featuredImage} 
                    alt="Featured" 
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div style={{ color: selectedCategory?.color }}>
                      {selectedCategory?.icon}
                    </div>
                    <Badge variant="outline" style={{ borderColor: selectedCategory?.color + "40", color: selectedCategory?.color }}>
                      {selectedCategory?.name}
                    </Badge>
                    {formData.isBreaking && (
                      <Badge variant="outline" className="border-red-300 text-red-600">
                        <Zap className="w-3 h-3 mr-1" />
                        Breaking
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-serif font-bold mb-2" style={{ color: COLORS.dark }}>
                    {formData.title || "Your News Title Here"}
                  </h1>
                  
                  <p className="text-lg mb-4" style={{ color: COLORS.dark + "80" }}>
                    {formData.excerpt || "Your news summary will appear here..."}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm mb-4" style={{ color: COLORS.dark + "60" }}>
                    <span>{calculateReadTime()} min read</span>
                    <span>•</span>
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span className="capitalize">{formData.urgency} priority</span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap" style={{ color: COLORS.dark }}>
                    {formData.content || "Your news content will be displayed here..."}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={!formData.title || !formData.content || isSaving}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save Draft
          </Button>
          {formData.scheduledAt && (
            <Button 
              onClick={() => handleSave("schedule")}
              disabled={!formData.title || !formData.content || isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          )}
          <Button 
            onClick={() => handleSave("publish")}
            disabled={!formData.title || !formData.content || isSaving}
            style={{ backgroundColor: COLORS.primary }}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-1" />
            )}
            Publish News
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AnalystNews() {
  const [news, setNews] = useState<AnalystNews[]>(mockAnalystNews);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNews, setEditingNews] = useState<AnalystNews | undefined>(undefined);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || "en").startsWith("ar");

  const handleCreateNews = () => {
    setEditingNews(undefined);
    setShowEditor(true);
  };

  const handleEditNews = (newsItem: AnalystNews) => {
    setEditingNews(newsItem);
    setShowEditor(true);
  };

  const handleSaveNews = (newsData: Partial<AnalystNews>) => {
    if (editingNews) {
      // Update existing news
      setNews(prev => prev.map(item => 
        item.id === editingNews.id 
          ? { ...item, ...newsData }
          : item
      ));
    } else {
      // Create new news
      const newNews: AnalystNews = {
        id: `news-${Date.now()}`,
        author: "Current User",
        createdAt: new Date(),
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        subscribers: 1205,
        isPinned: false,
        ...newsData
      } as AnalystNews;
      setNews(prev => [newNews, ...prev]);
    }
  };

  const handleDeleteNews = (id: string) => {
    setNews(prev => prev.filter(item => item.id !== id));
  };

  const handleDuplicateNews = (newsItem: AnalystNews) => {
    const duplicated: AnalystNews = {
      ...newsItem,
      id: `news-${Date.now()}`,
      title: `${newsItem.title} (Copy)`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: undefined,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      isBreaking: false
    };
    setNews(prev => [duplicated, ...prev]);
  };

  const handleTogglePin = (id: string) => {
    setNews(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isPinned: !item.isPinned }
        : item
    ));
  };

  const handleToggleBreaking = (id: string) => {
    setNews(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isBreaking: !item.isBreaking }
        : item
    ));
  };

  const filteredNews = news.filter(item => {
    if (filter !== "all") {
      if (filter === "published" && item.status !== "published") return false;
      if (filter === "draft" && item.status !== "draft") return false;
      if (filter === "scheduled" && item.status !== "scheduled") return false;
      if (filter === "breaking" && !item.isBreaking) return false;
      if (filter === "pinned" && !item.isPinned) return false;
    }
    if (categoryFilter !== "all" && item.category.id !== categoryFilter) return false;
    if (urgencyFilter !== "all" && item.urgency !== urgencyFilter) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  const statusCounts = {
    all: news.length,
    published: news.filter(n => n.status === "published").length,
    draft: news.filter(n => n.status === "draft").length,
    scheduled: news.filter(n => n.status === "scheduled").length,
    breaking: news.filter(n => n.isBreaking).length,
    pinned: news.filter(n => n.isPinned).length
  };

  const totalViews = news.filter(n => n.status === "published").reduce((sum, n) => sum + n.views, 0);
  const totalEngagement = news.filter(n => n.status === "published").reduce((sum, n) => sum + n.likes + n.comments + n.shares, 0);
  const subscriberReach = news.length > 0 ? news[0].subscribers : 0;

  return (
    <div
      className="space-y-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            {t("pages.newsCenter.title")}
          </h2>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            {t("pages.newsCenter.subtitle")}
          </p>
        </div>
        
        <Button 
          onClick={handleCreateNews}
          className="gap-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4" />
          {t("pages.newsCenter.header.create")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <Newspaper className="w-5 h-5" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                {statusCounts.all}
              </p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.newsCenter.stats.totalNews")}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{statusCounts.published}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.newsCenter.stats.published")}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalViews.toLocaleString()}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.newsCenter.stats.totalViews")}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{subscriberReach.toLocaleString()}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.newsCenter.stats.subscribers")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: COLORS.dark + "60" }} />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">
                {t("pages.newsCenter.filters.allNews", { count: statusCounts.all })}
              </option>
              <option value="published">
                {t("pages.newsCenter.filters.published", { count: statusCounts.published })}
              </option>
              <option value="draft">
                {t("pages.newsCenter.filters.draft", { count: statusCounts.draft })}
              </option>
              <option value="scheduled">
                {t("pages.newsCenter.filters.scheduled", { count: statusCounts.scheduled })}
              </option>
              <option value="breaking">
                {t("pages.newsCenter.filters.breaking", { count: statusCounts.breaking })}
              </option>
              <option value="pinned">
                {t("pages.newsCenter.filters.pinned", { count: statusCounts.pinned })}
              </option>
            </select>
          </div>
          
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">
              {t("pages.newsCenter.filters.allCategories")}
            </option>
            {NEWS_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select 
            value={urgencyFilter} 
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">
              {t("pages.newsCenter.filters.allPriorities")}
            </option>
            <option value="urgent">
              {t("pages.newsCenter.filters.urgent")}
            </option>
            <option value="high">
              {t("pages.newsCenter.filters.high")}
            </option>
            <option value="medium">
              {t("pages.newsCenter.filters.medium")}
            </option>
            <option value="low">
              {t("pages.newsCenter.filters.low")}
            </option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <Input
            placeholder={t("pages.newsCenter.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
            icon={<Search className="w-4 h-4" />}
          />
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <PieChart className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <motion.div 
        className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" 
            : "grid-cols-1 max-w-4xl mx-auto"
        }`}
        layout
      >
        <AnimatePresence>
          {filteredNews.map((newsItem) => (
            <NewsCard
              news={newsItem}
              onEdit={handleEditNews}
              onDelete={handleDeleteNews}
              onDuplicate={handleDuplicateNews}
              onTogglePin={handleTogglePin}
              onToggleBreaking={handleToggleBreaking}
              compact={viewMode === "list"}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
          <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
            {filter === "all"
              ? t("pages.newsCenter.emptyState.noNews")
              : t("pages.newsCenter.emptyState.noNewsFiltered", {
                  status: filter,
                })}
          </h3>
          <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
            {filter === "all" 
              ? t("pages.newsCenter.emptyState.body")
              : t("pages.newsCenter.emptyState.bodyFiltered", {
                  status: filter,
                })
            }
          </p>
          {filter === "all" && (
            <Button 
              onClick={handleCreateNews}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4 mr-1" />
              {t("pages.newsCenter.emptyState.createFirstNews")}
            </Button>
          )}
        </div>
      )}

      {/* News Editor Dialog */}
      <NewsEditor
        news={editingNews}
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingNews(undefined);
        }}
        onSave={handleSaveNews}
      />
    </div>
  );
}