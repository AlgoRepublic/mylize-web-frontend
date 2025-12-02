import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
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
  BarChart3,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  ExternalLink,
  Filter,
  Search,
  BookOpen,
  PenTool,
  Lightbulb,
  Target,
  DollarSign,
  Globe,
  X,
  Check,
  AlertCircle,
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
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Settings
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
import { useTranslation } from "react-i18next";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: ContentCategory;
  status: "draft" | "published" | "scheduled" | "archived";
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  scheduledAt?: Date;
  featuredImage?: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  shares: number;
  readTime: number; // in minutes
  isPremium: boolean;
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
}

interface ContentCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const CONTENT_CATEGORIES: ContentCategory[] = [
  {
    id: "market-analysis",
    name: "Market Analysis",
    description: "In-depth market insights and technical analysis",
    color: "#3B82F6",
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    id: "educational",
    name: "Educational",
    description: "Trading tutorials and educational content",
    color: "#10B981",
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: "news-insights",
    name: "News & Insights",
    description: "Market news and economic insights",
    color: "#F59E0B",
    icon: <Lightbulb className="w-4 h-4" />
  },
  {
    id: "trading-strategies",
    name: "Trading Strategies",
    description: "Strategy guides and trading methodologies",
    color: "#8B5CF6",
    icon: <Target className="w-4 h-4" />
  },
  {
    id: "research-reports",
    name: "Research Reports",
    description: "Detailed research and fundamental analysis",
    color: "#EF4444",
    icon: <FileText className="w-4 h-4" />
  }
];

const mockContent: ContentItem[] = [
  {
    id: "content-001",
    title: "EUR/USD Weekly Analysis: ECB Policy Implications",
    excerpt: "Comprehensive analysis of EUR/USD following ECB's latest policy decisions and their impact on currency markets.",
    content: "# EUR/USD Weekly Analysis\n\nThe European Central Bank's latest policy decision has significant implications for EUR/USD...",
    category: CONTENT_CATEGORIES[0], // Market Analysis
    status: "published",
    author: "John Analyst",
    createdAt: new Date("2024-01-15T10:00:00"),
    updatedAt: new Date("2024-01-15T14:30:00"),
    publishedAt: new Date("2024-01-15T15:00:00"),
    featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    tags: ["EUR/USD", "ECB", "Technical Analysis", "Weekly Outlook"],
    views: 1247,
    likes: 89,
    comments: 23,
    shares: 15,
    readTime: 8,
    isPremium: false,
    seoTitle: "EUR/USD Analysis: ECB Policy Impact | Trading Insights",
    seoDescription: "Expert analysis of EUR/USD currency pair following ECB policy decisions. Trading insights and technical outlook.",
    slug: "eur-usd-weekly-analysis-ecb-policy"
  },
  {
    id: "content-002",
    title: "Beginner's Guide to Risk Management in Forex Trading",
    excerpt: "Essential risk management principles every new trader should understand before entering the forex market.",
    content: "# Risk Management Fundamentals\n\nRisk management is the cornerstone of successful trading...",
    category: CONTENT_CATEGORIES[1], // Educational
    status: "draft",
    author: "Sarah Expert",
    createdAt: new Date("2024-01-18T09:00:00"),
    updatedAt: new Date("2024-01-18T16:45:00"),
    tags: ["Risk Management", "Education", "Forex", "Beginners"],
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    readTime: 12,
    isPremium: true,
    slug: "beginners-guide-risk-management-forex"
  },
  {
    id: "content-003",
    title: "Federal Reserve Meeting Preview: What to Expect",
    excerpt: "Preview of the upcoming Federal Reserve meeting and potential market implications for USD pairs.",
    content: "# Fed Meeting Preview\n\nThe Federal Reserve is set to announce its latest policy decision...",
    category: CONTENT_CATEGORIES[2], // News & Insights
    status: "scheduled",
    author: "Mike Economist",
    createdAt: new Date("2024-01-20T08:00:00"),
    updatedAt: new Date("2024-01-20T11:30:00"),
    scheduledAt: new Date("2024-01-22T14:00:00"),
    featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    tags: ["Federal Reserve", "USD", "Interest Rates", "Economic Policy"],
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    readTime: 6,
    isPremium: false,
    slug: "federal-reserve-meeting-preview"
  }
];

