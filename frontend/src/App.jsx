import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Spaces from "./pages/Spaces";
import SpaceDetails from "./pages/SpaceDetails";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
