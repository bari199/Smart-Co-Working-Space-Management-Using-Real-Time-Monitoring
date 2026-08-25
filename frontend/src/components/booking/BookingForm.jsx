import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Calendar, Clock, Users, CheckCircle2, XCircle } from "lucide-react";

import {
  createBooking,
  checkBookingAvailability,
} from "../../pages/services/bookingService";

const BookingForm = ({ space, onSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    guests: 1,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const duration = useMemo(() => {
    const [startHour, startMinute] = formData.startTime.split(":").map(Number);
    const [endHour, endMinute] = formData.endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (end <= start) {
      return 0;
    }

    return (end - start) / 60;
  }, [formData.startTime, formData.endTime]);

  const estimatedPrice = Math.ceil(Number(space?.price || 0) * duration);

  useEffect(() => {
    setAvailable(null);
  }, [formData.date, formData.startTime, formData.endTime]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleCheckAvailability = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast.error("Select date and time first");
      return;
    }

    if (duration <= 0) {
      toast.error("End time must be after start time");
      return;
    }

    if (!space?._id) {
      toast.error("Workspace information is missing");
      return;
    }

    try {
      setChecking(true);

      const response = await checkBookingAvailability({
        space: space._id,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });

      const isAvailable = Boolean(response?.available);

      setAvailable(isAvailable);

      if (isAvailable) {
        toast.success("Time slot is available");
      } else {
        toast.error("This workspace is already booked for the selected time");
      }
    } catch (error) {
      console.error("Availability check error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to check availability",
      );
    } finally {
      setChecking(false);
    }
  };

  const validateBooking = () => {
    if (!space?._id) {
      toast.error("Workspace information is missing");
      return false;
    }

    if (!formData.date) {
      toast.error("Please select a booking date");
      return false;
    }

    if (duration <= 0) {
      toast.error("End time must be after start time");
      return false;
    }

    if (Number(formData.guests) < 1) {
      toast.error("At least one guest is required");
      return false;
    }

    const capacity = Number(space?.capacity || 0);

    if (Number(formData.guests) > capacity) {
      toast.error(`Maximum capacity is ${space?.capacity}`);
      return false;
    }

    return true;
  };

  const handleBookingNow = async () => {
    if (loading) {
      return;
    }

    if (!validateBooking()) {
      return;
    }

    try {
      setLoading(true);

      const availabilityResponse = await checkBookingAvailability({
        space: space._id,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });

      if (!availabilityResponse?.available) {
        setAvailable(false);

        toast.error(
          "This workspace is no longer available for the selected time",
        );

        return;
      }

      setAvailable(true);

      const response = await createBooking({
        space: space._id,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        guests: Number(formData.guests),
        notes: formData.notes,
      });

      console.log("CREATE BOOKING RESPONSE:", response);

      const bookingId =
        response?.booking?._id ||
        response?.booking?.id ||
        response?.data?.booking?._id ||
        response?.data?.booking?.id ||
        response?.data?._id ||
        response?.data?.id ||
        response?._id ||
        response?.id;

      console.log("BOOKING ID:", bookingId);

      if (!bookingId) {
        throw new Error(
          "Booking request was created, but booking ID was not returned by the server.",
        );
      }

      toast.success("Booking request submitted successfully");

      if (typeof onSuccess === "function") {
        try {
          onSuccess(response);
        } catch (callbackError) {
          console.error("Booking onSuccess callback error:", callbackError);
        }
      }

      navigate(`/dashboard/bookings/${bookingId}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Create booking error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create booking request";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = () => {
    if (!space?._id) {
      toast.error("Workspace information is missing");
      return;
    }

    navigate(`/spaces/${space._id}/inquiry`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleBookingNow();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Booking form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
            Workspace reservation
          </p>

          <h2 className="mt-1 text-xl font-bold text-[var(--text)]">
            Book this workspace
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Submit a booking request. The workspace owner must confirm it before
            payment.
          </p>
        </div>

        <div className="space-y-5">
          {/* Date */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
              <Calendar size={14} />
              Booking date
            </label>

            <input
              type="date"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-[var(--secondary)]"
            />
          </div>

          {/* Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
                <Clock size={14} />
                Start time
              </label>

              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-[var(--secondary)]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
                <Clock size={14} />
                End time
              </label>

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-[var(--secondary)]"
              />
            </div>
          </div>

          {/* Availability */}
          <button
            type="button"
            onClick={handleCheckAvailability}
            disabled={checking}
            className="w-full rounded-xl border border-[var(--secondary)] px-4 py-2.5 text-sm font-bold text-[var(--secondary)] transition hover:bg-[var(--secondary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checking ? "Checking..." : "Check availability"}
          </button>

          {available !== null && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-sm font-medium ${
                available
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {available ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : (
                <XCircle size={16} className="shrink-0" />
              )}
              {available
                ? "This time slot is available."
                : "This time slot is already booked."}
            </div>
          )}

          {/* Guests */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
              <Users size={14} />
              Number of guests
            </label>

            <input
              type="number"
              name="guests"
              min="1"
              max={space?.capacity}
              value={formData.guests}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-[var(--secondary)]"
            />

            <p className="mt-1.5 text-xs text-[var(--muted)]">
              Maximum capacity: {space?.capacity}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--text)]">
              Notes
            </label>

            <textarea
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special requirements?"
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-[var(--secondary)]"
            />
          </div>

          {/* Actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              disabled={loading || available === false}
              className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Book now"}
            </button>

            <button
              type="button"
              onClick={handleInquiry}
              disabled={loading}
              className="rounded-xl border border-[var(--secondary)] px-5 py-3 text-sm font-bold text-[var(--secondary)] transition hover:bg-[var(--secondary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send inquiry
            </button>
          </div>

          <p className="text-center text-xs text-[var(--muted)]">
            Booking requests require owner confirmation. Payment is only
            available after confirmation.
          </p>
        </div>
      </form>

      {/* Booking summary */}
      <div className="h-fit rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-[var(--text)]">
          Booking summary
        </h2>

        <div className="mt-5 space-y-3.5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[var(--muted)]">Workspace</span>
            <span className="text-right font-semibold text-[var(--text)]">
              {space?.name}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-[var(--muted)]">Price / hour</span>
            <span className="font-semibold text-[var(--text)]">
              ₹{space?.price || 0}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-[var(--muted)]">Duration</span>
            <span className="font-semibold text-[var(--text)]">
              {duration > 0
                ? `${duration} hour${duration !== 1 ? "s" : ""}`
                : "—"}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-[var(--muted)]">Guests</span>
            <span className="font-semibold text-[var(--text)]">
              {formData.guests}
            </span>
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--text)]">
                Estimated total
              </span>
              <span className="text-xl font-extrabold text-[var(--primary)]">
                ₹{estimatedPrice}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--surfaceAlt)] p-3.5 text-xs text-[var(--muted)]">
            <p className="font-semibold text-[var(--text)]">Booking process</p>

            <ol className="mt-2 space-y-1 pl-4 list-decimal">
              <li>Submit booking request</li>
              <li>Owner reviews request</li>
              <li>Owner confirms</li>
              <li>Payment becomes available</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
