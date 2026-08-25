import { api } from "./api";

export const getNotifications = () => {
  return api("/notifications");
};

export const markNotificationAsRead = (id) => {
  return api(`/notifications/${id}/read`, {
    method: "PUT",
  });
};

export const deleteNotification = (id) => {
  return api(`/notifications/${id}`, {
    method: "DELETE",
  });
};

export const deleteAllNotifications = () => {
  return api("/notifications/all", {
    method: "DELETE",
  });
};
