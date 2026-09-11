import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Signed in successfully!");

      switch (data.user.role) {
        case "CUSTOMER":
          navigate("/dashboard/customer", { replace: true });
          break;

        case "SOLE_PROVIDER":
          navigate("/dashboard/provider", { replace: true });
          break;

        case "BUSINESS_OWNER":
          navigate("/dashboard/business", { replace: true });
          break;

        case "ADMIN":
          navigate("/dashboard/admin", { replace: true });
          break;

        default:
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          toast.error("Your account has an unsupported role.");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      toast.error("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-80px)] bg-[#F8FAFC]">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center">
            <Link to="/" className="mx-auto flex w-fit items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] font-[Clash_Display] text-base font-bold text-[#0F172A] shadow-[0_0_20px_-4px_rgba(14,165,233,0.6)]">
                IT
              </div>

              <span className="font-[Clash_Display] text-xl font-extrabold tracking-tight">
                <span className="text-[#0F172A]">ITThynk</span>
                <span className="text-[#0EA5E9]">Appoint</span>
              </span>
            </Link>

            <h1 className="mt-8 font-[Clash_Display] text-3xl font-bold tracking-tight text-[#0F172A]">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to manage your appointments, services, or business.
            </p>
          </div>

          {/* Form card */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#0F172A]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#334155] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#0F172A]"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => toast("Password recovery will be available soon.")}
                    className="text-xs font-semibold text-[#0EA5E9] transition-colors hover:text-sky-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative mt-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-[#334155] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-[#0EA5E9]"
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.4 5.3A9.9 9.9 0 0 1 12 5c5 0 9 4 10 7a12.5 12.5 0 0 1-3.1 4.1M6.2 6.2A12.7 12.7 0 0 0 2 12c1 3 5 7 10 7a9.7 9.7 0 0 0 3.4-.6" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M2 12c1-3 5-7 10-7s9 4 10 7c-1 3-5 7-10 7s-9-4-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-3 text-sm text-[#334155]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-[#0EA5E9]"
                />
                Remember me
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#0EA5E9] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(14,165,233,0)] transition-all duration-200 hover:bg-[#38BDF8] hover:shadow-[0_0_24px_-4px_rgba(14,165,233,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-7 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#0EA5E9] hover:text-sky-700"
                >
                  Get started
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}