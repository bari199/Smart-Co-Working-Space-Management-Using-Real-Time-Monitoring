import api from "./api";

// ==============================
// Dashboard
// ==============================

export const getAdminDashboard = () => api("/admin/dashboard");

// ==============================
// Users
// ==============================

export const getUsers = (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return api(`/admin/users${query ? `?${query}` : ""}`);
};

export const getUserById = (id) => api(`/admin/users/${id}`);

export const updateUserRole = (id, role) =>
  api(`/admin/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });

export const deleteUser = (id) =>
  api(`/admin/users/${id}`, {
    method: "DELETE",
  });

// ==============================
// Owners
// ==============================

export const getOwners = () => api("/admin/owners");

// ==============================
// Spaces
// ==============================

export const getSpaces = (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return api(`/admin/spaces${query ? `?${query}` : ""}`);
};

export const getSpaceById = (id) => api(`/admin/spaces/${id}`);

export const updateSpaceAvailability = (id, availability) =>
  api(`/admin/spaces/${id}/availability`, {
    method: "PUT",
    body: JSON.stringify({ availability }),
  });

export const deleteSpace = (id) =>
  api(`/admin/spaces/${id}`, {
    method: "DELETE",
  });

// ==============================
// Bookings
// ==============================

export const getBookings = (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return api(`/admin/bookings${query ? `?${query}` : ""}`);
};

export const getBookingById = (id) => api(`/admin/bookings/${id}`);

export const updateBookingStatus = (id, status) =>
  api(`/admin/bookings/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

// ==============================
// Inquiries
// ==============================

export const getInquiries = (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return api(`/admin/inquiries${query ? `?${query}` : ""}`);
};

export const getInquiryById = (id) => api(`/admin/inquiries/${id}`);

// ==============================
// Payments
// ==============================

export const getPayments = (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return api(`/admin/payments${query ? `?${query}` : ""}`);
};

export const getPaymentById = (id) => api(`/admin/payments/${id}`);
