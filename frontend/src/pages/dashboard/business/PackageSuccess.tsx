import { Link, useSearchParams } from "react-router-dom";

export default function PackageSuccess() {
  const [searchParams] = useSearchParams();

  const planId = searchParams.get("plan") || "growth";
  const amount = searchParams.get("amount") || "171.35";
  const ref = searchParams.get("ref") || "TXN-849201";

  const planTitle = planId === "enterprise" ? "Enterprise Practice Tier" : "Growth Business Tier";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 py-12 text-slate-900">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg sm:p-10">
        {/* Animated Check Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl font-bold text-emerald-600 ring-8 ring-emerald-50/50">
          ✓
        </div>

        <h1 className="mt-6 font-[Clash_Display] text-2xl font-bold text-slate-900 sm:text-3xl">
          Subscription Upgraded!
        </h1>
        <p className="mt-2 text-xs text-slate-500 sm:text-sm">
          Your payment authorization was completed and your business package is now active.
        </p>

        {/* Transaction Receipt Card */}
        <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 text-left text-xs space-y-3">
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-400">Plan Upgraded</span>
            <span className="font-bold text-slate-800">{planTitle}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-400">Reference Number</span>
            <span className="font-mono font-semibold text-slate-800">{ref}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-400">Amount Paid</span>
            <span className="font-bold text-emerald-600">R{amount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 text-[10px]">
              PAID &amp; ACTIVE
            </span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/dashboard/business/staff"
            className="flex-1 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] py-3 text-xs font-bold text-white shadow-sm hover:brightness-105"
          >
            Add More Staff (Up to 15) →
          </Link>

          <Link
            to="/dashboard/business/package"
            className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to Subscription
          </Link>
        </div>
      </div>
    </div>
  );
}