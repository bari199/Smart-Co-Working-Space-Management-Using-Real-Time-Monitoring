import { api } from "./api";

export const createInquiry = async (data) => {
  return api("/inquiries", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getMyInquiries = async () => {
  return api("/inquiries/my-inquiries");
};

export const closeInquiry = async (id) => {
  return api(`/inquiries/${id}/close`, {
    method: "PUT",
  });
};
