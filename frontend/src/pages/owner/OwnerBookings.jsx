import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock3,
  Eye,
  Filter,
  Mail,
  RefreshCw,
  Search,
  UserRound,
  X,
  Check,
} from "lucide-react";

import {
  getOwnerBookings,
  updateBookingStatus,
} from "../services/bookingService";

import Loading from "../../components/common/Loading";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  /* =========================================================
     FETCH BOOKINGS
  ========================================================= */

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const data = await getOwnerBookings();

      setBookings(
        data?.bookings || data?.data || (Array.isArray(data) ? data : []),
      );
    } catch (error) {
      toast.error(error?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await updateBookingStatus(id, status);

      toast.success(
        status === "confirmed"
          ? "Booking approved successfully"
          : "Booking rejected successfully",
      );

      await fetchBookings();
    } catch (error) {
      toast.error(error?.message || "Failed to update booking");
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return time;
  };

  const getCustomerName = (booking) => {
    return (
      booking?.user?.name ||
      booking?.user?.fullName ||
      booking?.firstName ||
      booking?.name ||
      booking?.user?.email ||
      "Unknown user"
    );
  };

  const getSpaceName = (booking) => {
    return (
      booking?.space?.name ||
      booking?.workspace?.name ||
      booking?.spaceName ||
      "Workspace"
    );
  };

  const getAmount = (booking) => {
    return (
      booking?.totalPrice ??
      booking?.totalAmount ??
      booking?.price ??
      booking?.amount ??
      0
    );
  };

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredBookings = bookings
    .filter((booking) => {
      const status = booking?.status || "pending";

      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      const query = search.trim().toLowerCase();

      if (!query) return true;

      const customer = getCustomerName(booking).toLowerCase();
      const space = getSpaceName(booking).toLowerCase();

      const email = (
        booking?.user?.email ||
        booking?.email ||
        ""
      ).toLowerCase();

      return (
        customer.includes(query) ||
        space.includes(query) ||
        email.includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a?.date || a?.createdAt || 0).getTime();

      const dateB = new Date(b?.date || b?.createdAt || 0).getTime();

      return sortAsc ? dateA - dateB : dateB - dateA;
    });

  /* =========================================================
     STATS
  ========================================================= */

  const stats = {
    total: bookings.length,

    pending: bookings.filter(
      (booking) => (booking?.status || "pending") === "pending",
    ).length,

    confirmed: bookings.filter((booking) => booking?.status === "confirmed")
      .length,

    rejected: bookings.filter((booking) => booking?.status === "rejected")
      .length,
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return <Loading />;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-[calc(100vh-68px)] w-full overflow-x-hidden bg-[var(--background)]">
      <div className="mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-4 lg:px-5">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
                Owner Bookings
              </h1>

              <span className="rounded-md bg-[var(--surfaceAlt)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]">
                {stats.total}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Review and manage bookings for your spaces.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookings}
            disabled={loading}
            className="h-9 w-fit gap-2 border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] shadow-none hover:bg-[var(--surfaceAlt)]"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </motion.div>

        {/* =====================================================
            QUICK STATS
        ====================================================== */}

        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard
            label="Total"
            value={stats.total}
            icon={<CalendarDays size={15} />}
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<Clock3 size={15} />}
          />

          <StatCard
            label="Confirmed"
            value={stats.confirmed}
            icon={<Check size={15} />}
          />

          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={<X size={15} />}
          />
        </div>

        {/* =====================================================
            FILTER BAR
        ====================================================== */}

        <div className="mb-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, workspace or email..."
                className="h-9 border-[var(--border)] bg-[var(--background)] pl-9 text-xs text-[var(--text)] shadow-none placeholder:text-[var(--muted)] focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
              />
            </div>

            {/* FILTERS */}

            <div className="flex w-full gap-2 md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 min-w-0 flex-1 border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] shadow-none sm:w-[130px] sm:flex-none">
                  <Filter size={13} className="mr-1 text-[var(--muted)]" />

                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>

                  <SelectItem value="pending">Pending</SelectItem>

                  <SelectItem value="confirmed">Confirmed</SelectItem>

                  <SelectItem value="rejected">Rejected</SelectItem>

                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortAsc((prev) => !prev)}
                className="h-9 shrink-0 gap-1.5 border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)] shadow-none hover:bg-[var(--surfaceAlt)]"
              >
                {sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Date
              </Button>
            </div>
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-12 text-center"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surfaceAlt)] text-[var(--text)]">
              <CalendarDays size={20} />
            </div>

            <h2 className="text-sm font-semibold text-[var(--text)]">
              {bookings.length === 0
                ? "No bookings yet"
                : "No matching bookings"}
            </h2>

            <p className="mt-1 text-xs text-[var(--muted)]">
              {bookings.length === 0
                ? "Bookings for your spaces will appear here."
                : "Try changing your search or filter."}
            </p>
          </motion.div>
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm lg:block"
            >
              {/* IMPORTANT:
                  No overflow-x-auto
                  No min-w-[1050px]
                  Table fits parent width
              */}

              <table className="w-full table-fixed border-collapse">
                <colgroup>
                  <col className="w-[19%]" />
                  <col className="w-[23%]" />
                  <col className="w-[12%]" />
                  <col className="w-[11%]" />
                  <col className="w-[9%]" />
                  <col className="w-[10%]" />
                  <col className="w-[16%]" />
                </colgroup>

                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                    <TableHead>Workspace</TableHead>

                    <TableHead>Customer</TableHead>

                    <TableHead>Date</TableHead>

                    <TableHead>Time</TableHead>

                    <TableHead>Amount</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead align="right">Action</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking, index) => {
                    const status = booking?.status || "pending";

                    const id = booking?._id;

                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: Math.min(index * 0.025, 0.25),
                        }}
                        className="group border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)]/70"
                      >
                        {/* WORKSPACE */}

                        <td className="overflow-hidden px-2.5 py-2.5">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-[var(--text)]">
                              {getSpaceName(booking)}
                            </p>

                            {booking?.space?.spaceType && (
                              <p className="mt-0.5 truncate text-[10px] text-[var(--muted)]">
                                {booking.space.spaceType}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* CUSTOMER */}

                        <td className="overflow-hidden px-2.5 py-2.5">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surfaceAlt)] text-[var(--text)]">
                              <UserRound size={13} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-[var(--text)]">
                                {getCustomerName(booking)}
                              </p>

                              <p className="truncate text-[10px] text-[var(--muted)]">
                                {booking?.user?.email ||
                                  booking?.email ||
                                  "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DATE */}

                        <td className="overflow-hidden whitespace-nowrap px-2.5 py-2.5 text-xs text-[var(--text)]">
                          {formatDate(booking?.date || booking?.startDate)}
                        </td>

                        {/* TIME */}

                        <td className="overflow-hidden whitespace-nowrap px-2.5 py-2.5 text-xs text-[var(--muted)]">
                          {formatTime(
                            booking?.time ||
                              booking?.startTime ||
                              booking?.slot,
                          )}
                        </td>

                        {/* AMOUNT */}

                        <td className="overflow-hidden whitespace-nowrap px-2.5 py-2.5 text-xs font-semibold text-[var(--text)]">
                          ₹{Number(getAmount(booking)).toLocaleString()}
                        </td>

                        {/* STATUS */}

                        <td className="overflow-hidden px-2.5 py-2.5">
                          <StatusBadge status={status} />
                        </td>

                        {/* ACTION */}

                        <td className="px-2.5 py-2.5">
                          <div className="flex flex-wrap items-center justify-end gap-1">
                            {status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  disabled={updatingId === id}
                                  onClick={() => updateStatus(id, "confirmed")}
                                  className="h-7 shrink-0 rounded-md bg-emerald-600 px-2 text-[10px] font-semibold text-white shadow-none hover:bg-emerald-700"
                                >
                                  <Check size={12} />
                                  Approve
                                </Button>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={updatingId === id}
                                  onClick={() => updateStatus(id, "rejected")}
                                  className="h-7 shrink-0 rounded-md px-2 text-[10px] font-semibold shadow-none"
                                >
                                  <X size={12} />
                                  Reject
                                </Button>
                              </>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBooking(booking)}
                              className="h-7 shrink-0 gap-1 rounded-md border-[var(--border)] bg-[var(--surface)] px-2 text-[10px] text-[var(--text)] shadow-none hover:bg-[var(--background)]"
                            >
                              <Eye size={12} />
                              Details
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {/* =================================================
                  TABLE FOOTER
              ================================================== */}

              <div className="flex min-w-0 items-center justify-between border-t border-[var(--border)] bg-[var(--background)] px-3 py-2">
                <p className="truncate text-[10px] text-[var(--muted)]">
                  Showing{" "}
                  <span className="font-semibold text-[var(--text)]">
                    {filteredBookings.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[var(--text)]">
                    {bookings.length}
                  </span>{" "}
                  bookings
                </p>

                <p className="shrink-0 text-[10px] text-[var(--muted)]">
                  Owner workspace
                </p>
              </div>
            </motion.div>

            {/* =================================================
                MOBILE / TABLET CARDS
            ================================================== */}

            <div className="space-y-2 lg:hidden">
              {filteredBookings.map((booking, index) => {
                const status = booking?.status || "pending";

                const id = booking?._id;

                return (
                  <motion.div
                    key={id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(index * 0.04, 0.25),
                    }}
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm"
                  >
                    {/* CARD HEADER */}

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--text)]">
                          {getSpaceName(booking)}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surfaceAlt)] text-[var(--text)]">
                            <UserRound size={12} />
                          </div>

                          <p className="truncate text-xs text-[var(--muted)]">
                            {getCustomerName(booking)}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={status} />
                    </div>

                    {/* CARD INFO */}

                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-2.5">
                      <InfoItem
                        label="Date"
                        value={formatDate(booking?.date || booking?.startDate)}
                      />

                      <InfoItem
                        label="Time"
                        value={formatTime(
                          booking?.time || booking?.startTime || booking?.slot,
                        )}
                      />

                      <InfoItem
                        label="Amount"
                        value={`₹${Number(
                          getAmount(booking),
                        ).toLocaleString()}`}
                      />
                    </div>

                    {/* CARD ACTIONS */}

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            disabled={updatingId === id}
                            onClick={() => updateStatus(id, "confirmed")}
                            className="h-8 w-full bg-emerald-600 text-xs text-white shadow-none hover:bg-emerald-700"
                          >
                            <Check size={13} />
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={updatingId === id}
                            onClick={() => updateStatus(id, "rejected")}
                            className="h-8 w-full text-xs shadow-none"
                          >
                            <X size={13} />
                            Reject
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedBooking(booking)}
                        className="h-8 w-full border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] shadow-none hover:bg-[var(--background)]"
                      >
                        <Eye size={13} />
                        Details
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* =========================================================
          DETAILS MODAL
      ========================================================== */}

      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={updateStatus}
          updatingId={updatingId}
        />
      )}
    </div>
  );
};

