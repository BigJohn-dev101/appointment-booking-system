import { Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

// Public pages
import Home from "../pages/public/Home";
import Pricing from "../pages/public/Pricing";
import Login from "../pages/public/Login";

// Provider discovery
import Providers from "../pages/public/providers/Providers";
import ProviderProfile from "../pages/public/providers/ProviderProfile";

// Registration
import Register from "../pages/public/register/Register";

//About
import About from "../pages/public/About";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        {/* Main public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        {/* Provider discovery */}
        <Route path="/providers" element={<Providers />} />
        <Route
          path="/providers/:id"
          element={<ProviderProfile />}
        />

        {/* Registration */}
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
} 
