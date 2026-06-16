import { Link, useLocation, Form } from "react-router";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import {
  LayoutDashboard,
  ShieldCheck,
  Calculator,
  TrendingUp,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  User,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transaction Screening",
    href: "/dashboard/transactions",
    icon: ShieldCheck,
  },
  {
    label: "Zakat Calculator",
    href: "/dashboard/zakat",
    icon: Calculator,
  },
  {
    label: "Halal Investment Screener",
    href: "/dashboard/investments",
    icon: TrendingUp,
  },
  {
    label: "Shariah Audit",
    href: "/dashboard/audit",
    icon: ClipboardList,
  },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const { config, loading } = useConfigurables();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const appName = loading ? "AZHAR" : (config?.appName ?? "AZHAR");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F8F6F1" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col w-60 transition-transform duration-300
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ background: "#0F3D2A" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "#1A4A30" }}>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-base flex-shrink-0"
            style={{ background: "#C9A84C" }}
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base truncate" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
              {appName}
            </p>
            <p className="text-xs truncate" style={{ color: "rgba(248,246,241,0.5)" }}>
              Shariah Finance Platform
            </p>
          </div>
          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href ||
              (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`sidebar-nav-link ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} style={{ color: "#C9A84C" }} />}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "#1A4A30" }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ background: "#C9A84C", color: "#0F3D2A" }}
            >
              {user?.username?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.username ?? "User"}</p>
              <p className="text-xs truncate" style={{ color: "rgba(248,246,241,0.5)" }}>
                {user?.role === "admin" ? "Shariah Admin" : "Compliance Officer"}
              </p>
            </div>
          </div>
          <Form action="/auth/logout" method="post">
            <button
              type="submit"
              className="sidebar-nav-link w-full"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </Form>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header
          className="h-14 flex items-center gap-4 px-4 lg:px-6 border-b bg-white flex-shrink-0"
          style={{ borderColor: "#E8E4DC" }}
        >
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} style={{ color: "#1A1A2E" }} />
          </button>

          {/* Breadcrumb / page title */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "#5A6B7B" }}>
              {NAV_ITEMS.find((i) =>
                location.pathname === i.href ||
                (i.href !== "/dashboard" && location.pathname.startsWith(i.href))
              )?.label ?? "Dashboard"}
            </p>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              title="Notifications"
            >
              <Bell size={18} style={{ color: "#5A6B7B" }} />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ background: "#1A6B4A", color: "white" }}
            >
              {user?.username?.charAt(0)?.toUpperCase() ?? <User size={14} />}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
