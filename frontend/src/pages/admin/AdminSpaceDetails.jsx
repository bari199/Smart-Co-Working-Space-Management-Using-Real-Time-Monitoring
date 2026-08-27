import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getSpaceById } from "../services/adminApi";
import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";

const AdminSpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpace = async () => {
      if (!id) {
        setError("Workspace ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("Fetching workspace details for ID:", id);

        const response = await getSpaceById(id);

        console.log("Workspace details API response:", response);

        /*
         * IMPORTANT:
         *
         * adminApi.js uses fetch().
         *
         * Therefore response is directly:
         *
         * {
         *   success: true,
         *   space: {...},
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
          throw new Error(
            response?.message || "Failed to fetch workspace details.",
          );
        }

        setData(response);
      } catch (err) {
        console.error("Fetch workspace details error:", err);

        setError(
          err?.message ||
            err?.response?.data?.message ||
            "Failed to fetch workspace details.",
        );

        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadSpace();
  }, [id]);

  if (loading) {
    return <AdminLoader fullPage text="Loading workspace..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/admin/spaces")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </button>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">Unable to load workspace</p>

          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const space = data?.space;

  const activity = {
    bookings: data?.activity?.bookings || [],
  };

  if (!space) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/admin/spaces")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Users className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 font-semibold text-[#041421]">
            Workspace not found
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            The requested workspace could not be found.
          </p>
        </div>
      </div>
    );
  }

  const owner = space?.owner || {};

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/spaces")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#4A7272]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Workspaces
      </button>

      {/* Workspace Header */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {space?.image ? (
          <img
            src={space.image}
            alt={space.name || "Workspace"}
            className="h-64 w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-[#D0D6D6] text-[#042630]">
            <Building2Icon />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[#041421]">
                  {space?.name || "Unnamed Workspace"}
                </h1>

                <StatusBadge status={space?.availability || "unknown"} />
              </div>

              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />

                {space?.location || "Location not provided"}
              </p>

              {space?.workspaceType && (
                <p className="mt-2 text-sm capitalize text-slate-400">
                  {space.workspaceType}
                </p>
              )}
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs text-slate-400">Price / Day</p>

              <p className="mt-1 text-2xl font-bold text-[#041421]">
                ₹{Number(space?.price || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Description */}
          {space?.description && (
            <p className="mt-6 max-w-4xl text-sm leading-7 text-slate-600">
              {space.description}
            </p>
          )}

          {/* Info Cards */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={Users}
              label="Capacity"
              value={space?.capacity || "—"}
            />

            <InfoCard
              icon={CalendarDays}
              label="Bookings"
              value={activity.bookings.length}
            />

            <InfoCard
              icon={Mail}
              label="Owner Email"
              value={owner?.email || "—"}
            />

            <InfoCard
              icon={Phone}
              label="Owner Phone"
              value={owner?.phone || "—"}
            />
          </div>
        </div>
      </div>

      {/* Owner Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-[#041421]">Workspace Owner</h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          {owner?.profilePicture ? (
            <img
              src={owner.profilePicture}
              alt={owner?.name || "Owner"}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D0D6D6] text-lg font-bold text-[#042630]">
              {owner?.name?.charAt(0)?.toUpperCase() || "O"}
            </div>
          )}

          <div>
            <p className="font-semibold text-[#041421]">
              {owner?.name || "Unknown Owner"}
            </p>

            <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500">
              {owner?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {owner.email}
                </span>
              )}

              {owner?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {owner.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      {Array.isArray(space?.amenities) && space.amenities.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#041421]">Amenities</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {space.amenities.map((amenity, index) => (
              <span
                key={`${amenity}-${index}`}
                className="rounded-full bg-[#e5eeee] px-3 py-1.5 text-xs font-semibold text-[#4A7272]"
              >
                {amenity}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Booking Activity */}
      {activity.bookings.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-bold text-[#041421]">Booking Activity</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Customer</th>

                  <th className="px-4 py-3">Date</th>

                  <th className="px-4 py-3">Status</th>

                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {activity.bookings.map((booking, index) => (
                  <tr
                    key={booking?._id || booking?.id || index}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-[#041421]">
                        {booking?.user?.name ||
                          booking?.customer?.name ||
                          booking?.userName ||
                          "—"}
                      </p>

                      <p className="text-xs text-slate-400">
                        {booking?.user?.email ||
                          booking?.customer?.email ||
                          booking?.email ||
                          ""}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(
                        booking?.date ||
                          booking?.bookingDate ||
                          booking?.createdAt,
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={booking?.status || "unknown"} />
                    </td>

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
        </section>
      )}

      {/* No bookings */}
      {activity.bookings.length === 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="py-8 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 font-medium text-[#041421]">No bookings yet</p>

            <p className="mt-1 text-sm text-slate-400">
              This workspace has no recorded bookings.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

/* ============================================================
   BUILDING ICON
============================================================ */

const Building2Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-12 w-12"
  >
    <path d="M3 21h18" />
    <path d="M6 21V3h12v18" />
    <path d="M9 7h2" />
    <path d="M13 7h2" />
    <path d="M9 11h2" />
    <path d="M13 11h2" />
    <path d="M9 15h2" />
    <path d="M13 15h2" />
  </svg>
);

/* ============================================================
   INFO CARD
============================================================ */

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl bg-slate-50 p-4">
    <Icon className="h-5 w-5 text-[#4A7272]" />

    <p className="mt-3 text-xs text-slate-400">{label}</p>

    <p className="mt-1 truncate text-sm font-semibold text-[#041421]">
      {value}
    </p>
  </div>
);

/* ============================================================
   DATE FORMATTER
============================================================ */

const formatDate = (date) => {
  if (!date) return "—";

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

export default AdminSpaceDetails;
