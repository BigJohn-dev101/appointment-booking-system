import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { apiFetch } from "../../../services/api";

const ACCENT_FROM = "#0EA5E9";
const ACCENT_TO = "#38BDF8";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  role: string;
};

type DashboardStats = {
  todayBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
};

type AppointmentItem = {
  id: string;
  time: string;
  customerName: string;
  service: string;
  status: string;
};

type SubscriptionInfo = {
  tier: string;
  status: string;
  paymentStatus: string;
  dailyAppointmentLimit?: number | null;
  monthlyPrice?: number | string | null;
  nextBillingDate?: string | null;
};

type DashboardResponse = {
  success: boolean;
  stats: DashboardStats;
  upcomingAppointments: AppointmentItem[];
  subscription: SubscriptionInfo | null;
};

type NavItem = {
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "▦" },
  { label: "Appointments", icon: "▣" },
  { label: "My services", icon: "◈" },
  { label: "Availability", icon: "◷" },
  { label: "My profile", icon: "♙" },
  { label: "Subscription", icon: "◇" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, loading, logout } = useAuth();

  const [activeItem, setActiveItem] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    todayBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    if (!authUser) {
      return;
    }

    if (authUser.role !== "SOLE_PROVIDER") {
      toast.error("You do not have permission to access this dashboard.");
      navigate("/login", { replace: true });
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await apiFetch<DashboardResponse>("/provider/dashboard");
        setStats(response.stats ?? { todayBookings: 0, upcomingBookings: 0, completedBookings: 0, cancelledBookings: 0 });
        setUpcomingAppointments(response.upcomingAppointments ?? []);
        setSubscription(response.subscription ?? null);
      } catch (error) {
        console.error("Provider dashboard fetch failed:", error);
        toast.error("Unable to load dashboard data.");
      }
    };

    void fetchDashboard();
  }, [authUser, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  const user = authUser as User | null;

  if (!user || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName ?? ""}`.trim();
  const initials = `${user.firstName.charAt(0)}${
    user.lastName ? user.lastName.charAt(0) : ""
  }`.toUpperCase();

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
          <button
            type="button"
            onClick={() => {
              setActiveItem("Dashboard");
              navigate("/dashboard/provider");
            }}
            className="flex pb-2 items-center gap-3"
          >
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
          </button>
        </div>

        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-medium text-slate-400">Signed in as</p>
          <h2 className="mt-1 truncate text-base font-semibold text-white">
            {fullName}
          </h2>
          <p className="mt-1 text-sm text-slate-400">Sole Provider</p>
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
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400"
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Provider dashboard
              </h1>
              <p className="hidden text-sm text-slate-500 sm:block">
                Manage your services, availability and appointments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
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
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold">{fullName}</p>
                <p className="text-xs text-slate-500">Sole Provider</p>
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
                  Welcome back
                </p>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {fullName}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Manage your services, availability and customer
                  appointments from one place.
                </p>
              </div>

              <div className="flex w-fit flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg px-5 py-3 text-sm font-semibold text-[#0F172A] shadow-[0_10px_30px_-8px_rgba(14,165,233,0.6)] transition hover:brightness-105"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})`,
                  }}
                  onClick={() => setActiveItem("My services")}
                >
                  Add service
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  onClick={() => setActiveItem("Availability")}
                >
                  Set availability
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Today's bookings"
              value={stats.todayBookings}
              description="Appointments scheduled today"
              icon="▣"
            />

            <StatCard
              title="Upcoming"
              value={stats.upcomingBookings}
              description="Future confirmed appointments"
              icon="◷"
            />

            <StatCard
              title="Completed"
              value={stats.completedBookings}
              description="Completed appointments"
              icon="✓"
            />

            <StatCard
              title="Cancelled"
              value={stats.cancelledBookings}
              description="Cancelled appointments"
              icon="✕"
            />
          </section>

          {/* Main grid */}
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Appointments */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="font-bold">Upcoming appointments</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your next customer bookings
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

              {upcomingAppointments.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 10h18" />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    No upcoming appointments
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Customer bookings will appear here once they book your
                    services.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingAppointments.map((appointment) => (
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
                            {appointment.service}
                          </p>
                        </div>
                      </div>

                      <span className="w-fit rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Package */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h2 className="font-bold">Your package</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current plan and limits
                </p>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">
                    {subscription?.tier ?? "Basic"}
                  </h3>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {subscription?.status ?? "Active"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {subscription?.paymentStatus ?? "Free plan"}
                </p>

                <div className="mt-5 space-y-3">
                  <PackageLimit
                    label="Daily bookings"
                    value={String(subscription?.dailyAppointmentLimit ?? "6")}
                  />
                  <PackageLimit label="Profile placement" value="Standard" />
                  <PackageLimit
                    label="Next billing"
                    value={
                      subscription?.nextBillingDate
                        ? new Date(subscription.nextBillingDate).toLocaleDateString()
                        : "N/A"
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveItem("Subscription")}
                  className="mt-5 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  Upgrade to Growth
                </button>
              </div>
            </section>
          </div>

          {/* Provider management */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              icon="◈"
              label="My services"
              description="Add and manage the services customers can book."
              onClick={() => setActiveItem("My services")}
            />

            <QuickAction
              icon="◷"
              label="Availability"
              description="Set the days and hours when customers can book."
              onClick={() => setActiveItem("Availability")}
            />

            <QuickAction
              icon="▣"
              label="Appointments"
              description="View, complete, cancel and reschedule bookings."
              onClick={() => setActiveItem("Appointments")}
            />

            <QuickAction
              icon="♙"
              label="My profile"
              description="Manage your public provider profile."
              onClick={() => setActiveItem("My profile")}
            />
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
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
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

function PackageLimit({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  description,
  onClick,
}: {
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-lg text-sky-700">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">{label}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </button>
  );
}