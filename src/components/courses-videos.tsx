import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen,
  Play,
  Plus,
  Edit3,
  Trash2,
  Save,
  Upload,
  Video,
  Users,
  Clock,
  Star,
  Eye,
  TrendingUp,
  BarChart3,
  DollarSign,
  Award,
  PlayCircle,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  Target,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  Share2,
  Copy,
  ExternalLink,
  Settings,
  Bell,
  BellRing,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  Heart,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  AlertCircle,
  Info,
  Lightbulb,
  Zap,
  Globe,
  Lock,
  Unlock,
  GraduationCap,
  // Certificate,
  // Progress as ProgressIcon,
  Timer,
  PieChart,
  LineChart,
  Activity,
  Layers,
  FolderOpen,
  Image as ImageIcon,
  FileVideo,
  Headphones,
  Mic,
  Camera,
  Monitor,
  Smartphone,
  Tablet,
  List
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
import { useTranslation } from "react-i18next";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: CourseCategory;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  status: "draft" | "published" | "archived";
  price: number;
  currency: string;
  isPremium: boolean;
  isFree: boolean;
  instructor: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  duration: number; // in minutes
  studentsEnrolled: number;
  rating: number;
  totalRatings: number;
  completionRate: number;
  revenue: number;
  lessons: Lesson[];
  tags: string[];
  learningObjectives: string[];
  prerequisites: string[];
  certificateEnabled: boolean;
  hasQuiz: boolean;
  downloadableResources: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: "video" | "text" | "quiz" | "assignment" | "live";
  duration: number; // in minutes
  videoUrl?: string;
  thumbnailUrl?: string;
  content?: string;
  position: number;
  isPreview: boolean;
  isFree: boolean;
  completions: number;
  averageWatchTime: number;
  resources: Resource[];
  quiz?: Quiz;
}

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "doc" | "image" | "link" | "template";
  url: string;
  size?: number;
  downloads: number;
}

interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
}

interface Question {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "text";
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface CourseCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  enrolledAt: Date;
  lastAccessed: Date;
  progress: number;
  completedLessons: string[];
  totalWatchTime: number;
  quizScores: { [quizId: string]: number };
  certificateEarned: boolean;
}

const COURSE_CATEGORIES: CourseCategory[] = [
  {
    id: "forex-basics",
    name: "Forex Basics",
    description: "Fundamental forex trading concepts",
    color: "#3B82F6",
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: "technical-analysis",
    name: "Technical Analysis",
    description: "Chart analysis and technical indicators",
    color: "#10B981",
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    id: "risk-management",
    name: "Risk Management",
    description: "Portfolio protection and money management",
    color: "#EF4444",
    icon: <Target className="w-4 h-4" />
  },
  {
    id: "trading-psychology",
    name: "Trading Psychology",
    description: "Mental aspects of successful trading",
    color: "#8B5CF6",
    icon: <Lightbulb className="w-4 h-4" />
  },
  {
    id: "advanced-strategies",
    name: "Advanced Strategies",
    description: "Complex trading methodologies",
    color: "#F59E0B",
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: "market-analysis",
    name: "Market Analysis",
    description: "Fundamental and economic analysis",
    color: "#06B6D4",
    icon: <TrendingUp className="w-4 h-4" />
  }
];

