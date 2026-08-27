import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import {
  changePassword,
  getProfile,
  updateProfile,
} from "../../services/authService";

import { useAuth } from "../../context/authContext";

const OwnerProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [profileSuccess, setProfileSuccess] = useState("");

  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    profilePicture: null,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /*
  ========================================================
  LOAD PROFILE
  ========================================================
  */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setProfileError("");

        const response = await getProfile();

        const profile = response?.user;

        if (!profile) {
          throw new Error("Profile data not found");
        }

        setForm({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          profilePicture: null,
        });

        setPreview(profile.profilePicture || "");

        if (setUser) {
          setUser(profile);
        }
      } catch (error) {
        console.error("PROFILE LOAD ERROR:", error);

        setProfileError(error?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [setUser]);

  /*
  ========================================================
  INPUT CHANGE
  ========================================================
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setProfileError("");
    setProfileSuccess("");
  };

  /*
  ========================================================
  PASSWORD INPUT
  ========================================================
  */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordSuccess("");
  };

  /*
  ========================================================
  IMAGE SELECT
  ========================================================
  */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Image size must be less than 5MB.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      profilePicture: file,
    }));

    setPreview(URL.createObjectURL(file));

    setProfileError("");
    setProfileSuccess("");
  };

  /*
  ========================================================
  REMOVE SELECTED NEW IMAGE
  ========================================================
  */

  const handleResetImage = () => {
    setForm((prev) => ({
      ...prev,
      profilePicture: null,
    }));

    setPreview(user?.profilePicture || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
  ========================================================
  UPDATE PROFILE
  ========================================================
  */

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileError("");
    setProfileSuccess("");

    if (!form.name.trim()) {
      setProfileError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setProfileError("Email is required.");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await updateProfile(form);

      const updatedUser = response?.user;

      if (updatedUser) {
        setForm((prev) => ({
          ...prev,
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          location: updatedUser.location || "",
          profilePicture: null,
        }));

        setPreview(updatedUser.profilePicture || "");

        if (setUser) {
          setUser(updatedUser);
        }
      }

      setProfileSuccess(response?.message || "Profile updated successfully.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      setProfileError(error?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  /*
  ========================================================
  CHANGE PASSWORD
  ========================================================
  */

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setSavingPassword(true);

      const response = await changePassword(passwordForm);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordSuccess(response?.message || "Password changed successfully.");
    } catch (error) {
      console.error("PASSWORD CHANGE ERROR:", error);

      setPasswordError(error?.message || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  /*
  ========================================================
  INITIALS
  ========================================================
  */

  const displayName = form.name || user?.name || "Owner";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "O";

  /*
  ========================================================
  LOADING
  ========================================================
  */

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />

          <p className="mt-3 text-sm text-[var(--muted)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  /*
  ========================================================
  PAGE
  ========================================================
  */

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
            Account
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--text)]">
            Profile
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your personal information, profile image and password.
          </p>
        </div>

        {/* PROFILE ERROR */}

        {profileError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {profileError}
          </div>
        )}

        {/* PROFILE SUCCESS */}

        {profileSuccess && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={17} />
            {profileSuccess}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* ==================================================
              LEFT - PROFILE INFORMATION
          ================================================== */}

          <form
            onSubmit={handleProfileSubmit}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
          >
            {/* CARD HEADER */}

            <div className="border-b border-[var(--border)] px-5 py-4">
              <h2 className="text-base font-bold text-[var(--text)]">
                Personal information
              </h2>

              <p className="mt-1 text-xs text-[var(--muted)]">
                Update your account information.
              </p>
            </div>

            <div className="space-y-5 p-5">
              {/* NAME */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--text)]">
                  Name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--text)]">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--text)]">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              {/* LOCATION */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--text)]">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Your location"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              {/* ROLE */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--text)]">
                  Account type
                </label>

                <input
                  type="text"
                  value={user?.role || "owner"}
                  disabled
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] px-3 py-2.5 text-sm capitalize text-[var(--muted)] outline-none"
                />
              </div>

              {/* SAVE */}

              <div className="flex justify-end border-t border-[var(--border)] pt-5">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />

                  {savingProfile ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </form>

          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <div className="space-y-6">
            {/* PROFILE IMAGE */}

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="border-b border-[var(--border)] px-5 py-4">
                <h2 className="text-base font-bold text-[var(--text)]">
                  Profile photo
                </h2>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  JPG, PNG or WEBP. Maximum 5MB.
                </p>
              </div>

              <div className="flex flex-col items-center p-5">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--surfaceAlt)] bg-[var(--primary)] text-2xl font-black text-white">
                    {preview ? (
                      <img
                        src={preview}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--primary)] text-white shadow-sm transition hover:opacity-90"
                  >
                    <Camera size={16} />
                  </button>
                </div>

                <p className="mt-3 text-sm font-bold text-[var(--text)]">
                  {displayName}
                </p>

                <p className="mt-0.5 text-xs capitalize text-[var(--muted)]">
                  {user?.role || "owner"}
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surfaceAlt)]"
                  >
                    Change photo
                  </button>

                  {form.profilePicture && (
                    <button
                      type="button"
                      onClick={handleResetImage}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {form.profilePicture && (
                  <p className="mt-3 max-w-full truncate text-[10px] text-[var(--muted)]">
                    {form.profilePicture.name}
                  </p>
                )}
              </div>
            </div>

            {/* ACCOUNT SUMMARY */}

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Account
              </p>

              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-[10px] text-[var(--muted)]">Email</p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-[var(--text)]">
                    {form.email || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[var(--muted)]">Role</p>

                  <p className="mt-0.5 text-sm font-semibold capitalize text-[var(--text)]">
                    {user?.role || "owner"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            PASSWORD
        ================================================== */}

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
        >
          <div className="border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                <LockKeyhole size={17} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[var(--text)]">
                  Change password
                </h2>

                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-3">
            {/* CURRENT PASSWORD */}

            <PasswordInput
              label="Current password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              show={showCurrentPassword}
              onToggle={() => setShowCurrentPassword((prev) => !prev)}
            />

            {/* NEW PASSWORD */}

            <PasswordInput
              label="New password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              show={showNewPassword}
              onToggle={() => setShowNewPassword((prev) => !prev)}
            />

            {/* CONFIRM PASSWORD */}

            <PasswordInput
              label="Confirm new password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
            />
          </div>

          {/* PASSWORD ERROR */}

          {passwordError && (
            <div className="mx-5 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
              {passwordError}
            </div>
          )}

          {/* PASSWORD SUCCESS */}

          {passwordSuccess && (
            <div className="mx-5 mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-medium text-green-700">
              <CheckCircle2 size={15} />
              {passwordSuccess}
            </div>
          )}

          <div className="flex justify-end border-t border-[var(--border)] p-5">
            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LockKeyhole size={16} />

              {savingPassword ? "Updating..." : "Change password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/*
============================================================
PASSWORD INPUT
============================================================
*/

const PasswordInput = ({ label, name, value, onChange, show, onToggle }) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[var(--text)]">
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--text)]"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

export default OwnerProfile;
