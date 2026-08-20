import { api } from "./api";

export const getNotifications = async () => {
  return api("/notifications");
};

export const markNotificationAsRead = async (id) => {
  return api(`/notifications/${id}/read`, {
    method: "PUT",
  });
};
