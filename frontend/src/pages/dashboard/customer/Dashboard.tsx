import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { apiFetch } from "../../../services/api";

type Appointment = {
  id: string;
  time: string;
  service: string;
  providerName: string;
  status: string;
};

type DashboardResponse = {
  success: boolean;
  stats: {
    upcomingAppointments: number;
    todayAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
  };
  upcomingAppointments: Appointment[];
};

const dashboardLinks = [
  {
    to: "/dashboard/customer/book",
    icon: "＋",
    title: "Find a service",
    description: "Browse providers and the services they offer.",
  },
  {
    to: "/dashboard/customer/appointments",
    icon: "▣",
    title: "My appointments",
    description: "Review your upcoming and past visits.",
  },
  {
    to: "/dashboard/customer/profile",
    icon: "◈",
    title: "My profile",
    description: "View your personal and account details.",
  },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void apiFetch<DashboardResponse>("/customer/dashboard")
      .then((response) => {
        if (active) setDashboard(response);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Dashboard information could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = dashboard?.stats;
  const statItems = [
    { label: "Upcoming", value: stats?.upcomingAppointments },
    { label: "Today", value: stats?.todayAppointments },
    { label: "Completed", value: stats?.completedAppointments },
    { label: "Cancelled", value: stats?.cancelledAppointments },
  ];

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-br from-[#0B1220] via-[#12253A] to-[#164E63] px-6 py-8 text-white sm:px-9 sm:py-10 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-sky-300">CUSTOMER DASHBOARD</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Manage your appointments and discover services.
          </p>
        </div>
        <Link
          to="/dashboard/customer/book"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
        >
          ＋ Find a service
        </Link>
      </section>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Could not load dashboard information: {error}
        </div>
      )}

      <section aria-label="Appointment summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{item.label} appointments</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {loading ? <span className="inline-block h-9 w-12 animate-pulse rounded bg-slate-100" /> : item.value ?? "—"}
            </p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">Quick links</h2>
          <p className="mt-1 text-sm text-slate-500">Go directly to the things you need.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {dashboardLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600"
            >
              <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-lg text-sky-700">
                {item.icon}
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-sky-700">Open page →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Upcoming appointments</h2>
            <p className="mt-1 text-sm text-slate-500">Your next scheduled visits.</p>
          </div>
          <Link to="/dashboard/customer/appointments" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 p-5" aria-label="Loading appointments">
            {[0, 1].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : dashboard?.upcomingAppointments.length ? (
          <div className="divide-y divide-slate-100">
            {dashboard.upcomingAppointments.map((appointment) => (
              <Link
                key={appointment.id}
                to={`/dashboard/customer/appointments/${encodeURIComponent(appointment.id)}`}
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div>
                  <p className="font-semibold">{appointment.service}</p>
                  <p className="mt-1 text-sm text-slate-500">with {appointment.providerName}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="text-sm text-slate-600">
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(appointment.time))}
                  </p>
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                    {appointment.status.toLowerCase().replaceAll("_", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <h3 className="font-semibold text-slate-900">No upcoming appointments</h3>
            <p className="mt-2 text-sm text-slate-500">Once you book a visit, it will appear here.</p>
            <Link to="/dashboard/customer/book" className="mt-4 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-900">
              Explore services →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