function ContentCard({ 
  content, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onPublish,
  onArchive
}: { 
  content: ContentItem;
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (content: ContentItem) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || "en").startsWith("ar");
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
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl p-6 border shadow-sm transition-all duration-300"
      style={{ borderColor: COLORS.lightGray }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: content.category.color + "20",
              color: content.category.color 
            }}
          >
            {content.category.icon}
          </div>
          <div>
            <Badge 
              variant="outline"
              style={{ 
                borderColor: getStatusColor(content.status) + "40",
                color: getStatusColor(content.status)
              }}
              className="mb-1"
            >
              <div className="flex items-center gap-1">
                {getStatusIcon(content.status)}
                <span className="capitalize">{content.status}</span>
              </div>
            </Badge>
            <p className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {content.category.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(content)}>
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(content)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(content.id)} className="text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Featured Image */}
      {content.featuredImage && (
        <div className="mb-4">
          <div 
            className="w-full h-40 bg-cover bg-center rounded-lg border"
            style={{ 
              backgroundImage: `url(${content.featuredImage})`,
              borderColor: COLORS.lightGray
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="mb-4">
        <h3 className="font-serif font-semibold mb-2 line-clamp-2" style={{ color: COLORS.dark }}>
          {content.title}
        </h3>
        <p className="text-sm mb-3 line-clamp-2" style={{ color: COLORS.dark + "80" }}>
          {content.excerpt}
        </p>
        
        <div className="flex items-center gap-4 text-xs mb-3" style={{ color: COLORS.dark + "60" }}>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {t("pages.contentPublishing.card.minRead", {
                minutes: content.readTime,
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{content.createdAt.toLocaleDateString()}</span>
          </div>
          {content.isPremium && (
            <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-600">
              <Star className="w-3 h-3 mr-1" />
              {t("pages.contentPublishing.card.premiumBadge")}
            </Badge>
          )}
        </div>
      </div>

      {/* Tags */}
      {content.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-1 flex-wrap">
            {content.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {content.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{content.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      {content.status === "published" && (
        <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: COLORS.dark }}>
              {content.views.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.contentPublishing.card.views")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-red-600">
              {content.likes}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.contentPublishing.card.likes")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-blue-600">
              {content.comments}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.contentPublishing.card.comments")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-green-600">
              {content.shares}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.contentPublishing.card.shares")}
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Info */}
      {content.status === "scheduled" && content.scheduledAt && (
        <Alert className="mb-4">
          <Calendar className="w-4 h-4" />
          <AlertDescription>
            {t("pages.contentPublishing.card.scheduled", {
              date: content.scheduledAt.toLocaleDateString(),
              time: content.scheduledAt.toLocaleTimeString(),
            })}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {content.status === "draft" ? (
          <Button 
            className="flex-1"
            style={{ backgroundColor: COLORS.primary }}
            onClick={() => onPublish(content.id)}
          >
            <Send className="w-4 h-4 mr-1" />
            {t("pages.contentPublishing.card.publishNow")}
          </Button>
        ) : content.status === "published" ? (
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            {t("pages.contentPublishing.card.viewPublished")}
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onEdit(content)}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            {t("pages.contentPublishing.card.editContent")}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function ContentEditor({ 
  content, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  content?: ContentItem; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (contentData: Partial<ContentItem>) => void; 
}) {
  const [formData, setFormData] = useState({
    title: content?.title || "",
    excerpt: content?.excerpt || "",
    content: content?.content || "",
    category: content?.category?.id || CONTENT_CATEGORIES[0].id,
    tags: content?.tags || [],
    isPremium: content?.isPremium || false,
    featuredImage: content?.featuredImage || "",
    seoTitle: content?.seoTitle || "",
    seoDescription: content?.seoDescription || "",
    scheduledAt: content?.scheduledAt ? content.scheduledAt.toISOString().slice(0, 16) : ""
  });

  const [activeTab, setActiveTab] = useState("content");
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [wordCount, setWordCount] = useState(0);

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
    
    const selectedCategory = CONTENT_CATEGORIES.find(cat => cat.id === formData.category);
    
    const contentData: Partial<ContentItem> = {
      ...content,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: selectedCategory,
      tags: formData.tags,
      isPremium: formData.isPremium,
      featuredImage: formData.featuredImage,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      readTime: calculateReadTime(),
      updatedAt: new Date(),
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    if (action === "publish") {
      contentData.status = "published";
      contentData.publishedAt = new Date();
    } else if (action === "schedule" && formData.scheduledAt) {
      contentData.status = "scheduled";
      contentData.scheduledAt = new Date(formData.scheduledAt);
    } else {
      contentData.status = "draft";
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(contentData);
    setIsSaving(false);
    onClose();
  };

  const selectedCategory = CONTENT_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" style={{ color: COLORS.primary }} />
            {content ? "Edit Content" : "Create New Content"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter compelling title..."
                className="text-lg font-serif"
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                {formData.title.length}/80 characters (optimal for SEO)
              </p>
            </div>
            
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary that will appear in previews..."
                rows={3}
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                {formData.excerpt.length}/160 characters (optimal for meta description)
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="content">Content</Label>
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
                placeholder="Start writing your content... You can use Markdown formatting."
                rows={15}
                className="font-mono"
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                Supports Markdown formatting. Aim for 800-2000 words for optimal engagement.
              </p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_CATEGORIES.map((category) => (
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
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                />
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Premium Content
                </Label>
              </div>
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
                  placeholder="Add tag (e.g. forex, analysis, tutorial)..."
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
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="Optimized title for search engines..."
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                {formData.seoTitle.length}/60 characters (recommended for Google)
              </p>
            </div>
            
            <div>
              <Label htmlFor="seoDescription">Meta Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Description that appears in search results..."
                rows={3}
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                {formData.seoDescription.length}/160 characters (optimal for search results)
              </p>
            </div>

            <Alert>
              <Lightbulb className="w-4 h-4" />
              <AlertDescription>
                <strong>SEO Tips:</strong> Include your target keywords naturally in the title and description. 
                Make them compelling to encourage clicks from search results.
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
                    {formData.isPremium && (
                      <Badge variant="outline" className="border-yellow-300 text-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-serif font-bold mb-2" style={{ color: COLORS.dark }}>
                    {formData.title || "Your Title Here"}
                  </h1>
                  
                  <p className="text-lg mb-4" style={{ color: COLORS.dark + "80" }}>
                    {formData.excerpt || "Your excerpt will appear here..."}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm" style={{ color: COLORS.dark + "60" }}>
                    <span>{calculateReadTime()} min read</span>
                    <span>•</span>
                    <span>{wordCount} words</span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap" style={{ color: COLORS.dark }}>
                    {formData.content || "Your content will be displayed here..."}
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
            Publish Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ContentPublishing() {
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | undefined>(undefined);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || "en").startsWith("ar");

  const handleCreateContent = () => {
    setEditingContent(undefined);
    setShowEditor(true);
  };

  const handleEditContent = (contentItem: ContentItem) => {
    setEditingContent(contentItem);
    setShowEditor(true);
  };

  const handleSaveContent = (contentData: Partial<ContentItem>) => {
    if (editingContent) {
      // Update existing content
      setContent(prev => prev.map(item => 
        item.id === editingContent.id 
          ? { ...item, ...contentData }
          : item
      ));
    } else {
      // Create new content
      const newContent: ContentItem = {
        id: `content-${Date.now()}`,
        author: "Current User",
        createdAt: new Date(),
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        ...contentData
      } as ContentItem;
      setContent(prev => [newContent, ...prev]);
    }
  };

  const handleDeleteContent = (id: string) => {
    setContent(prev => prev.filter(item => item.id !== id));
  };

  const handleDuplicateContent = (contentItem: ContentItem) => {
    const duplicated: ContentItem = {
      ...contentItem,
      id: `content-${Date.now()}`,
      title: `${contentItem.title} (Copy)`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: undefined,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };
    setContent(prev => [duplicated, ...prev]);
  };

  const handlePublishContent = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: "published" as const, publishedAt: new Date() }
        : item
    ));
  };

  const handleArchiveContent = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: "archived" as const }
        : item
    ));
  };

  const filteredContent = content.filter(item => {
    if (filter !== "all" && item.status !== filter) return false;
    if (categoryFilter !== "all" && item.category.id !== categoryFilter) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  const statusCounts = {
    all: content.length,
    published: content.filter(c => c.status === "published").length,
    draft: content.filter(c => c.status === "draft").length,
    scheduled: content.filter(c => c.status === "scheduled").length,
    archived: content.filter(c => c.status === "archived").length
  };

  const totalViews = content.filter(c => c.status === "published").reduce((sum, c) => sum + c.views, 0);
  const totalLikes = content.filter(c => c.status === "published").reduce((sum, c) => sum + c.likes, 0);
  const averageReadTime = content.length > 0 ? content.reduce((sum, c) => sum + c.readTime, 0) / content.length : 0;

  return (
    <div
      className="space-y-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            {t("pages.contentPublishing.title")}
          </h2>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            {t("pages.contentPublishing.subtitle")}
          </p>
        </div>
        
        <Button 
          onClick={handleCreateContent}
          className="gap-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4" />
          {t("pages.contentPublishing.header.create")}
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
              <FileText className="w-5 h-5" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                {statusCounts.all}
              </p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.contentPublishing.stats.totalContent")}
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
                {t("pages.contentPublishing.stats.published")}
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
                {t("pages.contentPublishing.stats.totalViews")}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{totalLikes}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.contentPublishing.stats.totalLikes")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: COLORS.dark + "60" }} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">
              {t("pages.contentPublishing.filters.allContent", {
                count: statusCounts.all,
              })}
            </option>
            <option value="published">
              {t("pages.contentPublishing.filters.published", {
                count: statusCounts.published,
              })}
            </option>
            <option value="draft">
              {t("pages.contentPublishing.filters.draft", {
                count: statusCounts.draft,
              })}
            </option>
            <option value="scheduled">
              {t("pages.contentPublishing.filters.scheduled", {
                count: statusCounts.scheduled,
              })}
            </option>
            <option value="archived">
              {t("pages.contentPublishing.filters.archived", {
                count: statusCounts.archived,
              })}
            </option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" style={{ color: COLORS.dark + "60" }} />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">
              {t("pages.contentPublishing.filters.allCategories")}
            </option>
            {CONTENT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <Input
          placeholder={t("pages.contentPublishing.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Content Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredContent.map((contentItem) => (
            <ContentCard
              content={contentItem}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
              onDuplicate={handleDuplicateContent}
              onPublish={handlePublishContent}
              onArchive={handleArchiveContent}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
          <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
            {filter === "all"
              ? t("pages.contentPublishing.emptyState.noContent")
              : t("pages.contentPublishing.emptyState.noContentFiltered", {
                  status: filter,
                })}
          </h3>
          <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
            {filter === "all" 
              ? t("pages.contentPublishing.emptyState.body")
              : t("pages.contentPublishing.emptyState.bodyFiltered", {
                  status: filter,
                })
            }
          </p>
          {filter === "all" && (
            <Button 
              onClick={handleCreateContent}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4 mr-1" />
              {t("pages.contentPublishing.emptyState.createFirstContent")}
            </Button>
          )}
        </div>
      )}

      {/* Content Editor Dialog */}
      <ContentEditor
        content={editingContent}
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingContent(undefined);
        }}
        onSave={handleSaveContent}
      />
    </div>
  );
}