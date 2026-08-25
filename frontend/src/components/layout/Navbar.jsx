import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  LogOut,
  Bell,
  MessageSquare,
  CalendarCheck,
  CreditCard,
  Info,
  LayoutDashboard,
  UserRound,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../context/authContext";
import { getNotifications } from "../../pages/services/notificationService";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  // -----------------------------------------------------
  // NAVIGATION
  // -----------------------------------------------------

  const links = [
    {
      label: "Spaces",
      to: "/spaces",
    },
    {
      label: "How It Works",
      to: "/#how-it-works",
    },
    {
      label: "For Owners",
      to: "/register?role=owner",
    },
  ];

  // -----------------------------------------------------
  // CLOSE MOBILE MENU
  // -----------------------------------------------------

  const closeMenu = () => {
    setMobileOpen(false);
  };

  // -----------------------------------------------------
  // ROLE
  // -----------------------------------------------------

  const userRole = user?.role?.toLowerCase();
  const isOwner = userRole === "owner";

  const dashboardPath = isOwner ? "/owner" : "/dashboard";

  const notificationPath = isOwner
    ? "/owner/notifications"
    : "/dashboard/notifications";

  const profilePath = isOwner ? "/owner/profile" : "/dashboard/profile";

  // -----------------------------------------------------
  // DISPLAY NAME
  // -----------------------------------------------------

  const displayName =
    user?.name || user?.fullName || user?.username || "Account";

  // -----------------------------------------------------
  // INITIALS
  // -----------------------------------------------------

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  // -----------------------------------------------------
  // NOTIFICATIONS
  // -----------------------------------------------------

  const loadNotifications = async () => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    try {
      const data = await getNotifications();

      const notificationData =
        data?.notifications ||
        data?.data?.notifications ||
        data?.data ||
        data ||
        [];

      setNotifications(Array.isArray(notificationData) ? notificationData : []);
    } catch (error) {
      console.error("Failed to load notifications:", error);

      setNotifications([]);
    }
  };

  // -----------------------------------------------------
  // LOAD + AUTO REFRESH
  // -----------------------------------------------------

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    loadNotifications();

    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("notifications-updated", handleNotificationUpdate);

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "notifications-updated",
        handleNotificationUpdate,
      );
    };
  }, [isAuthenticated, user?._id, user?.id, user?.role]);

  // -----------------------------------------------------
  // UNREAD COUNT
  // -----------------------------------------------------

  const unreadCount = notifications.filter(
    (notification) =>
      notification?.read === false ||
      notification?.isRead === false ||
      (!notification?.read && !notification?.isRead),
  ).length;

  const notificationCount = unreadCount > 99 ? "99+" : unreadCount;

  // -----------------------------------------------------
  // NOTIFICATION ICON
  // -----------------------------------------------------

  const getNotificationIcon = (type) => {
    const iconClass = "h-[16px] w-[16px] text-[var(--primary)]";

    switch (type) {
      case "booking":
        return <CalendarCheck className={iconClass} />;

      case "inquiry":
        return <MessageSquare className={iconClass} />;

      case "payment":
        return <CreditCard className={iconClass} />;

      default:
        return <Info className={iconClass} />;
    }
  };

  // -----------------------------------------------------
  // LOGOUT
  // -----------------------------------------------------

  const handleLogout = async () => {
    closeMenu();
    setNotificationOpen(false);
    setAccountOpen(false);
    setNotifications([]);

    await logout();
  };

  // -----------------------------------------------------
  // ACCOUNT NAVIGATION
  // -----------------------------------------------------

  const handleAccountNavigation = () => {
    setAccountOpen(false);
  };

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------

  return (
    <header
      className="
        sticky top-0 z-50
        w-full
        border-b border-[var(--border)]
        bg-white/95
        backdrop-blur-xl
        dark:bg-[var(--surface)]/95
      "
    >
      {/* =================================================
          NAVBAR
      ================================================= */}

      <div className="container-width">
        <div
          className="
            flex
            h-17
            items-center
            justify-between
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            onClick={closeMenu}
            className="
              group
              flex
              shrink-0
              items-center
              gap-2
              outline-none
            "
          >
            <span
              className="
                flex
                h-8
                items-center
                rounded-md
                bg-[var(--primary)]
                px-2.5
                text-sm
                font-black
                tracking-tight
                text-white
                shadow-sm
                transition
                group-hover:opacity-90
              "
            >
              Smart
            </span>

            <span
              className="
                hidden
                text-sm
                font-semibold
                tracking-tight
                text-[var(--text)]
                sm:block
              "
            >
              Workspace
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-0.5
              md:flex
            "
          >
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `
                    rounded-md
                    px-3
                    py-1.5
                    text-[13px]
                    font-medium
                    transition-colors
                    duration-200
                    ${
                      isActive
                        ? "text-[var(--primary)]"
                        : "text-[var(--text)] hover:bg-[var(--background)] hover:text-[var(--primary)]"
                    }
                  `
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-1
            "
          >
            {/* =================================================
                AUTHENTICATED
            ================================================= */}

            {isAuthenticated ? (
              <>
                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <Popover
                  open={notificationOpen}
                  onOpenChange={setNotificationOpen}
                >
                  <PopoverTrigger
                    type="button"
                    className="
                      relative
                      inline-flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-md
                      text-[var(--text)]
                      outline-none
                      transition-colors
                      hover:bg-[var(--background)]
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
                    "
                    aria-label="Notifications"
                  >
                    <Bell
                      className={
                        unreadCount > 0
                          ? "notification-bell-blink h-[18px] w-[18px]"
                          : "h-[18px] w-[18px]"
                      }
                    />

                    {unreadCount > 0 && (
                      <Badge
                        className="
                          absolute
                          -right-1
                          -top-1
                          flex
                          h-[16px]
                          min-w-[16px]
                          items-center
                          justify-center
                          rounded-full
                          bg-red-500
                          px-1
                          text-[9px]
                          font-bold
                          text-white
                          hover:bg-red-500
                        "
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    sideOffset={6}
                    className="
                      w-[340px]
                      overflow-hidden
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      p-0
                      shadow-xl
                    "
                  >
                    {/* HEADER */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[var(--border)]
                        px-3.5
                        py-2.5
                      "
                    >
                      <div>
                        <h3
                          className="
                            text-sm
                            font-semibold
                            text-[var(--text)]
                          "
                        >
                          Notifications
                        </h3>

                        <p
                          className="
                            text-[11px]
                            text-[var(--muted)]
                          "
                        >
                          {unreadCount > 0
                            ? `${unreadCount} unread notification${
                                unreadCount > 1 ? "s" : ""
                              }`
                            : "You're all caught up"}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <span
                          className="
                            rounded-full
                            bg-red-500
                            px-1.5
                            py-0.5
                            text-[9px]
                            font-bold
                            text-white
                          "
                        >
                          {notificationCount}
                        </span>
                      )}
                    </div>

                    {/* NOTIFICATIONS */}

                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Bell
                            className="
                              mx-auto
                              h-6
                              w-6
                              text-[var(--muted)]
                            "
                          />

                          <p
                            className="
                              mt-2
                              text-sm
                              font-medium
                              text-[var(--text)]
                            "
                          >
                            No notifications
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[11px]
                              text-[var(--muted)]
                            "
                          >
                            You're all caught up.
                          </p>
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((notification) => {
                          const isUnread =
                            notification?.read === false ||
                            notification?.isRead === false ||
                            (!notification?.read && !notification?.isRead);

                          return (
                            <div
                              key={notification?._id}
                              className={`
                                  border-b
                                  border-[var(--border)]
                                  px-3.5
                                  py-2.5
                                  transition
                                  hover:bg-[var(--background)]
                                  ${isUnread ? "bg-[var(--accent)]/5" : ""}
                                `}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="pt-0.5">
                                  {getNotificationIcon(notification?.type)}
                                </div>

                                <div className="pt-1">
                                  <span
                                    className={`
                                        block
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        ${
                                          isUnread
                                            ? "bg-red-500"
                                            : "bg-transparent"
                                        }
                                      `}
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4
                                    className="
                                        text-[13px]
                                        font-semibold
                                        text-[var(--text)]
                                      "
                                  >
                                    {notification?.title || "Notification"}
                                  </h4>

                                  <p
                                    className="
                                        mt-0.5
                                        line-clamp-2
                                        text-[11px]
                                        leading-4
                                        text-[var(--muted)]
                                      "
                                  >
                                    {notification?.message}
                                  </p>

                                  {notification?.createdAt && (
                                    <p
                                      className="
                                          mt-0.5
                                          text-[9px]
                                          text-[var(--muted)]
                                        "
                                    >
                                      {new Date(
                                        notification.createdAt,
                                      ).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* VIEW ALL */}

                    <div
                      className="
                        border-t
                        border-[var(--border)]
                        p-2
                      "
                    >
                      <Link
                        to={notificationPath}
                        onClick={() => setNotificationOpen(false)}
                        className="
                          block
                          w-full
                          rounded-md
                          bg-[var(--primary)]
                          px-3
                          py-2
                          text-center
                          text-xs
                          font-semibold
                          text-white
                          transition
                          hover:opacity-90
                        "
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* =================================================
                    ACCOUNT
                ================================================= */}

                <Popover open={accountOpen} onOpenChange={setAccountOpen}>
                  <PopoverTrigger
                    type="button"
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-md
                      p-0.5
                      pr-1.5
                      outline-none
                      transition-colors
                      hover:bg-[var(--background)]
                    "
                  >
                    <Avatar
                      className="
                        h-8
                        w-8
                        border
                        border-[var(--border)]
                      "
                    >
                      <AvatarImage src={user?.avatar} alt={displayName} />

                      <AvatarFallback
                        className="
                          bg-[var(--primary)]
                          text-[10px]
                          font-bold
                          text-white
                        "
                      >
                        {initials || <UserRound size={14} />}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className="
                        hidden
                        max-w-[110px]
                        flex-col
                        items-start
                        lg:flex
                      "
                    >
                      <span
                        className="
                          max-w-[110px]
                          truncate
                          text-xs
                          font-semibold
                          leading-tight
                          text-[var(--text)]
                        "
                      >
                        {displayName}
                      </span>

                      <span
                        className="
                          text-[9px]
                          capitalize
                          text-[var(--muted)]
                        "
                      >
                        {userRole || "Account"}
                      </span>
                    </div>

                    <ChevronDown
                      size={13}
                      className="
                        hidden
                        text-[var(--muted)]
                        transition-transform
                        group-data-[state=open]:rotate-180
                        sm:block
                      "
                    />
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    sideOffset={6}
                    className="
                      w-56
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      p-1
                      shadow-xl
                    "
                  >
                    <div className="px-2 py-1.5">
                      <p className="text-[10px] text-[var(--muted)]">
                        Signed in as
                      </p>

                      <p
                        className="
                          truncate
                          text-xs
                          font-semibold
                          text-[var(--text)]
                        "
                      >
                        {displayName}
                      </p>
                    </div>

                    <div className="my-0.5 h-px bg-[var(--border)]" />

                    <Link
                      to={dashboardPath}
                      onClick={handleAccountNavigation}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-md
                        px-2
                        py-1.5
                        text-xs
                        font-medium
                        text-[var(--text)]
                        transition
                        hover:bg-[var(--background)]
                      "
                    >
                      <LayoutDashboard
                        size={15}
                        className="text-[var(--primary)]"
                      />
                      Dashboard
                    </Link>

                    <Link
                      to={profilePath}
                      onClick={handleAccountNavigation}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-md
                        px-2
                        py-1.5
                        text-xs
                        font-medium
                        text-[var(--text)]
                        transition
                        hover:bg-[var(--background)]
                      "
                    >
                      <UserRound size={15} className="text-[var(--primary)]" />
                      Profile
                    </Link>

                    <div className="my-0.5 h-px bg-[var(--border)]" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-md
                        px-2
                        py-1.5
                        text-xs
                        font-medium
                        text-red-600
                        transition
                        hover:bg-red-50
                        dark:hover:bg-red-950/30
                      "
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <>
                {/* LOGIN */}

                <Button
                  asChild
                  variant="ghost"
                  className="
                    h-8
                    rounded-md
                    px-3
                    text-xs
                    font-semibold
                    text-[var(--text)]
                    hover:bg-[var(--background)]
                  "
                >
                  <Link to="/login">Login</Link>
                </Button>

                {/* REGISTER */}

                <Button
                  asChild
                  className="
                    h-8
                    rounded-md
                    bg-[var(--primary)]
                    px-3.5
                    text-xs
                    font-semibold
                    text-white
                    shadow-sm
                    hover:bg-[var(--primary-dark)]
                  "
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}

            {/* =================================================
                MOBILE MENU
            ================================================= */}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="
                    ml-0.5
                    h-8
                    w-8
                    rounded-md
                    text-[var(--text)]
                    hover:bg-[var(--background)]
                    md:hidden
                  "
                  aria-label="Toggle navigation"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="
                  w-[280px]
                  border-l
                  border-[var(--border)]
                  bg-white
                  p-0
                  dark:bg-[var(--surface)]
                  sm:w-[320px]
                "
              >
                {/* MOBILE HEADER */}

                <SheetHeader
                  className="
                    border-b
                    border-[var(--border)]
                    px-4
                    py-3
                    text-left
                  "
                >
                  <SheetTitle
                    className="
                      text-sm
                      font-black
                      tracking-tight
                      text-[var(--primary)]
                    "
                  >
                    Smart Workspace
                  </SheetTitle>
                </SheetHeader>

                {/* MOBILE LINKS */}

                <div className="flex flex-col gap-0.5 px-2.5 py-2.5">
                  {links.map((link) => (
                    <SheetClose asChild key={link.label}>
                      <NavLink
                        to={link.to}
                        className="
                          rounded-md
                          px-2.5
                          py-2
                          text-xs
                          font-medium
                          text-[var(--text)]
                          transition
                          hover:bg-[var(--background)]
                        "
                      >
                        {link.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </div>

                {/* MOBILE ACCOUNT */}

                <div
                  className="
                    mt-0
                    border-t
                    border-[var(--border)]
                    px-2.5
                    pt-2.5
                  "
                >
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-1.5">
                      {/* ACCOUNT SUMMARY */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2.5
                          rounded-md
                          border
                          border-[var(--border)]
                          px-2.5
                          py-2
                        "
                      >
                        <Avatar
                          className="
                            h-8
                            w-8
                            border
                            border-[var(--border)]
                          "
                        >
                          <AvatarImage src={user?.avatar} alt={displayName} />

                          <AvatarFallback
                            className="
                              bg-[var(--primary)]
                              text-[10px]
                              font-semibold
                              text-white
                            "
                          >
                            {initials || <UserRound size={14} />}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <span
                            className="
                              block
                              truncate
                              text-xs
                              font-semibold
                              text-[var(--text)]
                            "
                          >
                            {displayName}
                          </span>

                          <span
                            className="
                              text-[9px]
                              capitalize
                              text-[var(--muted)]
                            "
                          >
                            {userRole || "Account"}
                          </span>
                        </div>
                      </div>

                      {/* NOTIFICATIONS */}

                      <SheetClose asChild>
                        <Link
                          to={notificationPath}
                          className="
                            flex
                            items-center
                            justify-between
                            rounded-md
                            border
                            border-[var(--border)]
                            px-2.5
                            py-2
                            text-xs
                            font-medium
                            text-[var(--text)]
                          "
                        >
                          <span className="flex items-center gap-2">
                            <Bell size={16} />
                            Notifications
                          </span>

                          {unreadCount > 0 && (
                            <Badge
                              className="
                                rounded-full
                                bg-red-500
                                px-1.5
                                py-0
                                text-[9px]
                                font-bold
                                text-white
                                hover:bg-red-500
                              "
                            >
                              {notificationCount}
                            </Badge>
                          )}
                        </Link>
                      </SheetClose>

                      {/* DASHBOARD */}

                      <SheetClose asChild>
                        <Link
                          to={dashboardPath}
                          className="
                            flex
                            items-center
                            gap-2
                            rounded-md
                            border
                            border-[var(--border)]
                            px-2.5
                            py-2
                            text-xs
                            font-medium
                            text-[var(--text)]
                          "
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                      </SheetClose>

                      {/* PROFILE */}

                      <SheetClose asChild>
                        <Link
                          to={profilePath}
                          className="
                            flex
                            items-center
                            gap-2
                            rounded-md
                            border
                            border-[var(--border)]
                            px-2.5
                            py-2
                            text-xs
                            font-medium
                            text-[var(--text)]
                          "
                        >
                          <UserRound size={16} />
                          Profile
                        </Link>
                      </SheetClose>

                      {/* LOGOUT */}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogout}
                        className="
                          h-8
                          w-full
                          rounded-md
                          border-[var(--border)]
                          px-2.5
                          text-xs
                          font-medium
                          text-red-600
                          hover:bg-red-50
                          hover:text-red-600
                          dark:hover:bg-red-950/30
                        "
                      >
                        <LogOut size={16} />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      <SheetClose asChild>
                        <Link
                          to="/login"
                          className="
                            rounded-md
                            border
                            border-[var(--border)]
                            px-3
                            py-2
                            text-center
                            text-xs
                            font-semibold
                            text-[var(--text)]
                          "
                        >
                          Login
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          to="/register"
                          className="
                            rounded-md
                            bg-[var(--primary)]
                            px-3
                            py-2
                            text-center
                            text-xs
                            font-semibold
                            text-white
                          "
                        >
                          Get Started
                        </Link>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
