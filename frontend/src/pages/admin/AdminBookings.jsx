import React, { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getBookings, updateBookingStatus } from "../services/adminApi";
import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";

const AdminBookings = () => {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [bookings, setBookings] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionId, setActionId] = useState(null);

  // =========================================================
  // FETCH BOOKINGS
  // =========================================================

  const fetchBookings = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError("");

        console.log("=================================");
        console.log("FETCH BOOKINGS");
        console.log("Page:", page);
        console.log("Status:", status);
        console.log("Payment Status:", paymentStatus);
        console.log("=================================");

        const response = await getBookings({
          page,
          limit: 10,
          ...(status ? { status } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
        });

        console.log("BOOKINGS API RESPONSE:", response);

        // =====================================================
        // IMPORTANT:
        // Your api() helper returns JSON directly.
        //
        // Therefore:
        // response.bookings      ✅
        // response.pagination    ✅
        //
        // NOT:
        // response.data.bookings ❌
        // =====================================================

        const responseData = response;

        if (!responseData) {
          throw new Error("Empty response received from server.");
        }

        if (responseData.success === false) {
          throw new Error(responseData.message || "Failed to fetch bookings.");
        }

        // =====================================================
        // BOOKINGS
        // =====================================================

        const fetchedBookings = Array.isArray(responseData.bookings)
          ? responseData.bookings
          : Array.isArray(responseData.results)
            ? responseData.results
            : Array.isArray(responseData.data?.bookings)
              ? responseData.data.bookings
              : Array.isArray(responseData.data)
                ? responseData.data
                : [];

        // =====================================================
        // PAGINATION
        // =====================================================

        const fetchedPagination =
          responseData.pagination || responseData.data?.pagination || {};

        console.log("FINAL BOOKINGS:", fetchedBookings);
        console.log("FINAL PAGINATION:", fetchedPagination);

        setBookings(fetchedBookings);

        setPagination({
          page: Number(fetchedPagination.page) || Number(page) || 1,

          pages:
            Number(fetchedPagination.pages) ||
            Number(fetchedPagination.totalPages) ||
            1,

          total:
            Number(fetchedPagination.total) ||
            Number(fetchedPagination.totalBookings) ||
            fetchedBookings.length ||
            0,

          limit: Number(fetchedPagination.limit) || 10,
        });
      } catch (err) {
        console.error("FETCH BOOKINGS ERROR:", err);

        const message =
          err?.response?.data?.message ||
          err?.data?.message ||
          err?.message ||
          "Failed to fetch bookings.";

        setError(message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    },
    [status, paymentStatus],
  );

  // =========================================================
  // INITIAL FETCH + FILTER FETCH
  // =========================================================

  useEffect(() => {
    fetchBookings(1);
  }, [fetchBookings]);

  // =========================================================
  // UPDATE BOOKING STATUS
  // =========================================================

  const changeStatus = async (bookingId, nextStatus) => {
    if (!bookingId || !nextStatus) {
      return;
    }

    try {
      setActionId(bookingId);
      setError("");

      console.log("=================================");
      console.log("UPDATE BOOKING STATUS");
      console.log("Booking ID:", bookingId);
      console.log("New Status:", nextStatus);
      console.log("=================================");

      const response = await updateBookingStatus(bookingId, nextStatus);

      console.log("UPDATE BOOKING RESPONSE:", response);

      // Refresh current page after update
      await fetchBookings(pagination.page || 1);
    } catch (err) {
      console.error("UPDATE BOOKING STATUS ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.data?.message ||
        err?.message ||
        "Failed to update booking.";

      alert(message);
    } finally {
      setActionId(null);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

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

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time) => {
    if (!time) {
      return "—";
    }

    const [hours, minutes] = String(time).split(":");

    if (hours === undefined || minutes === undefined) {
      return time;
    }

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    fetchBookings(pagination.page || 1);
  };

  // =========================================================
  // VIEW BOOKING
  // =========================================================

  const handleViewBooking = (bookingId) => {
    if (!bookingId) {
      return;
    }

    navigate(`/admin/bookings/${bookingId}`);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#4A7272]">Management</p>

          <h1 className="mt-1 text-2xl font-bold text-[#041421]">Bookings</h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor and manage all workspace bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#4A7272] hover:text-[#4A7272] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Unable to load bookings</p>

          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ===================================================
            FILTERS
        =================================================== */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
          {/* Booking Status */}

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#4A7272] focus:ring-2 focus:ring-[#4A7272]/10"
          >
            <option value="">All Booking Status</option>

            <option value="pending">Pending</option>

            <option value="confirmed">Confirmed</option>

            <option value="rejected">Rejected</option>

            <option value="cancelled">Cancelled</option>

            <option value="completed">Completed</option>
          </select>

          {/* Payment Status */}

          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#4A7272] focus:ring-2 focus:ring-[#4A7272]/10"
          >
            <option value="">All Payment Status</option>

            <option value="pending">Pending</option>

            <option value="paid">Paid</option>

            <option value="failed">Failed</option>

            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (
          <AdminLoader text="Loading bookings..." />
        ) : bookings.length === 0 ? (
          /* =================================================
             EMPTY
          ================================================= */

          <div className="p-16 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-4 font-semibold text-[#041421]">
              No bookings found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              There are no bookings matching the selected filters.
            </p>
          </div>
        ) : (
          <>
            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Customer</th>

                    <th className="px-5 py-4">Workspace</th>

                    <th className="px-5 py-4">Date</th>

                    <th className="px-5 py-4">Time</th>

                    <th className="px-5 py-4">Guests</th>

                    <th className="px-5 py-4">Amount</th>

                    <th className="px-5 py-4">Status</th>

                    <th className="px-5 py-4">Payment</th>

                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => {
                    // =================================================
                    // BOOKING ID
                    // =================================================

                    const bookingId = booking?._id || booking?.id || "";

                    // =================================================
                    // CUSTOMER
                    // =================================================

                    const customer =
                      booking?.user ||
                      booking?.customer ||
                      booking?.userId ||
                      null;

                    // =================================================
                    // WORKSPACE
                    // =================================================

                    const workspace =
                      booking?.space ||
                      booking?.workspace ||
                      booking?.workspaceId ||
                      null;

                    // =================================================
                    // STATUS
                    // =================================================

                    const bookingStatus = booking?.status || "pending";

                    // =================================================
                    // PAYMENT STATUS
                    // =================================================

                    const bookingPaymentStatus =
                      booking?.paymentStatus ||
                      booking?.payment?.status ||
                      "pending";

                    // =================================================
                    // TOTAL PRICE
                    // =================================================

                    const totalPrice =
                      booking?.totalPrice ??
                      booking?.amount ??
                      booking?.totalAmount ??
                      0;

                    // =================================================
                    // CUSTOMER DATA
                    // =================================================

                    const customerName =
                      typeof customer === "object" && customer !== null
                        ? customer?.name || customer?.fullName || "Unknown"
                        : "Unknown";

                    const customerEmail =
                      typeof customer === "object" && customer !== null
                        ? customer?.email || ""
                        : "";

                    // =================================================
                    // WORKSPACE DATA
                    // =================================================

                    const workspaceName =
                      typeof workspace === "object" && workspace !== null
                        ? workspace?.name ||
                          workspace?.title ||
                          "Workspace unavailable"
                        : "Workspace unavailable";

                    const workspaceLocation =
                      typeof workspace === "object" && workspace !== null
                        ? workspace?.location || workspace?.address || ""
                        : "";

                    // =================================================
                    // DATE
                    // =================================================

                    const bookingDate =
                      booking?.date ||
                      booking?.bookingDate ||
                      booking?.startDate;

                    // =================================================
                    // TIME
                    // =================================================

                    const startTime = booking?.startTime || booking?.start_time;

                    const endTime = booking?.endTime || booking?.end_time;

                    // =================================================
                    // GUESTS
                    // =================================================

                    const guests =
                      booking?.guests ?? booking?.numberOfGuests ?? 1;

                    return (
                      <tr
                        key={bookingId}
                        className="transition hover:bg-slate-50/70"
                      >
                        {/* ===========================================
                            CUSTOMER
                        =========================================== */}

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-[#041421]">
                            {customerName}
                          </p>

                          {customerEmail && (
                            <p className="mt-1 text-xs text-slate-400">
                              {customerEmail}
                            </p>
                          )}
                        </td>

                        {/* ===========================================
                            WORKSPACE
                        =========================================== */}

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {workspaceName}
                          </p>

                          {workspaceLocation && (
                            <p className="mt-1 text-xs text-slate-400">
                              {workspaceLocation}
                            </p>
                          )}

                          {/* Show warning when backend returns null */}

                          {!workspace && (
                            <p className="mt-1 text-xs text-amber-500">
                              Space data unavailable
                            </p>
                          )}
                        </td>

                        {/* ===========================================
                            DATE
                        =========================================== */}

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(bookingDate)}
                        </td>

                        {/* ===========================================
                            TIME
                        =========================================== */}

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {formatTime(startTime)}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            to {formatTime(endTime)}
                          </p>
                        </td>

                        {/* ===========================================
                            GUESTS
                        =========================================== */}

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {guests}
                        </td>

                        {/* ===========================================
                            AMOUNT
                        =========================================== */}

                        <td className="px-5 py-4 text-sm font-bold text-[#041421]">
                          ₹{Number(totalPrice).toLocaleString("en-IN")}
                        </td>

                        {/* ===========================================
                            BOOKING STATUS
                        =========================================== */}

                        <td className="px-5 py-4">
                          <select
                            value={bookingStatus}
                            disabled={actionId === bookingId}
                            onChange={(e) =>
                              changeStatus(bookingId, e.target.value)
                            }
                            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none transition focus:border-[#4A7272] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>

                            <option value="confirmed">Confirmed</option>

                            <option value="rejected">Rejected</option>

                            <option value="cancelled">Cancelled</option>

                            <option value="completed">Completed</option>
                          </select>
                        </td>

                        {/* ===========================================
                            PAYMENT
                        =========================================== */}

                        <td className="px-5 py-4">
                          <StatusBadge status={bookingPaymentStatus} />
                        </td>

                        {/* ===========================================
                            ACTION
                        =========================================== */}

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            disabled={!bookingId}
                            onClick={() => handleViewBooking(bookingId)}
                            title="View booking"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            <Pagination pagination={pagination} onPageChange={fetchBookings} />
          </>
        )}
      </div>
    </div>
  );
};

// =============================================================
// PAGINATION COMPONENT
// =============================================================

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || Number(pagination.pages) <= 1) {
    return null;
  }

  const currentPage = Number(pagination.page) || 1;
  const totalPages = Number(pagination.pages) || 1;

  return (
    <div className="flex items-center justify-end gap-2 border-t border-slate-100 p-4">
      {/* Previous */}

      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page */}

      <span className="flex items-center px-2 text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next */}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AdminBookings;
