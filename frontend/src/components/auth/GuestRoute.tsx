import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const FullPageSpinner = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-slate-800 border-t-brand-accent rounded-full animate-spin" />
  </div>
);

export const GuestRoute = () => {
  const { user, initialized } = useAuthStore();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/dashboard";

  if (!initialized) return <FullPageSpinner />;

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};