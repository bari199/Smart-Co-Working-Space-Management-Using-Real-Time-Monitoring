import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If a specific role is required
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Send the user to their correct dashboard
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === "owner") {
      return <Navigate to="/owner" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
