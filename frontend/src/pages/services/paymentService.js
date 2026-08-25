import { api } from "./api";

export const createPaymentOrder = async (bookingId) => {
  return api("/payments/create-order", {
    method: "POST",
    body: JSON.stringify({
      bookingId,
    }),
  });
};

export const verifyPayment = async (data) => {
  return api("/payments/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getPaymentByBooking = async (bookingId) => {
  return api(`/payments/booking/${bookingId}`);
};
