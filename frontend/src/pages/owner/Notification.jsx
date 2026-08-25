import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  Bell,
  CalendarCheck,
  CreditCard,
  UserRound,
  AlertCircle,
  CircleCheck,
  Clock3,
  Inbox,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../services/notificationService";

const Notification = () => {
  const { user, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // =========================================================
  // ROLE
  // =========================================================

  const userRole = user?.role?.toLowerCase();

  const isOwner = userRole === "owner";

  // =========================================================
  // ROLE BASED NOTIFICATION ROUTE
  // =========================================================

  const notificationPath = isOwner
    ? "/owner/notifications"
    : "/dashboard/notifications";

  // =========================================================
  // GET NOTIFICATION ID
  // =========================================================

  const getNotificationId = (notification) =>
    notification?._id || notification?.id;

  // =========================================================
  // CHECK NOTIFICATION READ STATUS
  // =========================================================

  const isNotificationRead = (notification) =>
    notification?.read === true || notification?.isRead === true;

  // =========================================================
  // GET NOTIFICATION ICON
  // =========================================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return CalendarCheck;

      case "payment":
        return CreditCard;

      case "user":
      case "owner":
      case "provider":
        return UserRound;

      case "success":
        return CircleCheck;

      case "warning":
        return AlertCircle;

      case "reminder":
        return Clock3;

      default:
        return Bell;
    }
  };

  // =========================================================
  // TIME AGO
  // =========================================================

  const getTimeAgo = (date) => {
    if (!date) return "";

    const now = new Date();
    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "";
    }

    const seconds = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 1000,
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================

  const loadNotifications = async () => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await getNotifications();

      const data =
        response?.notifications ||
        response?.data?.notifications ||
        response?.data?.data ||
        response?.data ||
        [];

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadNotifications();
  }, [isAuthenticated, user?._id, user?.id, user?.role]);

  // =========================================================
  // AUTO REFRESH
  // =========================================================

  useEffect(() => {
    if (!isAuthenticated || !user) return;

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

  // =========================================================
  // UNREAD COUNT
  // =========================================================

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !isNotificationRead(notification),
    ).length;
  }, [notifications]);

  // =========================================================
  // FILTERED NOTIFICATIONS
  // =========================================================

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter(
        (notification) => !isNotificationRead(notification),
      );
    }

    if (filter === "read") {
      return notifications.filter((notification) =>
        isNotificationRead(notification),
      );
    }

    return notifications;
  }, [notifications, filter]);

  // =========================================================
  // VISIBLE IDS
  // =========================================================

  const visibleIds = filteredNotifications
    .map(getNotificationId)
    .filter(Boolean);

  // =========================================================
  // SELECT ALL STATUS
  // =========================================================

  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const someSelected =
    visibleIds.some((id) => selectedIds.includes(id)) && !allSelected;

  // =========================================================
  // SELECT ALL
  // =========================================================

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds((previous) => [...new Set([...previous, ...visibleIds])]);

      return;
    }

    setSelectedIds((previous) =>
      previous.filter((id) => !visibleIds.includes(id)),
    );
  };

  // =========================================================
  // SELECT SINGLE
  // =========================================================

  const handleSelectNotification = (id, checked) => {
    if (!id) return;

    if (checked) {
      setSelectedIds((previous) => [...new Set([...previous, id])]);

      return;
    }

    setSelectedIds((previous) =>
      previous.filter((selectedId) => selectedId !== id),
    );
  };

  // =========================================================
  // MARK SINGLE AS READ
  // =========================================================

  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) return;

    try {
      await markNotificationAsRead(notificationId);

      setNotifications((previous) =>
        previous.map((notification) =>
          getNotificationId(notification) === notificationId
            ? {
                ...notification,
                read: true,
                isRead: true,
              }
            : notification,
        ),
      );

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // =========================================================
  // MARK SELECTED AS READ
  // =========================================================

  const handleMarkSelectedAsRead = async () => {
    if (!selectedIds.length) return;

    try {
      setActionLoading(true);

      await Promise.all(selectedIds.map((id) => markNotificationAsRead(id)));

      setNotifications((previous) =>
        previous.map((notification) =>
          selectedIds.includes(getNotificationId(notification))
            ? {
                ...notification,
                read: true,
                isRead: true,
              }
            : notification,
        ),
      );

      setSelectedIds([]);

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Failed to mark selected notifications as read:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // MARK ALL AS READ
  // =========================================================

  const handleMarkAllAsRead = async () => {
    if (!unreadCount) return;

    try {
      setActionLoading(true);

      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
          isRead: true,
        })),
      );

      setSelectedIds([]);

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // DELETE SELECTED
  // =========================================================

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected notification${
        selectedIds.length > 1 ? "s" : ""
      }?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await Promise.all(selectedIds.map((id) => deleteNotification(id)));

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            !selectedIds.includes(getNotificationId(notification)),
        ),
      );

      setSelectedIds([]);

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Failed to delete selected notifications:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // DELETE ALL
  // =========================================================

  const handleDeleteAll = async () => {
    if (!notifications.length) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete all notifications?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await deleteAllNotifications();

      setNotifications([]);
      setSelectedIds([]);

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // NOT AUTHENTICATED
  // =========================================================

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-full bg-[var(--background)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center justify-center">
          <Card className="w-full max-w-md border-[var(--border)] bg-[var(--surface)]">
            <CardContent className="flex flex-col items-center px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/10">
                <Bell className="h-7 w-7 text-[var(--primary)]" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-[var(--text)]">
                Please login
              </h2>

              <p className="mt-2 text-sm text-[var(--muted)]">
                You need to be logged in to view your notifications.
              </p>

              <Button
                className="mt-5 bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-full bg-[var(--background)] p-4 text-[var(--text)] sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                <Bell className="h-5 w-5 text-[var(--primary)]" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  {isOwner
                    ? "Stay updated with your workspace activities."
                    : "Stay updated with your account activities."}
                </p>
              </div>
            </div>
          </div>

          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[var(--text)]"
            >
              {unreadCount} unread
            </Badge>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={actionLoading}
                className="border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--background)]"
              >
                {actionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCheck className="mr-2 h-4 w-4" />
                )}
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* ===================================================
            MAIN CARD
        =================================================== */}

        <Card className="overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-sm">
          {/* =================================================
              CARD HEADER
          ================================================= */}

          <CardHeader className="space-y-4 border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="text-lg font-semibold">
                Notification Center
              </CardTitle>

              {/* FILTERS */}

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={
                    filter === "all"
                      ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                      : "border-[var(--border)]"
                  }
                >
                  All
                </Button>

                <Button
                  variant={filter === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                  className={
                    filter === "unread"
                      ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                      : "border-[var(--border)]"
                  }
                >
                  Unread
                  {unreadCount > 0 && (
                    <span className="ml-1 rounded-full bg-white/20 px-1.5">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                <Button
                  variant={filter === "read" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("read")}
                  className={
                    filter === "read"
                      ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                      : "border-[var(--border)]"
                  }
                >
                  Read
                </Button>
              </div>
            </div>

            {/* =================================================
                SELECTION TOOLBAR
            ================================================= */}

            {filteredNotifications.length > 0 && (
              <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={allSelected}
                    data-state={someSelected ? "indeterminate" : undefined}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all notifications"
                  />

                  <span className="text-sm font-medium">
                    {selectedIds.length > 0
                      ? `${selectedIds.length} selected`
                      : "Select notifications"}
                  </span>
                </div>

                {selectedIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {/* MARK SELECTED */}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleMarkSelectedAsRead}
                      disabled={actionLoading}
                      className="border-[var(--border)]"
                    >
                      {actionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Mark read
                    </Button>

                    {/* DELETE SELECTED */}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDeleteSelected}
                      disabled={actionLoading}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardHeader>

          {/* =================================================
              CARD CONTENT
          ================================================= */}

          <CardContent className="p-0">
            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="flex min-h-[350px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />

                  <p className="text-sm text-[var(--muted)]">
                    Loading notifications...
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading && filteredNotifications.length === 0 && (
              <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/10">
                  <Inbox className="h-7 w-7 text-[var(--primary)]" />
                </div>

                <h3 className="text-lg font-semibold">
                  {filter === "unread"
                    ? "No unread notifications"
                    : filter === "read"
                      ? "No read notifications"
                      : "No notifications yet"}
                </h3>

                <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
                  {filter === "unread"
                    ? "You're all caught up. There are no unread notifications."
                    : "When you receive new booking, payment, or workspace updates, they will appear here."}
                </p>

                {filter !== "all" && notifications.length > 0 && (
                  <Button
                    variant="outline"
                    className="mt-5 border-[var(--border)]"
                    onClick={() => setFilter("all")}
                  >
                    View all notifications
                  </Button>
                )}
              </div>
            )}

            {/* =================================================
                NOTIFICATION LIST
            ================================================= */}

            {!loading && filteredNotifications.length > 0 && (
              <div>
                {filteredNotifications.map((notification, index) => {
                  const id = getNotificationId(notification);

                  const isRead = isNotificationRead(notification);

                  const Icon = getNotificationIcon(notification?.type);

                  const isSelected = selectedIds.includes(id);

                  return (
                    <div
                      key={id || index}
                      className={`group relative flex gap-3 border-b border-[var(--border)] p-4 transition-colors last:border-b-0 sm:gap-4 sm:p-5 ${
                        !isRead
                          ? "bg-[var(--background)]"
                          : "bg-[var(--surface)]"
                      } ${
                        isSelected
                          ? "ring-1 ring-inset ring-[var(--primary)]/40"
                          : ""
                      }`}
                    >
                      {/* =================================
                              CHECKBOX
                          ================================= */}

                      <div className="flex items-start pt-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectNotification(id, checked)
                          }
                          aria-label={`Select ${
                            notification?.title || "notification"
                          }`}
                        />
                      </div>

                      {/* =================================
                              ICON
                          ================================= */}

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isRead
                            ? "bg-[var(--background)] text-[var(--muted)]"
                            : "bg-[var(--primary)]/10 text-[var(--primary)]"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* =================================
                              CONTENT
                          ================================= */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`text-sm sm:text-base ${
                                !isRead ? "font-semibold" : "font-medium"
                              }`}
                            >
                              {notification?.title || "Notification"}
                            </h3>

                            {!isRead && (
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                            )}
                          </div>

                          <span className="shrink-0 text-xs text-[var(--muted)]">
                            {getTimeAgo(
                              notification?.createdAt ||
                                notification?.timestamp ||
                                notification?.date,
                            )}
                          </span>
                        </div>

                        {/* MESSAGE */}

                        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                          {notification?.message ||
                            notification?.description ||
                            "You have a new notification."}
                        </p>

                        {/* TYPE */}

                        {notification?.type && (
                          <div className="mt-2">
                            <Badge
                              variant="outline"
                              className="border-[var(--border)] text-[10px] capitalize"
                            >
                              {notification.type}
                            </Badge>
                          </div>
                        )}

                        {/* ACTIONS */}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {!isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(id)}
                              disabled={actionLoading}
                              className="h-8 px-2 text-xs text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary-dark)]"
                            >
                              <Check className="mr-1.5 h-3.5 w-3.5" />
                              Mark as read
                            </Button>
                          )}

                          {notification?.link && (
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="h-8 px-2 text-xs"
                            >
                              <a href={notification.link}>View details</a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ===================================================
            OWNER INFO
        =================================================== */}

        {isOwner && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                <Bell className="h-4 w-4 text-[var(--primary)]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  Owner notifications
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  These notifications are associated with your owner account and
                  workspace activities.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
