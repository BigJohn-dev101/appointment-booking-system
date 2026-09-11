import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  role: string;
}

export default function ClientDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);

      if (parsedUser.role !== "CUSTOMER") {
        navigate("/login", { replace: true });
        return;
      }

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/dashboard/client")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] font-[Clash_Display] text-sm font-bold text-[#0F172A] shadow-[0_0_20px_-4px_rgba(14,165,233,0.6)]">
              IT
            </div>

            <span className="font-[Clash_Display] text-lg font-extrabold tracking-tight">
              <span className="text-[#0F172A]">ITThynk</span>
              <span className="text-[#0EA5E9]">Appoint</span>
            </span>
          </button>

          {/* User section */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#0F172A]">
                {user.firstName} {user.lastName ?? ""}
              </p>

              <p className="text-xs text-slate-500">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Welcome */}
        <div>
          <p className="text-sm font-semibold text-[#0EA5E9]">
            Customer dashboard
          </p>

          <h1 className="mt-2 font-[Clash_Display] text-3xl font-bold tracking-tight text-[#0F172A]">
            Welcome back, {user.firstName}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your appointments and discover services.
          </p>
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0EA5E9]">
              +
            </div>

            <h2 className="mt-5 font-[Clash_Display] text-lg font-bold text-[#0F172A]">
              Book an appointment
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Find a service provider and book an available time.
            </p>
          </button>

          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0EA5E9]">
              
            </div>

            <h2 className="mt-5 font-[Clash_Display] text-lg font-bold text-[#0F172A]">
              My appointments
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View your upcoming and previous appointments.
            </p>
          </button>

          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0EA5E9]">
              
            </div>

            <h2 className="mt-5 font-[Clash_Display] text-lg font-bold text-[#0F172A]">
              My profile
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View and manage your account information.
            </p>
          </button>
        </div>

        {/* Upcoming appointments */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-[Clash_Display] text-lg font-bold text-[#0F172A]">
                Upcoming appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your next scheduled appointments will appear here.
              </p>
            </div>
          </div>

          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#0F172A]">
              No upcoming appointments
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Once you book an appointment, it will appear here.
            </p>

            <button
              type="button"
              className="mt-5 rounded-xl bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#38BDF8]"
            >
              Find a service
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}