import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Spaces from "./pages/spaces/spaces";
import SpaceDetails from "./pages/spaces/SpaceDetails";

import UserDashboard from "./pages/user/UserDashboard";
import MyBookings from "./pages/user/MyBookings";
import MyInquiries from "./pages/user/MyInquiries";
import Notifications from "./pages/user/Notifications";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/spaces" element={<Spaces />} />
          <Route path="/spaces/:id" element={<SpaceDetails />} />

          <Route element={<ProtectedRoute />}>
            {/* User routes */}

            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/bookings" element={<MyBookings />} />
            <Route path="/dashboard/inquiries" element={<MyInquiries />} />
            <Route
              path="/dashboard/notifications"
              element={<Notifications />}
            />

            {/* Owner routes */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
