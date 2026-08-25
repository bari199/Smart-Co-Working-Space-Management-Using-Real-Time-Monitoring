import { api } from "./api";

export const getSpaces = async () => {
  return api("/spaces");
};

export const searchSpaces = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return api(`/spaces/search${queryString ? `?${queryString}` : ""}`);
};

export const getSpaceById = async (id) => {
  return api(`/spaces/${id}`);
};

export const getOwnerSpaces = async () => {
  return api("/spaces/owner");
};

export const createSpace = async (data) => {
  return api("/spaces", {
    method: "POST",
    body: data,
  });
};

export const updateSpace = async (id, data) => {
  return api(`/spaces/${id}`, {
    method: "PUT",
    body: data,
  });
};

export const deleteSpace = async (id) => {
  return api(`/spaces/${id}`, {
    method: "DELETE",
  });
};
