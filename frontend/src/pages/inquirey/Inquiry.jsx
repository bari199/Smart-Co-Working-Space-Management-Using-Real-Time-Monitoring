import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, Users } from "lucide-react";

import { getSpaceById } from "../services/spaceService";
import { createInquiry } from "../services/inquiryService";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/authContext";

const Inquiry = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [space, setSpace] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    spaceType: "",
    seats: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: "",
  });

  /* =====================================================
     LOAD SPACE
  ====================================================== */

  useEffect(() => {
    const loadSpace = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSpaceById(id);

        const loadedSpace = data?.space || data?.data || data;

        setSpace(loadedSpace);

        /*
         * Pre-fill user information when available.
         */

        setFormData((prev) => ({
          ...prev,

          firstName: user?.firstName || user?.name?.split(" ")[0] || "",

          lastName:
            user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "",

          email: user?.email || "",

          mobile: user?.phone || user?.mobile || "",
        }));
      } catch (error) {
        console.error("Load inquiry space error:", error);

        setError(error?.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSpace();
    }
  }, [id, user]);

  /* =====================================================
     HANDLE INPUT
  ====================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     SUBMIT INQUIRY
  ====================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!space?._id) {
      toast.error("Workspace information is missing");
      return;
    }

    if (
      !formData.spaceType ||
      !formData.seats ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim()
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    const seats = Number(formData.seats);

    if (!Number.isInteger(seats) || seats < 1) {
      toast.error("Number of seats must be at least 1");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        space: space._id,

        spaceType: formData.spaceType,

        seats,

        firstName: formData.firstName.trim(),

        lastName: formData.lastName.trim(),

        email: formData.email.trim().toLowerCase(),

        mobile: formData.mobile.trim(),

        message: formData.message.trim(),
      };

      await createInquiry(payload);

      toast.success("Inquiry sent successfully");

      navigate("/dashboard/inquiries");
    } catch (error) {
      console.error("Create inquiry error:", error);

      toast.error(error?.message || "Failed to send inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Loading />
      </div>
    );
  }

  /* =====================================================
     ERROR
  ====================================================== */

  if (error || !space) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <h2 className="text-xl font-semibold">Workspace not found</h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            {error || "This workspace is no longer available."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/spaces")}
            className="mt-5 rounded-lg bg-[var(--primary)] px-5 py-2.5 font-medium text-white"
          >
            Back to Workspaces
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     UI
  ====================================================== */

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      {/* BACK */}

      <button
        type="button"
        onClick={() => navigate(`/spaces/${space._id}`)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--secondary)] transition hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Workspace
      </button>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* =================================================
            LEFT - SPACE SUMMARY
        ================================================== */}

        <div className="h-fit overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          {space.image ? (
            <img
              src={space.image}
              alt={space.name}
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-64 items-center justify-center bg-[var(--accent)]/10 text-sm text-[var(--muted)]">
              No Image
            </div>
          )}

          <div className="p-6">
            <span className="rounded-full bg-[var(--accent)]/30 px-3 py-1 text-xs font-medium text-[var(--primary)] dark:text-[var(--accent)]">
              {space.workspaceType || "Workspace"}
            </span>

            <h1 className="mt-4 text-2xl font-bold">{space.name}</h1>

            <p className="mt-2 text-sm text-[var(--muted)]">{space.location}</p>

            {space.description && (
              <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
                {space.description}
              </p>
            )}

            <div className="mt-6 space-y-3 border-t border-[var(--border)] pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Workspace Type</span>

                <span className="font-medium">
                  {space.workspaceType || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Capacity</span>

                <span className="font-medium">
                  {space.capacity || "N/A"} seats
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Price</span>

                <span className="font-semibold text-[var(--primary)]">
                  ₹{space.price || 0}/hour
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT - INQUIRY FORM
        ================================================== */}

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
              Workspace Inquiry
            </p>

            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Tell us what you need
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Share your requirements and the workspace owner will get back to
              you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* =================================================
                SPACE TYPE
            ================================================== */}

            <div>
              <label
                htmlFor="spaceType"
                className="mb-2 block text-sm font-medium"
              >
                Space Type
                <span className="text-red-500"> *</span>
              </label>

              <select
                id="spaceType"
                name="spaceType"
                value={formData.spaceType}
                onChange={handleChange}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
              >
                <option value="">Select space type</option>

                <option value="Private Office">Private Office</option>

                <option value="Dedicated Desk">Dedicated Desk</option>

                <option value="Hot Desk">Hot Desk</option>

                <option value="Meeting Room">Meeting Room</option>

                <option value="Conference Room">Conference Room</option>

                <option value="Virtual Office">Virtual Office</option>

                <option value="Other">Other</option>
              </select>
            </div>

            {/* =================================================
                NUMBER OF SEATS
            ================================================== */}

            <div>
              <label htmlFor="seats" className="mb-2 block text-sm font-medium">
                Number of Seats
                <span className="text-red-500"> *</span>
              </label>

              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />

                <input
                  id="seats"
                  name="seats"
                  type="number"
                  min="1"
                  value={formData.seats}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)]"
                />
              </div>
            </div>

            {/* =================================================
                FIRST / LAST NAME
            ================================================== */}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium"
                >
                  First Name
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium"
                >
                  Last Name
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                />
              </div>
            </div>

            {/* =================================================
                EMAIL / MOBILE
            ================================================== */}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="mb-2 block text-sm font-medium"
                >
                  Mobile Number
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />

                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile number"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                MESSAGE
            ================================================== */}

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium"
              >
                Additional Requirements
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell the workspace owner about your requirements..."
                className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
              />
            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(`/spaces/${space._id}`)}
                disabled={submitting}
                className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-medium transition hover:bg-[var(--accent)]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending Inquiry..." : "Submit Inquiry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Inquiry;
