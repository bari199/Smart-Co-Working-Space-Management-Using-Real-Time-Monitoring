import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { getSpaceById } from "../services/spaceService";
import { createInquiry } from "../services/inquiryService";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/authContext";

const inputClass =
  "h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10";

const labelClass = "mb-1.5 block text-xs font-semibold text-[var(--text)]";

const sectionAnimation = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: "easeOut" },
};

const InquiryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    spaceType: "",
    seats: 1,
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: "",
  });

  useEffect(() => {
    const loadSpace = async () => {
      try {
        setLoading(true);

        const data = await getSpaceById(id);
        const workspace = data?.space || data?.data || data;

        setSpace(workspace);

        setForm((prev) => ({
          ...prev,
          spaceType: workspace?.workspaceType || "",
          email: user?.email || "",
          firstName: user?.name?.split(" ")[0] || "",
          lastName: user?.name?.split(" ").slice(1).join(" ") || "",
        }));
      } catch (error) {
        toast.error(error.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    };

    loadSpace();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/spaces/${id}/inquiry`,
        },
      });

      return;
    }

    if (!form.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!form.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.mobile.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    if (!form.spaceType.trim()) {
      toast.error("Space type is required");
      return;
    }

    if (Number(form.seats) < 1) {
      toast.error("Seats must be at least 1");
      return;
    }

    if (Number(form.seats) > Number(space.capacity)) {
      toast.error(`Maximum capacity is ${space.capacity}`);
      return;
    }

    try {
      setSubmitting(true);

      const response = await createInquiry({
        space: id,
        spaceType: form.spaceType,
        seats: Number(form.seats),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        message: form.message.trim(),
      });

      toast.success(response?.message || "Inquiry sent successfully");

      navigate("/dashboard/inquiries");
    } catch (error) {
      toast.error(error?.message || "Failed to send inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------
     LOADING
  --------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-68px)] items-center justify-center px-4">
        <Loading />
      </div>
    );
  }

  /* ---------------------------------------------
     NOT FOUND
  --------------------------------------------- */

  if (!space) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-68px)] max-w-3xl items-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm"
        >
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Building2 size={20} />
          </div>

          <h2 className="text-lg font-bold text-[var(--text)]">
            Workspace not found
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            The workspace you're looking for is no longer available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/spaces")}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ArrowLeft size={15} />
            Back to Workspaces
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
      {/* ---------------------------------------------
          TOP HEADER
      --------------------------------------------- */}

      <motion.div {...sectionAnimation} className="mb-5">
        <button
          type="button"
          onClick={() => navigate(`/spaces/${id}`)}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--primary)]"
        >
          <ArrowLeft size={14} />
          Back to Workspace
        </button>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
              Workspace Inquiry
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
              Tell us what you need
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--muted)] sm:text-sm">
              Share your requirements and the workspace owner will get back to
              you.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ---------------------------------------------
          WORKSPACE SUMMARY
      --------------------------------------------- */}

      <motion.div
        {...sectionAnimation}
        transition={{ ...sectionAnimation.transition, delay: 0.04 }}
        className="mb-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
      >
        <div className="flex items-center gap-3 p-3 sm:p-3.5">
          {space.image ? (
            <img
              src={space.image}
              alt={space.name}
              className="h-16 w-20 shrink-0 rounded-xl object-cover sm:h-18 sm:w-24"
            />
          ) : (
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--surfaceAlt)] text-[var(--primary)] sm:h-18 sm:w-24">
              <Building2 size={22} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-sm font-bold text-[var(--text)] sm:text-base">
                {space.name}
              </h2>

              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                <CheckCircle2 size={11} />
                Available
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} />
                {space.location || "Location not specified"}
              </span>

              <span className="inline-flex items-center gap-1">
                <Users size={12} />
                Capacity: {space.capacity}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------------------------------------------
          FORM
      --------------------------------------------- */}

      <motion.form
        {...sectionAnimation}
        transition={{ ...sectionAnimation.transition, delay: 0.08 }}
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
      >
        {/* FORM HEADER */}
        <div className="border-b border-[var(--border)] px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
              <MessageSquare size={16} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[var(--text)]">
                Inquiry Details
              </h2>

              <p className="text-[11px] text-[var(--muted)]">
                Complete the details below to contact the workspace owner.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {/* ---------------------------------------------
              SPACE REQUIREMENTS
          --------------------------------------------- */}

          <div className="px-4 py-4 sm:px-5">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-[var(--text)]">
                Space Requirements
              </h3>

              <p className="mt-0.5 text-xs text-[var(--muted)]">
                Tell the owner what type of workspace you need.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* SPACE TYPE */}
              <div>
                <label htmlFor="spaceType" className={labelClass}>
                  Space Type
                </label>

                <input
                  id="spaceType"
                  type="text"
                  name="spaceType"
                  value={form.spaceType}
                  onChange={handleChange}
                  placeholder="e.g. Private Office"
                  className={inputClass}
                />
              </div>

              {/* SEATS */}
              <div>
                <label htmlFor="seats" className={labelClass}>
                  Number of Seats
                </label>

                <div className="relative">
                  <Users
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    id="seats"
                    type="number"
                    name="seats"
                    min="1"
                    max={space.capacity}
                    value={form.seats}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                  />
                </div>

                <p className="mt-1 text-[10px] text-[var(--muted)]">
                  Maximum {space.capacity} seats
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------
              CONTACT INFORMATION
          --------------------------------------------- */}

          <div className="px-4 py-4 sm:px-5">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-[var(--text)]">
                Contact Information
              </h3>

              <p className="mt-0.5 text-xs text-[var(--muted)]">
                These details will be shared with the workspace owner.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* FIRST NAME */}
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  First Name
                </label>

                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={inputClass}
                />
              </div>

              {/* LAST NAME */}
              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Last Name
                </label>

                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={inputClass}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              {/* MOBILE */}
              <div>
                <label htmlFor="mobile" className={labelClass}>
                  Mobile Number
                </label>

                <div className="relative">
                  <Phone
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    id="mobile"
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------
              MESSAGE
          --------------------------------------------- */}

          <div className="px-4 py-4 sm:px-5">
            <label htmlFor="message" className={labelClass}>
              Additional Message
              <span className="ml-1 font-normal text-[var(--muted)]">
                (Optional)
              </span>
            </label>

            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell the workspace owner anything else about your requirements..."
              className="min-h-[96px] w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
            />
          </div>

          {/* ---------------------------------------------
              SUBMIT
          --------------------------------------------- */}

          <div className="flex flex-col gap-2.5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-[11px] leading-4 text-[var(--muted)]">
              Your inquiry will be reviewed by the workspace owner.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Send Inquiry
                </>
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </section>
  );
};

export default InquiryForm;
