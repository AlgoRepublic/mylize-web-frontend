import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Camera, 
  Upload, 
  Save, 
  Edit3, 
  Eye,
  EyeOff,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Link2,
  Award,
  Briefcase,
  GraduationCap,
  Users,
  Star,
  Shield,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Check,
  X,
  Plus,
  ExternalLink,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  TrendingUp,
  Building2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface ProfileData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  profilePhoto?: string;
  coverPhoto?: string;
  
  // Professional Details
  title: string;
  company?: string;
  experience: string;
  specializations: string[];
  certifications: string[];
  languages: string[];
  
  // Location & Contact
  location: string;
  timezone: string;
  website?: string;
  
  // Social Media
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    telegram?: string;
  };
  
  // Branding
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  brandLogo?: string;
  
  // Privacy Settings
  profileVisibility: "public" | "private" | "subscribers_only";
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "certification" | "award" | "milestone" | "education";
  verified: boolean;
}

const mockProfileData: ProfileData = {
  firstName: "John",
  lastName: "Smith", 
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  bio: "Senior Forex Analyst with 8+ years of experience in currency markets. Specialized in EUR/USD, GBP/USD, and emerging market currencies. Certified FRM and CFA charterholder.",
  title: "Senior Forex Analyst",
  company: "Forex Analytics Corp",
  experience: "8+ years",
  specializations: ["Forex Trading", "Technical Analysis", "Risk Management", "Market Research"],
  certifications: ["CFA Level III", "FRM Certified", "CMT Level II"],
  languages: ["English (Native)", "Spanish (Fluent)", "German (Intermediate)"],
  location: "New York, NY",
  timezone: "EST (UTC-5)",
  website: "johnsmith-forex.com",
  socialMedia: {
    twitter: "johnsmith_fx",
    linkedin: "john-smith-forex",
    youtube: "johnsmithtrading"
  },
  brandColors: {
    primary: "#EE6D41",
    secondary: "#484A4C", 
    accent: "#F2F4F7"
  },
  profileVisibility: "public",
  showEmail: false,
  showPhone: false,
  showLocation: true
};

const mockAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "CFA Level III Passed",
    description: "Completed the highest level of the CFA program",
    date: new Date("2023-08-15"),
    type: "certification",
    verified: true
  },
  {
    id: "ach-2", 
    title: "Top Analyst Award 2023",
    description: "Recognized as top performing analyst in Q4 2023",
    date: new Date("2023-12-15"),
    type: "award",
    verified: true
  },
  {
    id: "ach-3",
    title: "1000+ Subscribers Milestone",
    description: "Reached 1000 premium subscribers",
    date: new Date("2024-01-20"),
    type: "milestone",
    verified: false
  }
];

function ProfilePhotoUpload({ 
  currentPhoto, 
  onPhotoChange 
}: { 
  currentPhoto?: string; 
  onPhotoChange: (photo: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      onPhotoChange("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face");
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-32 h-32">
          <AvatarImage src={currentPhoto} alt="Profile" />
          <AvatarFallback className="text-2xl">
            {mockProfileData.firstName[0]}{mockProfileData.lastName[0]}
          </AvatarFallback>
        </Avatar>
        
        <motion.button
          className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg border-2 flex items-center justify-center"
          style={{ borderColor: COLORS.primary }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4" style={{ color: COLORS.primary }} />
            </motion.div>
          ) : (
            <Camera className="w-4 h-4" style={{ color: COLORS.primary }} />
          )}
        </motion.button>
      </div>
      
      <div className="text-center">
        <Button size="sm" variant="outline" onClick={handleUpload} disabled={isUploading}>
          <Upload className="w-4 h-4 mr-1" />
          {isUploading ? "Uploading..." : "Change Photo"}
        </Button>
        <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
          JPG, PNG up to 5MB
        </p>
      </div>
    </div>
  );
}

