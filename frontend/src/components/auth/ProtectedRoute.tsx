import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const FullPageSpinner = () => (
  <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-[#2A2A3A] border-t-[#6C63FF] rounded-full animate-spin" />
      <p className="text-[#8888AA] text-sm font-medium">Loading...</p>
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