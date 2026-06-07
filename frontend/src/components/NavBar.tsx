import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../features/contracts/hooks/useAuth";

const NavBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/contract/new", label: "New Contract" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <nav className="bg-[#0F0F13]/80 backdrop-blur-md border-b border-[#2A2A3A] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#6C63FF] to-[#4FFFB0] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">PS</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#4FFFB0]">
              PaidSafe
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 h-full">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 h-full flex items-center text-sm font-medium transition-all duration-200 relative ${
                  pathname === link.to
                    ? "text-[#F0F0FF]"
                    : "text-[#8888AA] hover:text-[#F0F0FF]"
                }`}
              >
                {link.label}
                {pathname === link.to && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#6C63FF] to-[#4FFFB0] shadow-[0_0_10px_rgba(108,99,255,0.8)]" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 bg-[#6C63FF]/20 border border-[#6C63FF]/30 rounded-lg flex items-center justify-center">
                  <span className="text-[#6C63FF] text-xs font-bold">{initials}</span>
                </div>
                <span className="text-[#8888AA] text-xs max-w-[120px] truncate">
                  {user.displayName ?? user.email}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-[#8888AA] hover:text-[#F0F0FF] transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="sm:hidden flex gap-2 pb-3 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors relative ${
                pathname === link.to
                  ? "text-[#F0F0FF] bg-[#1A1A24] border border-[#2A2A3A]"
                  : "text-[#8888AA] hover:text-[#F0F0FF]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;