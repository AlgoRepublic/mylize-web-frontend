import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Newspaper,
  TrendingUp,
  TrendingDown,
  Clock,
  Globe,
  AlertTriangle,
  Zap,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  Filter,
  Search,
  Calendar,
  BarChart3,
  DollarSign,
  Building2,
  Users,
  Bell,
  BellRing,
  ExternalLink,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Star,
  Flag,
  Target,
  Layers,
  PieChart,
  LineChart,
  Activity,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  AlertCircle,
  Info,
  Lightbulb,
  Radio,
  Rss,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  List
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
import { Textarea } from "./ui/textarea";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: NewsSource;
  category: NewsCategory;
  impact: "low" | "medium" | "high" | "critical";
  sentiment: "bullish" | "bearish" | "neutral";
  publishedAt: Date;
  updatedAt?: Date;
  image?: string;
  tags: string[];
  affectedPairs: string[];
  region: string;
  isBreaking: boolean;
  isPremium: boolean;
  views: number;
  likes: number;
  bookmarks: number;
  shares: number;
  readTime: number;
  url?: string;
  isBookmarked: boolean;
  priority: number;
  alertLevel?: "info" | "warning" | "critical";
}

interface NewsSource {
  id: string;
  name: string;
  logo?: string;
  credibility: number; // 1-10 scale
  type: "central_bank" | "financial_media" | "government" | "research" | "social";
  isVerified: boolean;
  subscription: "free" | "premium" | "partner";
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
    id: "central-banks",
    name: "Central Banks",
    description: "Central bank decisions and policy announcements",
    color: "#DC2626",
    icon: <Building2 className="w-4 h-4" />
  },
  {
    id: "economic-data",
    name: "Economic Data",
    description: "Economic indicators and statistical releases",
    color: "#2563EB",
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    id: "market-analysis",
    name: "Market Analysis",
    description: "Technical and fundamental market analysis",
    color: "#059669",
    icon: <LineChart className="w-4 h-4" />
  },
  {
    id: "geopolitical",
    name: "Geopolitical",
    description: "Political events affecting financial markets",
    color: "#7C3AED",
    icon: <Globe className="w-4 h-4" />
  },
  {
    id: "earnings",
    name: "Earnings",
    description: "Corporate earnings and financial results",
    color: "#EA580C",
    icon: <DollarSign className="w-4 h-4" />
  },
  {
    id: "breaking-news",
    name: "Breaking News",
    description: "Urgent market-moving news and events",
    color: "#EF4444",
    icon: <Zap className="w-4 h-4" />
  }
];

const NEWS_SOURCES: NewsSource[] = [
  {
    id: "federal-reserve",
    name: "Federal Reserve",
    credibility: 10,
    type: "central_bank",
    isVerified: true,
    subscription: "free"
  },
  {
    id: "ecb",
    name: "European Central Bank",
    credibility: 10,
    type: "central_bank",
    isVerified: true,
    subscription: "free"
  },
  {
    id: "reuters",
    name: "Reuters",
    credibility: 9,
    type: "financial_media",
    isVerified: true,
    subscription: "premium"
  },
  {
    id: "bloomberg",
    name: "Bloomberg",
    credibility: 9,
    type: "financial_media",
    isVerified: true,
    subscription: "premium"
  },
  {
    id: "forexfactory",
    name: "Forex Factory",
    credibility: 8,
    type: "financial_media",
    isVerified: true,
    subscription: "free"
  }
];

