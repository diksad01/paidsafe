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
    "w-full bg-[#0F0F13] border border-[#2A2A3A] text-[#F0F0FF] placeholder-[#8888AA] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition duration-200 disabled:bg-[#1A1A24] disabled:text-[#8888AA] disabled:cursor-not-allowed";

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-[#F0F0FF]">Create your account</h1>
        <p className="text-[#8888AA] text-sm">Start getting paid safely today</p>
      </div>

      <AuthErrorBanner message={displayError} onDismiss={dismissError} />

      <GoogleButton onClick={handleGoogleSignup} loading={loading} label="Sign up with Google" />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#2A2A3A]" />
        <span className="text-[#8888AA]/60 text-xs">or sign up with email</span>
        <div className="flex-1 h-px bg-[#2A2A3A]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="signup-name" className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wide">
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
          <label htmlFor="signup-email" className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wide">
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
          <label htmlFor="signup-password" className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wide">
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
          <label htmlFor="signup-confirm" className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wide">
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
          className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] hover:shadow-[0_0_25px_rgba(108,99,255,0.5)] disabled:bg-[#6C63FF]/30 disabled:text-[#8888AA] disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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

        <p className="text-center text-[#8888AA]/50 text-xs">
          By creating an account you agree to our{" "}
          <a href="#" className="text-[#8888AA] hover:text-[#F0F0FF] underline underline-offset-2">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-[#8888AA] hover:text-[#F0F0FF] underline underline-offset-2">Privacy Policy</a>.
        </p>
      </form>

      <p className="text-center text-[#8888AA] text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-[#6C63FF] hover:text-[#5A52E0] font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};