function ColorPicker({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (color: string) => void; 
}) {
  const presetColors = [
    "#EE6D41", "#484A4C", "#F2F4F7", // Brand colors
    "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", // Common colors
    "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1"
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => document.getElementById(`color-${label}`)?.click()}
        />
        <Input
          id={`color-${label}`}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 p-1 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          placeholder="#000000"
        />
      </div>
      
      <div className="flex gap-1 flex-wrap">
        {presetColors.map((color) => (
          <button
            key={color}
            className="w-6 h-6 rounded border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );
}

function SocialMediaLinks({ 
  socialMedia, 
  onChange 
}: { 
  socialMedia: ProfileData["socialMedia"]; 
  onChange: (social: ProfileData["socialMedia"]) => void;
}) {
  const platforms = [
    { key: "twitter" as keyof typeof socialMedia, icon: Twitter, label: "Twitter", placeholder: "username" },
    { key: "linkedin" as keyof typeof socialMedia, icon: Linkedin, label: "LinkedIn", placeholder: "profile-url" },
    { key: "youtube" as keyof typeof socialMedia, icon: Youtube, label: "YouTube", placeholder: "channel-name" },
    { key: "telegram" as keyof typeof socialMedia, icon: MessageCircle, label: "Telegram", placeholder: "username" },
    { key: "instagram" as keyof typeof socialMedia, icon: Instagram, label: "Instagram", placeholder: "username" },
    { key: "facebook" as keyof typeof socialMedia, icon: Facebook, label: "Facebook", placeholder: "profile" }
  ];

  return (
    <div className="space-y-4">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        return (
          <div key={platform.key} className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.lightGray }}
            >
              <Icon className="w-5 h-5" style={{ color: COLORS.dark }} />
            </div>
            <div className="flex-1">
              <Label className="text-sm">{platform.label}</Label>
              <Input
                value={socialMedia[platform.key] || ""}
                onChange={(e) => onChange({ 
                  ...socialMedia, 
                  [platform.key]: e.target.value 
                })}
                placeholder={platform.placeholder}
                className="mt-1"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AchievementCard({ 
  achievement, 
  onEdit, 
  onDelete 
}: { 
  achievement: Achievement; 
  onEdit: () => void; 
  onDelete: () => void; 
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "certification": return <Award className="w-5 h-5" />;
      case "award": return <Star className="w-5 h-5" />;
      case "milestone": return <TrendingUp className="w-5 h-5" />;
      case "education": return <GraduationCap className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "certification": return "#10B981";
      case "award": return "#F59E0B"; 
      case "milestone": return "#8B5CF6";
      case "education": return "#3B82F6";
      default: return COLORS.primary;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-4 border shadow-sm"
      style={{ borderColor: COLORS.lightGray }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: getTypeColor(achievement.type) + "20",
              color: getTypeColor(achievement.type)
            }}
          >
            {getTypeIcon(achievement.type)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-sans font-semibold" style={{ color: COLORS.dark }}>
                {achievement.title}
              </h4>
              {achievement.verified && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <p className="text-sm mb-2" style={{ color: COLORS.dark + "80" }}>
              {achievement.description}
            </p>
            
            <p className="text-xs" style={{ color: COLORS.dark + "60" }}>
              {achievement.date.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete} className="text-red-600 border-red-300 hover:bg-red-50">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ProfilePreview({ profile }: { profile: ProfileData }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
        Profile Preview
      </h3>
      
      {/* Preview Card */}
      <div 
        className="rounded-xl p-6 relative overflow-hidden"
        style={{ backgroundColor: profile.brandColors.primary + "10" }}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={mockProfileData.profilePhoto} />
            <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h4 className="text-xl font-serif font-semibold" style={{ color: COLORS.dark }}>
              {profile.firstName} {profile.lastName}
            </h4>
            <p className="text-sm" style={{ color: profile.brandColors.primary }}>
              {profile.title}
            </p>
            {profile.company && (
              <p className="text-sm" style={{ color: COLORS.dark + "80" }}>
                {profile.company}
              </p>
            )}
          </div>
          
          <Badge 
            style={{ 
              backgroundColor: profile.brandColors.primary + "20",
              color: profile.brandColors.primary
            }}
          >
            {profile.experience} Experience
          </Badge>
        </div>
        
        {/* Bio */}
        <p className="text-sm mb-4" style={{ color: COLORS.dark + "80" }}>
          {profile.bio}
        </p>
        
        {/* Specializations */}
        <div className="flex gap-1 flex-wrap mb-4">
          {profile.specializations.slice(0, 3).map((spec, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: profile.brandColors.primary + "40" }}
            >
              {spec}
            </Badge>
          ))}
          {profile.specializations.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{profile.specializations.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Contact Info */}
        <div className="flex items-center gap-4 text-xs" style={{ color: COLORS.dark + "60" }}>
          {profile.showLocation && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>{profile.website}</span>
            </div>
          )}
        </div>
      </div>
      
      <Alert className="mt-4">
        <Eye className="w-4 h-4" />
        <AlertDescription>
          This is how your profile will appear to {profile.profileVisibility === "public" ? "everyone" : 
          profile.profileVisibility === "subscribers_only" ? "your subscribers" : "no one (private)"}
        </AlertDescription>
      </Alert>
    </Card>
  );
}

export function ProfileBranding() {
  const [profile, setProfile] = useState<ProfileData>(mockProfileData);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [activeTab, setActiveTab] = useState("basic");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileChange = (field: keyof ProfileData, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSocialChange = (socialMedia: ProfileData["socialMedia"]) => {
    setProfile(prev => ({ ...prev, socialMedia }));
    setHasChanges(true);
  };

  const handleBrandColorsChange = (colorType: keyof ProfileData["brandColors"], color: string) => {
    setProfile(prev => ({
      ...prev,
      brandColors: { ...prev.brandColors, [colorType]: color }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
  };

  const profileCompleteness = () => {
    const fields = [
      profile.firstName, profile.lastName, profile.email, profile.bio,
      profile.title, profile.location, profile.specializations.length > 0
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            Profile & Branding
          </h2>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            Customize your professional profile and build your personal brand
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              Unsaved Changes
            </Badge>
          )}
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            style={{ backgroundColor: COLORS.primary }}
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
              </motion.div>
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Profile Completeness */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sans font-semibold" style={{ color: COLORS.dark }}>
            Profile Completeness
          </h3>
          <span className="font-semibold" style={{ color: COLORS.primary }}>
            {profileCompleteness()}%
          </span>
        </div>
        <Progress value={profileCompleteness()} className="h-2" />
        <p className="text-xs mt-2" style={{ color: COLORS.dark + "60" }}>
          Complete your profile to attract more subscribers and build credibility
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-serif font-semibold mb-6" style={{ color: COLORS.dark }}>
                  Basic Information
                </h3>
                
                {/* Profile Photo */}
                <div className="mb-6">
                  <ProfilePhotoUpload
                    currentPhoto={profile.profilePhoto}
                    onPhotoChange={(photo) => handleProfileChange("profilePhoto", photo)}
                  />
                </div>
                
                <Separator className="my-6" />
                
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => handleProfileChange("firstName", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => handleProfileChange("lastName", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleProfileChange("bio", e.target.value)}
                    rows={4}
                    placeholder="Tell people about your background, expertise, and what makes you unique..."
                  />
                  <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                    {profile.bio.length}/500 characters
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleProfileChange("location", e.target.value)}
                      placeholder="City, State/Country"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={profile.timezone} 
                      onValueChange={(value) => handleProfileChange("timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EST (UTC-5)">Eastern Time (EST)</SelectItem>
                        <SelectItem value="CST (UTC-6)">Central Time (CST)</SelectItem>
                        <SelectItem value="PST (UTC-8)">Pacific Time (PST)</SelectItem>
                        <SelectItem value="GMT (UTC+0)">Greenwich Time (GMT)</SelectItem>
                        <SelectItem value="CET (UTC+1)">Central European Time (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Professional Information */}
            <TabsContent value="professional" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-serif font-semibold mb-6" style={{ color: COLORS.dark }}>
                  Professional Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => handleProfileChange("title", e.target.value)}
                      placeholder="e.g. Senior Forex Analyst"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Current Company (Optional)</Label>
                    <Input
                      id="company"
                      value={profile.company || ""}
                      onChange={(e) => handleProfileChange("company", e.target.value)}
                      placeholder="e.g. Goldman Sachs"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select 
                      value={profile.experience} 
                      onValueChange={(value) => handleProfileChange("experience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1 years">0-1 years</SelectItem>
                        <SelectItem value="2-3 years">2-3 years</SelectItem>
                        <SelectItem value="4-5 years">4-5 years</SelectItem>
                        <SelectItem value="6-7 years">6-7 years</SelectItem>
                        <SelectItem value="8+ years">8+ years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                        <SelectItem value="15+ years">15+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Personal Website (Optional)</Label>
                    <Input
                      id="website"
                      value={profile.website || ""}
                      onChange={(e) => handleProfileChange("website", e.target.value)}
                      placeholder="yourwebsite.com"
                    />
                  </div>
                </div>
                
                {/* Specializations */}
                <div className="mb-6">
                  <Label>Specializations</Label>
                  <div className="flex gap-2 flex-wrap mt-2 mb-3">
                    {profile.specializations.map((spec, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="cursor-pointer hover:bg-red-50"
                        onClick={() => {
                          const newSpecs = profile.specializations.filter((_, i) => i !== index);
                          handleProfileChange("specializations", newSpecs);
                        }}
                      >
                        {spec}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add specialization..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newSpecs = [...profile.specializations, e.currentTarget.value.trim()];
                          handleProfileChange("specializations", newSpecs);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Certifications */}
                <div className="mb-6">
                  <Label>Certifications</Label>
                  <div className="flex gap-2 flex-wrap mt-2 mb-3">
                    {profile.certifications.map((cert, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="cursor-pointer hover:bg-red-50"
                        onClick={() => {
                          const newCerts = profile.certifications.filter((_, i) => i !== index);
                          handleProfileChange("certifications", newCerts);
                        }}
                      >
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add certification (e.g. CFA Level III)..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const newCerts = [...profile.certifications, e.currentTarget.value.trim()];
                        handleProfileChange("certifications", newCerts);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>
                
                {/* Languages */}
                <div>
                  <Label>Languages</Label>
                  <div className="flex gap-2 flex-wrap mt-2 mb-3">
                    {profile.languages.map((lang, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="cursor-pointer hover:bg-red-50"
                        onClick={() => {
                          const newLangs = profile.languages.filter((_, i) => i !== index);
                          handleProfileChange("languages", newLangs);
                        }}
                      >
                        {lang}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add language (e.g. Spanish - Fluent)..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const newLangs = [...profile.languages, e.currentTarget.value.trim()];
                        handleProfileChange("languages", newLangs);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>
              </Card>
              
              {/* Achievements */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif font-semibold" style={{ color: COLORS.dark }}>
                    Achievements & Awards
                  </h3>
                  <Button size="sm" style={{ backgroundColor: COLORS.primary }}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Achievement
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <AnimatePresence>
                    {achievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        onEdit={() => console.log("Edit", achievement.id)}
                        onDelete={() => setAchievements(prev => prev.filter(a => a.id !== achievement.id))}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            </TabsContent>

            {/* Branding */}
            <TabsContent value="branding" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-serif font-semibold mb-6" style={{ color: COLORS.dark }}>
                  Brand Colors
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ColorPicker
                    label="Primary Color"
                    value={profile.brandColors.primary}
                    onChange={(color) => handleBrandColorsChange("primary", color)}
                  />
                  <ColorPicker
                    label="Secondary Color"
                    value={profile.brandColors.secondary}
                    onChange={(color) => handleBrandColorsChange("secondary", color)}
                  />
                  <ColorPicker
                    label="Accent Color"
                    value={profile.brandColors.accent}
                    onChange={(color) => handleBrandColorsChange("accent", color)}
                  />
                </div>
                
                <Alert className="mt-6">
                  <Palette className="w-4 h-4" />
                  <AlertDescription>
                    These colors will be used throughout your profile and content to maintain brand consistency.
                  </AlertDescription>
                </Alert>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-serif font-semibold mb-6" style={{ color: COLORS.dark }}>
                  Brand Logo
                </h3>
                
                <div className="flex items-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    style={{ borderColor: COLORS.lightGray }}
                  >
                    {profile.brandLogo ? (
                      <img src={profile.brandLogo} alt="Brand Logo" className="w-16 h-16 object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8" style={{ color: COLORS.dark + "40" }} />
                    )}
                  </div>
                  
                  <div>
                    <Button size="sm" style={{ backgroundColor: COLORS.primary }}>
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Logo
                    </Button>
                    <p className="text-xs mt-1" style={{ color: COLORS.dark + "60" }}>
                      PNG, SVG up to 2MB. Recommended: 200x200px
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Social Media */}
            <TabsContent value="social" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-serif font-semibold mb-6" style={{ color: COLORS.dark }}>
                  Social Media Links
                </h3>
                
                <SocialMediaLinks
                  socialMedia={profile.socialMedia}
                  onChange={handleSocialChange}
                />
                
                <Alert className="mt-6">
                  <Link2 className="w-4 h-4" />
                  <AlertDescription>
                    Adding social media links helps build trust and allows subscribers to connect with you on other platforms.
                  </AlertDescription>
                </Alert>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-serif font-semibold mb-6" style={{ color: COLORS.dark }}>
                  Profile Visibility
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Who can see your profile?</Label>
                    <Select 
                      value={profile.profileVisibility} 
                      onValueChange={(value: "public" | "private" | "subscribers_only") => 
                        handleProfileChange("profileVisibility", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>Public - Anyone can view</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="subscribers_only">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Subscribers Only</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4" />
                            <span>Private - Hidden from everyone</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-serif font-semibold mb-6" style={{ color: COLORS.dark }}>
                  Contact Information Display
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" style={{ color: COLORS.dark + "80" }} />
                      <span className="text-sm">Show email address</span>
                    </div>
                    <Switch
                      checked={profile.showEmail}
                      onCheckedChange={(checked) => handleProfileChange("showEmail", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" style={{ color: COLORS.dark + "80" }} />
                      <span className="text-sm">Show phone number</span>
                    </div>
                    <Switch
                      checked={profile.showPhone}
                      onCheckedChange={(checked) => handleProfileChange("showPhone", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: COLORS.dark + "80" }} />
                      <span className="text-sm">Show location</span>
                    </div>
                    <Switch
                      checked={profile.showLocation}
                      onCheckedChange={(checked) => handleProfileChange("showLocation", checked)}
                    />
                  </div>
                </div>
                
                <Alert className="mt-6">
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    We recommend keeping personal contact information private and using the platform's messaging system for safety.
                  </AlertDescription>
                </Alert>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Profile Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <ProfilePreview profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}