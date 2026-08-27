import React from "react";

const statusStyles = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  unavailable: "bg-red-50 text-red-700 ring-red-200",

  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  cancelled: "bg-slate-100 text-slate-700 ring-slate-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",

  created: "bg-slate-100 text-slate-700 ring-slate-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  refunded: "bg-purple-50 text-purple-700 ring-purple-200",

  replied: "bg-blue-50 text-blue-700 ring-blue-200",
  closed: "bg-slate-100 text-slate-700 ring-slate-200",

  user: "bg-slate-100 text-slate-700 ring-slate-200",
  owner: "bg-teal-50 text-teal-700 ring-teal-200",
  admin: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

const StatusBadge = ({ status, label }) => {
  const normalized = String(status || "unknown").toLowerCase();

  const style =
    statusStyles[normalized] || "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label || normalized}
    </span>
  );
};

export default StatusBadge;
