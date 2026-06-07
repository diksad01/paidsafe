import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { User } from "firebase/auth";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearUser: () => void;
}

const serializeUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        loading: true,
        initialized: false,

        setUser: (user) =>
          set(
            { user: user ? serializeUser(user) : null, loading: false },
            false,
            "auth/setUser"
          ),

        setLoading: (loading) =>
          set({ loading }, false, "auth/setLoading"),

        setInitialized: (initialized) =>
          set({ initialized, loading: false }, false, "auth/setInitialized"),

        clearUser: () =>
          set({ user: null, loading: false }, false, "auth/clearUser"),
      }),
      {
        name: "paidsafe-auth",
        partialize: (state) => ({ user: state.user }),
      }
    ),
    { name: "AuthStore" }
  )
);

export type { AuthUser, AuthState };