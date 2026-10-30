import { Route, Routes, Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ProviderLayout from "../layouts/ProviderLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";

// Public pages
import Home from "../pages/public/Home";
import Pricing from "../pages/public/Pricing";
import Login from "../pages/public/Login";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import VerifyEmail from "../pages/public/VerifyEmail";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";

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

// Sole provider dashboard
import ProviderDashboard from "../pages/dashboard/provider/Dashboard";
import Services from "../pages/dashboard/provider/Services";
import Appointments from "../pages/dashboard/provider/Appointments";
import Availability from "../pages/dashboard/provider/Availability";
import ProviderProfilePage from "../pages/dashboard/provider/Profile";
import ProviderPackage from "../pages/dashboard/provider/Package";

// Business owner dashboard
import BusinessDashboard from "../pages/dashboard/business/Dashboard";
import BusinessServices from "../pages/dashboard/business/Services";
import BusinessStaff from "../pages/dashboard/business/Staff";
import StaffDetails from "../pages/dashboard/business/StaffDetails";
import BusinessAppointments from "../pages/dashboard/business/Appointments";
import BusinessPackage from "../pages/dashboard/business/Package";
import UpgradePlans from "../pages/dashboard/business/UpgradePlans";
import PackageCheckout from "../pages/dashboard/business/PackageCheckout";
import PackageSuccess from "../pages/dashboard/business/PackageSuccess";
import BusinessProfilePage from "../pages/dashboard/business/Profile";
import BusinessAnalytics from "../pages/dashboard/business/Analytics";

// Other dashboards
import StaffDashboard from "../pages/dashboard/staff/Dashboard";
import AdminDashboard from "../pages/dashboard/admin/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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

      {/* Sole provider dashboard */}
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
        <Route index element={<ProviderDashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="availability" element={<Availability />} />
        <Route path="availability/edit" element={<Availability editMode />} />
        <Route path="profile" element={<ProviderProfilePage />} />
        <Route path="subscription" element={<ProviderPackage />} />
      </Route>

      {/* Customer dashboard */}
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

      {/* Business owner dashboard */}
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

      {/* Business owner pages */}
      <Route
        path="/dashboard/business/services"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <BusinessServices />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/business/staff"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <BusinessStaff />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/business/staff/:id"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <StaffDetails />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/business/appointments"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <BusinessAppointments />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/business/package"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <BusinessPackage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/business/analytics"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <BusinessAnalytics />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/business/package/plans"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <UpgradePlans />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/business/package/checkout"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <PackageCheckout />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/business/package/success"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <PackageSuccess />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/business/profile"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_OWNER"]}>
              <BusinessProfilePage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Business staff dashboard */}
      <Route
        path="/dashboard/staff"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["BUSINESS_STAFF"]}>
              <StaffDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}