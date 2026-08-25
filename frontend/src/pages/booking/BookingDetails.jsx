import { useParams, Link } from "react-router-dom";

const BookingDetails = () => {
  const { bookingId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Booking Details</h1>

      <p className="mt-2 text-sm text-[var(--muted)]">
        Booking ID: {bookingId}
      </p>

      <Link
        to="/dashboard/bookings"
        className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white"
      >
        Back to My Bookings
      </Link>
    </div>
  );
};

export default BookingDetails;
