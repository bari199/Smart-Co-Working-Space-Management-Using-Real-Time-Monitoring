import { useEffect, useRef, useState } from "react";
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
  ShieldCheck,
  User,
} from "lucide-react";

import { useAuth } from "../../context/authContext";

import {
  changePassword,
  getCurrentUser,
  updateProfile,
} from "../services/authService";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  /*
  ========================================================
  PROFILE STATE
  ========================================================
  */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [profileImage, setProfileImage] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  /*
  ========================================================
  PASSWORD STATE
  ========================================================
  */

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /*
  ========================================================
  PASSWORD VISIBILITY
  ========================================================
  */

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /*
  ========================================================
  LOADING
  ========================================================
  */

  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);

  /*
  ========================================================
  MESSAGES
  ========================================================
  */

  const [profileMessage, setProfileMessage] = useState("");

  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");

  const [passwordError, setPasswordError] = useState("");

  /*
  ========================================================
  INITIAL DATA
  ========================================================
  */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getCurrentUser();

        if (response?.user) {
          setFormData({
            name: response.user.name || "",
            email: response.user.email || "",
            phone: response.user.phone || "",
            location: response.user.location || "",
          });

          setProfileImage(response.user.profilePicture || "");
        }
      } catch (error) {
        /*
        ----------------------------------------------------
        Fallback to auth context user
        ----------------------------------------------------
        */

        if (user) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            location: user.location || "",
          });

          setProfileImage(user.profilePicture || "");
        }
      }
    };

    loadProfile();
  }, [user]);

  /*
  ========================================================
  INPUT HANDLER
  ========================================================
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  ========================================================
  PASSWORD INPUT HANDLER
  ========================================================
  */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
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

    setProfileError("");

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    setProfileImage(previewUrl);
  };

  /*
  ========================================================
  UPDATE PROFILE
  ========================================================
  */

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileLoading(true);
    setProfileMessage("");
    setProfileError("");

    try {
      const response = await updateProfile({
        ...formData,
        profilePicture: selectedImage,
      });

      if (response?.user) {
        const updatedUser = response.user;

        /*
        ----------------------------------------------------
        Update localStorage user
        ----------------------------------------------------
        */

        localStorage.setItem("user", JSON.stringify(updatedUser));

        /*
        ----------------------------------------------------
        Update UI
        ----------------------------------------------------
        */

        setFormData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          location: updatedUser.location || "",
        });

        setProfileImage(updatedUser.profilePicture || "");

        setSelectedImage(null);
      }

      setProfileMessage(response?.message || "Profile updated successfully.");
    } catch (error) {
      setProfileError(error?.message || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  /*
  ========================================================
  CHANGE PASSWORD
  ========================================================
  */

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordLoading(true);
    setPasswordMessage("");
    setPasswordError("");

    try {
      const response = await changePassword(passwordData);

      setPasswordMessage(response?.message || "Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(error?.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  /*
  ========================================================
  INITIALS
  ========================================================
  */

  const displayName = formData.name || user?.name || "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  /*
  ========================================================
  ROLE LABEL
  ========================================================
  */

  const roleLabel =
    user?.role === "owner"
      ? "Workspace Owner"
      : user?.role === "admin"
        ? "Administrator"
        : "Workspace User";

  /*
  ========================================================
  RETURN
  ========================================================
  */

  return (
    <div className="min-w-0 space-y-6 pb-10">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 shrink-0 border-2 border-[var(--primary)]/20">
              <AvatarImage src={profileImage} alt={displayName} />

              <AvatarFallback className="bg-[var(--primary)] text-xl font-bold text-white">
                {initials || <User size={26} />}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
                <ShieldCheck size={16} />
                Account Settings
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Manage your personal information, profile photo, and account
                password.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          PROFILE INFORMATION
      ================================================== */}

      <Card className="overflow-hidden rounded-2xl border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <CardHeader className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
          <CardTitle className="text-base text-[var(--text)] sm:text-lg">
            Personal Information
          </CardTitle>

          <CardDescription className="text-xs text-[var(--muted)] sm:text-sm">
            Update your account information and profile photo.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* ==================================================
                PROFILE IMAGE
            ================================================== */}

            <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <Avatar className="h-20 w-20 border-2 border-[var(--border)]">
                  <AvatarImage src={profileImage} alt={displayName} />

                  <AvatarFallback className="bg-[var(--primary)] text-lg font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--primary)] text-white shadow-sm transition hover:opacity-90"
                  aria-label="Change profile photo"
                >
                  <Camera size={15} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text)]">
                  Profile photo
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  JPG, PNG, WEBP or other image formats. Maximum size 5MB.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full rounded-lg border-[var(--border)] sm:w-auto"
                >
                  <Camera size={15} />
                  Change Photo
                </Button>
              </div>
            </div>

            {/* ==================================================
                FORM GRID
            ================================================== */}

            <div className="grid min-w-0 gap-5 md:grid-cols-2">
              {/* NAME */}

              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  Full Name
                </Label>

                <div className="relative">
                  <User
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="h-11 min-w-0 rounded-xl border-[var(--border)] bg-[var(--surface)] pl-10 text-[var(--text)]"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  Email Address
                </Label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-11 min-w-0 rounded-xl border-[var(--border)] bg-[var(--surface)] pl-10 text-[var(--text)]"
                  />
                </div>
              </div>

              {/* PHONE */}

              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  Phone Number
                </Label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="h-11 min-w-0 rounded-xl border-[var(--border)] bg-[var(--surface)] pl-10 text-[var(--text)]"
                  />
                </div>
              </div>

              {/* LOCATION */}

              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  Location
                </Label>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your location"
                    className="h-11 min-w-0 rounded-xl border-[var(--border)] bg-[var(--surface)] pl-10 text-[var(--text)]"
                  />
                </div>
              </div>
            </div>

            {/* ROLE */}

            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-xs font-medium text-[var(--muted)]">
                Account Type
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                {roleLabel}
              </p>
            </div>

            {/* MESSAGE */}

            {profileMessage && (
              <div className="flex min-w-0 items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-600">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0" />

                <span className="break-words">{profileMessage}</span>
              </div>
            )}

            {profileError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600">
                {profileError}
              </div>
            )}

            {/* SAVE */}

            <div className="flex justify-end border-t border-[var(--border)] pt-5">
              <Button
                type="submit"
                disabled={profileLoading}
                className="w-full rounded-xl bg-[var(--primary)] px-5 text-white hover:bg-[var(--primary-dark)] sm:w-auto"
              >
                <Save size={16} />

                {profileLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ==================================================
          PASSWORD
      ================================================== */}

      <Card className="overflow-hidden rounded-2xl border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <CardHeader className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <LockKeyhole size={19} />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-base text-[var(--text)] sm:text-lg">
                Change Password
              </CardTitle>

              <CardDescription className="mt-1 text-xs leading-5 text-[var(--muted)] sm:text-sm">
                Use your current password to set a new password for your
                account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {/* CURRENT PASSWORD */}

              <div className="min-w-0 space-y-2 md:col-span-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  Current Password
                </Label>

                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="h-11 min-w-0 rounded-xl border-[var(--border)] bg-[var(--surface)] pr-11 text-[var(--text)]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}

              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  New Password
                </Label>

                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Minimum 6 characters"
                    className="h-11 min-w-0 rounded-xl border-[var(--border)] bg-[var(--surface)] pr-11 text-[var(--text)]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                  >
                    {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  Confirm New Password
                </Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Repeat new password"
                    className="h-11 min-w-0 rounded-xl border-[var(--border)] bg-[var(--surface)] pr-11 text-[var(--text)]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* PASSWORD INFO */}

            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-[var(--primary)]"
                />

                <p className="text-xs leading-5 text-[var(--muted)]">
                  Your password must contain at least 6 characters. For better
                  security, avoid using easily guessed passwords.
                </p>
              </div>
            </div>

            {/* MESSAGE */}

            {passwordMessage && (
              <div className="flex min-w-0 items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-600">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0" />

                <span className="break-words">{passwordMessage}</span>
              </div>
            )}

            {passwordError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600">
                {passwordError}
              </div>
            )}

            {/* SAVE PASSWORD */}

            <div className="flex justify-end border-t border-[var(--border)] pt-5">
              <Button
                type="submit"
                disabled={passwordLoading}
                className="w-full rounded-xl bg-[var(--primary)] px-5 text-white hover:bg-[var(--primary-dark)] sm:w-auto"
              >
                <LockKeyhole size={16} />

                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
