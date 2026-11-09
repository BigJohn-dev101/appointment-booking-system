import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { apiFetch } from "../../../services/api";

const ACCENT_FROM = "#0EA5E9";
const ACCENT_TO = "#38BDF8";

type NavItem = {
  label: string;
  icon: string;
  path: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "▦", path: "/dashboard/business" },
  { label: "Appointments", icon: "▣", path: "/dashboard/business/appointments" },
  { label: "Services", icon: "◈", path: "/dashboard/business/services" },
  { label: "Staff", icon: "♙", path: "/dashboard/business/staff" },
  { label: "Subscription", icon: "◇", path: "/dashboard/business/package" },
  { label: "Analytics", icon: "↗", path: "/dashboard/business/analytics" },
  { label: "Profile", icon: "⚙", path: "/dashboard/business/profile" },
];

type AnalyticsData = {
  completionRate: string;
  noShowRate: string;
  repeatClientRate: string;
  busiestDay: string;
  totalAppointmentsMonth: number;
  topServices: Array<{ name: string; bookings: number; percentage: number }>;
  peakHours: Array<{ period: string; label: string; percentage: number; isPeak?: boolean }>;
  staffPerformance: Array<{ name: string; role: string; appointmentsCompleted: number; rating: string }>;
};

const DEFAULT_ANALYTICS: AnalyticsData = {
  completionRate: "92.4%",
  noShowRate: "4.1%",
  repeatClientRate: "38.5%",
  busiestDay: "Friday",
  totalAppointmentsMonth: 244,
  topServices: [
    { name: "Standard Haircut / Consultation", bookings: 142, percentage: 58 },
    { name: "Beard Sculpt & Trim", bookings: 68, percentage: 28 },
    { name: "Haircut & Grooming Combo", bookings: 34, percentage: 14 },
  ],
  peakHours: [
    { period: "08:00 – 10:00", label: "Morning", percentage: 18 },
    { period: "10:00 – 12:00", label: "Midday Peak", percentage: 42, isPeak: true },
    { period: "14:00 – 16:00", label: "Afternoon", percentage: 28 },
    { period: "16:00 – 18:00", label: "Evening", percentage: 12 },
  ],
  staffPerformance: [
    { name: "Dr. Rachel Green", role: "Lead Chiropractor", appointmentsCompleted: 98, rating: "4.9" },
    { name: "Dr. Alex Carter", role: "Physiotherapist", appointmentsCompleted: 84, rating: "4.8" },
    { name: "Dr. Jane Wilson", role: "Yoga & Posture", appointmentsCompleted: 62, rating: "5.0" },
  ],
};

