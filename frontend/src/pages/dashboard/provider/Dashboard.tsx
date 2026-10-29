import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { apiFetch } from "../../../services/api";

const ACCENT_FROM = "#0EA5E9";
const ACCENT_TO = "#38BDF8";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const providerName = authUser?.soleProvider?.displayName?.trim()
    || (authUser ? `${authUser.firstName} ${authUser.lastName ?? ""}`.trim() : "");

  const [stats, setStats] = useState<DashboardStats>({
    todayBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

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
      setIsLoading(true);
      setDashboardError(null);
      try {
        const response = await apiFetch<DashboardResponse>("/provider/dashboard");
        if (!response.success) {
          throw new Error("The server could not load provider dashboard data.");
        }
        setStats(response.stats ?? { todayBookings: 0, upcomingBookings: 0, completedBookings: 0, cancelledBookings: 0 });
        setUpcomingAppointments(response.upcomingAppointments ?? []);
        setSubscription(response.subscription ?? null);
      } catch (error) {
        console.error("Provider dashboard fetch failed:", error);
        const message = error instanceof Error ? error.message : "Unable to load dashboard data.";
        setDashboardError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboard();
  }, [authUser, navigate, reloadCount]);

  return (
    <>
          {dashboardError && (
            <div className="mb-6 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
              <p role="alert">Dashboard data could not be loaded: {dashboardError}</p>
              <button
                type="button"
                onClick={() => setReloadCount((count) => count + 1)}
                className="w-fit rounded-md border border-red-300 px-3 py-2 font-semibold hover:bg-red-100"
              >
                Retry
              </button>
            </div>
          )}
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
                  {providerName}
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
                  onClick={() => navigate("/dashboard/provider/services")}
                >
                  Add service
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  onClick={() => navigate("/dashboard/provider/availability")}
                >
                  Set availability
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          {isLoading ? (
            <section className="mb-8 grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading dashboard statistics">
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 rounded-2xl border border-slate-200 bg-white p-5"><div className="h-4 w-2/3 rounded bg-slate-100" /><div className="mt-4 h-8 w-1/3 rounded bg-slate-200" /><div className="mt-3 h-3 w-1/2 rounded bg-slate-100" /></div>)}
            </section>
          ) : !dashboardError && (
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
          )}

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
                  onClick={() => navigate("/dashboard/provider/appointments")}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ACCENT_FROM }}
                >
                  View all
                </button>
              </div>

              {isLoading ? (
                <div className="divide-y divide-slate-100 p-5" role="status" aria-label="Loading upcoming appointments">
                  {Array.from({ length: 3 }, (_, index) => <div key={index} className="flex animate-pulse items-center gap-4 py-4"><div className="h-4 w-12 rounded bg-slate-100" /><div className="h-10 w-10 rounded-full bg-slate-200" /><div className="flex-1 space-y-2"><div className="h-4 w-1/3 rounded bg-slate-200" /><div className="h-3 w-1/4 rounded bg-slate-100" /></div></div>)}
                </div>
              ) : dashboardError ? (
                <p className="p-6 text-sm text-slate-500">Dashboard data is unavailable.</p>
              ) : upcomingAppointments.length === 0 ? (
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
                {isLoading ? (
                  <div className="animate-pulse space-y-4" role="status" aria-label="Loading subscription">
                    <div className="h-6 w-1/2 rounded bg-slate-200" />
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                  </div>
                ) : dashboardError ? <p className="text-sm text-slate-500">Subscription data is unavailable.</p> : subscription ? (
                <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{subscription.tier}</h3>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {subscription.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {subscription.tier === "BASIC" ? "Free" : "Paid"}
                </p>

                <div className="mt-5 space-y-3">
                  {subscription.tier === "GROWTH" && subscription.monthlyPrice !== undefined && (
                    <PackageLimit label="Monthly price" value={`R${Number(subscription.monthlyPrice).toFixed(2)} / month`} />
                  )}
                  <PackageLimit
                    label="Daily bookings"
                    value={String(subscription.dailyAppointmentLimit ?? "Not set")}
                  />
                  {subscription.tier === "GROWTH" && (
                    <PackageLimit label="Next billing" value={subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : "Not scheduled"} />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/provider/subscription")}
                  className="mt-5 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  View subscription
                </button>
                </>
                ) : <p className="text-sm text-slate-500">No active subscription found.</p>}
              </div>
            </section>
          </div>

          {/* Provider management */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              icon="◈"
              label="My services"
              description="Add and manage the services customers can book."
              onClick={() => navigate("/dashboard/provider/services")}
            />

            <QuickAction
              icon="◷"
              label="Availability"
              description="Set the days and hours when customers can book."
              onClick={() => navigate("/dashboard/provider/availability")}
            />

            <QuickAction
              icon="▣"
              label="Appointments"
              description="View, complete, cancel and reschedule bookings."
              onClick={() => navigate("/dashboard/provider/appointments")}
            />

            <QuickAction
              icon="♙"
              label="My profile"
              description="Review your account and public provider details."
              onClick={() => navigate("/dashboard/provider/profile")}
            />

            <QuickAction
              icon="◇"
              label="Subscription"
              description="Review your current plan and billing details."
              onClick={() => navigate("/dashboard/provider/subscription")}
            />
          </section>
    </>
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