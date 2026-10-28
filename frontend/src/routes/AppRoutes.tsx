import { Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";

// Public pages
import Home from "../pages/public/Home";
import Pricing from "../pages/public/Pricing";
import Login from "../pages/public/Login";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import VerifyEmail from "../pages/public/VerifyEmail";
import ForgotPassword from "../pages/public/ForgotPassword.tsx";
import ResetPassword from "../pages/public/ResetPassword.tsx";

// Provider discovery
import Providers from "../pages/public/providers/Providers";
import ProviderProfile from "../pages/public/providers/ProviderProfile";

// Service provider pages
import ProviderDashboard from "../pages/dashboard/provider/Dashboard";
import Services from "../pages/dashboard/provider/Services";
import Appointments from "../pages/dashboard/provider/Appointments";
import Availability from "../pages/dashboard/provider/Availability";
import ProviderProfilePage from "../pages/dashboard/provider/Profile";
import ProviderPackage from "../pages/dashboard/provider/Package";

// Registration
import Register from "../pages/public/register/Register";
import CustomerRegister from "../pages/public/register/CustomerRegister";
import ProviderRegister from "../pages/public/register/ProviderRegister";
import BusinessRegister from "../pages/public/register/BusinessRegister";

// Customer dashboard
import ClientDashboard from "../pages/dashboard/customer/Dashboard";
import BusinessDashboard from "../pages/dashboard/business/Dashboard";
import ProviderLayout from "../layouts/ProviderLayout.tsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/providers/:id" element={<ProviderProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/customer" element={<CustomerRegister />} />
        <Route path="/register/provider" element={<ProviderRegister />} />
        <Route path="/register/business" element={<BusinessRegister />} />
      </Route>

      {/* --- PROTECTED PROVIDER DASHBOARD ROUTES --- */}
      {/* 
        We wrap the entire provider section in the ProtectedRoute and RoleRoute.
        Then we use ProviderLayout to render the sidebar.
      */}
      <Route
        path="/dashboard/provider"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["SOLE_PROVIDER"]}>
              <ProviderLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        {/* Index route for /dashboard/provider (the main Dashboard) */}
        <Route index element={<ProviderDashboard />} />
        
        {/* Sub-routes for the provider dashboard */}
        <Route path="services" element={<Services />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="availability" element={<Availability />} />
        <Route path="profile" element={<ProviderProfilePage />} />
        <Route path="subscription" element={<ProviderPackage />} />
      </Route>

      {/* --- PROTECTED CUSTOMER DASHBOARD --- */}
      <Route
        path="/dashboard/customer"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <ClientDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* --- PROTECTED BUSINESS DASHBOARD --- */}
      <Route
        path="/dashboard/business"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <BusinessDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}