import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  type AuthError,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });
  return user;
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const signInWithGoogle = async (): Promise<User> => {
  const { user } = await signInWithPopup(auth, googleProvider);
  return user;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export const parseAuthError = (error: AuthError): string => {
  console.error("[auth] Firebase error:", error.code, error.message);
  const map: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please wait a few minutes.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
    "auth/cancelled-popup-request": "Sign-in was cancelled.",
    "auth/popup-blocked": "Pop-up was blocked by your browser. Please allow pop-ups for this site.",
    "auth/network-request-failed": "Network error. Please check your connection.",
    "auth/operation-not-allowed": "This sign-in method is not enabled. Please contact support.",
    "auth/unauthorized-domain": "This domain is not authorised for sign-in. Please contact support.",
    "auth/internal-error": "An internal error occurred. Please try again.",
    "auth/missing-email": "Please enter your email address.",
    "auth/missing-password": "Please enter your password.",
  };
  return map[error.code] ?? `Sign-in failed (${error.code ?? "unknown"}). Please try again.`;
};

export type { User, AuthError };