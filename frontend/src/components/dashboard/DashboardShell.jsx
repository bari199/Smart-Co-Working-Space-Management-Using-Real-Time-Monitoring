import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";

const DashboardShell = () => {
  return (
    <div className="min-h-[calc(100vh-68px)] bg-[var(--background)]">
      <DashboardSidebar />

      <main className="min-w-0 lg:ml-[248px]">
        <div className="container-width px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
