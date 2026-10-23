import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AdminRole, AdminUser } from '../types/admin';
import {
  getCurrentAdminSession,
  getSupabaseClient,
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

  const checkSession = useCallback(async (): Promise<void> => {
    try {
      const user = await getCurrentAdminSession();
      setAdminUser(user);
    } catch (err) {
      console.warn('Failed checking admin session:', err);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialCheck = async () => {
      try {
        const user = await getCurrentAdminSession();
        if (mounted) setAdminUser(user);
      } catch (err) {
        console.warn('Failed checking admin session:', err);
        if (mounted) setAdminUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void initialCheck();

    // Supabase processes the OAuth callback and emits SIGNED_IN after the
    // browser returns from Google. Re-check the allowlist when auth changes.
    const client = getSupabaseClient();
    const { data: authListener } = client
      ? client.auth.onAuthStateChange((event) => {
          if (
            event === 'SIGNED_IN' ||
            event === 'SIGNED_OUT' ||
            event === 'USER_UPDATED' ||
            event === 'TOKEN_REFRESHED'
          ) {
            // Defer the session read until Supabase's auth callback finishes.
            Promise.resolve().then(async () => {
              if (!mounted) return;
              try {
                const user = await getCurrentAdminSession();
                if (mounted) setAdminUser(user);
              } catch (err) {
                console.warn('Failed refreshing admin session:', err);
                if (mounted) setAdminUser(null);
              } finally {
                if (mounted) setIsLoading(false);
              }
            });
          }
        })
      : { data: { subscription: null } };

    return () => {
      mounted = false;
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async (): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogleOAuth();
      if (result.error) {
        setIsLoading(false);
        return { error: result.error };
      }
      // OAuth normally navigates away immediately. Do not claim a user is
      // authenticated here; the auth-state listener validates after callback.
      return {};
    } catch (err) {
      setIsLoading(false);
      return { error: (err as Error).message || 'Google sign-in failed.' };
    }
  };

  const loginWithPassword = async (
    email: string,
    pass: string
  ): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const result = await signInWithEmailPassword(email, pass);
      if (result.error) {
        setAdminUser(null);
        setIsLoading(false);
        return { error: result.error };
      }

      if (!result.user) {
        setAdminUser(null);
        setIsLoading(false);
        return { error: 'Sign-in did not return an authorized administrator.' };
      }

      setAdminUser(result.user);
      setIsLoading(false);
      return {};
    } catch (err) {
      setAdminUser(null);
      setIsLoading(false);
      return { error: (err as Error).message || 'Password sign-in failed.' };
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOutAdmin();
    } finally {
      setAdminUser(null);
      setIsLoading(false);
    }
  };

  const hasRole = (required: AdminRole | AdminRole[]): boolean => {
    if (!adminUser || !adminUser.is_active) return false;
    if (adminUser.role === 'owner') return true;
    return Array.isArray(required)
      ? required.includes(adminUser.role)
      : adminUser.role === required;
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
