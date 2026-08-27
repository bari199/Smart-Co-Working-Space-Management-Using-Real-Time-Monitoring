import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  DollarSign,
  MessageSquare,
  Users,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import StatCard from "../../components/admin/StatCard";
import AdminLoader from "../../components/admin/AdminLoader";
import StatusBadge from "../../components/admin/StatusBadge";
import { getAdminDashboard } from "../services/adminApi";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminDashboard();

      console.log("ADMIN DASHBOARD RESPONSE:", response);

      if (response?.success) {
        setDashboard(response.dashboard);
      } else {
        setError(response?.message || "Failed to load dashboard");
      }
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);

      setError(
        err.data?.message || err.message || "Unable to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <AdminLoader fullPage text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>

        <button
          onClick={fetchDashboard}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboard) return null;

  const { users, spaces, bookings, inquiries, payments } = dashboard;

  const bookingTotal = Math.max(bookings?.total || 1, 1);

  const bookingStats = [
    {
      label: "Pending",
      value: bookings?.pending || 0,
      width: `${((bookings?.pending || 0) / bookingTotal) * 100}%`,
    },
    {
      label: "Confirmed",
      value: bookings?.confirmed || 0,
      width: `${((bookings?.confirmed || 0) / bookingTotal) * 100}%`,
    },
    {
      label: "Cancelled",
      value: bookings?.cancelled || 0,
      width: `${((bookings?.cancelled || 0) / bookingTotal) * 100}%`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#4A7272]">Overview</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#041421] sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor your SmartSpace platform from one place.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Refresh Data
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={users?.total || 0}
          subtitle={`${users?.customers || 0} customers`}
          icon={Users}
        />

        <StatCard
          title="Workspace Owners"
          value={users?.owners || 0}
          subtitle={`${users?.admins || 0} administrators`}
          icon={UserRoundCheck}
          iconClass="bg-teal-50 text-teal-700"
        />

        <StatCard
          title="Total Workspaces"
          value={spaces?.total || 0}
          subtitle={`${spaces?.available || 0} currently available`}
          icon={Building2}
          iconClass="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(payments?.revenue)}
          subtitle={`${payments?.paid || 0} successful payments`}
          icon={DollarSign}
          iconClass="bg-emerald-50 text-emerald-700"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Bookings"
          value={bookings?.total || 0}
          subtitle={`${bookings?.pending || 0} pending`}
          icon={CalendarCheck}
          iconClass="bg-violet-50 text-violet-700"
        />

        <StatCard
          title="Inquiries"
          value={inquiries?.total || 0}
          subtitle={`${inquiries?.pending || 0} need attention`}
          icon={MessageSquare}
          iconClass="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="Paid Payments"
          value={payments?.paid || 0}
          subtitle={`${payments?.failed || 0} failed`}
          icon={CreditCard}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Available Spaces"
          value={spaces?.available || 0}
          subtitle={`${spaces?.unavailable || 0} unavailable`}
          icon={CheckCircle2}
          iconClass="bg-[#e5eeee] text-[#4A7272]"
        />
      </div>

      {/* Analytics */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Booking Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#041421]">Booking Overview</h2>
              <p className="mt-1 text-xs text-slate-400">
                Current booking distribution
              </p>
            </div>

            <div className="rounded-xl bg-[#e5eeee] p-2 text-[#4A7272]">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {bookingStats.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">
                    {item.label}
                  </span>
                  <span className="font-bold text-[#041421]">{item.value}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#4A7272] transition-all"
                    style={{
                      width: item.width,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-amber-50 p-4">
              <CalendarClock className="h-5 w-5 text-amber-600" />
              <p className="mt-3 text-xs text-slate-500">Pending</p>
              <p className="mt-1 text-xl font-bold text-[#041421]">
                {bookings?.pending || 0}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <p className="mt-3 text-xs text-slate-500">Confirmed</p>
              <p className="mt-1 text-xl font-bold text-[#041421]">
                {bookings?.confirmed || 0}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="mt-3 text-xs text-slate-500">Cancelled</p>
              <p className="mt-1 text-xl font-bold text-[#041421]">
                {bookings?.cancelled || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#041421]">Workspace Status</h2>

          <p className="mt-1 text-xs text-slate-400">
            Availability across the platform
          </p>

          <div className="mx-auto mt-8 flex h-44 w-44 items-center justify-center rounded-full border-[18px] border-[#86B9B2]">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#041421]">
                {spaces?.total || 0}
              </p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-600">Available</span>
              </div>

              <span className="font-bold text-[#041421]">
                {spaces?.available || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm text-slate-600">Unavailable</span>
              </div>

              <span className="font-bold text-[#041421]">
                {spaces?.unavailable || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#041421]">Inquiry Status</h2>
              <p className="mt-1 text-xs text-slate-400">
                Customer communication
              </p>
            </div>

            <MessageSquare className="h-5 w-5 text-[#4A7272]" />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">Pending</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {inquiries?.pending || 0}
              </p>
            </div>

            <ArrowUpRight className="h-5 w-5 text-slate-300" />

            <div>
              <p className="text-xs text-slate-400">Replied</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                {inquiries?.replied || 0}
              </p>
            </div>

            <ArrowUpRight className="h-5 w-5 text-slate-300" />

            <div>
              <p className="text-xs text-slate-400">Total</p>
              <p className="mt-1 text-2xl font-bold text-[#041421]">
                {inquiries?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#041421]">Payment Summary</h2>
              <p className="mt-1 text-xs text-slate-400">
                Payment processing status
              </p>
            </div>

            <CreditCard className="h-5 w-5 text-[#4A7272]" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <StatusBadge status="paid" label={`${payments?.paid || 0} Paid`} />

            <StatusBadge
              status="failed"
              label={`${payments?.failed || 0} Failed`}
            />

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {payments?.total || 0} Total
            </span>
          </div>

          <div className="mt-5">
            <p className="text-xs text-slate-400">Revenue</p>
            <p className="mt-1 text-2xl font-bold text-[#041421]">
              {formatCurrency(payments?.revenue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
