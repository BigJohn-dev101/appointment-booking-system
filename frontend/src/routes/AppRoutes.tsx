import { Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

// Public pages
import Home from "../pages/public/Home";
import Pricing from "../pages/public/Pricing";
import Login from "../pages/public/Login";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

// Provider discovery
import Providers from "../pages/public/providers/Providers";
import ProviderProfile from "../pages/public/providers/ProviderProfile";

// Registration
import Register from "../pages/public/register/Register";
import CustomerRegister from "../pages/public/register/CustomerRegister";
import ProviderRegister from "../pages/public/register/ProviderRegister";
import BusinessRegister from "../pages/public/register/BusinessRegister";

// Customer dashboard
import ClientDashboard from "../pages/dashboard/customer/Dashboard";
import ProviderDashboard from "../pages/dashboard/provider/Dashboard";
import BusinessDashboard from "../pages/dashboard/business/Dashboard";

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
        <Route path="/contact" element={<Contact />} />

        {/* Provider discovery */}
        <Route path="/providers" element={<Providers />} />
        <Route path="/providers/:id" element={<ProviderProfile />} />

        {/* Registration */}
        <Route path="/register" element={<Register />} />
        <Route path="/register/customer" element={<CustomerRegister />} />
        <Route path="/register/provider" element={<ProviderRegister />} />
        <Route path="/register/business" element={<BusinessRegister />} />
      </Route>

      {/* Customer dashboard */}
      <Route path="/dashboard/customer" element={<ClientDashboard />} />
      {/* Provider dashboard */}
      <Route path="/dashboard/provider" element={<ProviderDashboard />} />
      {/* Business dashboard */}
      <Route path="/dashboard/business" element={<BusinessDashboard />} />
    </Routes>
  );
}
