import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getOwnerBookings,
  updateBookingStatus,
} from "../services/bookingService";

import Loading from "../../components/common/Loading";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const data = await getOwnerBookings();

      setBookings(data?.bookings || data?.data || data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await updateBookingStatus(id, status);

      toast.success(
        status === "confirmed"
          ? "Booking approved successfully"
          : "Booking rejected successfully",
      );

      await fetchBookings();
    } catch (error) {
      toast.error(error.message || "Failed to update booking");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-[var(--secondary)]">Owner</p>

          <h1 className="mt-1 text-3xl font-bold text-[var(--text)]">
            Owner Bookings
          </h1>

          <p className="mt-1 text-[var(--muted)]">
            Review and manage bookings for your spaces.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              No bookings yet
            </h2>

            <p className="mt-2 text-[var(--muted)]">
              Bookings for your spaces will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = booking.status || "pending";

              return (
                <div
                  key={booking._id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text)]">
                        {booking.space?.name || "Workspace"}
                      </h2>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Customer:{" "}
                        {booking.user?.name ||
                          booking.user?.email ||
                          "Unknown user"}
                      </p>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Date:{" "}
                        {booking.date
                          ? new Date(booking.date).toLocaleDateString()
                          : "N/A"}
                      </p>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Amount: ₹{booking.totalPrice || booking.price || 0}
                      </p>
                    </div>

                    <span
                      className={`h-fit rounded-full px-3 py-1 text-sm font-medium ${
                        status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-[var(--accent)]/30 text-[var(--primary)]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {status === "pending" && (
                    <div className="mt-5 flex gap-3 border-t border-[var(--border)] pt-4">
                      <button
                        disabled={updatingId === booking._id}
                        onClick={() => updateStatus(booking._id, "confirmed")}
                        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === booking._id ? "Updating..." : "Approve"}
                      </button>

                      <button
                        disabled={updatingId === booking._id}
                        onClick={() => updateStatus(booking._id, "rejected")}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;
