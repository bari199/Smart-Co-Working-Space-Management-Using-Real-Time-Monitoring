import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { getSpaceById } from "../services/spaceService";
import { createInquiry } from "../services/inquiryService";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/authContext";

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

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Loading />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <h2 className="text-xl font-semibold">Workspace not found</h2>

          <button
            onClick={() => navigate("/spaces")}
            className="mt-5 rounded-lg bg-[var(--primary)] px-5 py-3 font-medium text-white"
          >
            Back to Workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      {/* HEADER */}

      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(`/spaces/${id}`)}
          className="mb-5 text-sm font-medium text-[var(--secondary)]"
        >
          ← Back to Workspace
        </button>

        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
          Workspace Inquiry
        </p>

        <h1 className="mt-2 text-3xl font-bold">Tell us what you need</h1>

        <p className="mt-3 text-[var(--muted)]">
          Send an inquiry to the workspace owner. They will review your
          requirements and get back to you.
        </p>
      </div>

      {/* SPACE SUMMARY */}

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row">
        {space.image && (
          <img
            src={space.image}
            alt={space.name}
            className="h-24 w-full rounded-xl object-cover sm:w-32"
          />
        )}

        <div>
          <h2 className="text-lg font-semibold">{space.name}</h2>

          <p className="mt-1 text-sm text-[var(--muted)]">{space.location}</p>

          <p className="mt-2 text-sm">
            Capacity: <span className="font-semibold">{space.capacity}</span>
          </p>
        </div>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8"
      >
        <div className="space-y-8">
          {/* SPACE REQUIREMENTS */}

          <div>
            <h2 className="text-lg font-semibold">Space Requirements</h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Tell the owner what kind of workspace you need.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {/* SPACE TYPE */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Space Type
                </label>

                <input
                  type="text"
                  name="spaceType"
                  value={form.spaceType}
                  onChange={handleChange}
                  placeholder="e.g. Private Office"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]"
                />
              </div>

              {/* SEATS */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Number of Seats
                </label>

                <input
                  type="number"
                  name="seats"
                  min="1"
                  max={space.capacity}
                  value={form.seats}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]"
                />

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Maximum {space.capacity} seats
                </p>
              </div>
            </div>
          </div>

          {/* PERSONAL DETAILS */}

          <div>
            <h2 className="text-lg font-semibold">Contact Information</h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              The workspace owner will use these details to contact you.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {/* FIRST NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]"
                />
              </div>

              {/* LAST NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]"
                />
              </div>

              {/* MOBILE */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          </div>

          {/* MESSAGE */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Additional Message
              <span className="ml-1 text-xs font-normal text-[var(--muted)]">
                (Optional)
              </span>
            </label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Tell the workspace owner anything else about your requirements..."
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* SUBMIT */}

          <div className="border-t border-[var(--border)] pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[var(--primary)] px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending Inquiry..." : "Send Inquiry"}
            </button>

            <p className="mt-3 text-center text-xs text-[var(--muted)]">
              Your inquiry will be sent to the workspace owner for review.
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

export default InquiryForm;
