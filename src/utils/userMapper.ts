import type { Analyst, User, LoginApiResponse } from '../types/api.types';

/**
 * Maps API Analyst response to internal User type
 */
export function mapAnalystToUser(analyst: Analyst): User {
  return {
    id: analyst._id,
    fullName: analyst.name,
    email: analyst.email,
    phone: analyst.phone,
    phoneCode: analyst.phoneCode,
    phoneVerified: analyst.phoneVerified,
    avatarUrl: analyst.avatarUrl,
    accountType: 'subscriber', // Default, adjust based on your business logic
    subscriptionStatus: 'active', // Default, adjust based on your business logic
    role: 'analyst',
    isEmailVerified: analyst.email ? true : false, // Adjust based on your verification logic
    isDemoApproved: true, // Adjust based on your business logic
    lastLogin: analyst.lastLoginAt,
    createdAt: analyst.createdAt,
    updatedAt: analyst.updatedAt,
    // Additional fields
    bio: analyst.bio,
    rating: analyst.rating,
    reviewCount: analyst.reviewCount,
    kycStatus: analyst.kycStatus,
    accessToken: analyst.accessToken,
  };
}

/**
 * Maps Login API Response to AuthResponse
 */
export function mapLoginResponse(response: LoginApiResponse): { user: User; accessToken: string } {
  const user = mapAnalystToUser(response.data.analyst);
  return {
    user,
    accessToken: response.data.analyst.accessToken,
  };
}
