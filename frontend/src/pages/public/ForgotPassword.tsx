import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { requestPasswordReset } from "../../services/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await requestPasswordReset(normalizedEmail);

      toast.success("If that email is registered, a reset code is on its way.");
      navigate("/reset-password", { state: { email: normalizedEmail } });
    } catch (error) {
      console.error("Forgot password request failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] px-6 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(14,165,233,0.12) 0%, rgba(248,250,252,0) 70%)",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_-28px_rgba(15,23,42,0.28)]">
          <div className="relative border-b border-slate-100 bg-gradient-to-b from-[#F8FBFF] to-white px-8 pb-5 pt-6">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#0EA5E9]"
            />
            <h1 className="mt-2 text-center font-[Clash_Display] text-2xl font-bold leading-tight text-[#0F172A]">
              Forgot your password?
            </h1>
            <p className="mx-auto mt-2 max-w-[300px] text-center text-sm leading-6 text-slate-500">
              Enter your email and we'll send you a 6-digit code to reset it.
            </p>
          </div>

          <div className="px-8 pb-7 pt-6 sm:px-9">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0F172A]">
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
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-[#334155] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(14,165,233,0.45)] transition hover:shadow-[0_14px_36px_-6px_rgba(14,165,233,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending code..." : "Send reset code"}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-100 pt-4 text-center">
              <p className="text-sm text-slate-500">
                Remembered it?{" "}
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
    </section>
  );
}
