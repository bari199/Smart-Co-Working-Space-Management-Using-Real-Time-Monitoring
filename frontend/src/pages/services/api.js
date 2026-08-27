const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const isFormData = options.body instanceof FormData;

    const headers = {
      Accept: "application/json",
      ...(options.headers || {}),
    };

    /*
    ========================================================
    CONTENT TYPE
    ========================================================
    */

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    /*
    ========================================================
    AUTHORIZATION
    ========================================================
    */

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    /*
    ========================================================
    REQUEST
    ========================================================
    */

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    /*
    ========================================================
    RESPONSE
    ========================================================
    */

    let data = {};

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = {};
      }
    } else {
      try {
        const text = await response.text();

        data = text ? { message: text } : {};
      } catch {
        data = {};
      }
    }

    /*
    ========================================================
    ERROR
    ========================================================
    */

    if (!response.ok) {
      const error = new Error(
        data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`,
      );

      error.status = response.status;
      error.data = data;

      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API ERROR [${endpoint}]:`, error);

    throw error;
  }
};

export default api;
