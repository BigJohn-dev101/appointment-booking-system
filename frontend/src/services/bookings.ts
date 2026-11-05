import { apiFetch } from "./api";

export type BookingStaffOption = { id: string; name: string };
export type BookingSlot = { startsAt: string; status: "AVAILABLE" | "BOOKED" };

export type ProviderAvailabilityResponse = {
  success: boolean;
  service: { id: string; name: string; durationMinutes: number };
  staff: BookingStaffOption[];
  selectedStaffId: string | null;
  slots: BookingSlot[];
};

export function fetchProviderAvailability(input: {
  providerId: string;
  serviceId: string;
  date: string;
  staffId?: string;
}) {
  const query = new URLSearchParams({ serviceId: input.serviceId, date: input.date });
  if (input.staffId) query.set("staffId", input.staffId);

  return apiFetch<ProviderAvailabilityResponse>(
    `/providers/${encodeURIComponent(input.providerId)}/availability?${query.toString()}`,
  );
}

export function createAppointment(input: {
  providerId: string;
  serviceId: string;
  startsAt: string;
  staffId?: string;
}) {
  return apiFetch<{
    success: boolean;
    appointment: { id: string; service: string; durationMinutes: number; startsAt: string; status: string };
  }>("/customer/appointments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
