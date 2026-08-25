import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const OwnerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-[var(--secondary)]">
            Owner Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[var(--text)]">
            Welcome, {user?.name || "Owner"} 👋
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            Manage your spaces, bookings and inquiries from here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/owner/spaces"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--accent)]"
          >
            <p className="text-sm text-[var(--muted)]">My Spaces</p>

            <h2 className="mt-2 text-3xl font-bold text-[var(--primary)]">→</h2>

            <p className="mt-3 text-sm text-[var(--muted)]">
              Add and manage your workspace listings.
            </p>
          </Link>

          <Link
            to="/owner/bookings"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--accent)]"
          >
            <p className="text-sm text-[var(--muted)]">Bookings</p>

            <h2 className="mt-2 text-3xl font-bold text-[var(--primary)]">→</h2>

            <p className="mt-3 text-sm text-[var(--muted)]">
              View and manage customer bookings.
            </p>
          </Link>

          <Link
            to="/owner/inquiries"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--accent)]"
          >
            <p className="text-sm text-[var(--muted)]">Inquiries</p>

            <h2 className="mt-2 text-3xl font-bold text-[var(--primary)]">→</h2>

            <p className="mt-3 text-sm text-[var(--muted)]">
              Check questions and requests from users.
            </p>
          </Link>
        </div>

        {/* Quick actions */}
        <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Quick Actions
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/owner/spaces"
              className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Manage Spaces
            </Link>

            <Link
              to="/owner/bookings"
              className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)]"
            >
              View Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
