import { createContext, useContext, type ReactNode } from "react";

export type BusinessDashboardResponse = {
  success: boolean;
  business: {
    id: string;
    name: string;
    category: string | null;
    staffSize: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  } | null;
  stats: {
    todayAppointments: number;
    todayRemaining: number;
    staffCount: number;
    maxStaff: number | null;
    activeServicesCount: number;
    monthAppointments: number;
  };
  todayAppointments: Array<{
    id: string;
    time: string;
    customerName: string;
    service: string;
    staffName: string | null;
    status: string;
  }>;
  staff: Array<{
    id: string;
    name: string;
    role: string;
    appointmentsToday: number;
    status: string;
  }>;
  subscription: {
    tier: string;
    status: string;
    paymentStatus: string;
    maxStaff: number | null;
    dailyAppointmentLimit: number | null;
    nextBillingDate: string | null;
  } | null;
};

type BusinessDashboardContextValue = {
  data: BusinessDashboardResponse | null;
  loading: boolean;
  error: string | null;
};

const BusinessDashboardContext = createContext<BusinessDashboardContextValue | null>(null);

export function BusinessDashboardProvider({
  value,
  children,
}: {
  value: BusinessDashboardContextValue;
  children: ReactNode;
}) {
  return <BusinessDashboardContext.Provider value={value}>{children}</BusinessDashboardContext.Provider>;
}

export function useBusinessDashboard() {
  const context = useContext(BusinessDashboardContext);
  if (!context) {
    throw new Error("useBusinessDashboard must be used within BusinessDashboardProvider");
  }
  return context;
}
