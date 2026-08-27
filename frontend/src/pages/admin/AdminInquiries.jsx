import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getInquiries } from "../services/adminApi";
import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";

const AdminInquiries = () => {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [status, setStatus] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  // ==============================
  // Fetch Inquiries
  // ==============================
  const fetchInquiries = async (page = 1) => {
    try {
      setLoading(true);

      const response = await getInquiries({
        status,
        page,
        limit: 10,
      });

      console.log("INQUIRIES API RESPONSE:", response);

      // IMPORTANT:
      // api() already returns parsed JSON.
      // So use response.success, NOT response.data.success
      if (response?.success) {
        setInquiries(response?.inquiries || []);

        setPagination(
          response?.pagination || {
            page,
            pages: 1,
            total: 0,
          },
        );
      } else {
        setInquiries([]);

        console.warn("Inquiry API returned unsuccessful response:", response);
      }
    } catch (err) {
      console.error("FETCH INQUIRIES ERROR:", err);

      alert(err?.data?.message || err?.message || "Failed to fetch inquiries.");

      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Status Filter
  // ==============================
  useEffect(() => {
    fetchInquiries(1);
  }, [status]);

  // ==============================
  // Render
  // ==============================
  return (
    <div className="space-y-6">
      {/* ==============================
          PAGE HEADER
      ============================== */}
      <div>
        <p className="text-sm font-medium text-[#4A7272]">Communication</p>

        <h1 className="mt-1 text-2xl font-bold text-[#041421]">Inquiries</h1>

        <p className="mt-1 text-sm text-slate-500">
          Review customer inquiries and workspace requests.
        </p>
      </div>

      {/* ==============================
          INQUIRIES CARD
      ============================== */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ==============================
            FILTER
        ============================== */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#041421]">Customer Inquiries</h2>

            <p className="mt-1 text-xs text-slate-400">
              Manage and review incoming customer messages.
            </p>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#4A7272] focus:bg-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* ==============================
            LOADING
        ============================== */}
        {loading ? (
          <AdminLoader text="Loading inquiries..." />
        ) : inquiries.length === 0 ? (
          /* ==============================
             EMPTY STATE
          ============================== */
          <div className="p-16 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-4 font-semibold text-[#041421]">
              No inquiries found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              There are no customer inquiries matching your filter.
            </p>
          </div>
        ) : (
          <>
            {/* ==============================
                TABLE
            ============================== */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Customer</th>

                    <th className="px-5 py-4">Workspace</th>

                    <th className="px-5 py-4">Message</th>

                    <th className="px-5 py-4">Status</th>

                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      {/* ==============================
                          CUSTOMER
                      ============================== */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#041421]">
                          {inquiry.user?.name || "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {inquiry.user?.email || ""}
                        </p>
                      </td>

                      {/* ==============================
                          WORKSPACE
                      ============================== */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {inquiry.space?.name || "—"}
                      </td>

                      {/* ==============================
                          MESSAGE
                      ============================== */}
                      <td className="max-w-[300px] px-5 py-4">
                        <p className="truncate text-sm text-slate-600">
                          {inquiry.message || inquiry.subject || "No message"}
                        </p>
                      </td>

                      {/* ==============================
                          STATUS
                      ============================== */}
                      <td className="px-5 py-4">
                        <StatusBadge status={inquiry.status} />
                      </td>

                      {/* ==============================
                          ACTION
                      ============================== */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/inquiries/${inquiry._id}`)
                          }
                          title="View inquiry"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ==============================
                PAGINATION
            ============================== */}
            <Pagination pagination={pagination} onPageChange={fetchInquiries} />
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// Pagination Component
// ==========================================
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 p-4">
      {/* Previous */}
      <button
        type="button"
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
        className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Current Page */}
      <span className="flex items-center px-2 text-sm text-slate-500">
        {pagination.page} / {pagination.pages}
      </span>

      {/* Next */}
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

export default AdminInquiries;
