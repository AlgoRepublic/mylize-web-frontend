import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Search, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Eye,
  ExternalLink,
  Plus,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Badge as BadgeIcon,
  Filter,
  RefreshCw,
  Trash2,
  MessageSquare,
  Calendar,
  Building,
  Shield
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { useTranslation } from "react-i18next";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  website?: string;
  email?: string;
  description: string;
  employeeCount: string;
  founded: string;
  verified: boolean;
  analysts: number;
}

interface AssociationRequest {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  status: "pending" | "approved" | "rejected";
  requestDate: Date;
  responseDate?: Date;
  message?: string;
  adminMessage?: string;
  position: string;
  department?: string;
}

interface CurrentAssociation {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  position: string;
  department: string;
  joinDate: Date;
  status: "active" | "pending_verification" | "suspended";
  permissions: string[];
}

const mockCompanies: Company[] = [
  {
    id: "comp-1",
    name: "Goldman Sachs",
    industry: "Investment Banking",
    location: "New York, NY",
    website: "goldmansachs.com",
    email: "careers@gs.com",
    description: "Leading global investment banking, securities and investment management firm",
    employeeCount: "10,000+",
    founded: "1869",
    verified: true,
    analysts: 245
  },
  {
    id: "comp-2", 
    name: "JP Morgan Chase",
    industry: "Banking & Financial Services",
    location: "New York, NY",
    website: "jpmorganchase.com",
    email: "hr@jpmorgan.com",
    description: "Multinational investment bank and financial services holding company",
    employeeCount: "50,000+",
    founded: "1799",
    verified: true,
    analysts: 189
  },
  {
    id: "comp-3",
    name: "Forex Analytics Corp",
    industry: "Financial Technology",
    location: "London, UK",
    website: "forexanalytics.com",
    description: "Specialized forex analysis and trading technology company",
    employeeCount: "100-500",
    founded: "2015",
    verified: true,
    analysts: 34
  },
  {
    id: "comp-4",
    name: "TradeTech Solutions",
    industry: "Trading Technology",
    location: "Singapore",
    description: "Innovative trading platform and analytics provider",
    employeeCount: "50-100",
    founded: "2018",
    verified: false,
    analysts: 12
  }
];

const mockRequests: AssociationRequest[] = [
  {
    id: "req-1",
    companyId: "comp-1",
    companyName: "Goldman Sachs",
    status: "pending",
    requestDate: new Date("2024-01-15"),
    message: "I am a senior forex analyst with 8+ years experience. Looking to join the analytics team.",
    position: "Senior Forex Analyst",
    department: "Foreign Exchange Division"
  },
  {
    id: "req-2",
    companyId: "comp-3",
    companyName: "Forex Analytics Corp",
    status: "approved",
    requestDate: new Date("2024-01-10"),
    responseDate: new Date("2024-01-12"),
    adminMessage: "Welcome to the team! Please check your email for onboarding details.",
    position: "Market Analyst",
    department: "Research"
  },
  {
    id: "req-3",
    companyId: "comp-2",
    companyName: "JP Morgan Chase",
    status: "rejected",
    requestDate: new Date("2024-01-05"),
    responseDate: new Date("2024-01-08"),
    adminMessage: "Thank you for your interest. We are not currently accepting new analyst associations.",
    position: "Investment Analyst"
  }
];

const mockCurrentAssociation: CurrentAssociation = {
  id: "assoc-1",
  companyId: "comp-3",
  companyName: "Forex Analytics Corp",
  position: "Senior Market Analyst",
  department: "Research & Development",
  joinDate: new Date("2024-01-12"),
  status: "active",
  permissions: ["publish_research", "access_premium_data", "mentor_analysts"]
};

interface CompanyCardProps {
  company: Company;
  onRequestJoin: (companyId: string) => void;
  hasExistingRequest?: boolean;
  isAssociated?: boolean;
}

