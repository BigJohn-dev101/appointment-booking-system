import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [stats] = useState<DashboardStats>({
    todayBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
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

      if (parsedUser.role !== "SOLE_PROVIDER") {
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName ?? ""}`.trim();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
              Appointment Platform
            </p>

            <h1 className="mt-1 text-xl font-bold text-slate-900">
              Provider Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {fullName}
              </p>

              <p className="text-xs text-slate-500">
                Sole Provider
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome */}
        <section className="rounded-3xl bg-[#0F172A] p-7 text-white shadow-lg">
          <p className="text-sm font-medium text-teal-300">
            Welcome back
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {fullName}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Manage your services, availability and customer appointments
            from one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-400"
            >
              Add Service
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >
              Set Availability
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's bookings"
            value={stats.todayBookings}
            description="Appointments scheduled today"
          />

          <StatCard
            title="Upcoming"
            value={stats.upcomingBookings}
            description="Future confirmed appointments"
          />

          <StatCard
            title="Completed"
            value={stats.completedBookings}
            description="Completed appointments"
          />

          <StatCard
            title="Cancelled"
            value={stats.cancelledBookings}
            description="Cancelled appointments"
          />
        </section>

        {/* Dashboard sections */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Appointments */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Upcoming appointments
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your next customer bookings
                </p>
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                View all
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-xl">
                📅
              </div>

              <h4 className="mt-4 text-sm font-semibold text-slate-800">
                No upcoming appointments
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Customer bookings will appear here once they book your
                services.
              </p>
            </div>
          </div>

          {/* Package */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
              Your package
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                Basic
              </h3>

              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                Active
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Free plan
            </p>

            <div className="mt-6 space-y-3">
              <PackageLimit
                label="Daily bookings"
                value="6"
              />

              <PackageLimit
                label="Profile placement"
                value="Standard"
              />

              <PackageLimit
                label="Appointment history"
                value="Basic"
              />
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-teal-600 px-4 py-3 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50"
            >
              Upgrade to Growth
            </button>
          </div>
        </section>

        {/* Provider management */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardAction
            title="My Services"
            description="Add and manage the services customers can book."
          />

          <DashboardAction
            title="Availability"
            description="Set the days and hours when customers can book."
          />

          <DashboardAction
            title="Appointments"
            description="View, complete, cancel and reschedule bookings."
          />

          <DashboardAction
            title="My Profile"
            description="Manage your public provider profile."
          />
        </section>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function PackageLimit({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function DashboardAction({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="rounded-3xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
    >
      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </button>
  );
}