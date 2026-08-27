import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CreditCard, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getPayments } from "../services/adminApi";

import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";

const AdminPayments = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("");

  const [summary, setSummary] = useState({
    totalRevenue: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH PAYMENTS
  // ==============================
  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);

      const response = await getPayments({
        status,
        page,
        limit: 10,
      });

      console.log("PAYMENTS API RESPONSE:", response);

      if (response?.success) {
        setPayments(response.payments || []);

        setSummary(
          response.summary || {
            totalRevenue: 0,
          },
        );

        setPagination(
          response.pagination || {
            page,
            pages: 1,
            total: 0,
          },
        );
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("FETCH PAYMENTS ERROR:", error);

      alert(
        error?.message || error?.data?.message || "Failed to fetch payments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [status]);

  // ==============================
  // CURRENCY
  // ==============================
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-sm font-medium text-[#4A7272]">Finance</p>

        <h1 className="mt-1 text-2xl font-bold text-[#041421]">Payments</h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor payment transactions and platform revenue.
        </p>
      </div>

      {/* METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric
          icon={CreditCard}
          label="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
        />

        <Metric
          icon={CreditCard}
          label="Transactions"
          value={payments.length}
        />

        <Metric
          icon={CreditCard}
          label="Current Page"
          value={pagination.page || 1}
        />
      </div>

      {/* MAIN CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* FILTER */}
        <div className="border-b border-slate-200 p-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#4A7272]"
          >
            <option value="">All Payment Status</option>

            <option value="created">Created</option>

            <option value="pending">Pending</option>

            <option value="paid">Paid</option>

            <option value="failed">Failed</option>

            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* CONTENT */}
        {loading ? (
          <AdminLoader text="Loading payments..." />
        ) : payments.length === 0 ? (
          <EmptyPaymentState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Transaction</th>

                    <th className="px-5 py-4">Customer</th>

                    <th className="px-5 py-4">Booking</th>

                    <th className="px-5 py-4">Amount</th>

                    <th className="px-5 py-4">Status</th>

                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-50/70">
                      {/* TRANSACTION */}
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-semibold text-[#041421]">
                          {payment._id ? payment._id.slice(-10) : "—"}
                        </p>

                        {payment.paymentId && (
                          <p className="mt-1 text-xs text-slate-400">
                            {payment.paymentId}
                          </p>
                        )}
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#041421]">
                          {payment.user?.name || "Unknown"}
                        </p>

                        <p className="text-xs text-slate-400">
                          {payment.user?.email || ""}
                        </p>
                      </td>

                      {/* BOOKING */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {payment.booking?._id
                          ? `#${payment.booking._id.slice(-8)}`
                          : "—"}
                      </td>

                      {/* AMOUNT */}
                      <td className="px-5 py-4 text-sm font-bold text-[#041421]">
                        {formatCurrency(payment.amount)}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <StatusBadge status={payment.status || "pending"} />
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/payments/${payment._id}`)
                          }
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          title="View payment"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination pagination={pagination} onPageChange={fetchPayments} />
          </>
        )}
      </div>
    </div>
  );
};

// ==============================
// METRIC
// ==============================

const Metric = ({ icon: Icon, label, value }) => (
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

// ==============================
// EMPTY STATE
// ==============================

const EmptyPaymentState = () => (
  <div className="p-16 text-center">
    <CreditCard className="mx-auto h-10 w-10 text-slate-300" />

    <p className="mt-4 font-semibold text-[#041421]">No payments found</p>

    <p className="mt-1 text-sm text-slate-400">
      There are no payments matching the selected status.
    </p>
  </div>
);

// ==============================
// PAGINATION
// ==============================

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 p-4">
      <button
        type="button"
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
        className="rounded-lg border p-2 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="flex items-center px-2 text-sm text-slate-500">
        {pagination.page} / {pagination.pages}
      </span>

      <button
        type="button"
        disabled={pagination.page >= pagination.pages}
        onClick={() => onPageChange(pagination.page + 1)}
        className="rounded-lg border p-2 disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AdminPayments;
