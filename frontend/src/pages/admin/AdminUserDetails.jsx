import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getUserById } from "../services/adminApi";
import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("Fetching user details for ID:", id);

        const response = await getUserById(id);

        console.log("User details API response:", response);

        /*
         * IMPORTANT:
         *
         * api.js uses fetch(), not axios.
         *
         * Therefore response is directly:
         *
         * {
         *   success: true,
         *   user: {...},
         *   activity: {...}
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
          throw new Error(response?.message || "Failed to fetch user details.");
        }

        setData(response);
      } catch (err) {
        console.error("Fetch user details error:", err);

        setError(
          err?.message || err?.data?.message || "Failed to fetch user details.",
        );

        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return <AdminLoader fullPage text="Loading user..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </button>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">Unable to load user</p>

          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const user = data?.user;

  const activity = {
    spaces: data?.activity?.spaces || [],
    bookings: data?.activity?.bookings || [],
    inquiries: data?.activity?.inquiries || [],
    payments: data?.activity?.payments || [],
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <User className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 font-semibold text-[#041421]">User not found</h3>

          <p className="mt-1 text-sm text-slate-400">
            The requested user could not be found.
          </p>
        </div>
      </div>
    );
  }

  const displayName =
    user?.name || user?.fullName || user?.username || "Unnamed User";

  const profilePicture =
    user?.profilePicture ||
    user?.profileImage ||
    user?.avatar ||
    user?.image ||
    "";

  const email = user?.email || "No email";

  const phone = user?.phone || user?.phoneNumber || "";

  const location = user?.location || user?.address?.city || user?.city || "";

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/users")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </button>

      {/* User Profile */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Profile Image */}
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={displayName}
              className="h-20 w-20 shrink-0 rounded-2xl object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#D0D6D6] text-2xl font-bold text-[#042630]">
              {displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#041421]">
                {displayName}
              </h1>

              <StatusBadge status={user?.role || "user"} />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              {/* Email */}
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {email}
              </span>

              {/* Phone */}
              {phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {phone}
                </span>
              )}

              {/* Location */}
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={Building2}
          label="Workspaces"
          value={activity.spaces.length}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Bookings"
          value={activity.bookings.length}
        />

        <SummaryCard
          icon={Mail}
          label="Inquiries"
          value={activity.inquiries.length}
        />

        <SummaryCard
          icon={CreditCard}
          label="Payments"
          value={activity.payments.length}
        />
      </div>

      {/* Owned Workspaces */}
      {activity.spaces.length > 0 && (
        <Section title="Owned Workspaces">
          <div className="grid gap-4 md:grid-cols-2">
            {activity.spaces.map((space, index) => (
              <div
                key={space?._id || space?.id || index}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-[#86B9B2]"
              >
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#041421]">
                      {space?.name || "Unnamed Workspace"}
                    </h3>

                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />

                      {space?.location || "Location not provided"}
                    </p>
                  </div>

                  <StatusBadge status={space?.availability || "unknown"} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Booking Activity */}
      {activity.bookings.length > 0 && (
        <Section title="Booking Activity">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Workspace</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {activity.bookings.map((booking, index) => (
                  <tr
                    key={booking?._id || booking?.id || index}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* Workspace */}
                    <td className="px-4 py-3 text-sm font-medium text-[#041421]">
                      {booking?.space?.name ||
                        booking?.workspace?.name ||
                        booking?.workspaceName ||
                        "—"}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(
                        booking?.date ||
                          booking?.bookingDate ||
                          booking?.createdAt,
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={booking?.status || "unknown"} />
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 text-sm font-semibold text-[#041421]">
                      ₹
                      {Number(
                        booking?.totalPrice ??
                          booking?.amount ??
                          booking?.price ??
                          0,
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Inquiries */}
      {activity.inquiries.length > 0 && (
        <Section title="Inquiries">
          <div className="space-y-3">
            {activity.inquiries.map((inquiry, index) => (
              <div
                key={inquiry?._id || inquiry?.id || index}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#041421]">
                      {inquiry?.subject || inquiry?.title || "Inquiry"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {inquiry?.message || inquiry?.description || "No message"}
                    </p>
                  </div>

                  {inquiry?.status && <StatusBadge status={inquiry.status} />}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Payments */}
      {activity.payments.length > 0 && (
        <Section title="Payment Activity">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {activity.payments.map((payment, index) => (
                  <tr key={payment?._id || payment?.id || index}>
                    <td className="px-4 py-3 text-sm font-medium text-[#041421]">
                      {payment?.paymentId ||
                        payment?.transactionId ||
                        "Payment"}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(
                        payment?.createdAt ||
                          payment?.date ||
                          payment?.paymentDate,
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={payment?.status || "unknown"} />
                    </td>

                    <td className="px-4 py-3 text-sm font-semibold text-[#041421]">
                      ₹
                      {Number(
                        payment?.amount ?? payment?.totalAmount ?? 0,
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* No Activity */}
      {activity.spaces.length === 0 &&
        activity.bookings.length === 0 &&
        activity.inquiries.length === 0 &&
        activity.payments.length === 0 && (
          <Section title="Activity">
            <div className="py-10 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-3 font-medium text-[#041421]">No activity yet</p>

              <p className="mt-1 text-sm text-slate-400">
                This user has no recorded workspace activity.
              </p>
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

      <p className="mt-1 text-2xl font-bold text-[#041421]">{value}</p>
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

export default AdminUserDetails;
