import { api } from "./api";

export const loginUser = async (data) => {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const registerUser = async (data) => {
  return api("/auth/register", {
    method: "POST",
    body: data,
  });
};