function CompanyCard({ company, onRequestJoin, hasExistingRequest = false, isAssociated = false }: CompanyCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-6 border shadow-sm transition-all duration-300"
      style={{ borderColor: COLORS.lightGray }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary + "20" }}
          >
            <Building2 className="w-6 h-6" style={{ color: COLORS.primary }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-sans font-semibold" style={{ color: COLORS.dark }}>
                {company.name}
              </h4>
              {company.verified && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm" style={{ color: COLORS.dark + "80" }}>
              {company.industry}
            </p>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.dark + "80" }}>
          <MapPin className="w-4 h-4" />
          <span>{company.location}</span>
        </div>
        
        {company.website && (
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.dark + "80" }}>
            <Globe className="w-4 h-4" />
            <span>{company.website}</span>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm" style={{ color: COLORS.dark + "80" }}>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{company.employeeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <BadgeIcon className="w-4 h-4" />
            <span>{company.analysts} analysts</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Est. {company.founded}</span>
          </div>
        </div>

        <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
          {company.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isAssociated ? (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Associated
          </Badge>
        ) : hasExistingRequest ? (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Request Pending
          </Badge>
        ) : (
          <Button 
            size="sm" 
            onClick={() => onRequestJoin(company.id)}
            style={{ backgroundColor: COLORS.primary }}
          >
            <Send className="w-4 h-4 mr-1" />
            Request to Join
          </Button>
        )}
        
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4 mr-1" />
          {t("pages.companyAssociation.viewDetails")}
        </Button>
        
        {company.website && (
          <Button size="sm" variant="outline">
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

interface RequestCardProps {
  request: AssociationRequest;
  onCancel?: (requestId: string) => void;
  onResubmit?: (requestId: string) => void;
}

function RequestCard({ request, onCancel, onResubmit }: RequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "#10B981";
      case "rejected": return "#EF4444";
      case "pending": return "#F59E0B";
      default: return COLORS.dark;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl p-6 border shadow-sm"
      style={{ borderColor: COLORS.lightGray }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: getStatusColor(request.status) + "20",
              color: getStatusColor(request.status)
            }}
          >
            {getStatusIcon(request.status)}
          </div>
          <div>
            <h4 className="font-sans font-semibold" style={{ color: COLORS.dark }}>
              {request.companyName}
            </h4>
            <p className="text-sm" style={{ color: COLORS.dark + "80" }}>
              {request.position}
            </p>
          </div>
        </div>
        
        <Badge 
          variant="outline"
          className="capitalize"
          style={{ 
            borderColor: getStatusColor(request.status),
            color: getStatusColor(request.status)
          }}
        >
          {request.status}
        </Badge>
      </div>

      {/* Request Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-4 text-sm" style={{ color: COLORS.dark + "80" }}>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Requested: {request.requestDate.toLocaleDateString()}</span>
          </div>
          {request.responseDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Responded: {request.responseDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {request.department && (
          <div className="text-sm" style={{ color: COLORS.dark + "80" }}>
            <span className="font-medium">Department:</span> {request.department}
          </div>
        )}

        {request.message && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm" style={{ color: COLORS.dark + "80" }}>
              <span className="font-medium">Your Message:</span><br />
              {request.message}
            </p>
          </div>
        )}

        {request.adminMessage && (
          <Alert className={request.status === "approved" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <MessageSquare className="w-4 h-4" />
            <AlertDescription className="text-sm">
              <strong>Company Response:</strong><br />
              {request.adminMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {request.status === "pending" && onCancel && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onCancel(request.id)}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Cancel Request
          </Button>
        )}
        
        {request.status === "rejected" && onResubmit && (
          <Button 
            size="sm" 
            onClick={() => onResubmit(request.id)}
            style={{ backgroundColor: COLORS.primary }}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Resubmit Request
          </Button>
        )}

        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4 mr-1" />
          View Company
        </Button>
      </div>
    </motion.div>
  );
}

function CurrentAssociationCard({ association }: { association: CurrentAssociation }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "#10B981";
      case "pending_verification": return "#F59E0B";
      case "suspended": return "#EF4444";
      default: return COLORS.dark;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: COLORS.primary + "20" }}
        >
          <Building className="w-8 h-8" style={{ color: COLORS.primary }} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-serif font-semibold" style={{ color: COLORS.dark }}>
            {association.companyName}
          </h3>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            {association.position} • {association.department}
          </p>
          <Badge 
            className="mt-2"
            style={{ 
              backgroundColor: getStatusColor(association.status) + "20",
              color: getStatusColor(association.status),
              border: `1px solid ${getStatusColor(association.status)}40`
            }}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {association.status === "active" ? "Active Association" : 
             association.status === "pending_verification" ? "Pending Verification" : "Suspended"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.dark }}>
            Association Details
          </h4>
          <div className="space-y-2 text-sm" style={{ color: COLORS.dark + "80" }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Joined: {association.joinDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.dark }}>
            Permissions
          </h4>
          <div className="space-y-1">
            {association.permissions.map((permission, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs mr-1"
                style={{ borderColor: COLORS.primary + "40", color: COLORS.primary }}
              >
                {permission.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          <Building2 className="w-4 h-4 mr-1" />
          Company Profile
        </Button>
        <Button size="sm" variant="outline">
          <Users className="w-4 h-4 mr-1" />
          Team Directory
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Leave Company
        </Button>
      </div>
    </Card>
  );
}

function RequestJoinDialog({ 
  isOpen, 
  onClose, 
  companyId, 
  companyName, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  companyId?: string; 
  companyName?: string;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    position: "",
    department: "",
    message: "",
    experience: "",
    motivation: ""
  });

  const handleSubmit = () => {
    onSubmit({
      companyId,
      ...formData
    });
    setFormData({
      position: "",
      department: "",
      message: "",
      experience: "",
      motivation: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" style={{ color: COLORS.primary }} />
            Request to Join {companyName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="position">Desired Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              placeholder="e.g. Senior Forex Analyst"
            />
          </div>

          <div>
            <Label htmlFor="department">Department (Optional)</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              placeholder="e.g. Foreign Exchange Division"
            />
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="2-3">2-3 years</SelectItem>
                <SelectItem value="4-5">4-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message to Company</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Tell them about your background, expertise, and why you'd like to join their team..."
              rows={4}
            />
          </div>

          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Your request will be sent to the company administrators. They will review your profile 
              and may contact you directly for additional information.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            style={{ backgroundColor: COLORS.primary }}
            disabled={!formData.position || !formData.message}
          >
            <Send className="w-4 h-4 mr-1" />
            Send Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CompanyAssociation() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [requests, setRequests] = useState<AssociationRequest[]>(mockRequests);
  const [currentAssociation, setCurrentAssociation] = useState<CurrentAssociation | null>(mockCurrentAssociation);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{id: string, name: string} | null>(null);
  const [activeTab, setActiveTab] = useState("discover");
  const { t } = useTranslation();

  const handleRequestJoin = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany({ id: companyId, name: company.name });
      setShowJoinDialog(true);
    }
  };

  const handleSubmitRequest = (data: any) => {
    const newRequest: AssociationRequest = {
      id: `req-${Date.now()}`,
      companyId: data.companyId,
      companyName: selectedCompany?.name || "",
      status: "pending",
      requestDate: new Date(),
      position: data.position,
      department: data.department,
      message: data.message
    };
    
    setRequests(prev => [newRequest, ...prev]);
    setActiveTab("requests");
  };

  const handleCancelRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const filteredCompanies = companies.filter(company => {
    if (searchTerm && !company.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !company.industry.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (industryFilter !== "all" && company.industry !== industryFilter) return false;
    return true;
  });

  const pendingRequests = requests.filter(r => r.status === "pending");
  const approvedRequests = requests.filter(r => r.status === "approved");
  const rejectedRequests = requests.filter(r => r.status === "rejected");

  const hasRequestForCompany = (companyId: string) => {
    return requests.some(r => r.companyId === companyId && r.status === "pending");
  };

  const isAssociatedWithCompany = (companyId: string) => {
    return currentAssociation?.companyId === companyId;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            {t("pages.companyAssociation.title")}
          </h2>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            {t("pages.companyAssociation.subtitle")}
          </p>
        </div>
      </div>

      {/* Current Association Status */}
      {currentAssociation && (
        <div>
          <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
            Current Association
          </h3>
          <CurrentAssociationCard association={currentAssociation} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {[
          { id: "discover", label: "Discover Companies", count: companies.length },
          { id: "requests", label: "My Requests", count: requests.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? `border-[${COLORS.primary}] text-[${COLORS.primary}]`
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <Badge className="ml-2" variant="outline">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "discover" && (
          <motion.div
            key="discover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: COLORS.dark + "60" }} />
                <Input
                  placeholder="Search companies by name or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Investment Banking">Investment Banking</SelectItem>
                  <SelectItem value="Banking & Financial Services">Banking & Financial Services</SelectItem>
                  <SelectItem value="Financial Technology">Financial Technology</SelectItem>
                  <SelectItem value="Trading Technology">Trading Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredCompanies.map((company) => (
                  <CompanyCard
                    company={company}
                    onRequestJoin={handleRequestJoin}
                    hasExistingRequest={hasRequestForCompany(company.id)}
                    isAssociated={isAssociatedWithCompany(company.id)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
                <p className="text-lg font-medium" style={{ color: COLORS.dark }}>
                  No companies found
                </p>
                <p className="text-sm" style={{ color: COLORS.dark + "60" }}>
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "requests" && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
                  Pending Requests ({pendingRequests.length})
                </h3>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <RequestCard
                      request={request}
                      onCancel={handleCancelRequest}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Approved Requests */}
            {approvedRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
                  Approved Requests ({approvedRequests.length})
                </h3>
                <div className="space-y-4">
                  {approvedRequests.map((request) => (
                    <RequestCard request={request} />
                  ))}
                </div>
              </div>
            )}

            {/* Rejected Requests */}
            {rejectedRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
                  Rejected Requests ({rejectedRequests.length})
                </h3>
                <div className="space-y-4">
                  {rejectedRequests.map((request) => (
                    <RequestCard 
                      request={request}
                      onResubmit={() => handleRequestJoin(request.companyId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {requests.length === 0 && (
              <div className="text-center py-12">
                <Send className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.dark + "40" }} />
                <p className="text-lg font-medium" style={{ color: COLORS.dark }}>
                  No requests yet
                </p>
                <p className="text-sm mb-4" style={{ color: COLORS.dark + "60" }}>
                  Start by discovering companies and sending join requests
                </p>
                <Button 
                  onClick={() => setActiveTab("discover")}
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Building2 className="w-4 h-4 mr-1" />
                  Discover Companies
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Join Dialog */}
      <RequestJoinDialog
        isOpen={showJoinDialog}
        onClose={() => {
          setShowJoinDialog(false);
          setSelectedCompany(null);
        }}
        companyId={selectedCompany?.id}
        companyName={selectedCompany?.name}
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
}