import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  Shield,
  Camera,
  CreditCard,
  Building,
  FileCheck,
  MessageSquare,
  Calendar
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";

const COLORS = {
  primary: "#EE6D41", // Orange
  dark: "#484A4C",    // Dark Gray
  light: "#FDFDFE",   // Light White
  lightGray: "#F2F4F7" // Light Gray
};

interface Document {
  id: string;
  type: "identity" | "financial" | "address" | "business";
  name: string;
  fileName?: string;
  status: "not_uploaded" | "uploaded" | "under_review" | "approved" | "rejected";
  uploadedDate?: Date;
  reviewedDate?: Date;
  fileSize?: string;
  adminNotes?: string;
  required: boolean;
}

interface KYCStatus {
  overall: "not_started" | "in_progress" | "under_review" | "approved" | "rejected";
  completionPercentage: number;
  submittedDate?: Date;
  reviewedDate?: Date;
  adminNotes?: string;
  nextSteps?: string[];
}

const mockDocuments: Document[] = [
  {
    id: "doc-1",
    type: "identity",
    name: "Government-issued Photo ID",
    fileName: "passport_john_doe.pdf",
    status: "approved",
    uploadedDate: new Date("2024-01-15"),
    reviewedDate: new Date("2024-01-16"),
    fileSize: "2.3 MB",
    required: true
  },
  {
    id: "doc-2",
    type: "address",
    name: "Proof of Address",
    fileName: "utility_bill_december.pdf",
    status: "under_review",
    uploadedDate: new Date("2024-01-18"),
    fileSize: "1.8 MB",
    required: true
  },
  {
    id: "doc-3",
    type: "financial",
    name: "Financial Certification",
    status: "not_uploaded",
    required: true
  },
  {
    id: "doc-4",
    type: "financial",
    name: "Bank Statement (Last 3 months)",
    fileName: "bank_statements_q4.pdf",
    status: "rejected",
    uploadedDate: new Date("2024-01-10"),
    reviewedDate: new Date("2024-01-12"),
    fileSize: "4.2 MB",
    adminNotes: "Bank statements are older than 3 months. Please upload more recent statements.",
    required: true
  },
  {
    id: "doc-5",
    type: "business",
    name: "Business Registration (Optional)",
    status: "not_uploaded",
    required: false
  }
];

const mockKYCStatus: KYCStatus = {
  overall: "in_progress",
  completionPercentage: 75,
  submittedDate: new Date("2024-01-15"),
  nextSteps: [
    "Upload recent bank statements (last 3 months)",
    "Provide financial certification document",
    "Wait for admin review of address verification"
  ]
};

interface DocumentCardProps {
  document: Document;
  onUpload: (documentId: string) => void;
  onDelete: (documentId: string) => void;
  onView: (documentId: string) => void;
  onReupload: (documentId: string) => void;
}

