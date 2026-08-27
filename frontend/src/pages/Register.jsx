import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Upload,
  UserRound,
  UserPlus,
} from "lucide-react";

import { registerUser } from "./services/authService";
import { useAuth } from "../context/authContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    location: "",
    profilePicture: null,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /*
  ========================================================
  HANDLE INPUT CHANGE
  ========================================================
  */

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  };

  /*
  ========================================================
  HANDLE REGISTER
  ========================================================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    /*
    --------------------------------------------------------
    Basic frontend validation
    --------------------------------------------------------
    */

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      /*
      ======================================================
      CREATE FORMDATA
      ======================================================
      */

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim());
      data.append("password", formData.password);
      data.append("phone", formData.phone.trim());
      data.append("role", formData.role);
      data.append("location", formData.location.trim());

      /*
      ------------------------------------------------------
      Optional profile picture
      ------------------------------------------------------
      */

      if (formData.profilePicture instanceof File) {
        data.append("profilePicture", formData.profilePicture);
      }

      /*
      ======================================================
      DEBUG
      ======================================================
      */

      console.log("REGISTER FORMDATA:");

      for (const [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(key, value);
        }
      }

      /*
      ======================================================
      API REQUEST
      ======================================================
      */

      const response = await registerUser(data);

      console.log("REGISTER RESPONSE:", response);

      /*
      ======================================================
      SAVE AUTH
      ======================================================
      */

      login(response);

      toast.success(response?.message || "Registration successful");

      /*
      ======================================================
      REDIRECT BASED ON ROLE
      ======================================================
      */

      if (response?.user?.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      toast.error(error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[var(--background)] px-4 py-4 sm:py-5">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}

        <div className="mb-4 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-md">
            <UserPlus size={20} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Create your account
          </h1>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Join Smart Workspace and manage everything in one place.
          </p>
        </div>

        {/* Card */}

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name + Email */}

            <div className="grid gap-3.5 md:grid-cols-2">
              {/* Name */}

              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold text-[var(--text)]"
                >
                  Full name
                </Label>

                <div className="relative">
                  <UserRound
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="h-10 rounded-lg border-[var(--border)] bg-[var(--background)] pl-9 text-sm shadow-none focus-visible:border-[var(--primary)] focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                  />
                </div>
              </div>

              {/* Email */}

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-[var(--text)]"
                >
                  Email address
                </Label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="h-10 rounded-lg border-[var(--border)] bg-[var(--background)] pl-9 text-sm shadow-none focus-visible:border-[var(--primary)] focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Password */}

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-[var(--text)]"
              >
                Password
              </Label>

              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-10 rounded-lg border-[var(--border)] bg-[var(--background)] pl-9 pr-9 text-sm shadow-none focus-visible:border-[var(--primary)] focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Phone + Location */}

            <div className="grid gap-3.5 md:grid-cols-2">
              {/* Phone */}

              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-xs font-semibold text-[var(--text)]"
                >
                  Phone number
                </Label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="h-10 rounded-lg border-[var(--border)] bg-[var(--background)] pl-9 text-sm shadow-none focus-visible:border-[var(--primary)] focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                  />
                </div>
              </div>

              {/* Location */}

              <div className="space-y-1.5">
                <Label
                  htmlFor="location"
                  className="text-xs font-semibold text-[var(--text)]"
                >
                  Location
                </Label>

                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <Input
                    id="location"
                    name="location"
                    placeholder="New York, NY"
                    value={formData.location}
                    onChange={handleChange}
                    className="h-10 rounded-lg border-[var(--border)] bg-[var(--background)] pl-9 text-sm shadow-none focus-visible:border-[var(--primary)] focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Role */}

            <div className="space-y-1.5">
              <Label
                htmlFor="role"
                className="text-xs font-semibold text-[var(--text)]"
              >
                Account type
              </Label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              >
                <option value="user">User</option>

                <option value="owner">Workspace Owner</option>
              </select>
            </div>

            {/* Profile Picture */}

            <div className="space-y-1.5">
              <Label
                htmlFor="profilePicture"
                className="text-xs font-semibold text-[var(--text)]"
              >
                Profile picture{" "}
                <span className="font-normal text-[var(--muted)]">
                  (optional)
                </span>
              </Label>

              <label
                htmlFor="profilePicture"
                className="flex h-14 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[var(--border)] bg-[var(--background)] px-3 transition hover:border-[var(--primary)]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--surface)] text-[var(--primary)]">
                  <Upload size={15} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[var(--text)]">
                    {formData.profilePicture
                      ? formData.profilePicture.name
                      : "Upload profile picture"}
                  </p>

                  <p className="text-[10px] text-[var(--muted)]">
                    PNG, JPG or JPEG
                  </p>
                </div>

                <input
                  id="profilePicture"
                  type="file"
                  name="profilePicture"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit */}

            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-lg bg-[var(--primary)] text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)] disabled:opacity-60"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight size={15} />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}

          <div className="mt-4 border-t border-[var(--border)] pt-4 text-center">
            <p className="text-xs text-[var(--muted)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[var(--secondary)] hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
