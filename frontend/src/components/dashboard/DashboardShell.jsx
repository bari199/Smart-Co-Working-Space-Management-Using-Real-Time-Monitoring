import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";

import OwnerSidebar from "./OwnerSidebar";
import DashboardSidebar from "./DashboardSidebar";

const DashboardShell = () => {
  const { user } = useAuth();

  const isOwner = user?.role === "owner";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      {isOwner ? <OwnerSidebar /> : <DashboardSidebar />}

      {/* Dashboard Content */}
      <main
        className="
          min-h-screen
          w-full
          min-w-0
          lg:pl-[248px]
        "
      >
        <div className="w-full min-w-0 px-4 py-6 sm:px-5 lg:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
