import React from "react";
import { Bell, Menu, Search } from "lucide-react";

const AdminHeader = ({ onMenuClick }) => {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Admin workspace</span>
        </div>

        <div className="md:hidden">
          <p className="text-sm font-bold text-[#041421]">SMARTSPACE</p>
          <p className="text-[10px] text-[#4A7272]">Admin</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#041421]">
              {user?.name || "Administrator"}
            </p>
            <p className="text-xs capitalize text-slate-400">
              {user?.role || "admin"}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D0D6D6] font-bold text-[#042630]">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
