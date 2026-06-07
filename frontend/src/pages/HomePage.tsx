import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const HomePage = () => {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#0F0F13] bg-[radial-gradient(#2A2A3A_1px,transparent_1px)] [background-size:24px_24px] text-[#F0F0FF] flex flex-col justify-between">
      <header className="bg-[#1A1A24]/85 backdrop-blur-md sticky top-0 z-50 border-b border-[#2A2A3A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#6C63FF] to-[#4FFFB0] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(108,99,255,0.3)]">
              <span className="text-[#0F0F13] font-display font-black text-xs">PS</span>
            </div>
            <span className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#4FFFB0] text-lg">
              PaidSafe
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="text-[#8888AA] hover:text-[#F0F0FF] text-sm font-medium transition-colors"
            >
              {isLoggedIn ? "Dashboard" : "Sign in"}
            </Link>
            <Link
              to={isLoggedIn ? "/dashboard" : "/login?signup=true"}
              className="bg-[#6C63FF] hover:bg-[#5A52E0] hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="pt-24 pb-20 px-4 sm:px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 bg-[#1A1A24] border border-[#2A2A3A] rounded-full px-4.5 py-1.5 mb-8 hover:border-[#6C63FF]/30 transition duration-200 shadow-xl">
            <span className="w-2 h-2 bg-[#4FFFB0] rounded-full animate-pulse"></span>
            <span className="text-[#8888AA] text-xs font-semibold tracking-wide">
              Secure escrow for freelancers & clients
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-[#F0F0FF] leading-tight mb-6 tracking-tight">
            Get paid.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#4FFFB0]">
              Stay protected.
            </span>
          </h1>
          <p className="text-[#8888AA] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            PaidSafe holds funds securely in escrow until work is delivered and approved.
            Eliminate late payments and transaction disputes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isLoggedIn ? "/contract/new" : "/login"}
              className="w-full sm:w-auto bg-[#6C63FF] hover:bg-[#5A52E0] hover:shadow-[0_0_25px_rgba(108,99,255,0.5)] text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 cursor-pointer"
            >
              Create a contract
            </Link>
            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="w-full sm:w-auto bg-[#1A1A24] hover:bg-[#2A2A3A] border border-[#2A2A3A] hover:text-[#F0F0FF] text-[#8888AA] font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 cursor-pointer"
            >
              View dashboard
            </Link>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 bg-[#0F0F13]/55 border-t border-b border-[#2A2A3A]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F0FF] text-center mb-16 tracking-tight">
              How PaidSafe works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create a contract",
                  desc: "Define the scope, milestones, and payment terms with your client in a few clicks.",
                },
                {
                  step: "02",
                  title: "Funds in escrow",
                  desc: "The client deposits payment securely into escrow before any work begins.",
                },
                {
                  step: "03",
                  title: "Release on approval",
                  desc: "Once milestones are accepted, funds are instantly released to you.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-[#1A1A24] border border-[#2A2A3A] hover:border-[#6C63FF]/30 rounded-2xl p-8 hover:shadow-[0_0_25px_rgba(108,99,255,0.1)] transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6C63FF] to-[#4FFFB0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  <span className="text-[#4FFFB0] font-black text-sm uppercase tracking-widest">{item.step}</span>
                  <h3 className="text-[#F0F0FF] font-bold text-lg mt-3 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#8888AA] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0F0F13] border-t border-[#2A2A3A] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-tr from-[#6C63FF] to-[#4FFFB0] rounded-lg flex items-center justify-center">
              <span className="text-[#0F0F13] font-bold text-xs">PS</span>
            </div>
            <span className="text-[#8888AA] text-sm font-semibold">PaidSafe</span>
          </div>
          <p className="text-[#8888AA]/40 text-xs">
            © {new Date().getFullYear()} PaidSafe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;