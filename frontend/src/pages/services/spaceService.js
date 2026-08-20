import { api } from "./api";

export const getSpaces = async () => {
  return api("/spaces");
};

export const searchSpaces = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  return api(`/spaces/search?${query.toString()}`);
};

export const getSpaceById = async (id) => {
  return api(`/spaces/${id}`);
};
