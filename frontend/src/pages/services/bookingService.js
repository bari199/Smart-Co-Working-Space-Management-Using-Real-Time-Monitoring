import { api } from "./api";

export const createBooking = async (data) => {
  return api("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getMyBookings = async () => {
  return api("/bookings/my-bookings");
};

export const cancelBooking = async (id) => {
  return api(`/bookings/${id}/cancel`, {
    method: "PUT",
  });
};
