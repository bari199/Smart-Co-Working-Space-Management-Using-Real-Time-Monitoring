import React, { useEffect, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  deleteSpace,
  getSpaces,
  updateSpaceAvailability,
} from "../services/adminApi";

import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const AdminSpaces = () => {
  const navigate = useNavigate();

  const [spaces, setSpaces] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [search, setSearch] = useState("");
  const [workspaceType, setWorkspaceType] = useState("");
  const [availability, setAvailability] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // =========================================================
  // FETCH SPACES
  // =========================================================

  const fetchSpaces = async (page = 1) => {
    try {
      setLoading(true);

      const response = await getSpaces({
        search: search.trim(),
        workspaceType,
        availability,
        page,
        limit: 10,
      });

      console.log("SPACES API RESPONSE:", response);

      // Your custom api() returns JSON directly.
      // Therefore use response.success, not response.data.success.
      if (response?.success) {
        setSpaces(response.spaces || []);

        setPagination(
          response.pagination || {
            page,
            pages: 1,
            total: 0,
          },
        );
      } else {
        setSpaces([]);

        setPagination({
          page,
          pages: 1,
          total: 0,
        });
      }
    } catch (err) {
      console.error("FETCH SPACES ERROR:", err);

      alert(
        err?.data?.message || err?.message || "Failed to fetch workspaces.",
      );

      setSpaces([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSpaces(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search, workspaceType, availability]);

  // =========================================================
  // TOGGLE AVAILABILITY
  // =========================================================

  const handleAvailability = async (space) => {
    const next =
      space?.availability === "available" ? "unavailable" : "available";

    try {
      setActionLoading(true);

      await updateSpaceAvailability(space._id, next);

      await fetchSpaces(pagination.page);
    } catch (err) {
      console.error("UPDATE AVAILABILITY ERROR:", err);

      alert(
        err?.data?.message || err?.message || "Failed to update availability.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // DELETE SPACE
  // =========================================================

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      setActionLoading(true);

      await deleteSpace(deleteTarget._id);

      setDeleteTarget(null);

      // If deleting the last item from a page,
      // go back one page when necessary.
      const currentPage = pagination.page;
      const nextPage =
        spaces.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;

      await fetchSpaces(nextPage);
    } catch (err) {
      console.error("DELETE SPACE ERROR:", err);

      alert(
        err?.data?.message || err?.message || "Failed to delete workspace.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div>
        <p className="text-sm font-medium text-[#4A7272]">Management</p>

        <h1 className="mt-1 text-2xl font-bold text-[#041421]">Workspaces</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage all workspace listings and availability.
        </p>
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ===================================================
            SEARCH + FILTERS
        =================================================== */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 xl:flex-row">
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workspace..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#4A7272] focus:bg-white"
            />
          </div>

          {/* WORKSPACE TYPE */}

          <select
            value={workspaceType}
            onChange={(e) => setWorkspaceType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#4A7272]"
          >
            <option value="">All Types</option>
            <option value="private cabin">Private Cabin</option>
            <option value="open desk">Open Desk</option>
            <option value="meeting room">Meeting Room</option>
          </select>

          {/* AVAILABILITY */}

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#4A7272]"
          >
            <option value="">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (
          <AdminLoader text="Loading workspaces..." />
        ) : spaces.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Workspace</th>

                    <th className="px-5 py-4">Owner</th>

                    <th className="px-5 py-4">Type</th>

                    <th className="px-5 py-4">Price</th>

                    <th className="px-5 py-4">Availability</th>

                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {spaces.map((space) => (
                    <tr key={space._id} className="hover:bg-slate-50/70">
                      {/* =======================================
                          WORKSPACE
                      ======================================= */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {space.image ? (
                            <img
                              src={space.image}
                              alt={space.name || "Workspace"}
                              className="h-12 w-14 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-12 w-14 items-center justify-center rounded-lg bg-[#D0D6D6] text-[#042630]">
                              <Building2 className="h-5 w-5" />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-[#041421]">
                              {space.name || "Unnamed Workspace"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {space.location || "No location"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* =======================================
                          OWNER
                      ======================================= */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {space.owner?.name || "Unknown"}
                        </p>

                        <p className="text-xs text-slate-400">
                          {space.owner?.email || ""}
                        </p>
                      </td>

                      {/* =======================================
                          TYPE
                      ======================================= */}

                      <td className="px-5 py-4 text-sm capitalize text-slate-600">
                        {space.workspaceType || "—"}
                      </td>

                      {/* =======================================
                          PRICE
                      ======================================= */}

                      <td className="px-5 py-4 text-sm font-semibold text-[#041421]">
                        ₹{Number(space.price || 0).toLocaleString("en-IN")}
                      </td>

                      {/* =======================================
                          AVAILABILITY
                      ======================================= */}

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleAvailability(space)}
                          disabled={actionLoading}
                          title="Toggle availability"
                          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <StatusBadge
                            status={space.availability || "unavailable"}
                          />
                        </button>
                      </td>

                      {/* =======================================
                          ACTIONS
                      ======================================= */}

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/spaces/${space._id}`)
                            }
                            title="View workspace"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(space)}
                            title="Delete workspace"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            <Pagination pagination={pagination} onPageChange={fetchSpaces} />
          </>
        )}
      </div>

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Workspace"
        message={`Delete ${
          deleteTarget?.name || "this workspace"
        }? A workspace with active bookings will be rejected by the server.`}
        confirmText="Delete Workspace"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading}
      />
    </div>
  );
};

// =============================================================
// PAGINATION
// =============================================================

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 p-4">
      {/* PREVIOUS */}

      <button
        type="button"
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
        className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* PAGE */}

      <span className="flex items-center px-2 text-sm text-slate-500">
        {pagination.page} / {pagination.pages}
      </span>

      {/* NEXT */}

      <button
        type="button"
        disabled={pagination.page >= pagination.pages}
        onClick={() => onPageChange(pagination.page + 1)}
        className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

// =============================================================
// EMPTY STATE
// =============================================================

const EmptyState = () => {
  return (
    <div className="p-16 text-center">
      <Building2 className="mx-auto h-10 w-10 text-slate-300" />

      <h3 className="mt-4 font-semibold text-[#041421]">No workspaces found</h3>

      <p className="mt-1 text-sm text-slate-400">
        Try changing your search or filters.
      </p>
    </div>
  );
};

export default AdminSpaces;
