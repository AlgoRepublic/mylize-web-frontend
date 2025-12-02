import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import authService, { User, LoginCredentials, RegisterData } from '../services/authService';
import { toast } from 'sonner';

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
const DEMO_MODE = true;

// Fake user used when DEMO_MODE is enabled
const DEMO_USER: User = {
  id: 'demo-user-id',
  fullName: 'Demo Analyst',
  email: 'demo@example.com',
  accountType: 'demo',
  subscriptionStatus: 'active',
  role: 'analyst',
  isEmailVerified: true,
  isDemoApproved: true,
  lastLogin: new Date()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);

  // Load user on mount - memoized to prevent infinite loops
  const loadUser = useCallback(async () => {
    // In demo mode, skip backend and immediately set a fake user
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    // Prevent multiple simultaneous calls
    if (loadingRef.current) {
      return;
    }

    try {
      loadingRef.current = true;
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // User not authenticated or token expired
      setUser(null);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Demo mode: pretend login succeeded without hitting backend
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      toast.success('Demo mode: logged in (no backend call)');
      return;
    }

    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      toast.success('Welcome back to your analyst dashboard!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    // Demo mode: pretend registration succeeded without hitting backend
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      toast.success('Demo mode: registration successful (no backend call)');
      return;
    }

    try {
      const response = await authService.register(data);
      setUser(response.user);
      
      if (data.accountType === 'demo') {
        toast.success("Demo access requested! You'll receive access within 24 hours.");
      } else {
        toast.success("Welcome to Forex Analyst! Let's set up your dashboard.");
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    // Demo mode: just clear local user
    if (DEMO_MODE) {
      setUser(null);
      toast.success('Demo mode: logged out');
      return;
    }

    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (data: { fullName?: string; email?: string }) => {
    // Demo mode: update user locally only
    if (DEMO_MODE) {
      setUser((prev) => (prev ? { ...prev, ...data } as User : DEMO_USER));
      toast.success('Demo mode: profile updated (no backend call)');
      return;
    }

    try {
      const updatedUser = await authService.updateDetails(data);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
      throw error;
    }
  }, []);

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
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      loadingRef.current = false;
    }
  }, []);

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
