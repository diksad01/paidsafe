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
    "w-full bg-[#0F0F13] border border-[#2A2A3A] text-[#F0F0FF] placeholder-[#8888AA] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition duration-200 disabled:bg-[#1A1A24] disabled:text-[#8888AA] disabled:cursor-not-allowed";

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-[#F0F0FF]">Welcome back</h1>
        <p className="text-[#8888AA] text-sm">Sign in to your PaidSafe account</p>
      </div>

      <AuthErrorBanner message={error} onDismiss={clearError} />

      <GoogleButton onClick={handleGoogleLogin} loading={loading} />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#2A2A3A]" />
        <span className="text-[#8888AA]/60 text-xs">or continue with email</span>
        <div className="flex-1 h-px bg-[#2A2A3A]" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wide">
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
            <label htmlFor="login-password" className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wide">
              Password
            </label>
            <a href="#" className="text-xs text-[#6C63FF] hover:text-[#5A52E0] transition-colors">
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
          className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] hover:shadow-[0_0_25px_rgba(108,99,255,0.5)] disabled:bg-[#6C63FF]/30 disabled:text-[#8888AA] disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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

      <p className="text-center text-[#8888AA] text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="text-[#6C63FF] hover:text-[#5A52E0] font-medium transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  );
};