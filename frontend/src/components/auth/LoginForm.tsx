import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../features/contracts/hooks/useAuth";
import { GoogleButton } from "./GoogleButton";
import { AuthErrorBanner } from "./AuthErrorBanner";
import { PasswordInput } from "./PasswordInput";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";

  const { loginWithEmail, loginWithGoogle, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginWithEmail(email, password);
    if (success) navigate(from, { replace: true });
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) navigate(from, { replace: true });
  };

  const inputClass =
    "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-slate-400 text-sm">Sign in to your PaidSafe account</p>
      </div>

      <AuthErrorBanner message={error} onDismiss={clearError} />

      <GoogleButton onClick={handleGoogleLogin} loading={loading} />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-slate-600 text-xs">or continue with email</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError(); }}
            placeholder="you@company.com"
            autoComplete="email"
            required
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Password
            </label>
            <a href="#" className="text-xs text-brand-accent hover:text-indigo-300 transition-colors">
              Forgot password?
            </a>
          </div>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(v) => { setPassword(v); clearError(); }}
            autoComplete="current-password"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold text-sm
                     py-2.5 rounded-xl transition-all duration-150 shadow-btn hover:shadow-btn-hover
                     hover:-translate-y-px active:translate-y-0
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
                     focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="text-center text-slate-500 text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="text-brand-accent hover:text-indigo-300 font-medium transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  );
};