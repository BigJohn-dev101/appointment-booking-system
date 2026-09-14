import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ACCENT_FROM = "#0EA5E9";
const ACCENT_TO = "#38BDF8";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  role: string;
  businessStaff?: {
    business: {
      name: string;
    } | null;
  } | null;
};

type StaffStats = {
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
};

type NavItem = {
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "▦" },
  { label: "My appointments", icon: "▣" },
  { label: "My availability", icon: "◷" },
  { label: "My profile", icon: "♙" },
];

const appointments = [
  {
    time: "09:00",
    customer: "Thabo Mokoena",
    service: "Haircut",
    status: "Confirmed",
  },
  {
    time: "11:30",
    customer: "Michael Smith",
    service: "Beard Trim",
    status: "Confirmed",
  },
  {
    time: "14:00",
    customer: "Sarah Williams",
    service: "Hair Colour",
    status: "Completed",
  },
];

export default function StaffDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats] = useState<StaffStats>({
    todayAppointments: 3,
    upcomingAppointments: 5,
    completedAppointments: 1,
    cancelledAppointments: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;

      if (parsedUser.role !== "BUSINESS_STAFF") {
        toast.error("You do not have permission to access this dashboard.");
        navigate("/login", { replace: true });
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Unable to read logged-in user:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully.");

    navigate("/login", { replace: true });
  };

  if (!user) {
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
  const businessName = user.businessStaff?.business?.name ?? "Your business";

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
              navigate("/dashboard/staff");
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
          <p className="text-xs font-medium text-slate-400">Staff at</p>
          <h2 className="mt-1 truncate text-base font-semibold text-white">
            {businessName}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{fullName}</p>
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
                Staff dashboard
              </h1>
              <p className="hidden text-sm text-slate-500 sm:block">
                Your appointments and availability at {businessName}.
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
                <p className="text-xs text-slate-500">{businessName}</p>
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
                  Here's your schedule at {businessName} today.
                </p>
              </div>

              <button
                type="button"
                className="w-fit rounded-lg px-5 py-3 text-sm font-semibold text-[#0F172A] shadow-[0_10px_30px_-8px_rgba(14,165,233,0.6)] transition hover:brightness-105"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})`,
                }}
                onClick={() => setActiveItem("My appointments")}
              >
                View my appointments
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Today's appointments"
              value={stats.todayAppointments}
              subtitle="Scheduled for today"
              icon="▣"
            />

            <StatCard
              title="Upcoming"
              value={stats.upcomingAppointments}
              subtitle="Confirmed appointments"
              icon="◷"
            />

            <StatCard
              title="Completed"
              value={stats.completedAppointments}
              subtitle="This week"
              icon="✓"
            />

            <StatCard
              title="Cancelled"
              value={stats.cancelledAppointments}
              subtitle="This week"
              icon="✕"
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
                    Your schedule for today
                  </p>
                </div>

                <button
                  onClick={() => setActiveItem("My appointments")}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ACCENT_FROM }}
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {appointments.map((appointment) => (
                  <div
                    key={`${appointment.time}-${appointment.customer}`}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14">
                        <p className="font-semibold">{appointment.time}</p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-700">
                        {appointment.customer
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {appointment.customer}
                        </p>
                        <p className="text-sm text-slate-500">
                          {appointment.service}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        appointment.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Availability */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h2 className="font-bold">This week's availability</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Hours set by {businessName}
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                <AvailabilityRow day="Monday" hours="09:00 – 17:00" />
                <AvailabilityRow day="Tuesday" hours="09:00 – 17:00" />
                <AvailabilityRow day="Wednesday" hours="09:00 – 17:00" />
                <AvailabilityRow day="Thursday" hours="09:00 – 17:00" />
                <AvailabilityRow day="Friday" hours="09:00 – 15:00" />
                <AvailabilityRow day="Saturday" hours="Off" off />
                <AvailabilityRow day="Sunday" hours="Off" off />
              </div>

              <div className="p-5">
                <button
                  type="button"
                  onClick={() => setActiveItem("My availability")}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  Request time off
                </button>
              </div>
            </section>
          </div>

          {/* Quick actions */}
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <QuickAction
              icon="▣"
              label="My appointments"
              description="View, complete or reschedule your bookings."
              onClick={() => setActiveItem("My appointments")}
            />

            <QuickAction
              icon="◷"
              label="My availability"
              description="Update the hours you're available to work."
              onClick={() => setActiveItem("My availability")}
            />

            <QuickAction
              icon="♙"
              label="My profile"
              description="Manage your contact details and photo."
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
  subtitle,
  icon,
}: {
  title: string;
  value: number;
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

function AvailabilityRow({
  day,
  hours,
  off = false,
}: {
  day: string;
  hours: string;
  off?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-5">
      <span className="text-sm font-medium text-slate-700">{day}</span>
      <span
        className={`text-sm font-semibold ${
          off ? "text-slate-400" : "text-slate-800"
        }`}
      >
        {hours}
      </span>
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