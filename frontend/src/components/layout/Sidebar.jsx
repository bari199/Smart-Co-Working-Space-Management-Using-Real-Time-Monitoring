import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Bell,
  UserRound,
  Search,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/authContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      label: "Overview",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Bookings",
      to: "/dashboard/bookings",
      icon: CalendarDays,
    },
    {
      label: "My Inquiries",
      to: "/dashboard/inquiries",
      icon: MessageSquare,
    },
    {
      label: "Notifications",
      to: "/dashboard/notifications",
      icon: Bell,
    },
  ];

  const accountItems = [
    {
      label: "Profile",
      to: "/dashboard/profile",
      icon: UserRound,
    },
    {
      label: "Settings",
      to: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = user?.name || user?.fullName || user?.username || "User";

  const initials =
    displayName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "U";

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 hidden h-screen shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col ${
        collapsed ? "w-[72px]" : "w-[238px]"
      } transition-[width] duration-300`}
    >
      {/* =====================================================
          BRAND
      ===================================================== */}
      <div
        className={`flex h-[60px] shrink-0 items-center border-b border-[var(--border)] ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        {!collapsed && (
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-xs font-black text-white">
              S
            </span>

            <div className="text-left">
              <p className="text-sm font-black leading-none tracking-tight text-[var(--text)]">
                Smart Workspace
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                User Dashboard
              </p>
            </div>
          </button>
        )}

        {collapsed && (
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-xs font-black text-white"
          >
            S
          </button>
        )}
      </div>

      {/* =====================================================
          USER PROFILE
      ===================================================== */}
      <div
        className={`shrink-0 border-b border-[var(--border)] ${
          collapsed ? "p-2" : "px-3 py-2.5"
        }`}
      >
        <div
          className={`flex items-center gap-2.5 rounded-lg bg-[var(--surfaceAlt)] ${
            collapsed ? "justify-center p-2" : "px-2.5 py-2"
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[11px] font-bold text-white">
            {initials}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[var(--text)]">
                {displayName}
              </p>

              <p className="mt-0.5 truncate text-[10px] capitalize text-[var(--muted)]">
                {user?.role || "User"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3">
        {/* Workspace */}
        <p
          className={`mb-1.5 px-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] ${
            collapsed ? "text-center" : ""
          }`}
        >
          {!collapsed ? "Workspace" : "•••"}
        </p>

        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "text-[var(--muted)] hover:bg-[var(--surfaceAlt)] hover:text-[var(--text)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2.4 : 2}
                      className="shrink-0"
                    />

                    {!collapsed && <span>{item.label}</span>}

                    {!collapsed && item.label === "Notifications" && (
                      <span
                        className={`ml-auto h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-white" : "bg-[var(--primary)]"
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-3 h-px bg-[var(--border)]" />

        {/* Account */}
        <p
          className={`mb-1.5 px-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] ${
            collapsed ? "text-center" : ""
          }`}
        >
          {!collapsed ? "Account" : "•••"}
        </p>

        <nav className="space-y-0.5">
          {accountItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-[var(--surfaceAlt)] text-[var(--primary)]"
                      : "text-[var(--muted)] hover:bg-[var(--surfaceAlt)] hover:text-[var(--text)]"
                  }`
                }
              >
                <Icon size={17} />

                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* =====================================================
            FIND WORKSPACE CARD
        ===================================================== */}
        {!collapsed && (
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] p-3">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <BriefcaseBusiness size={16} />
            </div>

            <p className="text-xs font-semibold text-[var(--text)]">
              Find a workspace
            </p>

            <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">
              Discover flexible workspaces that fit your schedule.
            </p>

            <button
              type="button"
              onClick={() => navigate("/spaces")}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:opacity-90"
            >
              <Search size={13} />
              Explore Spaces
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          BOTTOM ACTIONS
      ===================================================== */}
      <div className="shrink-0 border-t border-[var(--border)] p-2">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={17} />

          {!collapsed && <span>Logout</span>}
        </button>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="mt-0.5 flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-[var(--muted)] transition hover:bg-[var(--surfaceAlt)] hover:text-[var(--text)]"
        >
          {collapsed ? (
            <ChevronRight size={15} />
          ) : (
            <>
              <ChevronLeft size={15} />
              Collapse
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
