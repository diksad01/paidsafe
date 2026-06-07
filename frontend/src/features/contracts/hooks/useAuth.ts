import { useState, useCallback } from "react";
import { type AuthError } from "firebase/auth";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  parseAuthError,
} from "../../../lib/firebase";
import { useAuthStore } from "../../../store/authStore";

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  clearError: () => void;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, clearUser } = useAuthStore();

  const clearError = useCallback(() => setError(null), []);

  const handleAuthError = useCallback((err: unknown) => {
    const message = parseAuthError(err as AuthError);
    setError(message);
    return false;
  }, []);

  const registerWithEmail = useCallback(
    async (email: string, password: string, displayName: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        const user = await signUpWithEmail(email, password, displayName);
        setUser(user);
        return true;
      } catch (err) {
        return handleAuthError(err);
      } finally {
        setLoading(false);
      }
    },
    [setUser, handleAuthError]
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        const user = await signInWithEmail(email, password);
        setUser(user);
        return true;
      } catch (err) {
        return handleAuthError(err);
      } finally {
        setLoading(false);
      }
    },
    [setUser, handleAuthError]
  );

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const user = await signInWithGoogle();
      setUser(user);
      return true;
    } catch (err) {
      return handleAuthError(err);
    } finally {
      setLoading(false);
    }
  }, [setUser, handleAuthError]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await signOutUser();
      clearUser();
    } finally {
      setLoading(false);
    }
  }, [clearUser]);

  return {
    loading,
    error,
    clearError,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
  };
};