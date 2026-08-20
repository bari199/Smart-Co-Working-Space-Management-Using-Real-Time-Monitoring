import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-[var(--muted)]">Welcome back</p>

        <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>

        <p className="mt-2 text-[var(--muted)]">
          Manage your workspaces, bookings and inquiries.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/dashboard/bookings"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="font-semibold">My Bookings</h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            View and manage your workspace bookings.
          </p>
        </Link>

        <Link
          to="/dashboard/inquiries"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="font-semibold">My Inquiries</h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Check your inquiries and owner replies.
          </p>
        </Link>

        <Link
          to="/dashboard/notifications"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="font-semibold">Notifications</h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Stay updated with your latest activity.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
