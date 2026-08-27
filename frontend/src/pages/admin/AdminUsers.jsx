import React, { useCallback, useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { deleteUser, getUsers, updateUserRole } from "../services/adminApi";

import StatusBadge from "../../components/admin/StatusBadge";
import AdminLoader from "../../components/admin/AdminLoader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 1,
};

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [roleTarget, setRoleTarget] = useState(null);
  const [newRole, setNewRole] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Users
  |--------------------------------------------------------------------------
  */

  const fetchUsers = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: 10,
        };

        const trimmedSearch = search.trim();

        if (trimmedSearch) {
          params.search = trimmedSearch;
        }

        if (role) {
          params.role = role;
        }

        console.log("Fetching users with params:", params);

        const response = await getUsers(params);

        console.log("Users API response:", response);

        /*
        |--------------------------------------------------------------------------
        | Backend Response Normalization
        |--------------------------------------------------------------------------
        |
        | Supports:
        |
        | 1. { success: true, users: [], pagination: {} }
        | 2. { success: true, data: { users: [], pagination: {} } }
        | 3. { users: [], pagination: {} }
        | 4. { data: { users: [], pagination: {} } }
        | 5. { data: [] }
        | 6. []
        |
        */

        let usersData = [];
        let paginationData = null;

        if (Array.isArray(response)) {
          usersData = response;
        } else if (Array.isArray(response?.users)) {
          usersData = response.users;
          paginationData = response.pagination;
        } else if (Array.isArray(response?.data)) {
          usersData = response.data;
          paginationData = response.pagination;
        } else if (Array.isArray(response?.data?.users)) {
          usersData = response.data.users;

          paginationData = response.data.pagination || response.pagination;
        }

        /*
        |--------------------------------------------------------------------------
        | Backend Explicit Error
        |--------------------------------------------------------------------------
        */

        if (response?.success === false) {
          throw new Error(response?.message || "Failed to fetch users.");
        }

        /*
        |--------------------------------------------------------------------------
        | Normalize Users
        |--------------------------------------------------------------------------
        */

        const normalizedUsers = usersData.map((user) => ({
          ...user,

          _id: user?._id || user?.id || "",

          name:
            user?.name || user?.fullName || user?.username || "Unnamed User",

          email: user?.email || "No email",

          phone: user?.phone || user?.phoneNumber || "",

          location: user?.location || user?.address?.city || user?.city || "",

          profilePicture:
            user?.profilePicture ||
            user?.profileImage ||
            user?.avatar ||
            user?.image ||
            "",

          role: user?.role || "user",

          createdAt:
            user?.createdAt || user?.created_at || user?.joinedAt || null,
        }));

        setUsers(normalizedUsers);

        /*
        |--------------------------------------------------------------------------
        | Normalize Pagination
        |--------------------------------------------------------------------------
        */

        if (paginationData) {
          const total = Number(paginationData?.total) || 0;

          const currentPage =
            Number(
              paginationData?.page ?? paginationData?.currentPage ?? page,
            ) || page;

          const limit =
            Number(paginationData?.limit ?? paginationData?.perPage ?? 10) ||
            10;

          const pages =
            Number(paginationData?.pages ?? paginationData?.totalPages) ||
            Math.max(1, Math.ceil(total / limit));

          setPagination({
            total,
            page: currentPage,
            limit,
            pages,
          });
        } else {
          /*
          |--------------------------------------------------------------------------
          | Frontend fallback pagination
          |--------------------------------------------------------------------------
          */

          const total = normalizedUsers.length;

          setPagination({
            total,
            page,
            limit: 10,
            pages: Math.max(1, Math.ceil(total / 10)),
          });
        }

        console.log("Normalized users:", normalizedUsers);
      } catch (err) {
        console.error("Fetch users error:", err);

        setUsers([]);

        setError(
          err?.data?.message ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch users.",
        );
      } finally {
        setLoading(false);
      }
    },
    [search, role],
  );

  /*
  |--------------------------------------------------------------------------
  | Initial Load + Search + Role Filter
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [fetchUsers]);

  /*
  |--------------------------------------------------------------------------
  | Delete User
  |--------------------------------------------------------------------------
  */

  const handleDelete = async () => {
    if (!deleteTarget?._id) {
      setError("Invalid user selected.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await deleteUser(deleteTarget._id);

      setDeleteTarget(null);

      const currentPage = pagination.page;

      const remainingOnPage = users.length - 1;

      if (remainingOnPage <= 0 && currentPage > 1) {
        await fetchUsers(currentPage - 1);
      } else {
        await fetchUsers(currentPage);
      }
    } catch (err) {
      console.error("Delete user error:", err);

      setError(
        err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete user.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update User Role
  |--------------------------------------------------------------------------
  */

  const handleRoleUpdate = async () => {
    if (!roleTarget?._id || !newRole) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await updateUserRole(roleTarget._id, newRole);

      setRoleTarget(null);
      setNewRole("");

      await fetchUsers(pagination.page);
    } catch (err) {
      console.error("Update role error:", err);

      setError(
        err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update user role.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-[#4A7272]">Management</p>

        <h1 className="mt-1 text-2xl font-bold text-[#041421]">Users</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage customers, owners and administrators.
        </p>
      </div>

      {/* Users Card */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Filters */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row">
          {/* Search */}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone or location..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#4A7272] focus:bg-white focus:ring-2 focus:ring-[#4A7272]/10"
            />
          </div>

          {/* Role Filter */}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#4A7272] focus:ring-2 focus:ring-[#4A7272]/10"
          >
            <option value="">All Roles</option>

            <option value="user">User</option>

            <option value="owner">Owner</option>

            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Error */}

        {error && (
          <div className="m-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading ? (
          <AdminLoader text="Loading users..." />
        ) : users.length === 0 ? (
          /* Empty */

          <div className="px-6 py-16 text-center">
            <UsersIcon />

            <h3 className="mt-4 font-semibold text-[#041421]">
              No users found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <>
            {/* Table */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-4">User</th>

                    <th className="px-5 py-4">Contact</th>

                    <th className="px-5 py-4">Role</th>

                    <th className="px-5 py-4">Joined</th>

                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user, index) => {
                    const userId = user?._id || `user-${index}`;

                    return (
                      <tr
                        key={userId}
                        className="transition hover:bg-slate-50/70"
                      >
                        {/* User */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D0D6D6] font-bold text-[#042630]">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#041421]">
                                {user.name}
                              </p>

                              <p className="truncate text-xs text-slate-400">
                                {user.location || "Location not provided"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">{user.email}</p>

                          <p className="mt-1 text-xs text-slate-400">
                            {user.phone || "No phone"}
                          </p>
                        </td>

                        {/* Role */}

                        <td className="px-5 py-4">
                          <StatusBadge status={user.role} />
                        </td>

                        {/* Joined */}

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(user.createdAt)}
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            {/* View */}

                            <button
                              type="button"
                              onClick={() => {
                                if (user._id) {
                                  navigate(`/admin/users/${user._id}`);
                                }
                              }}
                              disabled={!user._id}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Change Role */}

                            <button
                              type="button"
                              onClick={() => {
                                setRoleTarget(user);

                                setNewRole(user.role || "user");
                              }}
                              disabled={!user._id}
                              className="rounded-lg p-2 text-slate-500 hover:bg-[#e5eeee] hover:text-[#4A7272] disabled:cursor-not-allowed disabled:opacity-40"
                              title="Change Role"
                            >
                              <UserCog className="h-4 w-4" />
                            </button>

                            {/* Delete */}

                            {user.role !== "admin" && (
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(user)}
                                disabled={!user._id}
                                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}

                            {/* More */}

                            <button
                              type="button"
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                              title="More"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}

            <Pagination pagination={pagination} onPageChange={fetchUsers} />
          </>
        )}
      </div>

      {/* Delete Confirmation */}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete User"
        message={`Are you sure you want to delete ${
          deleteTarget?.name || "this user"
        }? This action cannot be undone.`}
        confirmText="Delete User"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading}
      />

      {/* Role Modal */}

      {roleTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Header */}

            <div className="border-b border-slate-100 p-5">
              <h3 className="font-bold text-[#041421]">Change User Role</h3>

              <p className="mt-1 text-sm text-slate-400">{roleTarget.name}</p>
            </div>

            {/* Body */}

            <div className="p-5">
              <label className="text-sm font-semibold text-slate-700">
                New Role
              </label>

              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#4A7272] focus:ring-2 focus:ring-[#4A7272]/10"
              >
                <option value="user">User</option>

                <option value="owner">Owner</option>

                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 p-5">
              <button
                type="button"
                onClick={() => {
                  setRoleTarget(null);
                  setNewRole("");
                }}
                disabled={actionLoading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRoleUpdate}
                disabled={actionLoading || !newRole}
                className="rounded-xl bg-[#042630] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#063642] disabled:opacity-50"
              >
                {actionLoading ? "Updating..." : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Pagination Component
|--------------------------------------------------------------------------
*/

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
      <p className="text-xs text-slate-400">
        Showing page{" "}
        <span className="font-semibold text-slate-600">{pagination.page}</span>{" "}
        of {pagination.pages}
      </p>

      <div className="flex gap-2">
        {/* Previous */}

        <button
          type="button"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Next */}

        <button
          type="button"
          disabled={pagination.page >= pagination.pages}
          onClick={() => onPageChange(pagination.page + 1)}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Empty Users Icon
|--------------------------------------------------------------------------
*/

const UsersIcon = () => {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <Users className="h-6 w-6" />
    </div>
  );
};

export default AdminUsers;