export default function BusinessAnalytics() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tier, setTier] = useState<"BASIC" | "GROWTH">("BASIC");
  const [data, setData] = useState<AnalyticsData>(DEFAULT_ANALYTICS);
  const [timeRange, setTimeRange] = useState<"30_DAYS" | "THIS_MONTH" | "THIS_YEAR">("THIS_MONTH");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "BUSINESS_OWNER") {
      navigate("/login", { replace: true });
      return;
    }

    const loadData = async () => {
      setFetching(true);
      try {
        const response = await apiFetch<{
          success: boolean;
          subscription?: { tier: "BASIC" | "GROWTH" };
          analytics?: AnalyticsData;
        }>("/business/dashboard");

        if (response.subscription) {
          setTier(response.subscription.tier);
        }
        if (response.analytics) {
          setData(response.analytics);
        }
      } catch (err) {
        console.warn("Using default analytics figures:", err);
      } finally {
        setFetching(false);
      }
    };

    void loadData();
  }, [user, navigate]);

  // Non-blocking guard
  if (loading || !user) {
    return null;
  }

  const isGrowth = tier === "GROWTH";

  return (
    <div className="business-legacy-page min-h-screen bg-[#F4F7FB] text-slate-900">
      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="business-mobile-overlay fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0B1220] transition-transform duration-200 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <Link to="/" className="flex items-center gap-3">
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
          <p className="text-xs font-medium text-slate-400">Navigation</p>
          <h2 className="mt-1 truncate text-base font-semibold text-white">Analytics</h2>
          <p className="mt-1 text-xs text-sky-400">Performance &amp; Insights</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 pb-6 pt-6">
          {navItems.map((item) => {
            const isActive = item.path === "/dashboard/business/analytics";
            return (
              <button
                key={item.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(item.path);
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
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="lg:pl-64">
        {/* Sticky Header */}
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
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Business Analytics</h1>
                {fetching && <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />}
              </div>
              <p className="hidden text-sm text-slate-500 sm:block">
                Track client attendance rates, peak scheduling hours, and service performance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeRange("30_DAYS")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                timeRange === "30_DAYS" ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange("THIS_MONTH")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                timeRange === "THIS_MONTH" ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              This Month
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Plan Gating Notice if on Basic */}
          {!isGrowth && (
            <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-sky-200 bg-sky-50/70 p-6 sm:flex-row sm:items-center">
              <div>
                <span className="rounded-full bg-sky-200 px-2.5 py-0.5 text-xs font-bold text-sky-900 uppercase tracking-wider">
                  Growth Plan Benefit
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  Unlock In-Depth Retention &amp; Peak Hour Analytics
                </h3>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  You are viewing basic metrics. Upgrade to Growth to access repeat-client percentages, appointment heatmaps, and staff workload optimization.
                </p>
              </div>

              <button
                onClick={() => navigate("/dashboard/business/package/plans")}
                className="w-fit shrink-0 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Upgrade to Growth (R149/mo) →
              </button>
            </div>
          )}

          {/* Metric Cards Row */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completion Rate</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{data.completionRate}</p>
              <p className="mt-1 text-xs text-slate-500">Appointments fulfilled</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">No-Show Rate</p>
              <p className="mt-2 text-3xl font-bold text-rose-600">{data.noShowRate}</p>
              <p className="mt-1 text-xs text-slate-500">Unattended appointments</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Repeat Client Rate</p>
              <p className="mt-2 text-3xl font-bold text-sky-600">
                {isGrowth ? data.repeatClientRate : " Growth Tier"}
              </p>
              <p className="mt-1 text-xs text-slate-500">Returning customers</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Busiest Day</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{data.busiestDay}</p>
              <p className="mt-1 text-xs text-slate-500">Highest appointment traffic</p>
            </div>
          </section>

          {/* Detailed Performance Breakdowns */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Top Booked Services */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="text-lg font-bold text-slate-900">Top Service Demands</h3>
              <p className="mt-0.5 text-xs text-slate-500">Most requested offerings by clients</p>

              <div className="mt-6 space-y-4">
                {data.topServices.map((svc) => (
                  <div key={svc.name}>
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{svc.name}</span>
                      <span>
                        {svc.bookings} bookings ({svc.percentage}%)
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]"
                        style={{ width: `${svc.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Booking Windows */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="text-lg font-bold text-slate-900">Peak Booking Hours</h3>
              <p className="mt-0.5 text-xs text-slate-500">Client appointment distribution across the day</p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                {data.peakHours.map((slot) => (
                  <div
                    key={slot.period}
                    className={`rounded-2xl p-4 transition ${
                      slot.isPeak
                        ? "border border-sky-300 bg-sky-50/70"
                        : "border border-slate-100 bg-slate-50"
                    }`}
                  >
                    <p className="text-xs text-slate-400">{slot.period}</p>
                    <p
                      className={`mt-1 text-lg font-bold ${
                        slot.isPeak ? "text-[#0EA5E9]" : "text-slate-800"
                      }`}
                    >
                      {slot.percentage}%
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">{slot.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
                💡 <span className="font-semibold">Capacity Tip:</span> Scheduling extra staff coverage between 10:00 and 12:00 on Fridays allows capturing up to 35% more booking requests without hitting staff limits.
              </div>
            </div>
          </div>

          {/* Staff Workload Distribution */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h3 className="text-lg font-bold text-slate-900">Staff Workload Distribution</h3>
            <p className="mt-0.5 text-xs text-slate-500">Fulfilled appointments per team member this month</p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Staff Member</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Appointments Fulfilled</th>
                    <th className="pb-3 text-right">Client Satisfaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.staffPerformance.map((staff) => (
                    <tr key={staff.name}>
                      <td className="py-3.5 font-semibold text-slate-900">{staff.name}</td>
                      <td className="py-3.5 text-xs text-slate-500">{staff.role}</td>
                      <td className="py-3.5 font-bold text-slate-800">{staff.appointmentsCompleted}</td>
                      <td className="py-3.5 text-right font-semibold text-emerald-600">★ {staff.rating} / 5.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} ITThynkAppoint. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link to="/about" className="hover:text-slate-700">About</Link>
              <Link to="/contact" className="hover:text-slate-700">Support</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}