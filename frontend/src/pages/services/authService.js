import api from "./api";

/*
============================================================
LOGIN USER
============================================================
*/

export const loginUser = async (data) => {
  if (!data?.email || !data?.password) {
    throw new Error("Email and password are required");
  }

  return api("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email: data.email.trim(),
      password: data.password,
    }),
  });
};

/*
============================================================
REGISTER USER
============================================================
*/

export const registerUser = async (data) => {
  let formData;

  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();

    formData.append("name", data?.name?.trim() || "");

    formData.append("email", data?.email?.trim() || "");

    formData.append("password", data?.password || "");

    formData.append("phone", data?.phone?.trim() || "");

    formData.append("role", data?.role || "user");

    formData.append("location", data?.location?.trim() || "");

    if (data?.profilePicture instanceof File) {
      formData.append("profilePicture", data.profilePicture);
    }
  }

  return api("/auth/register", {
    method: "POST",
    body: formData,
  });
};

/*
============================================================
GET CURRENT USER
GET /api/auth/me
============================================================
*/

export const getCurrentUser = async () => {
  return api("/auth/me", {
    method: "GET",
  });
};

/*
============================================================
UPDATE PROFILE
PUT /api/auth/profile
============================================================

Uses FormData because profile image can be uploaded.
============================================================
*/

export const updateProfile = async (data) => {
  const formData = new FormData();

  formData.append("name", data?.name?.trim() || "");

  formData.append("email", data?.email?.trim() || "");

  formData.append("phone", data?.phone?.trim() || "");

  formData.append("location", data?.location?.trim() || "");

  if (data?.profilePicture instanceof File) {
    formData.append("profilePicture", data.profilePicture);
  }

  return api("/auth/profile", {
    method: "PUT",
    body: formData,
  });
};

/*
============================================================
CHANGE PASSWORD
PUT /api/auth/change-password
============================================================
*/

export const changePassword = async (data) => {
  if (!data?.currentPassword || !data?.newPassword || !data?.confirmPassword) {
    throw new Error("All password fields are required");
  }

  return api("/auth/change-password", {
    method: "PUT",

    body: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    }),
  });
};
