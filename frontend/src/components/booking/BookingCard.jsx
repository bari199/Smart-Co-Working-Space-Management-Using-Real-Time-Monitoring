import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-600",
  rejected: "bg-red-100 text-red-600",
};

const BookingCard = ({ booking, onUpdated }) => {
  const isPaid = booking.paymentStatus === "paid";
  const isCancelled = booking.status === "cancelled";
  const isRejected = booking.status === "rejected";
  const status = booking.status || "pending";

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition duration-300 hover:shadow-md">
      <div className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[var(--text)]">
              {booking.space?.name || "Workspace"}
            </h2>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                STATUS_STYLES[status] || STATUS_STYLES.pending
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-[var(--muted)]">
            <MapPin size={13} />
            {booking.space?.location || "Location unavailable"}
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-xs text-[var(--muted)]">
            <Calendar size={13} />
            {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
          </div>
        </div>

        <div className="text-left md:text-right">
          <span className="text-lg font-extrabold text-[var(--text)]">
            ₹{booking.totalPrice || booking.price || 0}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-[var(--border)] px-5 py-4">
        {!isPaid && !isCancelled && !isRejected && (
          <Link
            to={`/payment/${booking._id}`}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Pay now
          </Link>
        )}

        {isPaid && (
          <span className="rounded-lg bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
            Payment completed
          </span>
        )}

        {!isPaid && !isCancelled && !isRejected && (
          <button
            onClick={() => {
              // Existing cancel functionality
            }}
            className="rounded-lg border border-red-300 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            Cancel booking
          </button>
        )}
      </div>
    </article>
  );
};

export default BookingCard;