const mockNews: NewsItem[] = [
  {
    id: "news-001",
    title: "Federal Reserve Signals Potential Rate Cut in March Meeting",
    summary: "Fed Chair Powell hints at dovish policy shift amid slowing inflation data, suggesting potential rate cuts may begin sooner than expected.",
    content: "Federal Reserve Chair Jerome Powell indicated during today's testimony that the central bank may consider rate cuts as early as March...",
    source: NEWS_SOURCES[0],
    category: NEWS_CATEGORIES[0],
    impact: "critical",
    sentiment: "bullish",
    publishedAt: new Date("2024-01-20T14:30:00"),
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    tags: ["Federal Reserve", "Interest Rates", "Powell", "Monetary Policy"],
    affectedPairs: ["USD/EUR", "USD/GBP", "USD/JPY", "DXY"],
    region: "United States",
    isBreaking: true,
    isPremium: false,
    views: 15247,
    likes: 892,
    bookmarks: 341,
    shares: 156,
    readTime: 4,
    isBookmarked: false,
    priority: 10,
    alertLevel: "critical"
  },
  {
    id: "news-002",
    title: "ECB Maintains Hawkish Stance Despite Economic Slowdown",
    summary: "European Central Bank keeps rates unchanged but signals continued vigilance on inflation, supporting euro strength in the near term.",
    content: "The European Central Bank held its key interest rate at 4.5% today, maintaining its hawkish stance despite growing concerns...",
    source: NEWS_SOURCES[1],
    category: NEWS_CATEGORIES[0],
    impact: "high",
    sentiment: "bullish",
    publishedAt: new Date("2024-01-20T12:45:00"),
    tags: ["ECB", "EUR", "Interest Rates", "Lagarde"],
    affectedPairs: ["EUR/USD", "EUR/GBP", "EUR/JPY"],
    region: "European Union",
    isBreaking: false,
    isPremium: false,
    views: 8934,
    likes: 234,
    bookmarks: 89,
    shares: 45,
    readTime: 6,
    isBookmarked: true,
    priority: 8,
    alertLevel: "warning"
  },
  {
    id: "news-003",
    title: "US Non-Farm Payrolls Exceed Expectations at 275K",
    summary: "January employment data shows robust job growth, complicating Federal Reserve's rate cut timeline and supporting dollar strength.",
    content: "The US economy added 275,000 jobs in January, significantly exceeding the expected 180,000, according to the Bureau of Labor Statistics...",
    source: NEWS_SOURCES[2],
    category: NEWS_CATEGORIES[1],
    impact: "high",
    sentiment: "neutral",
    publishedAt: new Date("2024-01-20T08:30:00"),
    updatedAt: new Date("2024-01-20T09:15:00"),
    tags: ["NFP", "Employment", "USD", "Labor Market"],
    affectedPairs: ["USD/EUR", "USD/CAD", "USD/CHF"],
    region: "United States",
    isBreaking: false,
    isPremium: true,
    views: 12456,
    likes: 567,
    bookmarks: 203,
    shares: 89,
    readTime: 5,
    isBookmarked: false,
    priority: 9
  },
  {
    id: "news-004",
    title: "China's GDP Growth Slows to 4.8% in Q4 2023",
    summary: "Chinese economic growth continues to decelerate, raising concerns about global trade and commodity demand impact.",
    content: "China's National Bureau of Statistics reported that GDP growth slowed to 4.8% year-over-year in the fourth quarter...",
    source: NEWS_SOURCES[3],
    category: NEWS_CATEGORIES[1],
    impact: "medium",
    sentiment: "bearish",
    publishedAt: new Date("2024-01-19T23:00:00"),
    tags: ["China", "GDP", "Economic Growth", "AUD", "NZD"],
    affectedPairs: ["AUD/USD", "NZD/USD", "USD/CNH"],
    region: "Asia Pacific",
    isBreaking: false,
    isPremium: false,
    views: 6789,
    likes: 145,
    bookmarks: 67,
    shares: 23,
    readTime: 7,
    isBookmarked: false,
    priority: 6
  },
  {
    id: "news-005",
    title: "UK Inflation Falls to 3.2%, Bank of England Under Pressure",
    summary: "UK inflation continues its downward trend, increasing pressure on the Bank of England to consider rate cuts sooner than anticipated.",
    content: "UK inflation dropped to 3.2% in December, marking the fourth consecutive month of decline and bringing it closer to the Bank of England's 2% target...",
    source: NEWS_SOURCES[4],
    category: NEWS_CATEGORIES[1],
    impact: "medium",
    sentiment: "bearish",
    publishedAt: new Date("2024-01-19T07:00:00"),
    tags: ["UK", "Inflation", "BOE", "GBP"],
    affectedPairs: ["GBP/USD", "EUR/GBP", "GBP/JPY"],
    region: "United Kingdom",
    isBreaking: false,
    isPremium: false,
    views: 4523,
    likes: 89,
    bookmarks: 34,
    shares: 12,
    readTime: 4,
    isBookmarked: true,
    priority: 5
  }
];

interface NewsAlert {
  id: string;
  title: string;
  keywords: string[];
  pairs: string[];
  impact: ("low" | "medium" | "high" | "critical")[];
  sources: string[];
  isActive: boolean;
  notificationTypes: ("push" | "email" | "sms")[];
  createdAt: Date;
}

