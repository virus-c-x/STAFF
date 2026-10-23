import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminRole, AdminUser } from '../types/admin';
import {
  getCurrentAdminSession,
  signInWithEmailPassword,
  signInWithGoogleOAuth,
  signOutAdmin,
} from '../lib/supabase';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<{ error?: string }>;
  loginWithPassword: (email: string, pass: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  hasRole: (required: AdminRole | AdminRole[]) => boolean;
  refreshAdminUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentAdminSession();
      setAdminUser(user);
    } catch (err) {
      console.warn('Failed checking admin session:', err);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const loginWithGoogle = async (): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const res = await signInWithGoogleOAuth();
      if (res.error) {
        setIsLoading(false);
        return { error: res.error };
      }
      await checkSession();
      return {};
    } catch (err) {
      setIsLoading(false);
      return { error: (err as Error).message };
    }
  };

  const loginWithPassword = async (email: string, pass: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const res = await signInWithEmailPassword(email, pass);
      if (res.error) {
        setIsLoading(false);
        return { error: res.error };
      }
      if (res.user) {
        setAdminUser(res.user);
      }
      setIsLoading(false);
      return {};
    } catch (err) {
      setIsLoading(false);
      return { error: (err as Error).message };
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await signOutAdmin();
    setAdminUser(null);
    setIsLoading(false);
  };

  const hasRole = (required: AdminRole | AdminRole[]): boolean => {
    if (!adminUser) return false;
    if (adminUser.role === 'owner') return true; // Owner has all permissions
    if (Array.isArray(required)) {
      return required.includes(adminUser.role);
    }
    return adminUser.role === required;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isLoading,
        loginWithGoogle,
        loginWithPassword,
        logout,
        hasRole,
        refreshAdminUser: checkSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