const mockCourses: Course[] = [
  {
    id: "course-001",
    title: "Complete Forex Trading Masterclass: From Beginner to Pro",
    description: "Master forex trading with this comprehensive course covering everything from basic concepts to advanced strategies. Learn risk management, technical analysis, and develop a winning mindset.",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    category: COURSE_CATEGORIES[0],
    level: "beginner",
    status: "published",
    price: 299,
    currency: "USD",
    isPremium: true,
    isFree: false,
    instructor: "John Analyst",
    createdAt: new Date("2024-01-10T00:00:00"),
    updatedAt: new Date("2024-01-20T00:00:00"),
    publishedAt: new Date("2024-01-15T00:00:00"),
    duration: 480, // 8 hours
    studentsEnrolled: 1247,
    rating: 4.8,
    totalRatings: 289,
    completionRate: 73,
    revenue: 372653,
    lessons: [
      {
        id: "lesson-001",
        title: "Introduction to Forex Markets",
        description: "Understanding the global foreign exchange market, major participants, and how currencies are traded.",
        type: "video",
        duration: 25,
        videoUrl: "https://example.com/video1.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
        position: 1,
        isPreview: true,
        isFree: true,
        completions: 1180,
        averageWatchTime: 23.5,
        resources: [
          {
            id: "resource-001",
            title: "Forex Market Overview PDF",
            type: "pdf",
            url: "https://example.com/forex-overview.pdf",
            size: 2.5,
            downloads: 856
          }
        ]
      },
      {
        id: "lesson-002",
        title: "Currency Pairs and Pricing",
        description: "Learn about major, minor, and exotic currency pairs, how they're quoted, and what affects their prices.",
        type: "video",
        duration: 30,
        videoUrl: "https://example.com/video2.mp4",
        position: 2,
        isPreview: false,
        isFree: false,
        completions: 1095,
        averageWatchTime: 28.2,
        resources: []
      }
    ],
    tags: ["Forex", "Trading", "Beginner", "Technical Analysis"],
    learningObjectives: [
      "Understand forex market fundamentals",
      "Master technical analysis techniques",
      "Develop risk management skills",
      "Create profitable trading strategies"
    ],
    prerequisites: ["Basic computer skills", "Interest in financial markets"],
    certificateEnabled: true,
    hasQuiz: true,
    downloadableResources: true
  },
  {
    id: "course-002",
    title: "Advanced Technical Analysis Strategies",
    description: "Deep dive into advanced technical analysis concepts including Elliott Wave Theory, Fibonacci retracements, and complex chart patterns.",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop",
    category: COURSE_CATEGORIES[1],
    level: "advanced",
    status: "published",
    price: 399,
    currency: "USD",
    isPremium: true,
    isFree: false,
    instructor: "John Analyst",
    createdAt: new Date("2024-01-05T00:00:00"),
    updatedAt: new Date("2024-01-18T00:00:00"),
    publishedAt: new Date("2024-01-12T00:00:00"),
    duration: 360, // 6 hours
    studentsEnrolled: 543,
    rating: 4.9,
    totalRatings: 127,
    completionRate: 68,
    revenue: 216657,
    lessons: [
      {
        id: "lesson-003",
        title: "Elliott Wave Theory Fundamentals",
        description: "Master the Elliott Wave principle and learn to identify wave patterns in forex markets.",
        type: "video",
        duration: 45,
        position: 1,
        isPreview: true,
        isFree: true,
        completions: 487,
        averageWatchTime: 41.3,
        resources: []
      }
    ],
    tags: ["Technical Analysis", "Advanced", "Elliott Wave", "Fibonacci"],
    learningObjectives: [
      "Master Elliott Wave Theory",
      "Use advanced Fibonacci techniques",
      "Identify complex chart patterns",
      "Develop precision entry/exit strategies"
    ],
    prerequisites: ["Basic technical analysis knowledge", "Understanding of chart patterns"],
    certificateEnabled: true,
    hasQuiz: true,
    downloadableResources: true
  },
  {
    id: "course-003",
    title: "Free Introduction to Forex Trading",
    description: "Get started with forex trading basics in this free introductory course. Perfect for absolute beginners who want to learn the fundamentals.",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
    category: COURSE_CATEGORIES[0],
    level: "beginner",
    status: "published",
    price: 0,
    currency: "USD",
    isPremium: false,
    isFree: true,
    instructor: "John Analyst",
    createdAt: new Date("2024-01-01T00:00:00"),
    updatedAt: new Date("2024-01-15T00:00:00"),
    publishedAt: new Date("2024-01-08T00:00:00"),
    duration: 120, // 2 hours
    studentsEnrolled: 3456,
    rating: 4.6,
    totalRatings: 678,
    completionRate: 85,
    revenue: 0,
    lessons: [
      {
        id: "lesson-004",
        title: "What is Forex Trading?",
        description: "An introduction to foreign exchange trading and why it's the world's largest financial market.",
        type: "video",
        duration: 15,
        position: 1,
        isPreview: true,
        isFree: true,
        completions: 3234,
        averageWatchTime: 14.2,
        resources: []
      }
    ],
    tags: ["Forex", "Free", "Beginner", "Introduction"],
    learningObjectives: [
      "Understand what forex trading is",
      "Learn basic terminology",
      "Discover major currency pairs",
      "Get started with demo trading"
    ],
    prerequisites: ["None"],
    certificateEnabled: false,
    hasQuiz: false,
    downloadableResources: false
  }
];

