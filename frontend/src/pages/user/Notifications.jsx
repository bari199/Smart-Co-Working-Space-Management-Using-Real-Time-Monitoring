import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  Inbox,
  CalendarDays,
  MessageSquare,
  CreditCard,
  Settings,
  AlertCircle,
} from "lucide-react";

import Loading from "../../components/common/Loading";

import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../services/notificationService";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState([]);

  const [deleting, setDeleting] = useState(false);
  const [readingId, setReadingId] = useState(null);

  // ======================================================
  // LOAD NOTIFICATIONS
  // ======================================================

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await getNotifications();

      const list =
        data?.notifications || data?.data || (Array.isArray(data) ? data : []);

      setNotifications(list);
      setSelectedIds([]);
    } catch (error) {
      console.error("Notification load error:", error);

      toast.error(error?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadNotifications();
  }, []);

  // ======================================================
  // UNREAD COUNT
  // ======================================================

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.read).length;
  }, [notifications]);

  // ======================================================
  // SELECT ALL
  // ======================================================

  const allSelected =
    notifications.length > 0 && selectedIds.length === notifications.length;

  const someSelected =
    selectedIds.length > 0 && selectedIds.length < notifications.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(notifications.map((notification) => notification._id));
    } else {
      setSelectedIds([]);
    }
  };

  // ======================================================
  // SELECT SINGLE
  // ======================================================

  const handleSelect = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  // ======================================================
  // MARK AS READ
  // ======================================================

  const handleRead = async (id) => {
    try {
      setReadingId(id);

      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                read: true,
              }
            : notification,
        ),
      );

      window.dispatchEvent(new CustomEvent("notifications-updated"));

      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Mark notification read error:", error);

      toast.error(error?.message || "Failed to mark notification as read");
    } finally {
      setReadingId(null);
    }
  };

  // ======================================================
  // DELETE SELECTED
  // ======================================================

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one notification");
      return;
    }

    const count = selectedIds.length;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${count} selected notification${
        count > 1 ? "s" : ""
      }?`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      // Delete selected notifications
      await Promise.all(selectedIds.map((id) => deleteNotification(id)));

      setNotifications((prev) =>
        prev.filter((notification) => !selectedIds.includes(notification._id)),
      );

      setSelectedIds([]);

      window.dispatchEvent(new CustomEvent("notifications-updated"));

      toast.success(`${count} notification${count > 1 ? "s" : ""} deleted`);
    } catch (error) {
      console.error("Delete notifications error:", error);

      toast.error(error?.message || "Failed to delete notifications");
    } finally {
      setDeleting(false);
    }
  };

  // ======================================================
  // NOTIFICATION ICON
  // ======================================================

  const getNotificationIcon = (type) => {
    const normalizedType = type?.toLowerCase();

    switch (normalizedType) {
      case "booking":
        return CalendarDays;

      case "inquiry":
        return MessageSquare;

      case "payment":
        return CreditCard;

      case "system":
        return Settings;

      case "warning":
        return AlertCircle;

      default:
        return Bell;
    }
  };

  // ======================================================
  // NOTIFICATION ICON STYLE
  // ======================================================

  const getIconStyle = (type) => {
    const normalizedType = type?.toLowerCase();

    switch (normalizedType) {
      case "booking":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";

      case "inquiry":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";

      case "payment":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

      case "warning":
        return "bg-red-500/10 text-red-600 dark:text-red-400";

      case "system":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";

      default:
        return "bg-[var(--primary)]/10 text-[var(--primary)]";
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "Unknown date";
    }

    return notificationDate.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return <Loading />;
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-w-0">
      {/* ==================================================
          HEADER
      ================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-7"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Bell size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Stay updated with your latest account activity.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ==================================================
          TOOLBAR
      ================================================== */}

      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-5 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          {/* LEFT */}

          <div className="flex items-center gap-3">
            <Checkbox
              checked={
                allSelected ? true : someSelected ? "indeterminate" : false
              }
              onCheckedChange={handleSelectAll}
              aria-label="Select all notifications"
            />

            <div>
              <p className="text-sm font-medium text-[var(--text)]">
                {selectedIds.length > 0
                  ? `${selectedIds.length} selected`
                  : "Select notifications"}
              </p>

              <p className="text-xs text-[var(--muted)]">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "You're all caught up"}
              </p>
            </div>
          </div>

          {/* ONLY DELETE BUTTON */}

          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                }}
              >
                <Button
                  variant="outline"
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 sm:w-auto"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={15} />
                      Delete selected
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {notifications.length === 0 ? (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Inbox size={28} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[var(--text)]">
            You're all caught up
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
            There are no notifications to show right now. New booking updates,
            inquiries, payments and account activity will appear here.
          </p>
        </motion.div>
      ) : (
        /* ==================================================
           NOTIFICATION LIST
        ================================================== */

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification, index) => {
              const isSelected = selectedIds.includes(notification._id);

              const isUnread = !notification.read;

              const Icon = getNotificationIcon(notification.type);

              const iconStyle = getIconStyle(notification.type);

              return (
                <motion.div
                  key={notification._id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 40,
                    height: 0,
                  }}
                  transition={{
                    delay: index * 0.04,
                    duration: 0.25,
                  }}
                >
                  <Card
                    className={`
                        group overflow-hidden rounded-2xl
                        border-[var(--border)]
                        bg-[var(--surface)]
                        shadow-sm
                        transition-all duration-300
                        hover:shadow-md
                        ${
                          isUnread ? "border-l-4 border-l-[var(--primary)]" : ""
                        }
                        ${isSelected ? "ring-2 ring-[var(--primary)]/20" : ""}
                      `}
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                        {/* CHECKBOX */}

                        <div className="pt-1">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelect(notification._id, checked)
                            }
                            aria-label={`Select ${
                              notification.title || "notification"
                            }`}
                          />
                        </div>

                        {/* ICON */}

                        <div
                          className={`
                              flex h-11 w-11 shrink-0
                              items-center justify-center
                              rounded-xl
                              ${iconStyle}
                            `}
                        >
                          <Icon size={20} />
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h2
                                  className={`
                                      text-sm
                                      ${
                                        isUnread ? "font-bold" : "font-semibold"
                                      }
                                      text-[var(--text)]
                                    `}
                                >
                                  {notification.title || "Notification"}
                                </h2>

                                {isUnread && (
                                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                                )}
                              </div>

                              <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                                {notification.message || "No message available"}
                              </p>
                            </div>

                            {/* TYPE */}

                            <Badge
                              variant="outline"
                              className="w-fit shrink-0 rounded-full capitalize"
                            >
                              {notification.type || "system"}
                            </Badge>
                          </div>

                          {/* FOOTER */}

                          <div className="mt-4 flex flex-col gap-3 border-t border-[var(--border)] pt-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                              <span>{formatDate(notification.createdAt)}</span>

                              <span>•</span>

                              {isUnread ? (
                                <span className="font-medium text-[var(--primary)]">
                                  Unread
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Check size={13} />
                                  Read
                                </span>
                              )}
                            </div>

                            {/* MARK AS READ ONLY */}

                            {isUnread && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRead(notification._id)}
                                disabled={readingId === notification._id}
                                className="w-full gap-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] sm:w-auto"
                              >
                                {readingId === notification._id ? (
                                  <>
                                    <Loader2
                                      size={15}
                                      className="animate-spin"
                                    />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <CheckCheck size={15} />
                                    Mark as read
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Notifications;
