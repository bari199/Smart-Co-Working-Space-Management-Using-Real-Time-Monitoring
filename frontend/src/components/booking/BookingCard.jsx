import { useState } from "react";
import { toast } from "sonner";

import { cancelBooking } from "../../services/bookingService";

const BookingCard = ({ booking, onUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);

      await cancelBooking(booking._id);

      toast.success("Booking cancelled");

      onUpdated?.();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <h3 className="font-semibold">
            {booking.space?.name || "Workspace"}
          </h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {booking.space?.location || "Location unavailable"}
          </p>
        </div>

        <span className="h-fit rounded-full bg-[var(--accent)]/30 px-3 py-1 text-xs font-medium text-[var(--primary)] dark:text-[var(--accent)]">
          {booking.status || "Pending"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <p className="text-[var(--muted)]">Date</p>
          <p className="font-medium">
            {booking.date ? new Date(booking.date).toLocaleDateString() : "—"}
          </p>
        </div>

        <div>
          <p className="text-[var(--muted)]">Start</p>
          <p className="font-medium">{booking.startTime || "—"}</p>
        </div>

        <div>
          <p className="text-[var(--muted)]">End</p>
          <p className="font-medium">{booking.endTime || "—"}</p>
        </div>
      </div>

      {booking.status === "pending" && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="mt-5 rounded-lg border border-[var(--secondary)] px-4 py-2 text-sm font-medium text-[var(--secondary)] hover:bg-[var(--accent)]/10 disabled:opacity-50"
        >
          {loading ? "Cancelling..." : "Cancel Booking"}
        </button>
      )}
    </div>
  );
};

export default BookingCard;
