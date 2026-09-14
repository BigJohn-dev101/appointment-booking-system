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
};

type PlatformStats = {
  totalUsers: number;
  totalBusinesses: number;
  totalProviders: number;
  totalBookingsThisMonth: number;
};

type NavItem = {
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "▦" },
  { label: "Users", icon: "♙" },
  { label: "Businesses", icon: "◈" },
  { label: "Providers", icon: "◷" },
  { label: "Subscriptions", icon: "◇" },
  { label: "Reports", icon: "▣" },
];

const signups = [
  {
    name: "Riverside Wellness",
    type: "Business",
    date: "Today, 09:12",
    status: "Pending",
  },
  {
    name: "Amanda Cele",
    type: "Sole provider",
    date: "Today, 08:47",
    status: "Approved",
  },
  {
    name: "Thabo Mokoena",
    type: "Customer",
    date: "Yesterday, 17:20",
    status: "Approved",
  },
  {
    name: "Bright Smiles Dental",
    type: "Business",
    date: "Yesterday, 14:05",
    status: "Approved",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats] = useState<PlatformStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    totalProviders: 0,
    totalBookingsThisMonth: 0,
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

      if (parsedUser.role !== "ADMIN") {
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
              navigate("/dashboard/admin");
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
          <p className="mt-1 text-sm text-slate-400">Platform Admin</p>
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
                Admin dashboard
              </h1>
              <p className="hidden text-sm text-slate-500 sm:block">
                Oversee users, businesses and platform activity.
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
                <p className="text-xs text-slate-500">Platform Admin</p>
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
                  Here's an overview of what's happening across the platform.
                </p>
              </div>

              <button
                type="button"
                className="w-fit rounded-lg px-5 py-3 text-sm font-semibold text-[#0F172A] shadow-[0_10px_30px_-8px_rgba(14,165,233,0.6)] transition hover:brightness-105"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})`,
                }}
                onClick={() => setActiveItem("Reports")}
              >
                View reports
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total users"
              value={stats.totalUsers}
              subtitle="Customers, providers & staff"
              icon="♙"
            />

            <StatCard
              title="Businesses"
              value={stats.totalBusinesses}
              subtitle="Registered on the platform"
              icon="◈"
            />

            <StatCard
              title="Sole providers"
              value={stats.totalProviders}
              subtitle="Active provider accounts"
              icon="◷"
            />

            <StatCard
              title="Bookings this month"
              value={stats.totalBookingsThisMonth}
              subtitle="Across all accounts"
              icon="▣"
            />
          </section>

          {/* Main grid */}
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Recent signups */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="font-bold">Recent signups</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    New accounts across the platform
                  </p>
                </div>

                <button
                  onClick={() => setActiveItem("Users")}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ACCENT_FROM }}
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {signups.map((signup) => (
                  <div
                    key={`${signup.name}-${signup.date}`}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-700">
                        {signup.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="font-semibold">{signup.name}</p>
                        <p className="text-sm text-slate-500">
                          {signup.type} · {signup.date}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        signup.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {signup.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Platform health */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h2 className="font-bold">Platform health</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current system status
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                <HealthRow label="API" status="Operational" />
                <HealthRow label="Payments" status="Operational" />
                <HealthRow label="Notifications" status="Operational" />
                <HealthRow label="Pending approvals" status="1 waiting" tone="amber" />
              </div>
            </section>
          </div>

          {/* Quick actions */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              icon="♙"
              label="Manage users"
              description="Search, edit and suspend user accounts."
              onClick={() => setActiveItem("Users")}
            />

            <QuickAction
              icon="◈"
              label="Manage businesses"
              description="Review and approve business accounts."
              onClick={() => setActiveItem("Businesses")}
            />

            <QuickAction
              icon="◇"
              label="Subscriptions"
              description="View plans, billing and upgrades."
              onClick={() => setActiveItem("Subscriptions")}
            />

            <QuickAction
              icon="▣"
              label="Reports"
              description="Platform-wide bookings and revenue reports."
              onClick={() => setActiveItem("Reports")}
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

function HealthRow({
  label,
  status,
  tone = "green",
}: {
  label: string;
  status: string;
  tone?: "green" | "amber";
}) {
  return (
    <div className="flex items-center justify-between p-5">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            tone === "amber" ? "bg-amber-500" : "bg-emerald-500"
          }`}
        />
        {status}
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