function NewsCard({ 
  news, 
  onBookmark, 
  onShare, 
  onView,
  compact = false
}: { 
  news: NewsItem;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onView: (id: string) => void;
  compact?: boolean;
}) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical": return "#DC2626";
      case "high": return "#EA580C";
      case "medium": return "#CA8A04";
      case "low": return "#059669";
      default: return COLORS.dark;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "#059669";
      case "bearish": return "#DC2626";
      case "neutral": return "#6B7280";
      default: return COLORS.dark;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return <TrendingUp className="w-3 h-3" />;
      case "bearish": return <TrendingDown className="w-3 h-3" />;
      case "neutral": return <Activity className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
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
        borderColor: news.isBreaking ? "#EF4444" : COLORS.lightGray,
        borderWidth: news.isBreaking ? "2px" : "1px"
      }}
    >
      {/* Breaking News Banner */}
      {news.isBreaking && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-red-50 rounded-lg border border-red-200">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-red-600" />
          </motion.div>
          <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 font-semibold">
            BREAKING NEWS
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
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
                  borderColor: getImpactColor(news.impact) + "40",
                  color: getImpactColor(news.impact)
                }}
              >
                {news.impact.toUpperCase()} IMPACT
              </Badge>
              <Badge 
                variant="outline"
                style={{ 
                  borderColor: getSentimentColor(news.sentiment) + "40",
                  color: getSentimentColor(news.sentiment)
                }}
              >
                <div className="flex items-center gap-1">
                  {getSentimentIcon(news.sentiment)}
                  <span className="capitalize">{news.sentiment}</span>
                </div>
              </Badge>
              {news.isPremium && (
                <Badge variant="outline" className="border-yellow-300 text-yellow-600">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {news.category.name} • {news.source.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onBookmark(news.id)}
            className={news.isBookmarked ? "text-yellow-600" : ""}
          >
            {news.isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onShare(news.id)}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 
          className={`font-serif font-semibold mb-2 cursor-pointer hover:text-opacity-80 ${compact ? 'text-base line-clamp-2' : 'text-lg line-clamp-3'}`} 
          style={{ color: COLORS.dark }}
          onClick={() => onView(news.id)}
        >
          {news.title}
        </h3>
        {!compact && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: COLORS.dark + "80" }}>
            {news.summary}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-xs mb-3" style={{ color: COLORS.dark + "60" }}>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(news.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{news.readTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>{news.region}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {news.image && !compact && (
        <div className="mb-4">
          <div 
            className="w-full h-32 bg-cover bg-center rounded-lg border"
            style={{ 
              backgroundImage: `url(${news.image})`,
              borderColor: COLORS.lightGray
            }}
          />
        </div>
      )}

      {/* Affected Pairs */}
      {news.affectedPairs.length > 0 && (
        <div className="mb-4">
          <h5 className="text-xs font-medium mb-2" style={{ color: COLORS.dark + "80" }}>
            AFFECTED PAIRS
          </h5>
          <div className="flex gap-1 flex-wrap">
            {news.affectedPairs.slice(0, compact ? 3 : 6).map((pair, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {pair}
              </Badge>
            ))}
            {news.affectedPairs.length > (compact ? 3 : 6) && (
              <Badge variant="outline" className="text-xs">
                +{news.affectedPairs.length - (compact ? 3 : 6)}
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
                +{news.tags.length - 4}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Stats & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs" style={{ color: COLORS.dark + "60" }}>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{news.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{news.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bookmark className="w-3 h-3" />
            <span>{news.bookmarks}</span>
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onView(news.id)}
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Read Full
        </Button>
      </div>

      {/* Alert Level Indicator */}
      {news.alertLevel && (
        <div className={`mt-3 p-2 rounded-lg ${
          news.alertLevel === 'critical' ? 'bg-red-50 border border-red-200' :
          news.alertLevel === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center gap-2 text-xs">
            {news.alertLevel === 'critical' ? 
              <AlertTriangle className="w-3 h-3 text-red-600" /> :
              news.alertLevel === 'warning' ?
              <AlertCircle className="w-3 h-3 text-yellow-600" /> :
              <Info className="w-3 h-3 text-blue-600" />
            }
            <span className={
              news.alertLevel === 'critical' ? 'text-red-600' :
              news.alertLevel === 'warning' ? 'text-yellow-600' :
              'text-blue-600'
            }>
              {news.alertLevel === 'critical' ? 'Critical market impact expected' :
               news.alertLevel === 'warning' ? 'Moderate market impact possible' :
               'Informational update'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function NewsAlertDialog({ 
  isOpen, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (alert: Partial<NewsAlert>) => void; 
}) {
  const [formData, setFormData] = useState({
    title: "",
    keywords: [],
    pairs: [],
    impact: ["high", "critical"],
    sources: [],
    notificationTypes: ["push"]
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [newPair, setNewPair] = useState("");

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData({ 
        ...formData, 
        keywords: [...formData.keywords, newKeyword.trim()] 
      });
      setNewKeyword("");
    }
  };

  const addPair = () => {
    if (newPair.trim() && !formData.pairs.includes(newPair.trim())) {
      setFormData({ 
        ...formData, 
        pairs: [...formData.pairs, newPair.trim()] 
      });
      setNewPair("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({ 
      ...formData, 
      keywords: formData.keywords.filter(k => k !== keyword) 
    });
  };

  const removePair = (pair: string) => {
    setFormData({ 
      ...formData, 
      pairs: formData.pairs.filter(p => p !== pair) 
    });
  };

  const handleSave = () => {
    const alertData: Partial<NewsAlert> = {
      ...formData,
      id: `alert-${Date.now()}`,
      isActive: true,
      createdAt: new Date()
    };
    onSave(alertData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: COLORS.primary }} />
            Create News Alert
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="alertTitle">Alert Name</Label>
            <Input
              id="alertTitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Federal Reserve Rate Decisions"
            />
          </div>
          
          <div>
            <Label>Keywords</Label>
            <div className="flex gap-2 flex-wrap mt-2 mb-3">
              {formData.keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="cursor-pointer hover:bg-red-50"
                  onClick={() => removeKeyword(keyword)}
                >
                  {keyword}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add keyword (e.g. Fed, ECB, NFP)..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button size="sm" onClick={addKeyword} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Currency Pairs</Label>
            <div className="flex gap-2 flex-wrap mt-2 mb-3">
              {formData.pairs.map((pair, index) => (
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
          </div>

          <div>
            <Label>Impact Levels</Label>
            <div className="flex gap-2 mt-2">
              {["low", "medium", "high", "critical"].map((level) => (
                <Button
                  key={level}
                  variant={formData.impact.includes(level as any) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const updatedImpact = formData.impact.includes(level as any)
                      ? formData.impact.filter(i => i !== level)
                      : [...formData.impact, level as any];
                    setFormData({ ...formData, impact: updatedImpact });
                  }}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Notification Methods</Label>
            <div className="flex gap-2 mt-2">
              {["push", "email", "sms"].map((method) => (
                <Button
                  key={method}
                  variant={formData.notificationTypes.includes(method as any) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const updatedTypes = formData.notificationTypes.includes(method as any)
                      ? formData.notificationTypes.filter(t => t !== method)
                      : [...formData.notificationTypes, method as any];
                    setFormData({ ...formData, notificationTypes: updatedTypes });
                  }}
                  className="capitalize"
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.title || formData.keywords.length === 0}
            style={{ backgroundColor: COLORS.primary }}
          >
            <Bell className="w-4 h-4 mr-1" />
            Create Alert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function NewsCenter() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [alerts, setAlerts] = useState<NewsAlert[]>([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [impactFilter, setImpactFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [showBreakingOnly, setShowBreakingOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      // Simulate new breaking news occasionally
      if (Math.random() < 0.1) {
        const breakingNews: NewsItem = {
          id: `news-${Date.now()}`,
          title: "Market Flash: Unexpected Central Bank Statement",
          summary: "Breaking: Central bank announces surprise policy statement affecting major currency pairs.",
          content: "In an unexpected development...",
          source: NEWS_SOURCES[0],
          category: NEWS_CATEGORIES[5], // Breaking News
          impact: "critical",
          sentiment: "neutral",
          publishedAt: new Date(),
          tags: ["Breaking", "Central Bank", "Policy"],
          affectedPairs: ["USD/EUR", "USD/JPY"],
          region: "Global",
          isBreaking: true,
          isPremium: false,
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 100),
          bookmarks: Math.floor(Math.random() * 50),
          shares: Math.floor(Math.random() * 25),
          readTime: Math.floor(Math.random() * 5) + 2,
          isBookmarked: false,
          priority: 10,
          alertLevel: "critical"
        };
        
        setNews(prev => [breakingNews, ...prev]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const handleBookmark = (id: string) => {
    setNews(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  const handleShare = (id: string) => {
    // Implement share functionality
    console.log(`Sharing news: ${id}`);
  };

  const handleView = (id: string) => {
    // Implement view functionality
    console.log(`Viewing news: ${id}`);
    setNews(prev => prev.map(item => 
      item.id === id ? { ...item, views: item.views + 1 } : item
    ));
  };

  const handleCreateAlert = (alertData: Partial<NewsAlert>) => {
    setAlerts(prev => [...prev, alertData as NewsAlert]);
  };

  const filteredNews = news.filter(item => {
    if (filter !== "all") {
      if (filter === "bookmarked" && !item.isBookmarked) return false;
      if (filter === "breaking" && !item.isBreaking) return false;
      if (filter === "premium" && !item.isPremium) return false;
    }
    if (categoryFilter !== "all" && item.category.id !== categoryFilter) return false;
    if (impactFilter !== "all" && item.impact !== impactFilter) return false;
    if (sourceFilter !== "all" && item.source.id !== sourceFilter) return false;
    if (selectedRegion !== "all" && !item.region.toLowerCase().includes(selectedRegion.toLowerCase())) return false;
    if (showBreakingOnly && !item.isBreaking) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  const breakingNewsCount = news.filter(n => n.isBreaking).length;
  const criticalNewsCount = news.filter(n => n.impact === "critical").length;
  const totalViews = news.reduce((sum, n) => sum + n.views, 0);
  const totalBookmarks = news.filter(n => n.isBookmarked).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            Financial News Center
          </h2>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            Real-time market news with impact analysis and custom alerts
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={isLiveMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className="gap-2"
            style={{ backgroundColor: isLiveMode ? COLORS.primary : undefined }}
          >
            <Radio className="w-4 h-4" />
            {isLiveMode ? "Live" : "Paused"}
          </Button>
          
          <Button 
            onClick={() => setShowAlertDialog(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Bell className="w-4 h-4" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Breaking News Ticker */}
      {breakingNewsCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-red-600" />
          </motion.div>
          <AlertDescription className="text-red-800">
            <strong>{breakingNewsCount} Breaking News Alert{breakingNewsCount > 1 ? 's' : ''}</strong> - 
            Critical market events are developing. Monitor your positions carefully.
          </AlertDescription>
        </Alert>
      )}

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
                {news.length}
              </p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                Total News
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{breakingNewsCount}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                Breaking News
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{criticalNewsCount}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                Critical Impact
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
                Total Views
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Controls */}
      <div className="space-y-4">
        {/* Primary Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: COLORS.dark + "60" }} />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All News</option>
              <option value="breaking">Breaking News</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="premium">Premium Only</option>
            </select>
          </div>
          
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            {NEWS_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select 
            value={impactFilter} 
            onChange={(e) => setImpactFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Impact Levels</option>
            <option value="critical">Critical Impact</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>

          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Regions</option>
            <option value="united states">United States</option>
            <option value="european union">European Union</option>
            <option value="united kingdom">United Kingdom</option>
            <option value="asia pacific">Asia Pacific</option>
            <option value="global">Global</option>
          </select>
        </div>

        {/* Search & View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search news, tags, or currency pairs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
              icon={<Search className="w-4 h-4" />}
            />
            
            <div className="flex items-center gap-2">
              <Switch
                checked={showBreakingOnly}
                onCheckedChange={setShowBreakingOnly}
              />
              <Label className="text-sm">Breaking Only</Label>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Layers className="w-4 h-4" />
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

      {/* News Feed */}
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
              key={newsItem.id}
              news={newsItem}
              onBookmark={handleBookmark}
              onShare={handleShare}
              onView={handleView}
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
            No news found
          </h3>
          <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
            Try adjusting your filters or search terms to find relevant news.
          </p>
          <Button 
            onClick={() => {
              setFilter("all");
              setCategoryFilter("all");
              setImpactFilter("all");
              setSearchTerm("");
              setShowBreakingOnly(false);
            }}
            variant="outline"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* News Alert Dialog */}
      <NewsAlertDialog
        isOpen={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
        onSave={handleCreateAlert}
      />
    </div>
  );
}