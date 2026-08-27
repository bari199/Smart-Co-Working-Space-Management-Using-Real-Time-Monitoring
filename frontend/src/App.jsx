import { BrowserRouter, Route, Routes } from "react-router-dom";

// ==============================
// Layouts
// ==============================
import MainLayout from "./components/layout/MainLayout";
import DashboardShell from "./components/dashboard/DashboardShell";
import AdminLayout from "./components/layout/AdminLayout";

// ==============================
// Authentication / Authorization
// ==============================
import ProtectedRoute from "./components/auth/ProtectedRoute";

// ==============================
// Public Pages
// ==============================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Spaces from "./pages/spaces/spaces";
import SpaceDetails from "./pages/spaces/SpaceDetails";

// ==============================
// User Pages
// ==============================
import Profile from "./pages/user/Profile";
import UserDashboard from "./pages/user/UserDashboard";
import MyBookings from "./pages/user/MyBookings";
import MyInquiries from "./pages/user/MyInquiries";
import Notifications from "./pages/user/Notifications";

// ==============================
// Owner Pages
// ==============================
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import MySpaces from "./pages/owner/MySpaces";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerInquiries from "./pages/owner/OwnerInquiries";

// ==============================
// Booking / Inquiry / Payment
// ==============================
import Booking from "./pages/booking/Booking";
import BookingDetails from "./pages/booking/BookingDetails";
import Inquiry from "./pages/inquirey/Inquiry";
import Payment from "./pages/payments/Payment";

// ==============================
// Admin Pages
// ==============================
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminOwners from "./pages/admin/AdminOwners";
import AdminSpaces from "./pages/admin/AdminSpaces";
import AdminSpaceDetails from "./pages/admin/AdminSpaceDetails";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminBookingDetails from "./pages/admin/AdminBookingDetails";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminInquiryDetails from "./pages/admin/AdminInquiryDetails";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminPaymentDetails from "./pages/admin/AdminPaymentDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            MAIN / PUBLIC LAYOUT
        ====================================================== */}

        <Route element={<MainLayout />}>
          {/* =========================
              Public Routes
          ========================== */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/spaces" element={<Spaces />} />

          <Route path="/spaces/:id" element={<SpaceDetails />} />

          {/* =========================
              USER PROTECTED ROUTES
          ========================== */}

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            {/* =========================
                User Dashboard Shell
            ========================== */}

            <Route element={<DashboardShell />}>
              <Route path="/dashboard" element={<UserDashboard />} />

              <Route path="/dashboard/bookings" element={<MyBookings />} />

              <Route
                path="/dashboard/bookings/:bookingId"
                element={<BookingDetails />}
              />

              <Route path="/dashboard/inquiries" element={<MyInquiries />} />

              <Route
                path="/dashboard/notifications"
                element={<Notifications />}
              />

              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>

            {/* =========================
                User Booking Flow
            ========================== */}

            <Route path="/spaces/:id/book" element={<Booking />} />

            {/* =========================
                User Inquiry Flow
            ========================== */}

            <Route path="/spaces/:id/inquiry" element={<Inquiry />} />

            {/* =========================
                Payment
            ========================== */}

            <Route path="/payment/:bookingId" element={<Payment />} />
          </Route>

          {/* =========================
              OWNER PROTECTED ROUTES
          ========================== */}

          <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
            {/* =========================
                Owner Dashboard Shell
            ========================== */}

            <Route element={<DashboardShell />}>
              {/* Owner Dashboard */}

              <Route path="/owner" element={<OwnerDashboard />} />

              {/* Owner Spaces */}

              <Route path="/owner/spaces" element={<MySpaces />} />

              {/* Owner Space Details */}

              <Route path="/owner/spaces/:id" element={<SpaceDetails />} />

              {/* Owner Bookings */}

              <Route path="/owner/bookings" element={<OwnerBookings />} />

              {/* Owner Inquiries */}

              <Route path="/owner/inquiries" element={<OwnerInquiries />} />

              {/* Owner Profile */}

              <Route path="/owner/profile" element={<Profile />} />

              {/* Owner Notifications */}

              <Route path="/owner/notifications" element={<Notifications />} />
            </Route>
          </Route>
        </Route>

        {/* =====================================================
            ADMIN PANEL
            Separate from MainLayout
        ====================================================== */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["admin"]} />}
        >
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetails />} />

            <Route path="owners" element={<AdminOwners />} />

            <Route path="spaces" element={<AdminSpaces />} />
            <Route path="spaces/:id" element={<AdminSpaceDetails />} />

            <Route path="bookings" element={<AdminBookings />} />
            <Route path="bookings/:id" element={<AdminBookingDetails />} />

            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="inquiries/:id" element={<AdminInquiryDetails />} />

            <Route path="payments" element={<AdminPayments />} />
            <Route path="payments/:id" element={<AdminPaymentDetails />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
