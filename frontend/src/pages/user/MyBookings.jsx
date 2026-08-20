import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import BookingCard from "../../components/booking/BookingCard";
import Loading from "../../components/common/Loading";
import { getMyBookings } from "../../services/bookingService";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getMyBookings();

      setBookings(data.bookings || data.data || data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Bookings</h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Manage your workspace bookings.
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h2 className="font-semibold">No bookings yet</h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Your workspace bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onUpdated={loadBookings}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
