import { apiFetch } from "./api";

export type StaffAppointmentStatus = "CONFIRMED" | "RESCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export type StaffAppointment = {
  id: string;
  startsAt: string;
  status: StaffAppointmentStatus;
  customerName: string;
  service: string;
  durationMinutes: number;
};

export type StaffAvailabilityRule = {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
};

export type StaffProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  title: string | null;
  businessName: string;
};

export type StaffDashboardResponse = {
  success: boolean;
  staff: { id: string; title: string | null; businessName: string; firstName: string; lastName: string | null };
  stats: {
    todayAppointments: number;
    upcomingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
  };
  todayAppointments: StaffAppointment[];
};

export function fetchStaffDashboard() {
  return apiFetch<StaffDashboardResponse>("/staff/dashboard");
}

export function fetchStaffAppointments() {
  return apiFetch<{ success: boolean; appointments: StaffAppointment[] }>("/staff/appointments");
}

export function updateStaffAppointmentStatus(id: string, status: "COMPLETED" | "NO_SHOW") {
  return apiFetch<{ success: boolean; message: string }>(`/staff/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function fetchStaffAvailability() {
  return apiFetch<{
    success: boolean;
    schedule: StaffAvailabilityRule[];
    businessSchedule: StaffAvailabilityRule[];
    inheritsBusinessSchedule: boolean;
  }>("/staff/availability");
}

export function saveStaffAvailability(availability: StaffAvailabilityRule[]) {
  return apiFetch<{ success: boolean; schedule: StaffAvailabilityRule[] }>("/staff/availability", {
    method: "PUT",
    body: JSON.stringify({ availability }),
  });
}

export function fetchStaffProfile() {
  return apiFetch<{ success: boolean; profile: StaffProfile }>("/staff/profile");
}

export function updateStaffProfile(payload: Pick<StaffProfile, "firstName" | "lastName" | "phone">) {
  return apiFetch<{ success: boolean; profile: StaffProfile }>("/staff/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
