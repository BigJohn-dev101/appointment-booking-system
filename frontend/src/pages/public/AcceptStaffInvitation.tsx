import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { apiFetch } from "../../services/api";

const passwordRules = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
  { label: "One special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export default function AcceptStaffInvitation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordRules.every((rule) => rule.test(password))) {
      toast.error("Choose a password that meets all requirements.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiFetch<{ success: boolean; message: string }>(
        "/auth/accept-staff-invitation",
        { method: "POST", body: JSON.stringify({ token, password, confirmPassword }) },
      );
      toast.success(response.message);
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to accept this invitation.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100";

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-12">
      <section className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase text-sky-700">Staff onboarding</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Accept your invitation</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Create a password to activate your staff account. Invitation links can only be used once.
        </p>

        {!token ? (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
            This invitation link is missing its token. Ask the business owner to send another invitation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="staff-password" className="text-sm font-medium text-slate-800">Password</label>
              <div className="relative">
                <input
                  id="staff-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-sky-700"
                >
                  {showPassword ? (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.9 10.9 0 0 1 12 5c7 0 11 7 11 7a13.4 13.4 0 0 1-3.1 3.8M6.2 6.2C3.9 7.7 2 10 1 12c0 0 4 7 11 7 1.4 0 2.7-.3 3.8-.8" />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-1">
                {passwordRules.map((rule) => (
                  <li key={rule.label} className={`text-xs ${rule.test(password) ? "text-emerald-700" : "text-slate-500"}`}>
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label htmlFor="staff-confirm-password" className="text-sm font-medium text-slate-800">Confirm password</label>
              <div className="relative">
                <input
                  id="staff-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={`${inputClass} pr-12`}
                  aria-describedby={confirmPassword ? "staff-password-match" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  aria-pressed={showConfirmPassword}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-sky-700"
                >
                  {showConfirmPassword ? (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.9 10.9 0 0 1 12 5c7 0 11 7 11 7a13.4 13.4 0 0 1-3.1 3.8M6.2 6.2C3.9 7.7 2 10 1 12c0 0 4 7 11 7 1.4 0 2.7-.3 3.8-.8" />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {confirmPassword && (
                <p
                  id="staff-password-match"
                  aria-live="polite"
                  className={`mt-1.5 text-xs font-medium ${passwordsMatch ? "text-emerald-700" : "text-rose-700"}`}
                >
                  {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
            >
              {submitting ? "Activating account..." : "Accept invitation"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already activated? <Link to="/login" className="font-semibold text-sky-700 hover:underline">Sign in</Link>
        </p>
      </section>
    </main>
  );
}