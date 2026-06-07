import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="min-h-screen bg-slate-950 flex flex-col">
    <header className="flex-shrink-0 px-6 py-5">
      <Link to="/" className="inline-flex items-center gap-2.5">
        <div className="w-8 h-8 bg-brand-accent rounded-xl flex items-center justify-center">
          <span className="text-white font-display font-bold text-xs">PS</span>
        </div>
        <span className="font-display font-bold text-white text-base">PaidSafe</span>
      </Link>
    </header>

    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-7 sm:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.4)] animate-fade-up">
        {children}
      </div>
    </main>

    <footer className="flex-shrink-0 px-6 py-5 text-center">
      <p className="text-slate-700 text-xs">
        © {new Date().getFullYear()} PaidSafe, Inc. All rights reserved.
      </p>
    </footer>
  </div>
);