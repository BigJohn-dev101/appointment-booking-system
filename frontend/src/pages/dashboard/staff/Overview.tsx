import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchStaffDashboard, type StaffDashboardResponse } from "../../../services/staff";

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function StaffOverview() {
  const [data, setData] = useState<StaffDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void fetchStaffDashboard()
      .then((response) => { if (active) setData(response); })
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Unable to load your dashboard."))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <div className="animate-pulse space-y-4" role="status" aria-label="Loading staff dashboard"><div className="h-28 rounded-xl bg-white" /><div className="h-48 rounded-xl bg-white" /></div>;

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-6 rounded-xl bg-[#0B1220] p-6 text-white sm:p-8">
        <p className="text-sm font-semibold text-sky-300">{data?.staff.title ?? "Team member"} · {data?.staff.businessName}</p>
        <h2 className="mt-2 font-[Clash_Display] text-3xl font-bold">Welcome back, {data?.staff.firstName}</h2>
        <p className="mt-2 text-sm text-slate-300">Your appointments and working hours at a glance.</p>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Today's appointments", data?.stats.todayAppointments ?? 0],
          ["Upcoming", data?.stats.upcomingAppointments ?? 0],
          ["Completed this week", data?.stats.completedAppointments ?? 0],
          ["Cancelled this week", data?.stats.cancelledAppointments ?? 0],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div><h2 className="font-bold text-slate-900">Today's schedule</h2><p className="mt-1 text-sm text-slate-500">Upcoming appointments assigned to you</p></div>
          <Link to="/dashboard/staff/appointments" className="text-sm font-semibold text-sky-700 hover:underline">All appointments</Link>
        </div>
        {!data?.todayAppointments.length ? (
          <p className="p-8 text-center text-sm text-slate-500">No appointments scheduled for today.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.todayAppointments.map((appointment) => (
              <li key={appointment.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <time className="w-20 font-semibold text-slate-800">{formatTime(appointment.startsAt)}</time>
                  <div><p className="font-semibold text-slate-900">{appointment.customerName}</p><p className="text-sm text-slate-500">{appointment.service} · {appointment.durationMinutes} min</p></div>
                </div>
                <span className="w-fit rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">{appointment.status.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
