import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../features/contracts/hooks/useAuth";
import { GoogleButton } from "./GoogleButton";
import { AuthErrorBanner } from "./AuthErrorBanner";
import { PasswordInput } from "./PasswordInput";

export const SignupForm = () => {
  const navigate = useNavigate();
  const { registerWithEmail, loginWithGoogle, loading, error, clearError } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError ?? error;

  const dismissError = () => { setLocalError(null); clearError(); };

  const handleChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    dismissError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password.length < 6) { setLocalError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setLocalError("Passwords do not match."); return; }
    const success = await registerWithEmail(email, password, name);
    if (success) navigate("/dashboard", { replace: true });
  };

  const handleGoogleSignup = async () => {
    const success = await loginWithGoogle();
    if (success) navigate("/dashboard", { replace: true });
  };

  const inputClass =
    "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-white">Create your account</h1>
        <p className="text-slate-400 text-sm">Start getting paid safely today</p>
      </div>

      <AuthErrorBanner message={displayError} onDismiss={dismissError} />

      <GoogleButton onClick={handleGoogleSignup} loading={loading} label="Sign up with Google" />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-slate-600 text-xs">or sign up with email</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => handleChange(setName)(e.target.value)}
            placeholder="Jane Smith"
            autoComplete="name"
            required
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => handleChange(setEmail)(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            required
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Password
          </label>
          <PasswordInput
            id="signup-password"
            value={password}
            onChange={handleChange(setPassword)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-confirm" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Confirm password
          </label>
          <PasswordInput
            id="signup-confirm"
            value={confirmPassword}
            onChange={handleChange(setConfirmPassword)}
            placeholder="Repeat your password"
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password || !name || !confirmPassword}
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
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="text-center text-slate-600 text-xs">
          By creating an account you agree to our{" "}
          <a href="#" className="text-slate-400 hover:text-slate-300 underline underline-offset-2">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-slate-400 hover:text-slate-300 underline underline-offset-2">Privacy Policy</a>.
        </p>
      </form>

      <p className="text-center text-slate-500 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-accent hover:text-indigo-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};