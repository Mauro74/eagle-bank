import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CreditCard, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils";
import Logo from "../../assets/eagle_bank_logo.png";
import LogoMobile from "../../assets/eagle_bank_logo_small.png";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: CreditCard },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function RootLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* ── Desktop sidebar ──────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-brand-800 text-white">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-brand-700">
          <img src={Logo} className="w-32 mx-auto" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gold-500/20 text-gold-200"
                    : "text-brand-300 hover:bg-brand-900 hover:text-white",
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-brand-700 space-y-0.5">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-brand-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-300 hover:bg-brand-900 hover:text-white transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b bg-brand-800 text-white shrink-0">
          <img src={LogoMobile} className="w-28" />
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="p-2 text-brand-300 hover:text-white transition-colors"
          >
            <LogOut className="size-5" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile bottom tab bar ─────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-10 flex border-t bg-white">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            <Icon className="size-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
