import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CreditCard,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getPaymentById } from "../services/adminApi";

import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";

const AdminPaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        setLoading(true);

        const response = await getPaymentById(id);

        console.log("Payment details response:", response);

        // IMPORTANT:
        // api() already returns parsed JSON.
        if (response?.success) {
          setPayment(response?.payment || null);
        } else {
          setPayment(null);
        }
      } catch (err) {
        console.error("Failed to load payment:", err);

        alert(err?.message || err?.data?.message || "Failed to load payment.");

        setPayment(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPayment();
    }
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  if (loading) {
    return <AdminLoader fullPage text="Loading payment..." />;
  }

  if (!payment) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <CreditCard className="h-12 w-12 text-slate-300" />

        <h2 className="mt-4 text-lg font-bold text-[#041421]">
          Payment not found
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          The requested payment could not be loaded.
        </p>

        <button
          onClick={() => navigate("/admin/payments")}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#042630] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#041421]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </button>
      </div>
    );
  }

  /*
   * Depending on your backend populate structure,
   * booking may contain:
   * - space
   * - owner
   * - user
   */

  const booking = payment?.booking;

  const space = booking?.space;

  const owner = booking?.owner;

  const user = payment?.user || booking?.user;

  return (
    <div className="space-y-6">
      {/* ================================
          BACK BUTTON
      ================================= */}

      <button
        onClick={() => navigate("/admin/payments")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Payments
      </button>

      {/* ================================
          PAGE HEADER
      ================================= */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-[#4A7272]">Finance</p>

          <h1 className="mt-1 text-2xl font-bold text-[#041421]">
            Payment Details
          </h1>

          <p className="mt-1 break-all font-mono text-xs text-slate-400">
            {payment?._id || "—"}
          </p>
        </div>

        <StatusBadge status={payment?.status} />
      </div>

      {/* ================================
          MAIN CONTENT
      ================================= */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* =================================
            LEFT SIDE
        ================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          {/* Amount */}

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#e5eeee] p-3 text-[#4A7272]">
              <CreditCard className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-slate-400">Transaction Amount</p>

              <h2 className="text-3xl font-bold text-[#041421]">
                {formatCurrency(payment?.amount)}
              </h2>
            </div>
          </div>

          {/* Information Grid */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info icon={User} label="Customer" value={user?.name || "—"} />

            <Info
              icon={Mail}
              label="Customer Email"
              value={user?.email || "—"}
            />

            <Info
              icon={Building2}
              label="Workspace"
              value={space?.name || "—"}
            />

            <Info
              icon={MapPin}
              label="Location"
              value={space?.location || "—"}
            />

            <Info
              icon={CalendarDays}
              label="Booking Date"
              value={
                booking?.date
                  ? new Date(booking.date).toLocaleDateString("en-IN")
                  : "—"
              }
            />

            <Info icon={User} label="Owner" value={owner?.name || "—"} />
          </div>
        </section>

        {/* =================================
            RIGHT SIDE
        ================================== */}

        <div className="space-y-6">
          {/* =================================
              PAYMENT INFORMATION
          ================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-[#041421]">Payment Information</h2>

            <div className="mt-5 space-y-4">
              <Row
                label="Status"
                value={<StatusBadge status={payment?.status} />}
              />

              <Row label="Amount" value={formatCurrency(payment?.amount)} />

              <Row label="Payment ID" value={payment?.paymentId || "—"} />

              <Row label="Order ID" value={payment?.orderId || "—"} />

              <Row
                label="Created"
                value={
                  payment?.createdAt
                    ? new Date(payment.createdAt).toLocaleString("en-IN")
                    : "—"
                }
              />
            </div>
          </section>

          {/* =================================
              BOOKING INFORMATION
          ================================== */}

          {booking && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-[#041421]">Booking</h2>

              <p className="mt-4 break-all font-mono text-sm text-slate-600">
                #{booking?._id?.slice(-10) || "—"}
              </p>

              <div className="mt-3">
                <StatusBadge status={booking?.status} />
              </div>

              {booking?.startTime && (
                <div className="mt-4">
                  <p className="text-xs text-slate-400">Start Time</p>

                  <p className="mt-1 text-sm font-semibold text-[#041421]">
                    {booking.startTime}
                  </p>
                </div>
              )}

              {booking?.endTime && (
                <div className="mt-4">
                  <p className="text-xs text-slate-400">End Time</p>

                  <p className="mt-1 text-sm font-semibold text-[#041421]">
                    {booking.endTime}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* =================================
              WORKSPACE INFORMATION
          ================================== */}

          {space && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#4A7272]" />

                <h2 className="font-bold text-[#041421]">Workspace</h2>
              </div>

              <div className="mt-5">
                <p className="font-semibold text-[#041421]">
                  {space?.name || "—"}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />

                  {space?.location || "—"}
                </p>

                <p className="mt-2 text-sm capitalize text-slate-500">
                  Type: {space?.workspaceType || "—"}
                </p>

                {space?.price !== undefined && (
                  <p className="mt-2 text-sm text-slate-500">
                    Price: {formatCurrency(space.price)}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================
   INFO CARD
========================================= */

const Info = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-[#4A7272]" />

      <p className="mt-3 text-xs text-slate-400">{label}</p>

      <p className="mt-1 truncate text-sm font-semibold text-[#041421]">
        {value}
      </p>
    </div>
  );
};

/* =========================================
   INFORMATION ROW
========================================= */

const Row = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-slate-400">{label}</span>

      <span className="max-w-[220px] text-right text-sm font-semibold text-[#041421]">
        {value}
      </span>
    </div>
  );
};

export default AdminPaymentDetails;
