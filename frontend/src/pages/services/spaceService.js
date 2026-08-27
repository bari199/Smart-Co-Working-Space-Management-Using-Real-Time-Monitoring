import { api } from "./api";

export const getSpaces = async () => {
  return api("/spaces", {
    method: "GET",
  });
};

export const searchSpaces = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.location?.trim()) {
    query.set("location", params.location.trim());
  }

  if (params.workspaceType) {
    query.set("workspaceType", params.workspaceType);
  }

  if (params.date) {
    query.set("date", params.date);
  }

  const queryString = query.toString();

  return api(queryString ? `/spaces/search?${queryString}` : "/spaces/search", {
    method: "GET",
  });
};

export const getSpaceById = async (id) => {
  return api(`/spaces/${id}`, {
    method: "GET",
  });
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

export const getSearchOptions = async () => {
  return api("/spaces/search-options", {
    method: "GET",
  });
};
