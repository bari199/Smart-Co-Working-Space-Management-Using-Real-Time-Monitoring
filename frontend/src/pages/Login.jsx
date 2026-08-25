import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { loginUser } from "./services/authService";
import { useAuth } from "../context/authContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      login(data);

      toast.success("Login successful");

      if (data.user.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[var(--background)] px-4 py-5 sm:py-6">
      <div className="mx-auto flex w-full max-w-md justify-center">
        <div className="w-full">
          {/* Header */}
          <div className="mb-4 text-center">
            <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-md">
              <ShieldCheck size={20} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Welcome back
            </h1>

            <p className="mt-1 text-xs text-[var(--muted)]">
              Sign in to your Smart Workspace account.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="h-10 rounded-lg border-[var(--border)] bg-[var(--background)] pl-9 text-sm shadow-none focus-visible:border-[var(--primary)] focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                  />
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
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
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

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-lg bg-[var(--primary)] text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)] disabled:opacity-60"
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login
                    <ArrowRight size={15} />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-4 border-t border-[var(--border)] pt-4 text-center">
              <p className="text-xs text-[var(--muted)]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[var(--secondary)] hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
            Secure access to your workspace
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
