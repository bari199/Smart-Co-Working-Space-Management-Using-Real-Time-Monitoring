import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardShell from "./components/dashboard/DashboardShell";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Spaces from "./pages/spaces/spaces";
import SpaceDetails from "./pages/spaces/SpaceDetails";

// User pages
import UserDashboard from "./pages/user/UserDashboard";
import MyBookings from "./pages/user/MyBookings";
import MyInquiries from "./pages/user/MyInquiries";
import Notifications from "./pages/user/Notifications";

// Owner pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import MySpaces from "./pages/owner/MySpaces";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerInquiries from "./pages/owner/OwnerInquiries";

// Booking / Inquiry / Payment
import Booking from "./pages/booking/Booking";
import BookingDetails from "./pages/booking/BookingDetails";
import Inquiry from "./pages/inquirey/Inquiry";
import Payment from "./pages/payments/Payment";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            MAIN LAYOUT
        ====================================================== */}

        <Route element={<MainLayout />}>
          {/* =====================================================
              PUBLIC ROUTES
          ====================================================== */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/spaces" element={<Spaces />} />

          <Route path="/spaces/:id" element={<SpaceDetails />} />

          {/* =====================================================
              USER PROTECTED ROUTES
          ====================================================== */}

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            {/* =================================================
                USER DASHBOARD SHELL
                Protected + Sidebar
            ================================================== */}

            <Route element={<DashboardShell />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<UserDashboard />} />

              {/* My Bookings */}
              <Route path="/dashboard/bookings" element={<MyBookings />} />

              {/* Booking Details */}
              <Route
                path="/dashboard/bookings/:bookingId"
                element={<BookingDetails />}
              />

              {/* My Inquiries */}
              <Route path="/dashboard/inquiries" element={<MyInquiries />} />

              {/* Notifications */}
              <Route
                path="/dashboard/notifications"
                element={<Notifications />}
              />

              {/* Profile */}
              {/* Add your Profile component here later */}
              {/* 
              <Route
                path="/dashboard/profile"
                element={<Profile />}
              />
              */}
            </Route>

            {/* =================================================
                BOOKING FLOW
            ================================================== */}

            <Route path="/spaces/:id/book" element={<Booking />} />

            {/* =================================================
                INQUIRY FLOW
            ================================================== */}

            <Route path="/spaces/:id/inquiry" element={<Inquiry />} />

            {/* =================================================
                PAYMENT
            ================================================== */}

            <Route path="/payment/:bookingId" element={<Payment />} />
          </Route>

          {/* =====================================================
              OWNER PROTECTED ROUTES
          ====================================================== */}

          <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
            {/* =================================================
                OWNER DASHBOARD SHELL
                Protected + Sidebar
            ================================================== */}

            <Route element={<DashboardShell />}>
              {/* Owner Dashboard */}
              <Route path="/owner" element={<OwnerDashboard />} />

              {/* Owner Spaces */}
              <Route path="/owner/spaces" element={<MySpaces />} />

              {/* Owner Bookings */}
              <Route path="/owner/bookings" element={<OwnerBookings />} />

              {/* Owner Inquiries */}
              <Route path="/owner/inquiries" element={<OwnerInquiries />} />

              {/* Owner Notifications */}
              <Route path="/owner/notifications" element={<Notifications />} />

              {/* Owner Profile */}
              {/* Add later if needed */}
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
