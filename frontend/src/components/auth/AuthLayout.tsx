import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="min-h-screen bg-[#0F0F13] bg-[radial-gradient(#2A2A3A_1px,transparent_1px)] [background-size:24px_24px] flex flex-col">
    <header className="flex-shrink-0 px-6 py-5">
      <Link to="/" className="inline-flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-tr from-[#6C63FF] to-[#4FFFB0] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(108,99,255,0.3)]">
          <span className="text-[#0F0F13] font-display font-black text-xs">PS</span>
        </div>
        <span className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#4FFFB0] text-base">PaidSafe</span>
      </Link>
    </header>

    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#1A1A24] border border-[#2A2A3A] rounded-2xl p-7 sm:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.6)] hover:border-[#6C63FF]/30 transition-all duration-300">
        {children}
      </div>
    </main>

    <footer className="flex-shrink-0 px-6 py-5 text-center">
      <p className="text-[#8888AA]/50 text-xs">
        © {new Date().getFullYear()} PaidSafe, Inc. All rights reserved.
      </p>
    </footer>
  </div>
);