function CourseCard({ 
  course, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onViewAnalytics,
  compact = false 
}: { 
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onDuplicate: (course: Course) => void;
  onViewAnalytics: (course: Course) => void;
  compact?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || "en").startsWith("ar");
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "#10B981";
      case "intermediate": return "#F59E0B";
      case "advanced": return "#EF4444";
      case "expert": return "#8B5CF6";
      default: return COLORS.dark;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "#10B981";
      case "draft": return "#6B7280";
      case "archived": return "#EF4444";
      default: return COLORS.dark;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return t("pages.coursesVideos.card.duration", { hours, minutes: mins });
    }
    return t("pages.coursesVideos.card.durationMinutesOnly", { minutes: mins });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
      className={`bg-white rounded-xl border shadow-sm transition-all duration-300 overflow-hidden ${compact ? 'p-4' : ''}`}
      style={{ borderColor: COLORS.lightGray }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Course Thumbnail */}
      <div className={`relative ${compact ? 'h-32' : 'h-48'}`}>
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${course.thumbnail})` }}
        />
        
        {/* Overlay with Play Button */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <Play className="w-6 h-6 ml-1" style={{ color: COLORS.primary }} />
          </motion.div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="outline" 
            className="bg-white bg-opacity-90"
            style={{ 
              borderColor: getStatusColor(course.status) + "40",
              color: getStatusColor(course.status)
            }}
          >
            <div className="flex items-center gap-1">
              {course.status === "published" && <Globe className="w-3 h-3" />}
              {course.status === "draft" && <Edit3 className="w-3 h-3" />}
              {course.status === "archived" && <Eye className="w-3 h-3" />}
              <span className="capitalize">{course.status}</span>
            </div>
          </Badge>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          {course.isFree ? (
            <Badge className="bg-green-100 text-green-700 border-green-300">
              {t("pages.coursesVideos.card.freeBadge")}
            </Badge>
          ) : (
            <Badge className="bg-white bg-opacity-90 text-gray-900">
              ${course.price}
            </Badge>
          )}
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="outline" className="bg-black bg-opacity-70 text-white border-transparent">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(course.duration)}
          </Badge>
        </div>
      </div>

      {/* Course Content */}
      <div className={compact ? 'mt-4' : 'p-6'}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ 
                backgroundColor: course.category.color + "20",
                color: course.category.color 
              }}
            >
              {course.category.icon}
            </div>
            <Badge 
              variant="outline"
              style={{ 
                borderColor: getLevelColor(course.level) + "40",
                color: getLevelColor(course.level)
              }}
            >
              {course.level.toUpperCase()}
            </Badge>
            {course.isPremium && (
              <Badge variant="outline" className="border-yellow-300 text-yellow-600">
                <Star className="w-3 h-3 mr-1" />
                {t("pages.coursesVideos.card.premiumBadge")}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onViewAnalytics(course)}>
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(course)}>
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDuplicate(course)}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(course.id)} className="text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Course Title & Description */}
        <div className="mb-4">
          <h3 className={`font-serif font-semibold mb-2 line-clamp-2 ${compact ? 'text-base' : 'text-lg'}`} style={{ color: COLORS.dark }}>
            {course.title}
          </h3>
          {!compact && (
            <p className="text-sm line-clamp-2" style={{ color: COLORS.dark + "80" }}>
              {course.description}
            </p>
          )}
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: COLORS.dark }}>
              {course.studentsEnrolled.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.coursesVideos.card.students")}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                {course.rating}
              </span>
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.coursesVideos.card.rating")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-green-600">
              {course.completionRate}%
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.coursesVideos.card.completion")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: COLORS.primary }}>
              ${course.revenue.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {t("pages.coursesVideos.card.revenue")}
            </div>
          </div>
        </div>

        {/* Course Features */}
        <div className="flex items-center gap-2 lg:gap-4 text-xs mb-4 flex-wrap" style={{ color: COLORS.dark + "60" }}>
          <div className="flex items-center gap-1">
            <Video className="w-3 h-3" />
            <span>
              {t("pages.coursesVideos.card.lessons", {
                count: course.lessons.length,
              })}
            </span>
          </div>
          {course.certificateEnabled && (
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>{t("pages.coursesVideos.card.certificate")}</span>
            </div>
          )}
          {course.downloadableResources && (
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{t("pages.coursesVideos.card.resources")}</span>
            </div>
          )}
          {course.hasQuiz && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t("pages.coursesVideos.card.quiz")}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {course.tags.length > 0 && !compact && (
          <div className="mb-4">
            <div className="flex gap-1 flex-wrap">
              {course.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {course.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{course.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {course.status === "draft" ? (
            <Button 
              className="flex-1"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Globe className="w-4 h-4 mr-1" />
              {t("pages.coursesVideos.card.publishCourse")}
            </Button>
          ) : course.status === "published" ? (
            <div className="flex gap-2 flex-1">
              <Button size="sm" variant="outline" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-1" />
                {t("pages.coursesVideos.card.viewLive")}
              </Button>
              <Button size="sm" variant="outline">
                <Users className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onEdit(course)}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              {t("pages.coursesVideos.card.editCourse")}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LessonEditor({ 
  lesson, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  lesson?: Lesson | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (lessonData: Partial<Lesson>) => void; 
}) {
  const [formData, setFormData] = useState({
    title: lesson?.title || "",
    description: lesson?.description || "",
    type: lesson?.type || "video",
    duration: lesson?.duration || 0,
    videoUrl: lesson?.videoUrl || "",
    content: lesson?.content || "",
    isFree: lesson?.isFree || false,
    isPreview: lesson?.isPreview || false
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        description: lesson.description,
        type: lesson.type,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl || "",
        content: lesson.content || "",
        isFree: lesson.isFree,
        isPreview: lesson.isPreview
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "video",
        duration: 0,
        videoUrl: "",
        content: "",
        isFree: false,
        isPreview: false
      });
    }
  }, [lesson]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" style={{ color: COLORS.primary }} />
            {lesson ? "Edit Lesson" : "Add New Lesson"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="lesson-title">Lesson Title</Label>
              <Input
                id="lesson-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter lesson title..."
              />
            </div>
            
            <div>
              <Label htmlFor="lesson-description">Lesson Description</Label>
              <Textarea
                id="lesson-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what students will learn in this lesson..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lesson-type">Lesson Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video Lesson
                      </div>
                    </SelectItem>
                    <SelectItem value="text">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Text Content
                      </div>
                    </SelectItem>
                    <SelectItem value="quiz">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Quiz
                      </div>
                    </SelectItem>
                    <SelectItem value="live">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Live Session
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lesson-duration">Duration (minutes)</Label>
                <Input
                  id="lesson-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Content based on type */}
          {formData.type === "video" && (
            <div>
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                Upload your video to a hosting service and paste the URL here
              </p>
            </div>
          )}

          {formData.type === "text" && (
            <div>
              <Label htmlFor="lesson-content">Lesson Content</Label>
              <Textarea
                id="lesson-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your lesson content here... (Supports Markdown)"
                rows={10}
                className="font-mono"
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                You can use Markdown formatting for better presentation
              </p>
            </div>
          )}

          {/* Access Settings */}
          <div>
            <h4 className="font-serif font-semibold mb-3">Access Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {formData.isFree ? (
                      <Unlock className="w-4 h-4 text-green-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-orange-600" />
                    )}
                    <Label className="font-medium">
                      {formData.isFree ? "Free Lesson" : "Paid Lesson"}
                    </Label>
                  </div>
                  <p className="text-xs" style={{ color: COLORS.dark + "80" }}>
                    {formData.isFree 
                      ? "Anyone can access this lesson without purchasing the course"
                      : "Students must purchase the course to access this lesson"
                    }
                  </p>
                </div>
                <Switch
                  checked={formData.isFree}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <Label className="font-medium">Preview Lesson</Label>
                  </div>
                  <p className="text-xs" style={{ color: COLORS.dark + "80" }}>
                    Show this lesson as a preview to attract potential students
                  </p>
                </div>
                <Switch
                  checked={formData.isPreview}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPreview: checked })}
                />
              </div>

              {formData.isFree && formData.isPreview && (
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    This lesson is both free and marked as preview. Free lessons are automatically accessible to everyone.
                  </AlertDescription>
                </Alert>
              )}
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
              {lesson ? "Update Lesson" : "Add Lesson"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CourseEditor({ 
  course, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  course?: Course; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (courseData: Partial<Course>) => void; 
}) {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    category: course?.category?.id || COURSE_CATEGORIES[0].id,
    level: course?.level || "beginner",
    price: course?.price || 0,
    isFree: course?.isFree || false,
    isPremium: course?.isPremium || false,
    tags: course?.tags || [],
    learningObjectives: course?.learningObjectives || [],
    prerequisites: course?.prerequisites || [],
    certificateEnabled: course?.certificateEnabled || false,
    hasQuiz: course?.hasQuiz || false,
    downloadableResources: course?.downloadableResources || false,
    thumbnail: course?.thumbnail || ""
  });

  const [lessons, setLessons] = useState<Lesson[]>(course?.lessons || []);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showLessonEditor, setShowLessonEditor] = useState(false);

  const [activeTab, setActiveTab] = useState("details");
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

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

  const addObjective = () => {
    if (newObjective.trim() && !formData.learningObjectives.includes(newObjective.trim())) {
      setFormData({ 
        ...formData, 
        learningObjectives: [...formData.learningObjectives, newObjective.trim()] 
      });
      setNewObjective("");
    }
  };

  const removeObjective = (objectiveToRemove: string) => {
    setFormData({ 
      ...formData, 
      learningObjectives: formData.learningObjectives.filter(obj => obj !== objectiveToRemove) 
    });
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData({ 
        ...formData, 
        prerequisites: [...formData.prerequisites, newPrerequisite.trim()] 
      });
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (prerequisiteToRemove: string) => {
    setFormData({ 
      ...formData, 
      prerequisites: formData.prerequisites.filter(pre => pre !== prerequisiteToRemove) 
    });
  };

  const handleThumbnailUpload = async () => {
    setIsUploadingThumbnail(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const imageUrl = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop";
      setFormData({ ...formData, thumbnail: imageUrl });
    } catch (error) {
      console.error("Failed to upload thumbnail:", error);
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleSave = async (action: "draft" | "publish") => {
    setIsSaving(true);
    
    const selectedCategory = COURSE_CATEGORIES.find(cat => cat.id === formData.category);
    
    const courseData: Partial<Course> = {
      ...course,
      title: formData.title,
      description: formData.description,
      category: selectedCategory,
      level: formData.level as any,
      price: formData.price,
      isFree: formData.isFree,
      isPremium: formData.isPremium,
      tags: formData.tags,
      learningObjectives: formData.learningObjectives,
      prerequisites: formData.prerequisites,
      certificateEnabled: formData.certificateEnabled,
      hasQuiz: formData.hasQuiz,
      downloadableResources: formData.downloadableResources,
      thumbnail: formData.thumbnail,
      lessons: lessons,
      duration: lessons.reduce((total, lesson) => total + lesson.duration, 0),
      updatedAt: new Date()
    };

    if (action === "publish") {
      courseData.status = "published";
      courseData.publishedAt = new Date();
    } else {
      courseData.status = "draft";
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(courseData);
    setIsSaving(false);
    onClose();
  };

  const handleSaveLesson = (lessonData: Partial<Lesson>) => {
    if (editingLesson) {
      // Update existing lesson
      setLessons(prev => prev.map(lesson => 
        lesson.id === editingLesson.id 
          ? { ...lesson, ...lessonData }
          : lesson
      ));
    } else {
      // Create new lesson
      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        position: lessons.length + 1,
        completions: 0,
        averageWatchTime: 0,
        resources: [],
        ...lessonData
      } as Lesson;
      setLessons(prev => [...prev, newLesson]);
    }
    setShowLessonEditor(false);
    setEditingLesson(null);
  };

  const selectedCategory = COURSE_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto p-4 lg:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: COLORS.primary }} />
            {course ? "Edit Course" : "Create New Course"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-1 lg:gap-0">
            <TabsTrigger value="details" className="text-xs lg:text-sm">Details</TabsTrigger>
            <TabsTrigger value="lessons" className="text-xs lg:text-sm">Lessons</TabsTrigger>
            <TabsTrigger value="content" className="text-xs lg:text-sm lg:block hidden">Content</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs lg:text-sm">Pricing</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs lg:text-sm">Preview</TabsTrigger>
          </TabsList>

          {/* Course Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter compelling course title..."
                className="text-lg font-serif"
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                {formData.title.length}/80 characters (optimal for marketing)
              </p>
            </div>
            
            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what students will learn and achieve in this course..."
                rows={4}
              />
              <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                {formData.description.length}/500 characters (detailed description helps enrollment)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Course Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_CATEGORIES.map((category) => (
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
                <Label htmlFor="level">Difficulty Level</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Course Thumbnail</Label>
              <div className="mt-2">
                {formData.thumbnail ? (
                  <div className="relative">
                    <img 
                      src={formData.thumbnail} 
                      alt="Course Thumbnail" 
                      className="w-full h-48 object-cover rounded-lg border"
                      style={{ borderColor: COLORS.lightGray }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-white"
                      onClick={() => setFormData({ ...formData, thumbnail: "" })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    style={{ borderColor: COLORS.lightGray }}
                    onClick={handleThumbnailUpload}
                  >
                    {isUploadingThumbnail ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Upload className="w-5 h-5" />
                        </motion.div>
                        <span>Uploading thumbnail...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8" style={{ color: COLORS.dark + "40" }} />
                        <span className="text-sm" style={{ color: COLORS.dark + "60" }}>
                          Click to upload course thumbnail
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
                  placeholder="Add tag (e.g. Forex, Technical Analysis)..."
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
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-semibold" style={{ color: COLORS.dark }}>
                  Course Lessons
                </h3>
                <p className="text-sm" style={{ color: COLORS.dark + "80" }}>
                  Add and organize lessons for your course. Mark lessons as free or paid access.
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingLesson(null);
                  setShowLessonEditor(true);
                }}
                style={{ backgroundColor: COLORS.primary }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Lesson
              </Button>
            </div>

            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  style={{ borderColor: COLORS.lightGray }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{lesson.position}</span>
                      </div>
                      {lesson.type === "video" && <Video className="w-4 h-4 text-blue-600" />}
                      {lesson.type === "text" && <FileText className="w-4 h-4 text-green-600" />}
                      {lesson.type === "quiz" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      {lesson.type === "live" && <Globe className="w-4 h-4 text-red-600" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold" style={{ color: COLORS.dark }}>
                          {lesson.title}
                        </h4>
                        {lesson.isFree ? (
                          <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                            <Unlock className="w-3 h-3 mr-1" />
                            Free
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Paid
                          </Badge>
                        )}
                        {lesson.isPreview && (
                          <Badge variant="outline" className="text-xs">
                            Preview
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm line-clamp-1" style={{ color: COLORS.dark + "80" }}>
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: COLORS.dark + "60" }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration} min
                        </span>
                        <span className="capitalize">{lesson.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingLesson(lesson);
                        setShowLessonEditor(true);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLessons(prev => prev.filter(l => l.id !== lesson.id));
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}

              {lessons.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed" style={{ borderColor: COLORS.lightGray }}>
                  <Video className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
                  <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
                    No lessons yet
                  </h3>
                  <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
                    Start building your course by adding your first lesson
                  </p>
                  <Button
                    onClick={() => {
                      setEditingLesson(null);
                      setShowLessonEditor(true);
                    }}
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add First Lesson
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Content & Structure Tab */}
          <TabsContent value="content" className="space-y-4">
            <div>
              <Label>Learning Objectives</Label>
              <p className="text-xs mb-3" style={{ color: COLORS.dark + "60" }}>
                What will students be able to do after completing this course?
              </p>
              <div className="space-y-2 mb-3">
                {formData.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="flex-1 text-sm">{objective}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => removeObjective(objective)}
                      className="text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Add learning objective..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addObjective();
                    }
                  }}
                />
                <Button size="sm" onClick={addObjective} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Prerequisites</Label>
              <p className="text-xs mb-3" style={{ color: COLORS.dark + "60" }}>
                What should students know before taking this course?
              </p>
              <div className="space-y-2 mb-3">
                {formData.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="flex-1 text-sm">{prerequisite}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => removePrerequisite(prerequisite)}
                      className="text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  placeholder="Add prerequisite..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPrerequisite();
                    }
                  }}
                />
                <Button size="sm" onClick={addPrerequisite} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.certificateEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, certificateEnabled: checked })}
                />
                <Label className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certificate of Completion
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.hasQuiz}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasQuiz: checked })}
                />
                <Label className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Include Quizzes
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.downloadableResources}
                  onCheckedChange={(checked) => setFormData({ ...formData, downloadableResources: checked })}
                />
                <Label className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Downloadable Resources
                </Label>
              </div>
            </div>

            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                After creating the course, you'll be able to add lessons, upload videos, and organize your content structure.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Pricing & Access Tab */}
          <TabsContent value="pricing" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isFree}
                  onCheckedChange={(checked) => {
                    setFormData({ 
                      ...formData, 
                      isFree: checked,
                      price: checked ? 0 : formData.price,
                      isPremium: checked ? false : formData.isPremium
                    });
                  }}
                />
                <Label className="flex items-center gap-2">
                  <Unlock className="w-4 h-4" />
                  Free Course
                </Label>
              </div>
              
              {!formData.isFree && (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isPremium}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                  />
                  <Label className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Premium Course
                  </Label>
                </div>
              )}
            </div>

            {!formData.isFree && (
              <div>
                <Label htmlFor="price">Course Price (USD)</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" style={{ color: COLORS.dark + "60" }} />
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                  Suggested pricing: Beginner $99-199, Intermediate $199-399, Advanced $399-699
                </p>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-serif font-semibold mb-3">Pricing Strategy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Free Courses:</strong>
                  <ul className="mt-1 text-xs space-y-1" style={{ color: COLORS.dark + "80" }}>
                    <li>• Great for lead generation</li>
                    <li>• Build audience trust</li>
                    <li>• Showcase teaching quality</li>
                  </ul>
                </div>
                <div>
                  <strong>Paid Courses:</strong>
                  <ul className="mt-1 text-xs space-y-1" style={{ color: COLORS.dark + "80" }}>
                    <li>• Higher student commitment</li>
                    <li>• Revenue generation</li>
                    <li>• Premium content positioning</li>
                  </ul>
                </div>
              </div>
            </div>

            <Alert>
              <DollarSign className="w-4 h-4" />
              <AlertDescription>
                <strong>Revenue Sharing:</strong> Platform takes 15% commission on paid courses. You keep 85% of all course sales.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.lightGray }}>
                {formData.thumbnail && (
                  <div className="relative h-48">
                    <img 
                      src={formData.thumbnail} 
                      alt="Course Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 ml-1" style={{ color: COLORS.primary }} />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      {formData.isFree ? (
                        <Badge className="bg-green-100 text-green-700">FREE</Badge>
                      ) : (
                        <Badge className="bg-white bg-opacity-90">${formData.price}</Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div style={{ color: selectedCategory?.color }}>
                      {selectedCategory?.icon}
                    </div>
                    <Badge variant="outline" style={{ borderColor: selectedCategory?.color + "40", color: selectedCategory?.color }}>
                      {selectedCategory?.name}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {formData.level}
                    </Badge>
                    {formData.isPremium && (
                      <Badge variant="outline" className="border-yellow-300 text-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-serif font-bold mb-3" style={{ color: COLORS.dark }}>
                    {formData.title || "Your Course Title Here"}
                  </h1>
                  
                  <p className="text-base mb-4" style={{ color: COLORS.dark + "80" }}>
                    {formData.description || "Your course description will appear here..."}
                  </p>

                  {formData.learningObjectives.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-serif font-semibold mb-2">What You'll Learn</h3>
                      <div className="space-y-1">
                        {formData.learningObjectives.slice(0, 4).map((objective, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>{objective}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm py-3 border-t" style={{ borderColor: COLORS.lightGray }}>
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>0 lessons</span>
                    </div>
                    {formData.certificateEnabled && (
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>Certificate</span>
                      </div>
                    )}
                    {formData.downloadableResources && (
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>Resources</span>
                      </div>
                    )}
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
            disabled={!formData.title || !formData.description || isSaving}
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="w-4 h-4 mr-1" />
              </motion.div>
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave("publish")}
            disabled={!formData.title || !formData.description || isSaving}
            style={{ backgroundColor: COLORS.primary }}
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="w-4 h-4 mr-1" />
              </motion.div>
            ) : (
              <Globe className="w-4 h-4 mr-1" />
            )}
            Publish Course
          </Button>
        </div>
      </DialogContent>

      {/* Lesson Editor Dialog */}
      <LessonEditor
        lesson={editingLesson}
        isOpen={showLessonEditor}
        onClose={() => {
          setShowLessonEditor(false);
          setEditingLesson(null);
        }}
        onSave={handleSaveLesson}
      />
    </Dialog>
  );
}

function VideoPlayer({ 
  videoUrl, 
  thumbnail, 
  title 
}: { 
  videoUrl: string; 
  thumbnail: string; 
  title: string; 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {!isPlaying ? (
        // Thumbnail with play button
        <div className="relative">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(true)}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <Play className="w-8 h-8 ml-1" style={{ color: COLORS.primary }} />
            </motion.button>
          </div>
        </div>
      ) : (
        // Video player
        <div className="relative">
          <video 
            className="w-full aspect-video"
            poster={thumbnail}
            controls={false}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          
          {/* Custom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex items-center gap-3 text-white">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs">0:00</span>
                <div className="flex-1 h-1 bg-white bg-opacity-30 rounded">
                  <div 
                    className="h-full rounded"
                    style={{ 
                      backgroundColor: COLORS.primary,
                      width: `${(currentTime / duration) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-xs">10:25</span>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CoursesVideos() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || "en").startsWith("ar");

  const handleCreateCourse = () => {
    setEditingCourse(undefined);
    setShowEditor(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowEditor(true);
  };

  const handleSaveCourse = (courseData: Partial<Course>) => {
    if (editingCourse) {
      // Update existing course
      setCourses(prev => prev.map(item => 
        item.id === editingCourse.id 
          ? { ...item, ...courseData }
          : item
      ));
    } else {
      // Create new course
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        instructor: "Current User",
        createdAt: new Date(),
        updatedAt: new Date(),
        studentsEnrolled: 0,
        rating: 0,
        totalRatings: 0,
        completionRate: 0,
        revenue: 0,
        lessons: [],
        duration: 0,
        currency: "USD",
        ...courseData
      } as Course;
      setCourses(prev => [newCourse, ...prev]);
    }
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(item => item.id !== id));
  };

  const handleDuplicateCourse = (course: Course) => {
    const duplicated: Course = {
      ...course,
      id: `course-${Date.now()}`,
      title: `${course.title} (Copy)`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: undefined,
      studentsEnrolled: 0,
      rating: 0,
      totalRatings: 0,
      revenue: 0
    };
    setCourses(prev => [duplicated, ...prev]);
  };

  const handleViewAnalytics = (course: Course) => {
    setSelectedCourse(course);
    setShowAnalytics(true);
  };

  const filteredCourses = courses.filter(item => {
    if (filter !== "all") {
      if (filter === "published" && item.status !== "published") return false;
      if (filter === "draft" && item.status !== "draft") return false;
      if (filter === "free" && !item.isFree) return false;
      if (filter === "premium" && !item.isPremium) return false;
    }
    if (categoryFilter !== "all" && item.category.id !== categoryFilter) return false;
    if (levelFilter !== "all" && item.level !== levelFilter) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  const statusCounts = {
    all: courses.length,
    published: courses.filter(c => c.status === "published").length,
    draft: courses.filter(c => c.status === "draft").length,
    free: courses.filter(c => c.isFree).length,
    premium: courses.filter(c => c.isPremium).length
  };

  const totalStudents = courses.reduce((sum, c) => sum + c.studentsEnrolled, 0);
  const totalRevenue = courses.reduce((sum, c) => sum + c.revenue, 0);
  const averageRating = courses.length > 0 
    ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length 
    : 0;

  return (
    <div
      className="space-y-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            {t("pages.coursesVideos.title")}
          </h2>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            {t("pages.coursesVideos.subtitle")}
          </p>
        </div>
        
        <Button 
          onClick={handleCreateCourse}
          className="gap-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4" />
          {t("pages.coursesVideos.header.create")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + "20" }}
            >
              <BookOpen className="w-5 h-5" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                {statusCounts.all}
              </p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.coursesVideos.stats.totalCourses")}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalStudents.toLocaleString()}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.coursesVideos.stats.totalStudents")}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.coursesVideos.stats.totalRevenue")}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
              <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                {t("pages.coursesVideos.stats.averageRating")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: COLORS.dark + "60" }} />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">
                {t("pages.coursesVideos.filters.allCourses", {
                  count: statusCounts.all,
                })}
              </option>
              <option value="published">
                {t("pages.coursesVideos.filters.published", {
                  count: statusCounts.published,
                })}
              </option>
              <option value="draft">
                {t("pages.coursesVideos.filters.draft", {
                  count: statusCounts.draft,
                })}
              </option>
              <option value="free">
                {t("pages.coursesVideos.filters.free", {
                  count: statusCounts.free,
                })}
              </option>
              <option value="premium">
                {t("pages.coursesVideos.filters.premium", {
                  count: statusCounts.premium,
                })}
              </option>
            </select>
          </div>
          
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">
              {t("pages.coursesVideos.filters.allCategories")}
            </option>
            {COURSE_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select 
            value={levelFilter} 
            onChange={(e) => setLevelFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">
              {t("pages.coursesVideos.filters.allLevels")}
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
          <Input
            placeholder={t("pages.coursesVideos.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:max-w-xs"
          />
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex-1 lg:flex-none"
            >
              <Layers className="w-4 h-4" />
              <span className="ml-1 lg:hidden">Grid</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex-1 lg:flex-none"
            >
              <List className="w-4 h-4" />
              <span className="ml-1 lg:hidden">List</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <motion.div 
        className={`grid gap-4 lg:gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
            : "grid-cols-1 max-w-5xl mx-auto"
        }`}
        layout
      >
        <AnimatePresence>
          {filteredCourses.map((course) => (
            <CourseCard
              // key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onDuplicate={handleDuplicateCourse}
              onViewAnalytics={handleViewAnalytics}
              compact={viewMode === "list"}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
          <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: COLORS.dark }}>
            {filter === "all"
              ? t("pages.coursesVideos.emptyState.noCourses")
              : t("pages.coursesVideos.emptyState.noCoursesFiltered", {
                  status: filter,
                })}
          </h3>
          <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
            {filter === "all" 
              ? t("pages.coursesVideos.emptyState.body")
              : t("pages.coursesVideos.emptyState.bodyFiltered", {
                  status: filter,
                })
            }
          </p>
          {filter === "all" && (
            <Button 
              onClick={handleCreateCourse}
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4 mr-1" />
              {t("pages.coursesVideos.emptyState.createFirstCourse")}
            </Button>
          )}
        </div>
      )}

      {/* Course Editor Dialog */}
      <CourseEditor
        course={editingCourse}
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingCourse(undefined);
        }}
        onSave={handleSaveCourse}
      />

      {/* Course Analytics Dialog */}
      {showAnalytics && selectedCourse && (
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" style={{ color: COLORS.primary }} />
                Course Analytics - {selectedCourse.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                      {selectedCourse.studentsEnrolled.toLocaleString()}
                    </div>
                    <div className="text-sm" style={{ color: COLORS.dark + "60" }}>
                      Students Enrolled
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedCourse.completionRate}%
                    </div>
                    <div className="text-sm" style={{ color: COLORS.dark + "60" }}>
                      Completion Rate
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold text-yellow-600">
                        {selectedCourse.rating}
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: COLORS.dark + "60" }}>
                      Average Rating
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                      ${selectedCourse.revenue.toLocaleString()}
                    </div>
                    <div className="text-sm" style={{ color: COLORS.dark + "60" }}>
                      Total Revenue
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sample Video Player */}
              <div>
                <h3 className="text-lg font-serif font-semibold mb-4">Course Preview</h3>
                <VideoPlayer
                  videoUrl="https://example.com/course-preview.mp4"
                  thumbnail={selectedCourse.thumbnail}
                  title={selectedCourse.title}
                />
              </div>

              {/* Lessons Analytics */}
              <div>
                <h3 className="text-lg font-serif font-semibold mb-4">Lesson Performance</h3>
                <div className="space-y-3">
                  {selectedCourse.lessons.slice(0, 5).map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Video className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{lesson.title}</div>
                          <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
                            {lesson.duration} minutes • {lesson.completions} completions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {Math.round((lesson.completions / selectedCourse.studentsEnrolled) * 100)}%
                        </div>
                        <div className="text-xs" style={{ color: COLORS.dark + "60" }}>
                          completion rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}