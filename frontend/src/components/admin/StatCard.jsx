import React from "react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = "bg-[#e5eeee] text-[#4A7272]",
}) => {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#041421]">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
