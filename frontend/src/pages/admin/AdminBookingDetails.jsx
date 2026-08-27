import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  IndianRupee,
  Hash,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../services/adminApi";
import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";

const AdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      if (!id) {
        setError("Booking ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("Fetching booking details for ID:", id);

        const response = await getBookingById(id);

        console.log("Booking details API response:", response);

        /*
         * IMPORTANT:
         *
         * adminApi.js uses fetch(), not axios.
         *
         * Therefore response is directly:
         *
         * {
         *   success: true,
         *   booking: {...}
         * }
         *
         * NOT:
         *
         * {
         *   data: {
         *     success: true
         *   }
         * }
         */

        if (!response?.success) {
          throw new Error(
            response?.message || "Failed to fetch booking details.",
          );
        }

        setData(response);
      } catch (err) {
        console.error("Fetch booking details error:", err);

        setError(
          err?.message ||
            err?.data?.message ||
            "Failed to fetch booking details.",
        );

        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  if (loading) {
    return <AdminLoader fullPage text="Loading booking..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/admin/bookings")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </button>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">Unable to load booking</p>

          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const booking = data?.booking;

  if (!booking) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/admin/bookings")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 font-semibold text-[#041421]">
            Booking not found
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            The requested booking could not be found.
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     NORMALIZE BOOKING DATA
  ============================================================ */

  const bookingId = booking?._id || booking?.id || "—";

  const user = booking?.user || booking?.customer || {};

  const workspace = booking?.space || booking?.workspace || {};

  const customerName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    booking?.userName ||
    booking?.customerName ||
    "Unknown Customer";

  const email = user?.email || booking?.email || "No email";

  const phone =
    user?.phone ||
    user?.phoneNumber ||
    booking?.phone ||
    booking?.phoneNumber ||
    "";

  const workspaceName =
    workspace?.name || booking?.workspaceName || "Unknown Workspace";

  const workspaceLocation =
    workspace?.location ||
    workspace?.address ||
    booking?.location ||
    "Location not provided";

  const workspaceType =
    workspace?.type || workspace?.workspaceType || booking?.workspaceType || "";

  const bookingStatus = booking?.status || "unknown";

  const paymentStatus =
    booking?.paymentStatus || booking?.payment?.status || "pending";

  const bookingDate = booking?.date || booking?.bookingDate || "";

  const startTime = booking?.startTime || booking?.start || booking?.from || "";

  const endTime = booking?.endTime || booking?.end || booking?.to || "";

  const totalPrice =
    booking?.totalPrice ??
    booking?.amount ??
    booking?.price ??
    booking?.totalAmount ??
    0;

  const paymentId =
    booking?.paymentId ||
    booking?.transactionId ||
    booking?.payment?.paymentId ||
    booking?.payment?.transactionId ||
    "";

  const createdAt = booking?.createdAt || "";

  const updatedAt = booking?.updatedAt || "";

  return (
    <div className="space-y-6">
      {/* ============================================================
          BACK BUTTON
      ============================================================ */}

      <button
        type="button"
        onClick={() => navigate("/admin/bookings")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bookings
      </button>

      {/* ============================================================
          PAGE HEADER
      ============================================================ */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#e5eeee] text-[#4A7272]">
              <CalendarDays className="h-8 w-8" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[#041421]">
                  Booking Details
                </h1>

                <StatusBadge status={bookingStatus} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Hash className="h-4 w-4" />
                  {bookingId}
                </span>

                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" />
                  Payment:{" "}
                  <span className="font-medium text-slate-700">
                    {paymentStatus}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div>
            <StatusBadge status={paymentStatus} />
          </div>
        </div>
      </div>

      {/* ============================================================
          SUMMARY CARDS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Booking Date"
          value={formatDate(bookingDate)}
        />

        <SummaryCard
          icon={Clock3}
          label="Booking Time"
          value={
            startTime || endTime
              ? `${startTime || "—"} - ${endTime || "—"}`
              : "—"
          }
        />

        <SummaryCard
          icon={IndianRupee}
          label="Total Amount"
          value={`₹${Number(totalPrice).toLocaleString("en-IN")}`}
        />

        <SummaryCard
          icon={CreditCard}
          label="Payment Status"
          value={capitalize(paymentStatus)}
        />
      </div>

      {/* ============================================================
          CUSTOMER INFORMATION
      ============================================================ */}

      <Section title="Customer Information">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#D0D6D6] text-xl font-bold text-[#042630]">
            {customerName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#041421]">{customerName}</h3>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {email}
              </span>

              {phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {phone}
                </span>
              )}
            </div>
          </div>

          <StatusBadge status={user?.role || "user"} />
        </div>
      </Section>

      {/* ============================================================
          WORKSPACE INFORMATION
      ============================================================ */}

      <Section title="Workspace Information">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard icon={Building2} label="Workspace" value={workspaceName} />

          <InfoCard icon={MapPin} label="Location" value={workspaceLocation} />

          {workspaceType && (
            <InfoCard
              icon={Building2}
              label="Workspace Type"
              value={workspaceType}
            />
          )}

          {workspace?.capacity && (
            <InfoCard
              icon={User}
              label="Capacity"
              value={`${workspace.capacity} people`}
            />
          )}
        </div>
      </Section>

      {/* ============================================================
          BOOKING INFORMATION
      ============================================================ */}

      <Section title="Booking Information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Booking ID" value={bookingId} />

          <DetailItem label="Booking Date" value={formatDate(bookingDate)} />

          <DetailItem
            label="Booking Status"
            value={<StatusBadge status={bookingStatus} />}
          />

          <DetailItem
            label="Payment Status"
            value={<StatusBadge status={paymentStatus} />}
          />

          <DetailItem
            label="Total Amount"
            value={`₹${Number(totalPrice).toLocaleString("en-IN")}`}
          />

          {paymentId && <DetailItem label="Payment ID" value={paymentId} />}
        </div>
      </Section>

      {/* ============================================================
          TIME INFORMATION
      ============================================================ */}

      {(startTime || endTime) && (
        <Section title="Schedule">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={Clock3}
              label="Start Time"
              value={startTime || "Not provided"}
            />

            <InfoCard
              icon={Clock3}
              label="End Time"
              value={endTime || "Not provided"}
            />
          </div>
        </Section>
      )}

      {/* ============================================================
          PAYMENT INFORMATION
      ============================================================ */}

      <Section title="Payment Information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Payment Status"
            value={<StatusBadge status={paymentStatus} />}
          />

          <DetailItem
            label="Amount Paid"
            value={`₹${Number(totalPrice).toLocaleString("en-IN")}`}
          />

          <DetailItem label="Payment ID" value={paymentId || "—"} />
        </div>
      </Section>

      {/* ============================================================
          TIMESTAMPS
      ============================================================ */}

      {(createdAt || updatedAt) && (
        <Section title="Record Information">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Created At" value={formatDateTime(createdAt)} />

            <DetailItem
              label="Last Updated"
              value={formatDateTime(updatedAt)}
            />
          </div>
        </Section>
      )}
    </div>
  );
};

/* ============================================================
   SUMMARY CARD
============================================================ */

const SummaryCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eeee] text-[#4A7272]">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-sm text-slate-400">{label}</p>

      <p className="mt-1 break-words text-xl font-bold text-[#041421]">
        {value}
      </p>
    </div>
  );
};

/* ============================================================
   SECTION
============================================================ */

const Section = ({ title, children }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 font-bold text-[#041421]">{title}</h2>

      {children}
    </section>
  );
};

/* ============================================================
   INFO CARD
============================================================ */

const InfoCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 p-4 transition hover:border-[#86B9B2]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e5eeee] text-[#4A7272]">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words font-semibold text-[#041421]">
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   DETAIL ITEM
============================================================ */

const DetailItem = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 text-sm font-semibold text-[#041421]">
        {value || "—"}
      </div>
    </div>
  );
};

/* ============================================================
   DATE FORMATTER
============================================================ */

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ============================================================
   DATE + TIME FORMATTER
============================================================ */

const formatDateTime = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ============================================================
   CAPITALIZE
============================================================ */

const capitalize = (value) => {
  if (!value) {
    return "—";
  }

  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

/* ============================================================
   EXPORT
============================================================ */

export default AdminBookingDetails;
