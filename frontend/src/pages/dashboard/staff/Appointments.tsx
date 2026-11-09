import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchStaffAppointments,
  updateStaffAppointmentStatus,
  type StaffAppointment,
} from "../../../services/staff";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  }).format(new Date(value));
}

export default function StaffAppointments() {
  const [appointments, setAppointments] = useState<StaffAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [view, setView] = useState<"UPCOMING" | "HISTORY">("UPCOMING");

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetchStaffAppointments();
      setAppointments(response.appointments ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load appointments.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const filtered = useMemo(() => {
    const now = Date.now();
    return appointments.filter((appointment) => {
      const isActive = appointment.status === "CONFIRMED" || appointment.status === "RESCHEDULED";
      return view === "UPCOMING"
        ? isActive && new Date(appointment.startsAt).getTime() >= now
        : !isActive || new Date(appointment.startsAt).getTime() < now;
    });
  }, [appointments, view]);

  const upcomingCount = appointments.filter((appointment) =>
    (appointment.status === "CONFIRMED" || appointment.status === "RESCHEDULED") &&
    new Date(appointment.startsAt).getTime() >= Date.now(),
  ).length;
  const historyCount = appointments.length - upcomingCount;

  async function updateStatus(appointment: StaffAppointment, status: "COMPLETED" | "NO_SHOW") {
    setUpdatingId(appointment.id);
    try {
      const response = await updateStaffAppointmentStatus(appointment.id, status);
      setAppointments((current) => current.map((item) => item.id === appointment.id
        ? { ...item, status }
        : item));
      toast.success(response.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update appointment.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 className="font-[Clash_Display] text-2xl font-bold text-slate-950">My appointments</h2><p className="mt-1 text-sm text-slate-600">Appointments assigned to your staff account.</p></div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {(["UPCOMING", "HISTORY"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setView(item)} className={`rounded-md px-3 py-2 text-sm font-semibold ${view === item ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
              {item === "UPCOMING" ? `Upcoming (${upcomingCount})` : `History (${historyCount})`}
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loadError ? (
          <div className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-rose-700" role="alert">Could not fetch staff appointments: {loadError}</p>
            <button type="button" onClick={() => void loadAppointments()} disabled={loading} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              {loading ? "Retrying..." : "Retry"}
            </button>
          </div>
        ) : loading ? <div className="space-y-3 p-6" role="status" aria-label="Loading appointments">{[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-lg bg-slate-100" />)}</div>
          : filtered.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">No {view.toLowerCase()} appointments.</p>
            : <ul className="divide-y divide-slate-100">
              {filtered.map((appointment) => {
                const active = appointment.status === "CONFIRMED" || appointment.status === "RESCHEDULED";
                const started = new Date(appointment.startsAt).getTime() <= Date.now();
                return (
                  <li key={appointment.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{appointment.customerName}</p>
                      <p className="mt-1 text-sm text-slate-600">{appointment.service} · {appointment.durationMinutes} min</p>
                      <time className="mt-1 block text-xs text-slate-500">{formatDateTime(appointment.startsAt)}</time>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {active ? (
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <span className="sr-only">Appointment status</span>
                          <select
                            value={appointment.status}
                            disabled={!started || updatingId === appointment.id}
                            onChange={(event) => {
                              const status = event.target.value;
                              if (status === "COMPLETED" || status === "NO_SHOW") {
                                void updateStatus(appointment, status);
                              }
                            }}
                            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Change status for ${appointment.customerName}'s ${appointment.service} appointment`}
                          >
                            <option value={appointment.status}>
                              {updatingId === appointment.id ? "Saving..." : appointment.status.replace("_", " ")}
                            </option>
                            <option value="COMPLETED">Completed</option>
                            <option value="NO_SHOW">No-show</option>
                          </select>
                        </label>
                      ) : (
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${appointment.status === "COMPLETED" ? "bg-emerald-50 text-emerald-800" : appointment.status === "NO_SHOW" ? "bg-rose-50 text-rose-800" : "bg-slate-100 text-slate-700"}`}>
                          {appointment.status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>}
      </section>
    </div>
  );
}
