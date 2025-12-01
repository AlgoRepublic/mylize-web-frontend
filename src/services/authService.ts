import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  accountType: 'demo' | 'subscriber';
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  accountType: 'demo' | 'subscriber';
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'cancelled';
  role: 'user' | 'analyst' | 'admin';
  isEmailVerified: boolean;
  isDemoApproved: boolean;
  lastLogin?: Date;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

class AuthService {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<{ success: boolean; user: User }>('/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  }

  // Update user details
  async updateDetails(data: { fullName?: string; email?: string }): Promise<User> {
    try {
      const response = await api.put<{ success: boolean; user: User }>('/auth/updatedetails', data);
      return response.data.user;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update details' };
    }
  }

  // Update password
  async updatePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await api.put<AuthResponse>('/auth/updatepassword', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update password' };
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/forgotpassword', { email });
      return { message: response.data.message };
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to send reset email' };
    }
  }

  // Reset password
  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.put<AuthResponse>(`/auth/resetpassword/${token}`, { password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  }

  // Check if user is authenticated (check cookie exists)
  isAuthenticated(): boolean {
    // This is a simple check - the backend will validate the actual token
    return document.cookie.includes('token=');
  }
}

export default new AuthService();