function DocumentCard({ document, onUpload, onDelete, onView, onReupload }: DocumentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "#10B981";
      case "rejected": return "#EF4444";
      case "under_review": return "#F59E0B";
      case "uploaded": return "#3B82F6";
      case "not_uploaded": return "#6B7280";
      default: return COLORS.dark;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-5 h-5" />;
      case "rejected": return <XCircle className="w-5 h-5" />;
      case "under_review": return <Clock className="w-5 h-5" />;
      case "uploaded": return <FileCheck className="w-5 h-5" />;
      case "not_uploaded": return <Upload className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "identity": return <Camera className="w-5 h-5" />;
      case "financial": return <CreditCard className="w-5 h-5" />;
      case "address": return <Building className="w-5 h-5" />;
      case "business": return <Building className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "under_review": return "Under Review";
      case "uploaded": return "Uploaded";
      case "not_uploaded": return "Not Uploaded";
      default: return "Unknown";
    }
  };

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
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: getStatusColor(document.status) + "20",
              color: getStatusColor(document.status)
            }}
          >
            {getTypeIcon(document.type)}
          </div>
          <div>
            <h4 className="font-sans font-semibold" style={{ color: COLORS.dark }}>
              {document.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline"
                className="text-xs"
                style={{ 
                  borderColor: getStatusColor(document.status),
                  color: getStatusColor(document.status)
                }}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(document.status)}
                  {getStatusText(document.status)}
                </div>
              </Badge>
              {document.required && (
                <Badge variant="outline" className="text-xs border-red-300 text-red-600">
                  Required
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* File Info */}
      {document.fileName && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" style={{ color: COLORS.dark + "80" }} />
            <span className="text-sm font-medium" style={{ color: COLORS.dark }}>
              {document.fileName}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: COLORS.dark + "60" }}>
            {document.fileSize && (
              <span>Size: {document.fileSize}</span>
            )}
            {document.uploadedDate && (
              <span>
                Uploaded: {document.uploadedDate.toLocaleDateString()}
              </span>
            )}
            {document.reviewedDate && (
              <span>
                Reviewed: {document.reviewedDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Admin Notes */}
      {document.adminNotes && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <MessageSquare className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-sm text-yellow-800">
            <strong>Admin Notes:</strong> {document.adminNotes}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {document.status === "not_uploaded" && (
          <Button 
            size="sm" 
            onClick={() => onUpload(document.id)}
            style={{ backgroundColor: COLORS.primary }}
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
        )}
        
        {document.status === "rejected" && (
          <Button 
            size="sm" 
            onClick={() => onReupload(document.id)}
            style={{ backgroundColor: COLORS.primary }}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Re-upload
          </Button>
        )}

        {document.fileName && (
          <>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onView(document.id)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              variant="outline"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </>
        )}

        {document.status !== "approved" && document.fileName && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onDelete(document.id)}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function KYCStatusCard({ status }: { status: KYCStatus }) {
  const getOverallStatusColor = (overall: string) => {
    switch (overall) {
      case "approved": return "#10B981";
      case "rejected": return "#EF4444";
      case "under_review": return "#F59E0B";
      case "in_progress": return "#3B82F6";
      case "not_started": return "#6B7280";
      default: return COLORS.dark;
    }
  };

  const getOverallStatusText = (overall: string) => {
    switch (overall) {
      case "approved": return "Approved - Full Access Granted";
      case "rejected": return "Rejected - Action Required";
      case "under_review": return "Under Admin Review";
      case "in_progress": return "In Progress - Documents Required";
      case "not_started": return "Not Started";
      default: return "Unknown Status";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ 
            backgroundColor: getOverallStatusColor(status.overall) + "20",
            color: getOverallStatusColor(status.overall)
          }}
        >
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-serif font-semibold" style={{ color: COLORS.dark }}>
            KYC Verification Status
          </h3>
          <p className="text-sm mt-1" style={{ color: getOverallStatusColor(status.overall) }}>
            {getOverallStatusText(status.overall)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: COLORS.dark }}>
            Completion Progress
          </span>
          <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>
            {status.completionPercentage}%
          </span>
        </div>
        <Progress 
          value={status.completionPercentage} 
          className="h-3"
        />
      </div>

      {/* Timeline */}
      {(status.submittedDate || status.reviewedDate) && (
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-medium" style={{ color: COLORS.dark }}>
            Timeline
          </h4>
          <div className="space-y-2">
            {status.submittedDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" style={{ color: COLORS.dark + "60" }} />
                <span style={{ color: COLORS.dark + "80" }}>
                  Application submitted: {status.submittedDate.toLocaleDateString()}
                </span>
              </div>
            )}
            {status.reviewedDate && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} />
                <span style={{ color: COLORS.dark + "80" }}>
                  Reviewed: {status.reviewedDate.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {status.nextSteps && status.nextSteps.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3" style={{ color: COLORS.dark }}>
            Next Steps
          </h4>
          <div className="space-y-2">
            {status.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium mt-0.5"
                  style={{ 
                    backgroundColor: COLORS.primary + "20",
                    color: COLORS.primary
                  }}
                >
                  {index + 1}
                </div>
                <span className="text-sm" style={{ color: COLORS.dark + "80" }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Notes */}
      {status.adminNotes && (
        <Alert className="mt-4">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            <strong>Admin Message:</strong> {status.adminNotes}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}

export function KYCVerification() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [kycStatus, setKycStatus] = useState<KYCStatus>(mockKYCStatus);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);

  const handleUpload = (documentId: string) => {
    console.log("Upload document:", documentId);
    // Simulate file upload
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { 
            ...doc, 
            status: "uploaded", 
            fileName: `document_${Date.now()}.pdf`,
            fileSize: "2.1 MB",
            uploadedDate: new Date()
          }
        : doc
    ));
  };

  const handleDelete = (documentId: string) => {
    console.log("Delete document:", documentId);
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { 
            ...doc, 
            status: "not_uploaded", 
            fileName: undefined,
            fileSize: undefined,
            uploadedDate: undefined
          }
        : doc
    ));
  };

  const handleView = (documentId: string) => {
    console.log("View document:", documentId);
  };

  const handleReupload = (documentId: string) => {
    console.log("Re-upload document:", documentId);
    handleUpload(documentId);
  };

  const requiredDocuments = documents.filter(doc => doc.required);
  const optionalDocuments = documents.filter(doc => !doc.required);
  const approvedCount = documents.filter(doc => doc.status === "approved").length;
  const totalRequired = requiredDocuments.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.dark }}>
            KYC Verification
          </h2>
          <p className="text-sm mt-1" style={{ color: COLORS.dark + "80" }}>
            Complete your verification to unlock all platform features
          </p>
        </div>
        
        {kycStatus.overall !== "approved" && (
          <Button 
            className="gap-2"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Upload className="w-4 h-4" />
            Upload Documents
          </Button>
        )}
      </div>

      {/* Status Overview */}
      <KYCStatusCard status={kycStatus} />

      {/* Documents Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Required Documents */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-serif font-semibold" style={{ color: COLORS.dark }}>
              Required Documents
            </h3>
            <Badge 
              variant="outline"
              style={{ 
                borderColor: approvedCount === totalRequired ? "#10B981" : COLORS.primary,
                color: approvedCount === totalRequired ? "#10B981" : COLORS.primary
              }}
            >
              {approvedCount}/{totalRequired} Approved
            </Badge>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {requiredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onUpload={handleUpload}
                  onDelete={handleDelete}
                  onView={handleView}
                  onReupload={handleReupload}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Optional Documents */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-serif font-semibold" style={{ color: COLORS.dark }}>
              Optional Documents
            </h3>
            <Badge variant="outline" className="text-gray-600 border-gray-300">
              Optional
            </Badge>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {optionalDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onUpload={handleUpload}
                  onDelete={handleDelete}
                  onView={handleView}
                  onReupload={handleReupload}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Requirements Information */}
      <Card className="p-6">
        <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: COLORS.dark }}>
          Document Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2" style={{ color: COLORS.dark }}>
              Identity Documents
            </h4>
            <ul className="text-sm space-y-1" style={{ color: COLORS.dark + "80" }}>
              <li>• Government-issued photo ID (passport, driver's license)</li>
              <li>• Must be valid and not expired</li>
              <li>• Clear, high-resolution image</li>
              <li>• All corners visible</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2" style={{ color: COLORS.dark }}>
              Financial Documents
            </h4>
            <ul className="text-sm space-y-1" style={{ color: COLORS.dark + "80" }}>
              <li>• Bank statements (last 3 months)</li>
              <li>• Trading experience certification</li>
              <li>• Proof of income source</li>
              <li>• Professional qualifications (if applicable)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Support Contact */}
      <Alert>
        <MessageSquare className="w-4 h-4" />
        <AlertDescription>
          <strong>Need Help?</strong> If you have questions about the KYC process or need assistance with document upload, 
          please contact our support team at <strong>kyc@analystpro.com</strong> or use the chat support.
        </AlertDescription>
      </Alert>
    </div>
  );
}