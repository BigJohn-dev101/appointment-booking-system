import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { apiFetch } from "../../../services/api";

const ACCENT_FROM = "#0EA5E9";
const ACCENT_TO = "#38BDF8";

type BusinessDashboardResponse = {
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

type NavItem = {
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "▦" },
  { label: "Appointments", icon: "▣" },
  { label: "Services", icon: "◈" },
  { label: "Staff", icon: "♙" },
  { label: "Availability", icon: "◷" },
  { label: "Subscription", icon: "◇" },
];

export default function BusinessDashboard() {
  const { user, loading, logout } = useAuth();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [business, setBusiness] = useState<BusinessDashboardResponse["business"]>(null);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    todayRemaining: 0,
    staffCount: 0,
    activeServicesCount: 0,
    monthAppointments: 0,
  });
  const [appointments, setAppointments] = useState<BusinessDashboardResponse["todayAppointments"]>([]);
  const [staff, setStaff] = useState<BusinessDashboardResponse["staff"]>([]);
  const [subscription, setSubscription] = useState<BusinessDashboardResponse["subscription"]>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role !== "BUSINESS_OWNER") {
      window.location.href = "/login";
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await apiFetch<BusinessDashboardResponse>("/business/dashboard");
        setBusiness(response.business ?? null);
        setStats(response.stats);
        setAppointments(response.todayAppointments ?? []);
        setStaff(response.staff ?? []);
        setSubscription(response.subscription ?? null);
      } catch (error) {
        console.error("Business dashboard fetch failed:", error);
      }
    };

    void fetchDashboard();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 pt-2 z-50 flex w-64 flex-col bg-[#0B1220] transition-transform duration-200 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <Link to="/" className="flex pb-2 items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[#0F172A]"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})`,
              }}
            >
              IT
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              ITThynk<span className="text-[#38BDF8]">Appoint</span>
            </span>
          </Link>
        </div>

        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-medium text-slate-400">Business</p>
          <h2 className="mt-1 truncate text-base font-semibold text-white">
            {business?.name ?? "Business profile"}
          </h2>
          <p className="mt-1 text-sm text-slate-400">Business Owner</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 pb-6 pt-7">
          {navItems.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveItem(item.label);
                  setMobileMenuOpen(false);
                }}
                className={`relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
                    style={{
                      background: `linear-gradient(180deg, ${ACCENT_TO}, ${ACCENT_FROM})`,
                    }}
                  />
                )}
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">

          <button
            onClick={() => void logout()}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 p-2 lg:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Business dashboard
              </h1>
              <p className="hidden text-sm text-slate-500 sm:block">
                Manage your business, staff and appointments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span
                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-white"
                style={{ backgroundColor: ACCENT_FROM }}
              />
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})`,
                }}
              >
                {business?.name ? business.name.slice(0, 2).toUpperCase() : "BU"}
              </div>
              <div>
                <p className="text-sm font-semibold">{business?.name ?? "Business profile"}</p>
                <p className="text-xs text-slate-500">Business Owner</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <section className="relative mb-8 overflow-hidden rounded-2xl bg-[#0B1220] p-6 text-white sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-20 blur-[80px]"
              style={{ background: ACCENT_FROM }}
            />
            <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="mb-2 text-sm font-medium text-sky-400">
                  Good morning
                </p>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Welcome back, {business?.name ?? "Business Owner"}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Here's what's happening with your business today.
                </p>
              </div>

              <button
                className="w-fit rounded-lg px-5 py-3 text-sm font-semibold text-[#0F172A] shadow-[0_10px_30px_-8px_rgba(14,165,233,0.6)] transition hover:brightness-105"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})`,
                }}
                onClick={() => setActiveItem("Appointments")}
              >
                View appointments
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Today's appointments"
              value={String(stats.todayAppointments)}
              subtitle={`${stats.todayRemaining} remaining`}
              icon="▣"
            />

            <StatCard
              title="Total staff"
              value={String(stats.staffCount)}
              subtitle={subscription ? `of ${subscription.maxStaff ?? "unlimited"} allowed` : "Staff count"}
              icon="♙"
            />

            <StatCard
              title="Active services"
              value={String(stats.activeServicesCount)}
              subtitle="Services available"
              icon="◈"
            />

            <StatCard
              title="This month"
              value={String(stats.monthAppointments)}
              subtitle="Appointments"
              icon="↗"
            />
          </section>

          {/* Main grid */}
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Appointments */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="font-bold">Today's appointments</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Appointments scheduled for today
                  </p>
                </div>

                <button
                  onClick={() => setActiveItem("Appointments")}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ACCENT_FROM }}
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {appointments.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No appointments scheduled for today yet.
                  </div>
                ) : (
                  appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14">
                          <p className="font-semibold">
                            {new Date(appointment.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-700">
                          {appointment.customerName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>
                          <p className="font-semibold">{appointment.customerName}</p>
                          <p className="text-sm text-slate-500">
                            {appointment.service} · {appointment.staffName ?? "Unassigned"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                          appointment.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-sky-50 text-sky-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Staff */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="font-bold">Your staff</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Today's staff overview
                  </p>
                </div>

                <button
                  onClick={() => setActiveItem("Staff")}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ACCENT_FROM }}
                >
                  Manage
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {staff.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No staff members found yet.
                  </div>
                ) : (
                  staff.map((member) => (
                    <div key={member.id} className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-700">
                            {member.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.role}</p>
                          </div>
                        </div>

                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            member.status === "Available"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                          title={member.status}
                        />
                      </div>

                      <div className="mt-3 flex justify-between text-xs text-slate-500">
                        <span>{member.appointmentsToday} appointments</span>
                        <span>{member.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Bottom cards */}
          <section className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Subscription */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Current package
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">Growth</h2>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Staff limit</p>
                  <p className="mt-1 font-bold">
                    {subscription ? `${stats.staffCount} / ${subscription.maxStaff ?? "∞"}` : `${stats.staffCount} / 0`}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Daily limit</p>
                  <p className="mt-1 font-bold">
                    {subscription?.dailyAppointmentLimit ?? "N/A"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveItem("Subscription")}
                className="mt-5 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Manage subscription
              </button>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold">Quick actions</h2>
              <p className="mt-1 text-sm text-slate-500">
                Common business management tasks
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <QuickAction
                  icon="＋"
                  label="Add staff"
                  onClick={() => setActiveItem("Staff")}
                />

                <QuickAction
                  icon="◈"
                  label="Add service"
                  onClick={() => setActiveItem("Services")}
                />

                <QuickAction
                  icon="◷"
                  label="Availability"
                  onClick={() => setActiveItem("Availability")}
                />

                <QuickAction
                  icon="▣"
                  label="Appointments"
                  onClick={() => setActiveItem("Appointments")}
                />
              </div>
            </div>
          </section>

          {/* Current section indicator */}
          {activeItem !== "Dashboard" && (
            <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
              <strong>{activeItem}</strong> section selected. The detailed{" "}
              {activeItem.toLowerCase()} page can be connected next.
            </div>
          )}
        </div>
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} ITThynkAppoint. All rights
              reserved.
            </p>

            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-slate-700">
                Privacy policy
              </a>
              <a href="#" className="hover:text-slate-700">
                Terms of service
              </a>
              <a href="#" className="hover:text-slate-700">
                Support
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg text-sky-700"
          style={{ backgroundColor: "rgba(14,165,233,0.1)" }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left text-sm font-medium transition hover:border-sky-300 hover:bg-sky-50"
    >
      <span className="text-lg" style={{ color: ACCENT_FROM }}>
        {icon}
      </span>
      {label}
    </button>
  );
}