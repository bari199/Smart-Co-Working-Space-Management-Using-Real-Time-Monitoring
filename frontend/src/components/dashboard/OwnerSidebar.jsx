import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Bell,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Building2,
} from "lucide-react";

const OwnerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      label: "Overview",
      to: "/owner",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Bookings",
      to: "/owner/bookings",
      icon: CalendarDays,
    },
    {
      label: "My Spaces",
      to: "/owner/spaces",
      icon: Building2,
    },
    {
      label: "Inquiries",
      to: "/owner/inquiries",
      icon: MessageSquare,
    },
    {
      label: "Notifications",
      to: "/owner/notifications",
      icon: Bell,
    },
  ];

  const sidebarWidth = collapsed ? 72 : 248;

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
      ====================================================== */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-[76px] z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--sidebar-border)] bg-[var(--popover-foreground)] text-[var(--sidebar-foreground)] shadow-sm transition hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-primary)] lg:hidden"
        aria-label="Open owner dashboard menu"
      >
        <Menu size={19} />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileSidebar}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className="fixed left-0 top-[68px] z-40 hidden h-[calc(100vh-68px)] border-r border-[var(--sidebar-border)] bg-[var(--popover-foreground)] lg:block"
      >
        <div className="flex h-full flex-col">
          {/* =================================================
              SIDEBAR HEADER
          ================================================== */}
          <div
            className={`flex h-16 items-center border-b border-[var(--sidebar-border)] ${
              collapsed ? "justify-center px-2" : "justify-between px-3.5"
            }`}
          >
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key="expanded-title"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-0"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86B9B2]">
                    Owner Workspace
                  </p>

                  <p className="mt-0.5 truncate text-sm font-bold text-white">
                    Owner Dashboard
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapse Button */}
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#b7c5c7] transition hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-primary)]"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen size={17} />
              ) : (
                <PanelLeftClose size={17} />
              )}
            </button>
          </div>

          {/* =================================================
              NAVIGATION
          ================================================== */}
          <nav className="flex-1 overflow-y-auto px-2.5 py-3.5">
            {!collapsed && (
              <p className="mb-2 px-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#86B9B2]">
                Management
              </p>
            )}

            <div className="space-y-1">
              {links.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeMobileSidebar}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      [
                        "group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                        collapsed
                          ? "justify-center px-2 py-2.5"
                          : "gap-3 px-2.5 py-2.5",

                        isActive
                          ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-sm"
                          : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-primary)]",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active Indicator */}
                        {isActive && (
                          <motion.span
                            layoutId="owner-dashboard-active"
                            className="absolute left-0 h-5 w-0.5 rounded-r-full bg-[var(--sidebar-primary)]"
                          />
                        )}

                        <Icon
                          size={18}
                          strokeWidth={isActive ? 2.4 : 2}
                          className="shrink-0"
                        />

                        <AnimatePresence mode="wait">
                          {!collapsed && (
                            <motion.span
                              initial={{
                                opacity: 0,
                                width: 0,
                              }}
                              animate={{
                                opacity: 1,
                                width: "auto",
                              }}
                              exit={{
                                opacity: 0,
                                width: 0,
                              }}
                              transition={{
                                duration: 0.15,
                              }}
                              className="flex-1 overflow-hidden whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {!collapsed && (
                          <ChevronRight
                            size={14}
                            className={`shrink-0 transition-all ${
                              isActive
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                            }`}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* =================================================
              SIDEBAR FOOTER
          ================================================== */}
          <div className="border-t border-[var(--sidebar-border)] p-2.5">
            <div
              className={`rounded-lg bg-[var(--sidebar-accent)] ${
                collapsed ? "p-2" : "p-2.5"
              }`}
            >
              <div
                className={`flex items-center ${
                  collapsed ? "justify-center" : "gap-2.5"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]">
                  <Building2 size={16} />
                </div>

                {!collapsed && (
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">
                      Owner Workspace
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#b7c5c7]">
                      Manage your spaces
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{
          x: mobileOpen ? 0 : "-100%",
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className="fixed left-0 top-0 z-[70] flex h-screen w-[270px] flex-col border-r border-[var(--sidebar-border)] bg-[var(--popover-foreground)] shadow-2xl lg:hidden"
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--sidebar-border)] px-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86B9B2]">
              Owner Workspace
            </p>

            <p className="mt-0.5 text-sm font-bold text-white">
              Owner Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#b7c5c7] transition hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-primary)]"
            aria-label="Close owner dashboard menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3.5">
          <p className="mb-2 px-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#86B9B2]">
            Management
          </p>

          <div className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all",

                      isActive
                        ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-sm"
                        : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-primary)]",
                    ].join(" ")
                  }
                >
                  <Icon size={18} />

                  <span className="flex-1">{item.label}</span>

                  <ChevronRight size={14} />
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Mobile Footer */}
        <div className="border-t border-[var(--sidebar-border)] p-2.5">
          <div className="rounded-lg bg-[var(--sidebar-accent)] p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]">
                <Building2 size={16} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">
                  Owner Workspace
                </p>

                <p className="mt-0.5 text-[9px] text-[#b7c5c7]">
                  Manage your spaces
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default OwnerSidebar;
