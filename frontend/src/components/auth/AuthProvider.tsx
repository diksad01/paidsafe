import { useEffect, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { subscribeToAuthChanges } from "../../lib/firebase";
import { useAuthStore } from "../../store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user: User | null) => {
      setUser(user);
      setInitialized(true);
    });
    return unsubscribe;
  }, [setUser, setInitialized]);

  return <>{children}</>;
};