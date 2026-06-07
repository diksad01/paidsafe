import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const FullPageSpinner = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-brand-accent rounded-full animate-spin" />
      <p className="text-brand-text-secondary text-sm font-medium">Loading...</p>
    </div>
  </div>
);

export const ProtectedRoute = () => {
  const { user, initialized } = useAuthStore();
  const location = useLocation();

  if (!initialized) return <FullPageSpinner />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};