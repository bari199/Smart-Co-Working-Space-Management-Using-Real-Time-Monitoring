import React, { useEffect, useState } from "react";
import { Building2, CalendarCheck, Mail, Phone, Users } from "lucide-react";
import { getOwners } from "../services/adminApi";
import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";

const AdminOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOwners = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching owners...");

        const response = await getOwners();

        console.log("Owners API response:", response);

        /*
         * IMPORTANT:
         *
         * adminApi uses fetch().
         *
         * Therefore getOwners() should return:
         *
         * {
         *   success: true,
         *   owners: [...]
         * }
         *
         * NOT:
         *
         * {
         *   data: {
         *     success: true,
         *     owners: [...]
         *   }
         * }
         */

        if (!response?.success) {
          throw new Error(response?.message || "Failed to fetch owners.");
        }

        setOwners(response?.owners || []);
      } catch (err) {
        console.error("Fetch owners error:", err);

        setError(
          err?.message || err?.data?.message || "Failed to fetch owners.",
        );

        setOwners([]);
      } finally {
        setLoading(false);
      }
    };

    loadOwners();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const totalWorkspaces = owners.reduce(
    (sum, owner) => sum + Number(owner?.stats?.spaces || 0),
    0,
  );

  const totalBookings = owners.reduce(
    (sum, owner) => sum + Number(owner?.stats?.bookings || 0),
    0,
  );

  const totalRevenue = owners.reduce(
    (sum, owner) => sum + Number(owner?.stats?.revenue || 0),
    0,
  );

  if (loading) {
    return <AdminLoader fullPage text="Loading owners..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[#4A7272]">Management</p>

        <h1 className="mt-1 text-2xl font-bold text-[#041421]">
          Workspace Owners
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor owners and their workspace performance.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Unable to load owners</p>

          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat icon={Users} label="Total Owners" value={owners.length} />

        <MiniStat
          icon={Building2}
          label="Total Workspaces"
          value={totalWorkspaces}
        />

        <MiniStat
          icon={CalendarCheck}
          label="Total Bookings"
          value={totalBookings}
        />

        <MiniStat
          icon={Building2}
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
        />
      </div>

      {/* Owners Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Owner</th>

                <th className="px-5 py-4">Contact</th>

                <th className="px-5 py-4">Workspaces</th>

                <th className="px-5 py-4">Bookings</th>

                <th className="px-5 py-4">Revenue</th>

                <th className="px-5 py-4">Role</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {owners.map((owner, index) => {
                const ownerId = owner?._id || owner?.id || index;

                const ownerName =
                  owner?.name ||
                  owner?.fullName ||
                  owner?.username ||
                  "Unnamed Owner";

                const profilePicture =
                  owner?.profilePicture ||
                  owner?.profileImage ||
                  owner?.avatar ||
                  owner?.image ||
                  "";

                return (
                  <tr key={ownerId} className="transition hover:bg-slate-50/70">
                    {/* Owner */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            alt={ownerName}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D0D6D6] font-bold text-[#042630]">
                            {ownerName?.charAt(0)?.toUpperCase() || "O"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#041421]">
                            {ownerName}
                          </p>

                          {owner?.email && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {owner.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-4 w-4 text-slate-400" />

                        {owner?.email || "No email"}
                      </p>

                      {owner?.phone && (
                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                          <Phone className="h-3.5 w-3.5" />

                          {owner.phone}
                        </p>
                      )}
                    </td>

                    {/* Workspaces */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#041421]">
                        {Number(owner?.stats?.spaces || 0)}
                      </span>
                    </td>

                    {/* Bookings */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#041421]">
                        {Number(owner?.stats?.bookings || 0)}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-emerald-700">
                        {formatCurrency(owner?.stats?.revenue)}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <StatusBadge status="owner" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {owners.length === 0 && !error && (
          <div className="p-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-4 font-semibold text-[#041421]">No owners found</p>

            <p className="mt-1 text-sm text-slate-400">
              There are currently no workspace owners to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const MiniStat = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>

          <p className="mt-1 text-2xl font-bold text-[#041421]">{value}</p>
        </div>

        <div className="rounded-xl bg-[#e5eeee] p-3 text-[#4A7272]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default AdminOwners;
