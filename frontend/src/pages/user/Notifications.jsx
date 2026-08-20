import { useEffect, useState } from "react";
import { toast } from "sonner";

import Loading from "../../components/common/Loading";
import {
  getNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();

      setNotifications(data.notifications || data.data || data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Stay updated with your account activity.
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : notifications.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h2 className="font-semibold">No notifications</h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            You're all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 ${
                !notification.read
                  ? "border-l-4 border-l-[var(--secondary)]"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">
                    {notification.title || "Notification"}
                  </h3>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {notification.message}
                  </p>
                </div>

                {!notification.read && (
                  <button
                    onClick={() => handleRead(notification._id)}
                    className="shrink-0 text-xs font-medium text-[var(--secondary)] hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
