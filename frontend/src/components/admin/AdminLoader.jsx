import React from "react";
import { LoaderCircle } from "lucide-react";

const AdminLoader = ({ fullPage = false, text = "Loading..." }) => {
  if (fullPage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-[#4A7272]" />
          <p className="text-sm text-slate-500">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin text-[#4A7272]" />
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );
};

export default AdminLoader;
