import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  requestPasswordReset,
  resetPasswordWithOtp,
} from "../../services/auth";

const RESEND_COOLDOWN_SECONDS = 60;

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a13.2 13.2 0 0 1-3.4 4.06M6.1 6.1C3.6 7.8 2 10 1 12c0 0 3 6 9.4 6.9" />
    </svg>
  );
}

function getPasswordChecks(password: string) {
  return [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "One lowercase letter", passed: /[a-z]/.test(password) },
    { label: "One number", passed: /\d/.test(password) },
    { label: "One special character", passed: /[^A-Za-z0-9]/.test(password) },
  ];
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const passwordChecks = getPasswordChecks(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = window.setTimeout(
      () => setSecondsLeft((current) => current - 1),
      1000,
    );

    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!passwordChecks.every((check) => check.passed)) {
      toast.error("Password does not meet all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPasswordWithOtp({ email, code, password, confirmPassword });
      toast.success("Password reset successfully. Please sign in.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);

    try {
      await requestPasswordReset(email);
      toast.success("A new code has been sent.");
      setCode("");
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      console.error("Resend reset code failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to connect to the server.",
      );
    } finally {
      setResending(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-[#334155] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100";

  return (
    <section className="relative min-h-screen overflow-y-auto bg-[#F8FAFC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(14,165,233,0.12) 0%, rgba(248,250,252,0) 70%)",
        }}
      />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-6">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_-28px_rgba(15,23,42,0.28)]">
            <div className="relative border-b border-slate-100 bg-gradient-to-b from-[#F8FBFF] to-white px-8 pb-5 pt-6">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#0EA5E9]"
              />
              <h1 className="mt-2 text-center font-[Clash_Display] text-2xl font-bold leading-tight text-[#0F172A]">
                Reset your password
              </h1>
              <p className="mx-auto mt-2 max-w-[300px] text-center text-sm leading-6 text-slate-500">
                If an account exists for <span className="font-semibold text-[#0F172A]">{email}</span>,
                we sent a 6-digit code. It expires in 10 minutes.
              </p>
            </div>

            <div className="px-8 pb-7 pt-6 sm:px-9">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-semibold text-[#0F172A]">
                    Reset code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-center text-xl font-semibold tracking-[0.5em] text-[#334155] outline-none transition placeholder:text-slate-300 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-[#0F172A]">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      required
                      autoComplete="new-password"
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 mt-[3px] -translate-y-1/2 text-slate-400 transition-colors hover:text-[#0EA5E9]"
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>

                  {password.length > 0 && (
                    <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                      {passwordChecks.map((check) => (
                        <li
                          key={check.label}
                          className={`flex items-center gap-1.5 text-xs ${check.passed ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          <span>{check.passed ? "✓" : "○"}</span>
                          {check.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#0F172A]">
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your new password"
                    required
                    autoComplete="new-password"
                    className={inputClass}
                  />
                  {confirmPassword.length > 0 && (
                    <p className={`mt-1.5 text-xs ${passwordsMatch ? "text-emerald-600" : "text-red-500"}`}>
                      {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(14,165,233,0.45)] transition hover:shadow-[0_14px_36px_-6px_rgba(14,165,233,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </form>

              <div className="mt-5 border-t border-slate-100 pt-4 text-center">
                <p className="text-sm text-slate-500">
                  Didn't get the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || secondsLeft > 0}
                    className="font-semibold text-[#0EA5E9] hover:text-sky-700 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    {resending
                      ? "Sending..."
                      : secondsLeft > 0
                        ? `Resend in ${secondsLeft}s`
                        : "Resend code"}
                  </button>
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  <Link
                    to="/login"
                    className="font-semibold text-[#0F172A] underline decoration-sky-300 underline-offset-4"
                  >
                    Back to sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
