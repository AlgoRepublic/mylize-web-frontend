import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateUserDetailsMutation,
} from '../store/api/authApi';
import type { User, LoginCredentials, RegisterData } from '../types/api.types';
import { mapLoginResponse } from '../utils/userMapper';
import { getFcmToken, getCachedFcmToken, clearCachedFcmToken } from '../services/fcm';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: { fullName?: string; email?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mode configuration (frontend-only, no backend API calls)
// Set to false when you want to use real backend auth.
const DEMO_MODE = false;

// Fake user used when DEMO_MODE is enabled
const DEMO_USER: User = {
  id: 'demo-user-id',
  fullName: 'Demo Analyst',
  email: 'demo@example.com',
  phone: '+1234567890',
  phoneCode: '+1',
  phoneVerified: true,
  avatarUrl: null,
  accountType: 'demo',
  subscriptionStatus: 'active',
  role: 'analyst',
  isEmailVerified: true,
  isDemoApproved: true,
  lastLogin: new Date()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to restore user from localStorage on initialization
  const getStoredUser = (): User | null => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user');
    }
    return null;
  };

  const [user, setUser] = useState<User | null>(getStoredUser());
  const loadingRef = useRef(false);

  // RTK Query hooks
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [updateUserMutation, { isLoading: isUpdatingUser }] = useUpdateUserDetailsMutation();
  const [getCurrentUser, { isLoading: isLoadingUser, isFetching: isFetchingUser }] = useLazyGetCurrentUserQuery();

  // We only have accessToken (no refresh token, no separate /auth/info required).
  // Skip initial getCurrentUser so we don't call /auth/info on load; rely on user + accessToken from localStorage.
  const { data: currentUserData } = useGetCurrentUserQuery(undefined, {
    skip: true, // Rely on localStorage; login response provides analyst + accessToken
    refetchOnMountOrArgChange: false,
  });

  // Sync RTK Query user data with local state (only when explicitly refetched, e.g. refreshUser)
  useEffect(() => {
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      return;
    }

    if (currentUserData) {
      setUser(currentUserData);
      localStorage.setItem('user', JSON.stringify(currentUserData));
    }
  }, [currentUserData]);

  const loading = DEMO_MODE ? false : (isLoggingIn || isRegistering || isUpdatingUser || isLoadingUser || isFetchingUser);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Demo mode: pretend login succeeded without hitting backend
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      toast.success('Demo mode: logged in (no backend call)');
      return;
    }

    try {
      const response = await loginMutation(credentials).unwrap();
      // Map the API response to User type
      const { user, accessToken } = mapLoginResponse(response);
      
      // Store access token in localStorage
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      
      // Store user details in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      // Request FCM token in background so it's available for logout
      getFcmToken().catch(() => {});
      toast.success(response.message || 'Welcome back to your analyst dashboard!');
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  }, [loginMutation]);

  const register = useCallback(async (data: RegisterData) => {
    // Demo mode: pretend registration succeeded without hitting backend
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      localStorage.setItem('user', JSON.stringify(DEMO_USER));
      toast.success('Demo mode: registration successful (no backend call)');
      return;
    }

    try {
      const response = await registerMutation(data).unwrap();
      setUser(response.user);
      
      // Store user details in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Store access token if available
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
      
      if (data.accountType === 'demo') {
        toast.success("Demo access requested! You'll receive access within 24 hours.");
      } else {
        toast.success("Welcome to Forex Analyst! Let's set up your dashboard.");
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  }, [registerMutation]);

  const logout = useCallback(async () => {
    // Demo mode: just clear local user
    if (DEMO_MODE) {
      setUser(null);
      // Clear stored auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      toast.success('Demo mode: logged out');
      return;
    }

    try {
      const fcmToken = getCachedFcmToken() ?? (await getFcmToken()) ?? undefined;
      await logoutMutation({ fcmToken }).unwrap();
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      clearCachedFcmToken();
      toast.success('Logged out successfully');
    } catch (error: any) {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      clearCachedFcmToken();
      const errorMessage = error?.data?.message || error?.message || 'Logout failed';
      toast.error(errorMessage);
      throw error;
    }
  }, [logoutMutation]);

  const updateUser = useCallback(async (data: { fullName?: string; email?: string }) => {
    // Demo mode: update user locally only
    if (DEMO_MODE) {
      const updatedUser = { ...DEMO_USER, ...data } as User;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Demo mode: profile updated (no backend call)');
      return;
    }

    try {
      const updatedUser = await updateUserMutation(data).unwrap();
      setUser(updatedUser);
      // Update localStorage with updated user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Update failed';
      toast.error(errorMessage);
      throw error;
    }
  }, [updateUserMutation]);

  const refreshUser = useCallback(async () => {
    // Demo mode: keep using the fake user without backend
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      return;
    }

    // Prevent multiple simultaneous calls
    if (loadingRef.current) {
      return;
    }

    try {
      loadingRef.current = true;
      const userData = await getCurrentUser().unwrap();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      loadingRef.current = false;
    }
  }, [getCurrentUser]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  }), [user, loading, login, register, logout, updateUser, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
