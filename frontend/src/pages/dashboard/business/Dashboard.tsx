import { useState } from "react";
import { Link } from "react-router-dom";

const ACCENT = "#F59E0B";

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

const appointments = [
  {
    time: "09:00",
    customer: "Thabo Mokoena",
    service: "Haircut",
    staff: "James",
    status: "Confirmed",
  },
  {
    time: "10:30",
    customer: "Sarah Williams",
    service: "Hair Colour",
    staff: "Nomsa",
    status: "Confirmed",
  },
  {
    time: "12:00",
    customer: "Michael Smith",
    service: "Beard Trim",
    staff: "James",
    status: "Completed",
  },
  {
    time: "14:00",
    customer: "Lerato Dlamini",
    service: "Nail Treatment",
    staff: "Amanda",
    status: "Confirmed",
  },
];

const staff = [
  {
    name: "James",
    role: "Barber",
    appointments: 5,
    status: "Available",
  },
  {
    name: "Nomsa",
    role: "Hairdresser",
    appointments: 4,
    status: "Available",
  },
  {
    name: "Amanda",
    role: "Nail Technician",
    appointments: 3,
    status: "Busy",
  },
];

export default function BusinessDashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center border-b border-gray-100 px-6">
          <Link to="/" className="text-xl font-bold">
            <span style={{ color: ACCENT }}>Appoint</span>ly
          </Link>
        </div>

        <div className="border-b border-gray-100 px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Business
          </p>
          <h2 className="mt-1 truncate text-base font-semibold">
            Riverside Wellness
          </h2>
          <p className="mt-1 text-sm text-gray-500">Business Owner</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveItem(item.label);
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                activeItem === item.label
                  ? "bg-amber-50 text-amber-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="w-5 text-center text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <span>←</span>
            Back to website
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-gray-200 p-2 lg:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>

            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                Business Dashboard
              </h1>
              <p className="hidden text-sm text-gray-500 sm:block">
                Manage your business, staff and appointments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg border border-gray-200 p-2.5 hover:bg-gray-50">
              🔔
              <span
                className="absolute right-1 top-1 h-2 w-2 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-700">
                RM
              </div>
              <div>
                <p className="text-sm font-semibold">Riverside Wellness</p>
                <p className="text-xs text-gray-500">Business Owner</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <section className="mb-8 rounded-2xl bg-gray-900 p-6 text-white sm:p-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="mb-2 text-sm font-medium text-amber-400">
                  GOOD MORNING
                </p>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Welcome back, Riverside Wellness
                </h2>
                <p className="mt-2 max-w-xl text-sm text-gray-300">
                  Here's what's happening with your business today.
                </p>
              </div>

              <button
                className="rounded-lg px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
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
              value="12"
              subtitle="2 remaining"
              icon="▣"
            />

            <StatCard
              title="Total staff"
              value="3"
              subtitle="of 15 allowed"
              icon="♙"
            />

            <StatCard
              title="Active services"
              value="8"
              subtitle="Services available"
              icon="◈"
            />

            <StatCard
              title="This month"
              value="86"
              subtitle="Appointments"
              icon="↗"
            />
          </section>

          {/* Main grid */}
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Appointments */}
            <section className="rounded-2xl border border-gray-200 bg-white xl:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <div>
                  <h2 className="font-bold">Today's appointments</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Appointments scheduled for today
                  </p>
                </div>

                <button
                  onClick={() => setActiveItem("Appointments")}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ACCENT }}
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {appointments.map((appointment) => (
                  <div
                    key={`${appointment.time}-${appointment.customer}`}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14">
                        <p className="font-semibold">{appointment.time}</p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
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
                        <p className="text-sm text-gray-500">
                          {appointment.service} · {appointment.staff}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        appointment.status === "Completed"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Staff */}
            <section className="rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <div>
                  <h2 className="font-bold">Your staff</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Today's staff overview
                  </p>
                </div>

                <button
                  onClick={() => setActiveItem("Staff")}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ACCENT }}
                >
                  Manage
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {staff.map((member) => (
                  <div key={member.name} className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                          {member.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-xs text-gray-500">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          member.status === "Available"
                            ? "bg-green-500"
                            : "bg-amber-500"
                        }`}
                        title={member.status}
                      />
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-gray-500">
                      <span>{member.appointments} appointments</span>
                      <span>{member.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom cards */}
          <section className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Subscription */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Current package
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">Growth</h2>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Active
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Staff limit</p>
                  <p className="mt-1 font-bold">3 / 15</p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Daily limit</p>
                  <p className="mt-1 font-bold">20 / staff</p>
                </div>
              </div>

              <button
                onClick={() => setActiveItem("Subscription")}
                className="mt-5 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                Manage subscription
              </button>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="font-bold">Quick actions</h2>
              <p className="mt-1 text-sm text-gray-500">
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
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <strong>{activeItem}</strong> section selected. The detailed{" "}
              {activeItem.toLowerCase()} page can be connected next.
            </div>
          )}
        </div>
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-600">
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
      className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left text-sm font-medium transition hover:border-amber-300 hover:bg-amber-50"
    >
      <span className="text-lg" style={{ color: ACCENT }}>
        {icon}
      </span>
      {label}
    </button>
  );
}