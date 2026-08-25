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

export const getOwnerBookings = async () => {
  return api("/bookings/owner");
};

export const getBookingById = async (id) => {
  return api(`/bookings/${id}`);
};

export const updateBookingStatus = async (id, status) => {
  return api(`/bookings/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

export const cancelBooking = async (id) => {
  return api(`/bookings/${id}/cancel`, {
    method: "PUT",
  });
};

export const checkBookingAvailability = async ({
  space,
  date,
  startTime,
  endTime,
}) => {
  const params = new URLSearchParams({
    space,
    date,
    startTime,
    endTime,
  });

  return api(`/bookings/availability?${params.toString()}`);
};
