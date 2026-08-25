import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import BookingCard from "../../components/booking/BookingCard";
import Loading from "../../components/common/Loading";
import { getMyBookings } from "../services/bookingService";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getMyBookings();

      setBookings(data?.bookings || data?.data || data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <div className="min-w-0">
      {/* =====================================================
          PAGE INTRO
      ====================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
          <CalendarDays size={16} />
          Workspace Bookings
        </div>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              View, track and manage all your workspace bookings in one place.
            </p>
          </div>

          <Link
            to="/spaces"
            className="group inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
          >
            Explore Spaces
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </motion.div>

      {/* =====================================================
          BOOKING CONTENT
      ====================================================== */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8"
        >
          <Loading />
        </motion.div>
      ) : bookings.length === 0 ? (
        /* =====================================================
            EMPTY STATE
        ====================================================== */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm sm:p-12"
        >
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--primary)]/10 blur-2xl" />

          <div className="relative mx-auto flex max-w-lg flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <CalendarDays size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[var(--text)]">
              No bookings yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              You haven't booked a workspace yet. Explore available spaces and
              find the perfect place for your next work session.
            </p>

            <Link
              to="/spaces"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              Browse Workspaces
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      ) : (
        /* =====================================================
            BOOKINGS LIST
        ====================================================== */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="space-y-5"
        >
          {/* Section heading */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">
                Your Workspace Bookings
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Keep track of your upcoming and previous reservations.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted)] sm:flex">
              <Sparkles size={14} className="text-[var(--primary)]" />
              {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
            </div>
          </div>

          {/* Booking cards */}
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking?._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06,
                }}
              >
                <BookingCard booking={booking} onUpdated={loadBookings} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* =====================================================
          QUICK INFORMATION
      ====================================================== */}
      {!loading && bookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <CalendarDays size={19} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
              Booking Schedule
            </h3>

            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Keep an eye on your upcoming workspace reservations.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <Clock3 size={19} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
              Stay Updated
            </h3>

            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Booking status and updates will appear automatically.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <MapPin size={19} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
              Find More Spaces
            </h3>

            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Discover new workspaces whenever you need one.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyBookings;