/* ===============================================================
   STAT CARD
================================================================ */

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 transition-colors hover:bg-[var(--surfaceAlt)]">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text)]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[10px] text-[var(--muted)]">{label}</p>

        <p className="text-sm font-bold leading-none text-[var(--text)]">
          {value}
        </p>
      </div>
    </div>
  );
};

/* ===============================================================
   TABLE HEAD
================================================================ */

const TableHead = ({ children, align }) => {
  return (
    <th
      className={`whitespace-nowrap px-2.5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
};

/* ===============================================================
   STATUS BADGE
================================================================ */

const StatusBadge = ({ status }) => {
  const classes = {
    confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",

    rejected: "border-red-200 bg-red-50 text-red-700",

    cancelled: "border-slate-200 bg-slate-100 text-slate-600",

    canceled: "border-slate-200 bg-slate-100 text-slate-600",

    pending: "border-amber-200 bg-amber-50 text-amber-700",
  };

  const currentClass = classes[status] || classes.pending;

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-semibold ${currentClass}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  );
};

/* ===============================================================
   INFO ITEM
================================================================ */

const InfoItem = ({ label, value }) => {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>

      <p className="mt-0.5 truncate text-xs font-medium text-[var(--text)]">
        {value}
      </p>
    </div>
  );
};

/* ===============================================================
   BOOKING DETAILS
================================================================ */

const BookingDetails = ({ booking, onClose, onUpdate, updatingId }) => {
  const status = booking?.status || "pending";

  const customer =
    booking?.user?.name ||
    booking?.user?.fullName ||
    booking?.firstName ||
    booking?.user?.email ||
    "Unknown user";

  const email = booking?.user?.email || booking?.email || "No email available";

  const space =
    booking?.space?.name ||
    booking?.workspace?.name ||
    booking?.spaceName ||
    "Workspace";

  const amount =
    booking?.totalPrice ??
    booking?.totalAmount ??
    booking?.price ??
    booking?.amount ??
    0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.97,
          y: 8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
      >
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
              Booking Details
            </p>

            <h2 className="mt-0.5 truncate text-sm font-bold text-[var(--text)]">
              {space}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--text)]"
          >
            <X size={17} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-2">
            <DetailBox label="Customer" value={customer} />

            <DetailBox label="Status" value={<StatusBadge status={status} />} />

            <DetailBox label="Email" value={email} icon={<Mail size={12} />} />

            <DetailBox
              label="Amount"
              value={`₹${Number(amount).toLocaleString()}`}
            />

            <DetailBox
              label="Date"
              value={
                booking?.date
                  ? new Date(booking.date).toLocaleDateString()
                  : "N/A"
              }
            />

            <DetailBox
              label="Time"
              value={
                booking?.time || booking?.startTime || booking?.slot || "N/A"
              }
            />
          </div>

          {booking?.notes && (
            <div className="rounded-lg bg-[var(--background)] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                Notes
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--text)]">
                {booking.notes}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}

        {status === "pending" && (
          <div className="grid grid-cols-2 gap-2 border-t border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <Button
              disabled={updatingId === booking?._id}
              onClick={() => onUpdate(booking?._id, "confirmed")}
              className="h-8 bg-emerald-600 text-xs text-white shadow-none hover:bg-emerald-700"
            >
              <Check size={13} />
              Approve
            </Button>

            <Button
              disabled={updatingId === booking?._id}
              onClick={() => onUpdate(booking?._id, "rejected")}
              variant="destructive"
              className="h-8 text-xs shadow-none"
            >
              <X size={13} />
              Reject
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ===============================================================
   DETAIL BOX
================================================================ */

const DetailBox = ({ label, value, icon }) => {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5">
      <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>

      <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs font-medium text-[var(--text)]">
        {icon}

        <span className="min-w-0 truncate">{value}</span>
      </div>
    </div>
  );
};

export default OwnerBookings;
