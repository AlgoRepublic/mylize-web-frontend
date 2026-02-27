// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginCredentials {
  phone: string;
  password: string;
  platform?: string;
  type?: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  accountType: 'demo' | 'subscriber';
}

// KYC Information
export interface KYCInfo {
  fullName: string;
  dob: string;
  nationality: string;
  email: string;
  phone: string;
  phoneCode: string;
  governmentIdDoc: string;
  selfie: string;
  companyName: string;
  position: string;
  workEmail: string;
  certifications: string[];
  cv: string | null;
  linkedin: string | null;
}

// Notification Settings
export interface NotificationSettings {
  subscribersAndPackages: boolean;
  payoutsAndEarnings: boolean;
  signalsAndContent: boolean;
  consultations: boolean;
  generalPlatformUpdates: boolean;
}

// Analyst type matching the API response
export interface Analyst {
  _id: string;
  provider: string;
  phone: string;
  phoneCode: string;
  phoneVerified: boolean;
  email: string;
  name: string;
  avatarUrl: string | null;
  industryName: string | null;
  bio: string | null;
  rating: number;
  reviewCount: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  roi: number;
  pnl: number;
  sharpRatio: number;
  termsAndConditions: boolean;
  kycStatus: string;
  kyc: KYCInfo;
  notificationSettings: NotificationSettings;
  lastLoginAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  accessToken: string;
}

// Login API Response Structure
export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    analyst: Analyst;
  };
}

// User type for internal app usage (mapped from Analyst)
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  phoneCode: string;
  phoneVerified: boolean;
  avatarUrl: string | null;
  accountType: 'demo' | 'subscriber';
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'cancelled';
  role: 'user' | 'analyst' | 'admin';
  isEmailVerified: boolean;
  isDemoApproved: boolean;
  lastLogin?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // Additional fields from Analyst
  bio?: string | null;
  rating?: number;
  reviewCount?: number;
  kycStatus?: string;
  accessToken?: string;
}

// Auth Response (mapped from API response)
export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken?: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface LogoutPayload {
  fcmToken?: string;
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

// Referral API – raw response shapes (backend may use _id, camelCase, etc.)
export interface ReferralOwnerApi {
  _id: string;
  fullName?: string;
  name?: string;
  email: string;
  phone?: string;
  phoneCode?: string;
  paymentMethod: string;
  bankAccount?: string;
  paymentDetails?: string;
  isActive?: boolean;
  createdAt?: string;
  owedAmount?: number;
  totalPaid?: number;
  [key: string]: unknown;
}

export interface ReferralCodeApi {
  _id: string;
  code?: string;
  codeName?: string;
  name?: string;
  description?: string;
  referralOwner?: string;
  ownerId?: string;
  ownerName?: string;
  commissionRate?: number;
  maxUsage?: number;
  isActive?: boolean;
  createdAt?: string;
  expiresAt?: string;
  usageCount?: number;
  totalEarnings?: number;
  [key: string]: unknown;
}

export interface ReferralOwedApi {
  _id: string;
  referralOwner?: string;
  ownerId?: string;
  ownerName?: string;
  amount?: number;
  description?: string;
  notes?: string;
  createdAt?: string;
  date?: string;
  [key: string]: unknown;
}

export interface ReferralTransferApi {
  _id: string;
  referralOwner?: string;
  ownerId?: string;
  ownerName?: string;
  amount?: number;
  transactionNumber?: string;
  transferDate?: string;
  notes?: string;
  [key: string]: unknown;
}
